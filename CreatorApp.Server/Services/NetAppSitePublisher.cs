using System.Text;
using System.Text.Json;
using CreatorApp.Domain.Models;
using Microsoft.Extensions.Configuration;

namespace CreatorApp.Server.Services
{
    public class NetAppSitePublisher : ISitePublisher
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;
        private readonly string _path;

        public NetAppSitePublisher(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["Backends:NetApp:BaseUrl"] ?? string.Empty;
            _path = config["Backends:NetApp:GenerateFullSitePath"] ?? "/api/site/generate-full-site";
        }

        public async Task<string> PublishAsync(PageWrapper wrapper, string userId, CancellationToken ct = default)
        {
            var payload = JsonSerializer.Serialize(wrapper);
            var url = _baseUrl.TrimEnd('/') + _path;
            if (!string.IsNullOrEmpty(userId)) url += (url.Contains('?') ? '&' : '?') + "userId=" + Uri.EscapeDataString(userId);
            var res = await _http.PostAsync(url, new StringContent(payload, Encoding.UTF8, "application/json"), ct);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync(ct);
        }
    }
}
