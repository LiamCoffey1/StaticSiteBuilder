using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.IO;

namespace CreatorAppFunctions
{
    public static class ListBlobImages
    {
        [FunctionName("ListBlobImages")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "ListBlobImages")] HttpRequest req,
            ILogger log,
            [Blob("images", FileAccess.Read)] BlobContainerClient containerClient)
        {
            log.LogInformation("Listing all blob images for a specific user.");

            string userId = req.Query["userId"];

            if (string.IsNullOrEmpty(userId))
            {
                log.LogError("User ID is missing in the request.");
                return new BadRequestObjectResult("User ID is required.");
            }

            try
            {
                var blobItems = new List<string>();
                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(prefix: $"{userId}/"))
                {
                    blobItems.Add(blobItem.Name);
                }

                return new OkObjectResult(blobItems);
            }
            catch (Exception ex)
            {
                log.LogError($"Error listing blob images for user {userId}: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }
    }
}