using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace CreatorApp.Generator
{
    public class EmbeddedTemplateRepository : ITemplateRepository
    {
        private readonly Dictionary<string, string> _cache = new();
        private readonly Assembly _assembly = typeof(EmbeddedTemplateRepository).Assembly;

        public string LoadTemplate(string templateName)
        {
            if (string.IsNullOrEmpty(templateName)) throw new ArgumentNullException(nameof(templateName));
            if (_cache.TryGetValue(templateName, out var cached)) return cached;

            // Resource naming convention: CreatorApp.Generator.Templates.<filename>
            var resourceName = _assembly.GetManifestResourceNames()
                .FirstOrDefault(r => r.EndsWith($"Templates.{templateName}.html", StringComparison.OrdinalIgnoreCase)
                                     || r.EndsWith($"Templates.{templateName}", StringComparison.OrdinalIgnoreCase));
            if (resourceName == null)
            {
                throw new InvalidOperationException($"Template '{templateName}' not found as embedded resource.");
            }

            using var stream = _assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new InvalidOperationException($"Failed to open embedded resource '{resourceName}'.");
            using var reader = new StreamReader(stream);
            var content = reader.ReadToEnd();
            _cache[templateName] = content;
            return content;
        }
    }
}
