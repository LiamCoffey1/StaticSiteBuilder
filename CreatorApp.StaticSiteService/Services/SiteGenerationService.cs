using CreatorApp.Domain.Models;
using CreatorApp.Generator;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.RegularExpressions;

namespace CreatorApp.StaticSiteService.Services
{
    public class SiteGenerationService : ISiteGenerationService
    {
        private readonly IHtmlGenerator _generator;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        public SiteGenerationService(IHtmlGenerator generator, IWebHostEnvironment env, IConfiguration config)
        {
            _generator = generator;
            _env = env;
            _config = config;
        }

        public Task<IDictionary<string, string>> GenerateAsync(PageWrapper wrapper, string userId, HttpRequest request, CancellationToken ct)
        {
            if (wrapper.Pages == null || wrapper.Pages.Count == 0)
                return Task.FromResult<IDictionary<string, string>>(new Dictionary<string, string>());

            var outputs = new Dictionary<string, string>();

            // Determine output directory (under content root) and ensure it exists
            var staticRoot = _config["StaticSites:OutputPath"] ?? "StaticSites";
            var userFolderName = $"id_{userId}";
            var userDir = Path.Combine(_env.ContentRootPath, staticRoot, userFolderName);
            Directory.CreateDirectory(userDir);

            foreach (var page in wrapper.Pages)
            {
                ct.ThrowIfCancellationRequested();

                var html = _generator.GenerateHtml(page.Content);

                // Replace inter-page placeholders with relative links
                foreach (var other in wrapper.Pages)
                {
                    var placeholder = $"[[PAGE_LINK_{other.Id}]]";
                    var replacement = MakeSafeFileName(other.Name) + ".html";
                    html = html.Replace(placeholder, replacement, StringComparison.Ordinal);
                }

                // Basic sanitization: remove target/_blank and rel attributes (preserve server policy)
                html = Regex.Replace(html, "\\s*target=\"_blank\"", "", RegexOptions.IgnoreCase);
                html = Regex.Replace(html, "\\s*rel=\"noopener noreferrer\"", "", RegexOptions.IgnoreCase);

                var safeName = MakeSafeFileName(page.Name);
                if (string.IsNullOrEmpty(safeName)) safeName = Guid.NewGuid().ToString();
                var outPath = Path.Combine(userDir, safeName + ".html");
                File.WriteAllText(outPath, html, Encoding.UTF8);

                // Build public URL
                var publicBase = _config["StaticSites:PublicBaseUrl"];            
                var url = BuildPublicUrl(publicBase, request, userFolderName, safeName + ".html");
                outputs[page.Id] = url;
            }

            return Task.FromResult<IDictionary<string, string>>(outputs);
        }

        private static string BuildPublicUrl(string? publicBase, HttpRequest request, string userFolderName, string fileName)
        {
            if (!string.IsNullOrEmpty(publicBase))
            {
                return publicBase.TrimEnd('/') + "/" + userFolderName + "/" + Uri.EscapeDataString(fileName);
            }
            var reqBase = request.Scheme + "://" + request.Host.Value;
            return reqBase.TrimEnd('/') + "/" + userFolderName + "/" + Uri.EscapeDataString(fileName);
        }

        private static string MakeSafeFileName(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            var s = input.ToLowerInvariant();
            s = Regex.Replace(s, "[^a-z0-9_-]", "-");
            s = Regex.Replace(s, "-+", "-").Trim('-');
            return s;
        }
    }
}
