using BCrypt.Net;
using CreatorApp.Server.Models.Auth;
using CreatorApp.Server.Services;
using Microsoft.AspNetCore.Mvc;
using CreatorApp.Server.Repositories;

namespace CreatorApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly ITokenService _tokens;
        public AuthController(IUserRepository users, ITokenService tokens)
        {
            _users = users; _tokens = tokens;
        }

        public record RegisterDto(string Email, string Password);
        public record LoginDto(string Email, string Password);

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Email and password are required.");

            if (await _users.GetByEmailAsync(dto.Email) != null)
                return Conflict("Email already registered.");

            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User { Email = dto.Email, PasswordHash = hash };
            await _users.AddAsync(user);

            var token = _tokens.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _users.GetByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid credentials.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var token = _tokens.CreateToken(user);
            return Ok(new { token });
        }
    }
}
