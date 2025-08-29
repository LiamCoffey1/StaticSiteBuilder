using CreatorApp.Domain.Models;

namespace CreatorApp.Generator
{
    public interface ITemplateRepository
    {
        string LoadTemplate(string templateName);
    }

    public interface IHtmlGenerator
    {
        string GenerateHtml(Element rootElement);
    }
}
