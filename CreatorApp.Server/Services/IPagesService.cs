using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Models;

namespace CreatorApp.Server.Services
{
    public interface IPagesService
    {
        Task<List<PageEntity>> GetOrSeedPagesForUserAsync(int userId, CancellationToken ct = default);
        Task<List<PageEntity>> GetPagesForUserAsync(int userId, CancellationToken ct = default);
        Task<PageEntity> CreatePageAsync(PageEntity page, CancellationToken ct = default);
        Task UpdatePageAsync(PageEntity page, CancellationToken ct = default);
        Task DeletePageAsync(string id, int userId, CancellationToken ct = default);
    }
}
