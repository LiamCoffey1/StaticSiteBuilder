using CreatorApp.Domain.Models;
using CreatorApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CreatorApp.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GeneratorController : ControllerBase
    {
        private readonly ILogger<GeneratorController> _logger;
        private readonly ISitePublisher _publisher;

        public GeneratorController(ILogger<GeneratorController> logger, ISitePublisher publisher)
        {
            _logger = logger;
            _publisher = publisher;
        }

        private string? GetUserIdString()
        {
            return User.FindFirstValue("sub")
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("oid");
        }

        [HttpPost("PublishSite")]
        public async Task<IActionResult> PublishSite([FromBody] PageWrapper wrapper, CancellationToken ct)
        {
            if (wrapper == null || wrapper.Pages == null)
            {
                return BadRequest("Invalid input: Pages field is missing or empty.");
            }

            var userId = GetUserIdString();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _publisher.PublishAsync(wrapper, userId, ct);
            return Ok(result);
        }

    }      
}

