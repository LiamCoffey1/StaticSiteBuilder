using Microsoft.AspNetCore.Http;

namespace CreatorApp.Server.Services
{
    public interface IImageService
    {
        Task<IReadOnlyList<string>> ListAsync(string userId, CancellationToken ct = default);
        Task<string> UploadAsync(IFormFile file, string userId, CancellationToken ct = default);
    }
}
