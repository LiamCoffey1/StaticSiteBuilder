using CreatorApp.Domain;
using CreatorApp.Domain.Models;

namespace CreatorApp.Generator
{
    public class HtmlGenerator : IHtmlGenerator
    {
        private readonly ITemplateRepository _templateRepository;

        public HtmlGenerator(ITemplateRepository templateRepository)
        {
            _templateRepository = templateRepository;
        }

        public string GenerateHtml(Element rootElement)
        {
            var options = new HtmlGenerationOptions();
            var ctx = new VisitorContext<HtmlGenerationOptions>(options);
            var visitor = new GenerateHtmlVisitor();

            ctx.Html.Append("<body>");
            var result = rootElement.Accept(visitor, ctx);
            ctx.Html.Append("</body>");
            var template = _templateRepository.LoadTemplate(options.TemplateName);
            var full = template
                .Replace("{content}", ctx.Html.ToString())
                .Replace("{styles}", "<style>" + ctx.Css.ToString() + "</style>");

            return full;
        }
    }
}


