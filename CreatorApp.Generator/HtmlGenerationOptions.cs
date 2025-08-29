using System.Collections.Generic;

namespace CreatorApp.Generator
{
    public class HtmlGenerationOptions
    {
        public string TemplateName { get; set; } = "site_template";
        public int MobileMaxWidth { get; set; } = 768;
        public bool UseInlineOnClick { get; set; } = true;

        // Element types that should treat InnerText as raw HTML
        public HashSet<string> RawHtmlElementTypes { get; } = new(new[] { "html" });

        // Map of element types to actual HTML tags (e.g., row -> div)
        public Dictionary<string, string> ElementTypeMap { get; } = new()
        {
            ["row"] = "div",
            ["column"] = "div",
            ["html"] = "div",
        };
    }
}
