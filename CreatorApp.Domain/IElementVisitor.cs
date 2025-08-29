using CreatorApp.Domain.Models;

namespace CreatorApp.Domain
{
    public interface IElementVisitor<TResult, TContext>
    {
        TResult Visit(Element element, VisitorContext<TContext> ctx); 
    }
}
