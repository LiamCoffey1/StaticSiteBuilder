using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CreatorApp.Server.Repositories;
using CreatorApp.Server.Models;
using System.Text.Json;
using CreatorApp.Server.Defaults;
using Microsoft.Extensions.Configuration;

namespace CreatorApp.Server.Services
{
    public class PagesService : IPagesService
    {
        private readonly IPageRepository _pages;
        private readonly IConfiguration _config;

        public PagesService(IPageRepository pages, IConfiguration config)
        {
            _pages = pages;
            _config = config;
        }

        private class DefaultPageDto
        {
            public string Id { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public object Content { get; set; } = new();
            public object Bindings { get; set; } = new();
        }

        public async Task<List<PageEntity>> GetOrSeedPagesForUserAsync(int userId, CancellationToken ct = default)
        {
            var pages = await _pages.GetByUserIdAsync(userId, ct);
            if (pages.Count > 0) return pages;

            var cdnBase = _config["Defaults:CdnBase"] ?? "https://cdn.jsdelivr.net/gh/vitejs/vite/packages/create-vite/template-vanilla";
            var json = DefaultPages.DefaultsJson.Replace("{CDN_BASE}", cdnBase.TrimEnd('/'));
            var defaults = JsonSerializer.Deserialize<List<DefaultPageDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

            var entities = defaults.Select(d => new PageEntity
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = d.Name,
                ContentJson = JsonSerializer.Serialize(d.Content),
                BindingsJson = JsonSerializer.Serialize(d.Bindings)
            }).ToList();

            await _pages.AddRangeAsync(entities, ct);
            return await _pages.GetByUserIdAsync(userId, ct);
        }

        public Task<List<PageEntity>> GetPagesForUserAsync(int userId, CancellationToken ct = default)
        {
            return _pages.GetByUserIdAsync(userId, ct);
        }

        public Task<PageEntity> CreatePageAsync(PageEntity page, CancellationToken ct = default)
        {
            return _pages.AddAsync(page, ct);
        }

        public Task UpdatePageAsync(PageEntity page, CancellationToken ct = default)
        {
            return _pages.UpdateAsync(page, ct);
        }

        public Task DeletePageAsync(string id, int userId, CancellationToken ct = default)
        {
            return _pages.DeleteAsync(id, userId, ct);
        }
    }
}
