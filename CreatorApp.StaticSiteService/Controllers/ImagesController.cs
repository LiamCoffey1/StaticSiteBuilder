using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using CreatorApp.StaticSiteService.Services;

namespace CreatorApp.StaticSiteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IImageStorageService _imageStorage;
        private readonly ILogger<ImagesController> _logger;

        public ImagesController(IImageStorageService imageStorage, ILogger<ImagesController> logger)
        {
            _imageStorage = imageStorage;
            _logger = logger;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string? userId, CancellationToken ct)
        {
            if (file == null || file.Length == 0) return BadRequest("File is required");
            if (string.IsNullOrWhiteSpace(userId)) return BadRequest("userId form field is required");

            try
            {
                var url = await _imageStorage.SaveAsync(file, userId, ct);
                return Ok(new { url });
            }
            catch (OperationCanceledException)
            {
                return StatusCode(StatusCodes.Status499ClientClosedRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to upload image");
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] string? userId, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(userId)) return BadRequest("userId query parameter is required");
            try
            {
                var files = await _imageStorage.ListAsync(userId, ct);
                return Ok(files);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(StatusCodes.Status499ClientClosedRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing images for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to list images");
            }
        }
    }
}
