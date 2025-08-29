using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Services;
using CreatorApp.Server.Repositories;
using Microsoft.AspNetCore.Http;

namespace CreatorApp.Server.Services
{
    public class ImagesService : IImagesService
    {
        private readonly IImageService _imageService;

        public ImagesService(IImageService imageService)
        {
            _imageService = imageService;
        }

        public Task<IReadOnlyList<string>> ListForUserAsync(string userId, CancellationToken ct = default)
        {
            return _imageService.ListAsync(userId, ct);
        }

        public Task<string> UploadImageAsync(IFormFile file, string userId, CancellationToken ct = default)
        {
            return _imageService.UploadAsync(file, userId, ct);
        }
    }
}
