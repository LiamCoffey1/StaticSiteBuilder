using System.Security.Claims;
using CreatorApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CreatorApp.Server.Defaults;
using CreatorApp.Server.Services;

namespace CreatorApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PagesController : ControllerBase
    {
        private readonly IPagesService _pagesService;
        private readonly IConfiguration _config;
        public PagesController(IPagesService pagesService, IConfiguration config){ _pagesService = pagesService; _config = config; }

        private int? GetUserId()
        {
            var stringv =  User.FindFirstValue("sub")
    ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
    ?? User.FindFirstValue("oid");
            if (int.TryParse(stringv, out var id)) return id;
            return null;
        }

        public class PageDto
        {
            public string Id { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public object Content { get; set; } = new();
            public object Bindings { get; set; } = new();
        }

        [HttpGet]
        public async Task<IActionResult> List(CancellationToken ct)
        {
            var uid = GetUserId(); if (uid == null) return Unauthorized();
            var pages = await _pagesService.GetOrSeedPagesForUserAsync(uid.Value, ct);

            var result = pages.Select(p => new PageDto
            {
                Id = p.Id,
                Name = p.Name,
                Content = JsonSerializer.Deserialize<object>(p.ContentJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!,
                Bindings = JsonSerializer.Deserialize<object>(p.BindingsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!,
            }).ToList();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PageDto dto, CancellationToken ct)
        {
            var uid = GetUserId(); if (uid == null) return Unauthorized();
            var entity = new PageEntity
            {
                Id = string.IsNullOrWhiteSpace(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
                UserId = uid.Value,
                Name = dto.Name,
                ContentJson = JsonSerializer.Serialize(dto.Content),
                BindingsJson = JsonSerializer.Serialize(dto.Bindings)
            };
            var created = await _pagesService.CreatePageAsync(entity, ct);
            dto.Id = created.Id;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] PageDto dto, CancellationToken ct)
        {
            var uid = GetUserId(); if (uid == null) return Unauthorized();
            var page = await _pagesService.GetPagesForUserAsync(uid.Value, ct);
            var existing = page.FirstOrDefault(p => p.Id == id && p.UserId == uid.Value);
            if (existing == null) return NotFound();
            existing.Name = dto.Name;
            existing.ContentJson = JsonSerializer.Serialize(dto.Content);
            existing.BindingsJson = JsonSerializer.Serialize(dto.Bindings);
            existing.UpdatedAt = DateTime.UtcNow;
            await _pagesService.UpdatePageAsync(existing, ct);
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, CancellationToken ct)
        {
            var uid = GetUserId(); if (uid == null) return Unauthorized();
            var page = (await _pagesService.GetPagesForUserAsync(uid.Value, ct)).FirstOrDefault(p => p.Id == id);
            if (page == null) return NotFound();
            await _pagesService.DeletePageAsync(id, uid.Value, ct);
            return NoContent();
        }
    }
}
