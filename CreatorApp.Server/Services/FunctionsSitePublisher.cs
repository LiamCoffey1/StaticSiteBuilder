using System.Text;
using System.Text.Json;
using CreatorApp.Domain.Models;
using Microsoft.Extensions.Configuration;

namespace CreatorApp.Server.Services
{
    public class FunctionsSitePublisher : ISitePublisher
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;
        private readonly string _path;
        private readonly string _functionsKey;

        public FunctionsSitePublisher(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["Backends:Functions:BaseUrl"] ?? string.Empty;
            _path = config["Backends:Functions:GenerateFullSitePath"] ?? "/GenerateFullSite";
            _functionsKey = config["Backends:Functions:Key"] ?? string.Empty;
        }

        public async Task<string> PublishAsync(PageWrapper wrapper, string userId, CancellationToken ct = default)
        {
            var payload = JsonSerializer.Serialize(wrapper);
            var url = _baseUrl.TrimEnd('/') + _path;
            if (!string.IsNullOrEmpty(userId)) url += (url.Contains('?') ? '&' : '?') + "userId=" + Uri.EscapeDataString(userId);

            using var req = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(payload, Encoding.UTF8, "application/json")
            };
            if (!string.IsNullOrEmpty(_functionsKey))
            {
                req.Headers.Add("x-functions-key", _functionsKey);
            }
            var res = await _http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync(ct);
        }
    }
}
