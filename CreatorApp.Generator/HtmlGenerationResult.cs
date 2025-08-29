using System.Text;

namespace CreatorApp.Generator
{
    public class HtmlGenerationResult
    {
        public string ContentHtml { get; set; } = string.Empty;
        public string Css { get; set; } = string.Empty;

        public string ToFullHtml(string template)
        {
            return template
                .Replace("{content}", ContentHtml)
                .Replace("{styles}", "<style>" + Css + "</style>");
        }
    }
}
