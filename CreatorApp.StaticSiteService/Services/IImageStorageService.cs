namespace CreatorApp.StaticSiteService.Services
{
    public interface IImageStorageService
    {
        Task<string> SaveAsync(IFormFile file, string userId, CancellationToken ct);
        Task<IReadOnlyList<string>> ListAsync(string userId, CancellationToken ct);
    }
}
