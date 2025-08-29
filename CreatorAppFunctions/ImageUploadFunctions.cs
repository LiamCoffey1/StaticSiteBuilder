using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Azure.Storage.Blobs;
using Azure.Storage.Queues;
using Microsoft.AspNetCore.Http;

namespace CreatorAppFunctions
{
    public static class ImageUploadFunctions
    {
        [FunctionName("UploadImageJob")]
        public static async Task<IActionResult> UploadImageJob(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "UploadImageJob")] HttpRequest req,
            ILogger log,
            [Queue("image-upload-jobs", Connection = "AzureWebJobsStorage")] IAsyncCollector<string> imageUploadQueue,
            [Blob("temp-images", FileAccess.Write, Connection = "AzureWebJobsStorage")] BlobContainerClient tempContainerClient)
        {
            log.LogInformation("Received request to upload image.");

            var formCollection = await req.ReadFormAsync();
            var file = formCollection.Files["file"];
            var userId = formCollection["userId"];

            if (file == null || string.IsNullOrEmpty(userId))
            {
                log.LogError("Invalid input: File and UserId fields are required.");
                return new BadRequestObjectResult("Invalid input: File and UserId fields are required.");
            }

            var fileName = file.FileName;
            var tempBlobClient = tempContainerClient.GetBlobClient(fileName);

            using (var stream = file.OpenReadStream())
            {
                await tempBlobClient.UploadAsync(stream, overwrite: true);
            }

            var imageUploadRequest = new ImageUploadRequest
            {
                FileName = fileName,
                UserId = userId
            };

            try
            {
                var requestBody = JsonSerializer.Serialize(imageUploadRequest);
                await imageUploadQueue.AddAsync(requestBody);
                log.LogInformation("Image upload job added to the queue successfully.");
                return new OkObjectResult("Image upload job added to the queue successfully.");
            }
            catch (Exception ex)
            {
                log.LogError($"Error adding image upload job to the queue: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("ProcessImageUploadJob")]
        public static async Task ProcessImageUploadJob(
            [QueueTrigger("image-upload-jobs", Connection = "AzureWebJobsStorage")] string queueItem,
            ILogger log,
            [Blob("temp-images", FileAccess.Read, Connection = "AzureWebJobsStorage")] BlobContainerClient tempContainerClient,
            [Blob("images", FileAccess.Write, Connection = "AzureWebJobsStorage")] BlobContainerClient containerClient)
        {
            log.LogInformation($"Processing image upload job: {queueItem}");

            var imageUploadRequest = JsonSerializer.Deserialize<ImageUploadRequest>(queueItem, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (imageUploadRequest == null || string.IsNullOrEmpty(imageUploadRequest.FileName) || string.IsNullOrEmpty(imageUploadRequest.UserId))
            {
                log.LogError("Invalid queue item: FileName and UserId fields are required.");
                return;
            }

            try
            {
                var tempBlobClient = tempContainerClient.GetBlobClient(imageUploadRequest.FileName);
                var blobClient = containerClient.GetBlobClient($"{imageUploadRequest.UserId}/{imageUploadRequest.FileName}");

                var tempBlobStream = await tempBlobClient.OpenReadAsync();
                await blobClient.UploadAsync(tempBlobStream, overwrite: true);

                log.LogInformation($"Image uploaded successfully: {imageUploadRequest.FileName}");
            }
            catch (Exception ex)
            {
                log.LogError($"Error uploading image to Blob Storage: {ex.Message}");
            }
        }
    }

    public class ImageUploadRequest
    {
        public string FileName { get; set; }
        public string UserId { get; set; }
    }
}