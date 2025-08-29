using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Models;

namespace CreatorApp.Server.Repositories
{
    public interface IPageRepository
    {
        Task<List<PageEntity>> GetByUserIdAsync(int userId, CancellationToken ct = default);
        Task AddRangeAsync(IEnumerable<PageEntity> pages, CancellationToken ct = default);
        Task<PageEntity?> GetByIdForUserAsync(string id, int userId, CancellationToken ct = default);
        Task<PageEntity> AddAsync(PageEntity page, CancellationToken ct = default);
        Task UpdateAsync(PageEntity page, CancellationToken ct = default);
        Task DeleteAsync(string id, int userId, CancellationToken ct = default);
    }
}
