using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace CreatorApp.Server.Services
{
    public class FunctionsImageService : IImageService
    {
        private readonly HttpClient _http;
        private readonly string _baseUrl;
        private readonly string _functionsKey;
        private readonly string _publicBaseUrl; // for building public URLs if function returns names

        public FunctionsImageService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _baseUrl = config["Backends:Functions:BaseUrl"] ?? string.Empty;
            _functionsKey = config["Backends:Functions:Key"] ?? string.Empty;
            _publicBaseUrl = config["Storage:PublicBaseUrl"] ?? string.Empty;
        }

        public async Task<IReadOnlyList<string>> ListAsync(string userId, CancellationToken ct = default)
        {
            using var req = new HttpRequestMessage(HttpMethod.Get, $"{_baseUrl}/ListBlobImages?userId={Uri.EscapeDataString(userId)}");
            if (!string.IsNullOrEmpty(_functionsKey))
            {
                req.Headers.Add("x-functions-key", _functionsKey);
            }
            var res = await _http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            var payload = await res.Content.ReadAsStringAsync(ct);
            // functions returns array of blob names; turn into absolute URLs
            var names = JsonSerializer.Deserialize<List<string>>(payload, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
            return names.Select(n => CombineUrl(_publicBaseUrl, n)).ToList();
        }

        public async Task<string> UploadAsync(IFormFile file, string userId, CancellationToken ct = default)
        {
            using var form = new MultipartFormDataContent();
            form.Add(new StreamContent(file.OpenReadStream()), "file", file.FileName);
            form.Add(new StringContent(userId), "userId");
            using var req = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/UploadImageJob") { Content = form };
            if (!string.IsNullOrEmpty(_functionsKey))
                req.Headers.Add("x-functions-key", _functionsKey);
            var res = await _http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            // Return public URL (we know final path convention)
            return CombineUrl(_publicBaseUrl, $"{userId}/{file.FileName}");
        }

        private static string CombineUrl(string baseUrl, string path)
        {
            if (string.IsNullOrEmpty(baseUrl)) return path;
            return baseUrl.TrimEnd('/') + "/" + path.TrimStart('/');
        }
    }
}
