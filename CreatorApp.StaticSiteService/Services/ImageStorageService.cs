using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using System.Text.RegularExpressions;

namespace CreatorApp.StaticSiteService.Services
{
    public class ImageStorageService : IImageStorageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ImageStorageService> _logger;

        private static readonly string[] AllowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

        public ImageStorageService(IWebHostEnvironment env, ILogger<ImageStorageService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string> SaveAsync(IFormFile file, string userId, CancellationToken ct)
        {
            if (file.Length == 0) throw new ArgumentException("Empty file");
            if (file.Length > MaxFileSizeBytes) throw new ArgumentException("File too large");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext)) throw new ArgumentException("Unsupported file extension");
            if (string.IsNullOrEmpty(file.ContentType) || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Invalid content type");

            var safeUser = MakeSafeFileName(userId);
            var uploads = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", safeUser);
            Directory.CreateDirectory(uploads);

            var filename = Path.GetRandomFileName() + ext;
            var outPath = Path.Combine(uploads, filename);

            await using var fs = File.Create(outPath);
            await file.CopyToAsync(fs, ct);

            return $"/uploads/{Uri.EscapeDataString(safeUser)}/{Uri.EscapeDataString(filename)}";
        }

        public Task<IReadOnlyList<string>> ListAsync(string userId, CancellationToken ct)
        {
            var safeUser = MakeSafeFileName(userId);
            var uploads = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", safeUser);
            if (!Directory.Exists(uploads))
            {
                return Task.FromResult<IReadOnlyList<string>>(Array.Empty<string>());
            }

            var files = Directory.GetFiles(uploads)
                .Select(f => "/uploads/" + Uri.EscapeDataString(safeUser) + "/" + Uri.EscapeDataString(Path.GetFileName(f)))
                .ToArray();

            return Task.FromResult<IReadOnlyList<string>>(files);
        }

        private static string MakeSafeFileName(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            var s = input.ToLowerInvariant();
            s = Regex.Replace(s, "[^a-z0-9_-]", "-");
            s = Regex.Replace(s, "-+", "-").Trim('-');
            return s;
        }
    }
}
