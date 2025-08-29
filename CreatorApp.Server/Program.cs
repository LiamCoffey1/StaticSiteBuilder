using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CreatorApp.Server.Services;
using CreatorApp.Server.Data;
using Microsoft.EntityFrameworkCore;
using CreatorApp.Server.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Validate DI registrations at build time to get clearer errors
builder.Host.UseDefaultServiceProvider((context, options) =>
{
    options.ValidateOnBuild = true;
    options.ValidateScopes = true;
});

// Config
var jwtSection = builder.Configuration.GetSection("Authentication:Jwt");
var issuer = jwtSection["Issuer"] ?? "";
var audience = jwtSection["Audience"] ?? "";
var signingKey = jwtSection["SigningKey"] ?? "";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = !string.IsNullOrEmpty(issuer),
            ValidIssuer = issuer,
            ValidateAudience = !string.IsNullOrEmpty(audience),
            ValidAudience = audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtAuth");
                logger.LogError(ctx.Exception, "JWT authentication failed: {Message}", ctx.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtAuth");
                logger.LogWarning("JWT challenge: error={Error}, desc={Description}", ctx.Error, ctx.ErrorDescription);
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtAuth");
                logger.LogInformation("JWT token validated for subject: {Sub}", ctx.Principal?.FindFirst("sub")?.Value);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("upload", opt => { opt.Window = TimeSpan.FromMinutes(10); opt.PermitLimit = 10; });
    options.AddFixedWindowLimiter("api", opt => { opt.Window = TimeSpan.FromMinutes(1); opt.PermitLimit = 60; });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            var origins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',') ?? new[] { "https://localhost:5173" };
            policy.WithOrigins(origins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Backend selection: Functions => Functions, otherwise use NetApp by default
var mode = builder.Configuration["Backends:Mode"] ?? "NetApp";
if (string.Equals(mode, "Functions", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddHttpClient<IImageService, FunctionsImageService>();
    builder.Services.AddHttpClient<ISitePublisher, FunctionsSitePublisher>();
}
else
{
    builder.Services.AddHttpClient<IImageService, NetAppImageService>();
    builder.Services.AddHttpClient<ISitePublisher, NetAppSitePublisher>();
}
// Token service
builder.Services.AddSingleton<ITokenService, TokenService>();

// Add repository pattern
builder.Services.AddRepositories();
// Add domain services
builder.Services.AddDomainServices();

var app = builder.Build();
app.UseCors("AllowReactApp");

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// Ensure database folder exists and apply EF Core migrations deterministically
var conn = app.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
var dbFile = conn.Replace("Data Source=", string.Empty);
var dbDir = Path.GetDirectoryName(dbFile);
if (!string.IsNullOrEmpty(dbDir)) Directory.CreateDirectory(dbDir);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Apply any pending migrations; do not use EnsureCreated/EnsureDeleted in production scenarios.
    db.Database.Migrate();
}

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
