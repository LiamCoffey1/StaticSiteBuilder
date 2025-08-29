using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace CreatorApp.Server.Services
{
    public class NetAppImageService : IImageService
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;
        private readonly string _publicBaseUrl;

        public NetAppImageService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["Backends:NetApp:BaseUrl"] ?? string.Empty;
            _publicBaseUrl = config["Backends:NetApp:PublicBaseUrl"] ?? _baseUrl;
        }

        public async Task<IReadOnlyList<string>> ListAsync(string userId, CancellationToken ct = default)
        {
            var res = await _http.GetAsync($"{_baseUrl.TrimEnd('/')}/api/images/list?userId={Uri.EscapeDataString(userId)}", ct);
            res.EnsureSuccessStatusCode();
            var payload = await res.Content.ReadAsStringAsync(ct);
            var names = JsonSerializer.Deserialize<List<string>>(payload, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
            return names.Select(n => CombineUrl(_publicBaseUrl, n)).ToList();
        }

        public async Task<string> UploadAsync(IFormFile file, string userId, CancellationToken ct = default)
        {
            using var form = new MultipartFormDataContent();
            var fileContent = new StreamContent(file.OpenReadStream());
            if (!string.IsNullOrEmpty(file.ContentType)) fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            form.Add(fileContent, "file", file.FileName);
            form.Add(new StringContent(userId), "userId");

            var res = await _http.PostAsync($"{_baseUrl.TrimEnd('/')}/api/images/upload", form, ct);
            res.EnsureSuccessStatusCode();
            // Expect { url: '/uploads/...' }
            var payload = await res.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(payload);
            var url = doc.RootElement.TryGetProperty("url", out var u) ? u.GetString() ?? string.Empty : string.Empty;
            return CombineUrl(_publicBaseUrl, url);
        }

        private static string CombineUrl(string baseUrl, string path)
        {
            if (string.IsNullOrEmpty(baseUrl)) return path;
            return baseUrl.TrimEnd('/') + "/" + path.TrimStart('/');
        }
    }
}
