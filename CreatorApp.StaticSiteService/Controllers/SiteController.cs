using Microsoft.AspNetCore.Mvc;
using CreatorApp.Domain.Models;
using CreatorApp.StaticSiteService.Services;
using System.Threading;

namespace CreatorApp.StaticSiteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SiteController : ControllerBase
    {
        private readonly ISiteGenerationService _siteService;
        private readonly ILogger<SiteController> _logger;

        public SiteController(ISiteGenerationService siteService, ILogger<SiteController> logger)
        {
            _siteService = siteService;
            _logger = logger;
        }

        [HttpPost("generate-full-site")]
        public async Task<IActionResult> GenerateFullSite([FromBody] PageWrapper wrapper, [FromQuery] string? userId, CancellationToken ct)
        {
            if (wrapper == null || wrapper.Pages == null || wrapper.Pages.Count == 0)
                return BadRequest("Invalid input: Pages field is missing or empty.");

            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("Missing required query parameter: userId");

            try
            {
                var outputs = await _siteService.GenerateAsync(wrapper, userId, HttpContext.Request, ct);
                return Ok(outputs);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(StatusCodes.Status499ClientClosedRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating static site for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to generate site");
            }
        }
    }
}
