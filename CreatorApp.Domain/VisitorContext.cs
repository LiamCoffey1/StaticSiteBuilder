using System.Text;
using CreatorApp.Domain.Models;

namespace CreatorApp.Domain
{
    public class VisitorContext<TContext>
    {
        public VisitorContext(TContext options)
        {
            ContextData = options;
        }

        public TContext ContextData { get; }
        public StringBuilder Html { get; } = new();
        public StringBuilder Css { get; } = new();
        public Stack<Element> Ancestors { get; } = new();
    }
}
 