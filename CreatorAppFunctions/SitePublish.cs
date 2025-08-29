using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text;
using CreatorApp.Domain.Models;
using System.Linq;
using System.Text.Json;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs;
using System.IO;
using System.Threading.Tasks;
using System;
using CreatorApp.Generator;

namespace CreatorAppFunctions
{
    public static class SitePublish
    {
        [FunctionName("PublishSite")]
        public static async Task<IActionResult> PublishSite(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "GenerateFullSite")] HttpRequest req,
            ILogger log,
            [Blob("static-sites", FileAccess.Write)] BlobContainerClient containerClient)
        {
            log.LogInformation("Starting to generate the full static site.");

            string requestBody;
            using (var reader = new StreamReader(req.Body))
            {
                requestBody = await reader.ReadToEndAsync();
            }

            var wrapper = JsonSerializer.Deserialize<PageWrapper>(requestBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (wrapper?.Pages == null || !wrapper.Pages.Any())
            {
                log.LogError("Invalid input: Pages field is missing or empty.");
                return new BadRequestObjectResult("Invalid input: Pages field is required.");
            }

            var htmlFiles = new List<byte[]>();
            // Use shared generator and file template repository
            var _htmlGenerator = new HtmlGenerator(new FileTemplateRepository());

            foreach (var page in wrapper.Pages)
            {
                try
                {
                    var htmlContent = _htmlGenerator.GenerateHtml(page.Content);

                    foreach (var otherPage in wrapper.Pages)
                    {
                        string placeholder = $"[[PAGE_LINK_{otherPage.Id}]]";
                        string replacement = $"{otherPage.Name}.html";
                        htmlContent = htmlContent.Replace(placeholder, replacement);
                    }

                    htmlContent = Regex.Replace(htmlContent, @"\s*target=""_blank""", "", RegexOptions.IgnoreCase);
                    htmlContent = Regex.Replace(htmlContent, @"\s*rel=""noopener noreferrer""", "", RegexOptions.IgnoreCase);

                    var htmlBytes = Encoding.UTF8.GetBytes(htmlContent);
                    htmlFiles.Add(htmlBytes);
                }
                catch (Exception ex)
                {
                    log.LogError($"Error generating HTML for page {page.Name}: {ex.Message}");
                }
            }

            try
            {
                var uploadTasks = wrapper.Pages.Select((page, index) =>
                {
                    var blobClient = containerClient.GetBlobClient($"/id_1/{page.Name}.html");
                    var stream = new MemoryStream(htmlFiles[index]);
                    return blobClient.UploadAsync(stream, overwrite: true)
                        .ContinueWith(task =>
                        {
                            if (task.IsCompletedSuccessfully)
                            {
                                return blobClient.Uri.ToString();
                            }
                            return null;
                        });
                }).ToList();

                var results = await Task.WhenAll(uploadTasks);
                var urls = results.Where(r => r != null).ToList();
                return new OkObjectResult(new { UploadedFiles = urls });
            }
            catch (Exception ex)
            {
                log.LogError($"Error uploading site: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }

        // Helper method to create a ZIP file from HTML files
        private static byte[] CreateZipFile(List<byte[]> htmlFiles, List<string> filenames)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new System.IO.Compression.ZipArchive(memoryStream, System.IO.Compression.ZipArchiveMode.Create, true))
                {
                    for (int i = 0; i < htmlFiles.Count; i++)
                    {
                        var entry = archive.CreateEntry(filenames[i]);
                        using (var entryStream = entry.Open())
                        {
                            entryStream.Write(htmlFiles[i], 0, htmlFiles[i].Length);
                        }
                    }
                }

                return memoryStream.ToArray();
            }
        }
    }
}
