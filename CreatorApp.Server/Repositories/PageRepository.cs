using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Data;
using CreatorApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CreatorApp.Server.Repositories
{
    public class PageRepository : IPageRepository
    {
        private readonly AppDbContext _context;
        public PageRepository(AppDbContext context) => _context = context;

        public async Task<List<PageEntity>> GetByUserIdAsync(int userId, CancellationToken ct = default)
        {
            return await _context.Pages.Where(p => p.UserId == userId).ToListAsync(ct);
        }

        public async Task AddRangeAsync(IEnumerable<PageEntity> pages, CancellationToken ct = default)
        {
            _context.Pages.AddRange(pages);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<PageEntity?> GetByIdForUserAsync(string id, int userId, CancellationToken ct = default)
        {
            return await _context.Pages.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, ct);
        }

        public async Task<PageEntity> AddAsync(PageEntity page, CancellationToken ct = default)
        {
            _context.Pages.Add(page);
            await _context.SaveChangesAsync(ct);
            return page;
        }

        public async Task UpdateAsync(PageEntity page, CancellationToken ct = default)
        {
            _context.Pages.Update(page);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(string id, int userId, CancellationToken ct = default)
        {
            var page = await GetByIdForUserAsync(id, userId, ct);
            if (page == null) return;
            _context.Pages.Remove(page);
            await _context.SaveChangesAsync(ct);
        }
    }
}
