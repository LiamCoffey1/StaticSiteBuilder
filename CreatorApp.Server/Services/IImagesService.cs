using Microsoft.AspNetCore.Http;

namespace CreatorApp.Server.Services
{
    public interface IImagesService
    {
        Task<IReadOnlyList<string>> ListForUserAsync(string userId, CancellationToken ct = default);
        Task<string> UploadImageAsync(IFormFile file, string userId, CancellationToken ct = default);
    }
}
