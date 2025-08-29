using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CreatorApp.Server.Models.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CreatorApp.Server.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config){ _config = config; }

        public string CreateToken(User user)
        {
            var issuer = _config["Authentication:Jwt:Issuer"];
            var audience = _config["Authentication:Jwt:Audience"];
            var key = _config["Authentication:Jwt:SigningKey"] ?? string.Empty;
            var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
