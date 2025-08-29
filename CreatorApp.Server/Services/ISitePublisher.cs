using CreatorApp.Domain.Models;

namespace CreatorApp.Server.Services
{
    public interface ISitePublisher
    {
        Task<string> PublishAsync(PageWrapper wrapper, string userId, CancellationToken ct = default);
    }
}
