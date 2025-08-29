using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Logging;
using CreatorApp.Server.Services;
using System.Security.Claims;
using System.IO;

namespace CreatorApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly ILogger<ImageController> _logger;
        private readonly IImagesService _imagesService;

        // basic validation config (could be moved to appsettings)
        private static readonly string[] AllowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

        public ImageController(ILogger<ImageController> logger, IImagesService imagesService)
        {
            _logger = logger;
            _imagesService = imagesService;
        }

        private string? GetUserId()
        {
            return User.FindFirstValue("sub")
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("oid");
        }

        [HttpPost("UploadImage")]
        [EnableRateLimiting("upload")]
        [RequestSizeLimit(MaxFileSizeBytes)]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, CancellationToken ct)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (file == null || file.Length == 0)
                return BadRequest("File is required.");
            if (file.Length > MaxFileSizeBytes)
                return BadRequest("File too large.");
            if (string.IsNullOrEmpty(file.ContentType) || !file.ContentType.StartsWith("image/"))
                return BadRequest("Invalid content type.");
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest("Unsupported file extension.");

            var url = await _imagesService.UploadImageAsync(file, userId, ct);
            return Ok(new { url });
        }

        [HttpGet("ListImages")]
        [EnableRateLimiting("api")]
        public async Task<IActionResult> ListImages(CancellationToken ct)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var images = await _imagesService.ListForUserAsync(userId, ct);
            return Ok(images);
        }
    }
}