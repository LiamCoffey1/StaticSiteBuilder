using CreatorApp.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace CreatorApp.StaticSiteService.Services
{
    public interface ISiteGenerationService
    {
        Task<IDictionary<string, string>> GenerateAsync(PageWrapper wrapper, string userId, HttpRequest request, CancellationToken ct);
    }
}
