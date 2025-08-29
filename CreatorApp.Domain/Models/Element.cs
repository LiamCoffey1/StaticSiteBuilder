using System.Text.Json.Serialization;

namespace CreatorApp.Domain.Models
{
    public class Page
    {
        public string Name { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public Element Content { get; set; } = new Element();
    }

    public class PageWrapper
    {
        public List<Page> Pages { get; set; } = new List<Page>();
    }

    public class Element
    {
        public string Type { get; set; } = string.Empty; // Element type (e.g., "div", "p", "row", "column")
        public Props Props { get; set; } = new Props(); // Element properties
        public TResult Accept<TResult, TContext>(IElementVisitor<TResult, TContext> visitor, VisitorContext<TContext> ctx)
        {
            return visitor.Visit(this, ctx);
        }
    }

    public class Props
    {
        public string Key { get; set; } = string.Empty; // Unique identifier for the element
        public string? InnerText { get; set; } // Optional inner text
        public List<Element>? Children { get; set; } // Optional list of child elements
        public Dictionary<string, object>? Attributes { get; set; } // Optional attributes (e.g., style, class)
        public MobileProps? Mobile { get; set; } // Optional mobile-specific properties
        [JsonPropertyName("customData")]
        public CustomData? CustomData { get; set; } // Optional custom data (e.g., column widths)
    }

    public class MobileProps
    {
        public Dictionary<string, object>? Style { get; set; } // Mobile-specific styles
        public CustomData? CustomData { get; set; } // Mobile-specific custom data
    }

    public class CustomData
    {
        public List<int>? ColumnWidths { get; set; } // Column widths for grid layout
        public List<Interaction>? Interactions { get; set; } = new();
        // Add other custom data properties as needed
    }

    public class Interaction
    {
        public string? Type { get; set; } // Interaction type (e.g., "toggleVisibility", "showElement", "hideElement")
        public string? Target { get; set; } // Target element's unique key
    }
}
