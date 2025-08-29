using System;
using System.IO;

namespace CreatorApp.Generator
{
    public class FileTemplateRepository : ITemplateRepository
    {
        private readonly string _basePath;

        public FileTemplateRepository(string? basePath = null)
        {
            _basePath = basePath ?? Path.Combine(AppContext.BaseDirectory, "Templates");
        }

        public string LoadTemplate(string templateName)
        {
            var path = Path.Combine(_basePath, templateName + ".html");
            if (!File.Exists(path)) throw new FileNotFoundException($"Template file not found: {path}");
            return File.ReadAllText(path);
        }
    }
}
