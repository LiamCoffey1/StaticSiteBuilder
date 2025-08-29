using CreatorApp.Generator;
using CreatorApp.StaticSiteService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// swagger is optional for static site service
builder.Services.AddSwaggerGen();

// Register template repository: prefer file override via configuration, otherwise use embedded
var templatePath = builder.Configuration["StaticSites:TemplatePath"];
if (!string.IsNullOrEmpty(templatePath))
{
    builder.Services.AddSingleton<ITemplateRepository>(new FileTemplateRepository(templatePath));
}
else
{
    builder.Services.AddSingleton<ITemplateRepository, EmbeddedTemplateRepository>();
}

builder.Services.AddScoped<IHtmlGenerator, HtmlGenerator>();

// Static files output folder
var staticDir = builder.Configuration["StaticSites:OutputPath"] ?? "StaticSites";
System.IO.Directory.CreateDirectory(System.IO.Path.Combine(builder.Environment.ContentRootPath, staticDir));

// Add our services for SRP controllers
builder.Services.AddScoped<ISiteGenerationService, SiteGenerationService>();
builder.Services.AddScoped<IImageStorageService, ImageStorageService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve default wwwroot (for uploads, etc.)
app.UseStaticFiles();

// Serve generated static files from the configured StaticSites folder
var staticPath = builder.Configuration["StaticSites:OutputPath"] ?? "StaticSites";
var staticRoot = System.IO.Path.Combine(app.Environment.ContentRootPath, staticPath);
if (!System.IO.Directory.Exists(staticRoot)) System.IO.Directory.CreateDirectory(staticRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(staticRoot),
    RequestPath = ""
});

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
