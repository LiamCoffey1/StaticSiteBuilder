using CreatorApp.Domain;
using CreatorApp.Domain.Models;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace CreatorApp.Generator
{
    public class GenerateHtmlVisitor : IElementVisitor<HtmlGenerationResult, HtmlGenerationOptions>
    {
        // Precompiled regex for performance and readability
        private static readonly Regex UpperCaseRegex = new("(?<!^)([A-Z])", RegexOptions.Compiled);
        private static readonly Regex HtmlTagRegex = new(@"<\s*\w+[^>]*>", RegexOptions.Compiled);

        public HtmlGenerationResult Visit(Element element, VisitorContext<HtmlGenerationOptions> ctx)
        {
            if (element == null) return new HtmlGenerationResult();

            ctx.Ancestors.Push(element);
            VisitElement(element, ctx);
            ctx.Ancestors.Pop();

            return new HtmlGenerationResult
            {
                ContentHtml = ctx.Html.ToString(),
                Css = ctx.Css.ToString()
            };
        }


        protected virtual void VisitElement(Element element, VisitorContext<HtmlGenerationOptions> ctx)
        {
            // Resolve element basics
            var elementType = MapElementType(element, ctx);
            var key = element.Props?.Key ?? string.Empty;

            // Build attributes and classes
            var (mergedClass, otherAttrs) = BuildAttributes(element, ctx, key);

            // Styles (element-scoped)
            AppendElementStyles(element, ctx, key);

            // Open tag
            AppendOpenTag(ctx.Html, elementType, mergedClass, otherAttrs);

            // Content
            AppendInnerContent(element, ctx);

            // Special cases
            if (element.Type == "row")
            {
                RenderRow(element, ctx, key);
            }
            else
            {
                // Default: visit children inline
                if (element.Props?.Children != null)
                {
                    foreach (var child in element.Props.Children)
                    {
                        Visit(child, ctx);
                    }
                }
            }

            // Close tag
            AppendCloseTag(ctx.Html, elementType);
        }

        protected virtual string MapElementType(Element element, VisitorContext<HtmlGenerationOptions> ctx)
        {
            if (ctx.ContextData.ElementTypeMap.TryGetValue(element.Type, out var mapped)) return mapped;
            return element.Type;
        }

        // ==== Helpers =========================================================

        private static (string mergedClass, string otherAttributes) BuildAttributes(Element element, VisitorContext<HtmlGenerationOptions> ctx, string key)
        {
            var classes = new List<string>();
            if (!string.IsNullOrEmpty(key)) classes.Add($"element-{key}");
            var otherAttrs = new StringBuilder();

            // Interactions: inline onclick (backward-compat)
            if (ctx.ContextData.UseInlineOnClick && element.Props?.CustomData?.Interactions != null && element.Props.CustomData.Interactions.Count > 0)
            {
                var first = element.Props.CustomData.Interactions[0];
                if (!string.IsNullOrWhiteSpace(first?.Type))
                {
                    otherAttrs.Append($" onclick=\"{first.Type}('{first.Target}')\"");
                }
            }

            // Attributes merge and class/className handling
            if (element.Props?.Attributes != null)
            {
                foreach (var attribute in element.Props.Attributes)
                {
                    var name = attribute.Key ?? string.Empty;
                    if (string.Equals(name, "style", StringComparison.OrdinalIgnoreCase)) continue; // handled via CSS extraction

                    if (string.Equals(name, "class", StringComparison.OrdinalIgnoreCase) || string.Equals(name, "className", StringComparison.OrdinalIgnoreCase))
                    {
                        var value = attribute.Value?.ToString();
                        if (!string.IsNullOrWhiteSpace(value)) classes.Add(value);
                        continue;
                    }

                    // Normalize className -> class just in case
                    if (string.Equals(name, "className", StringComparison.OrdinalIgnoreCase)) name = "class";

                    var attrValue = attribute.Value?.ToString();
                    if (attrValue != null)
                    {
                        otherAttrs.Append($" {name}=\"{attrValue}\"");
                    }
                }
            }

            var mergedClass = string.Join(" ", classes.Where(c => !string.IsNullOrWhiteSpace(c)));
            return (mergedClass, otherAttrs.ToString());
        }

        private static void AppendElementStyles(Element element, VisitorContext<HtmlGenerationOptions> ctx, string key)
        {
            if (string.IsNullOrEmpty(key)) return;

            // Styles (desktop)
            if (element.Props?.Attributes != null && element.Props.Attributes.TryGetValue("style", out var styleValue))
            {
                var styles = ExtractStyleDictionary(styleValue);
                if (styles != null && styles.Count > 0)
                {
                    var css = ConvertStylesToCss(styles);
                    if (!string.IsNullOrEmpty(css)) ctx.Css.AppendLine($".element-{key} {{ {css} }}");
                }
            }

            // Styles (mobile)
            if (element.Props?.Mobile?.Style != null)
            {
                var mobileCss = ConvertStylesToCss(element.Props.Mobile.Style);
                if (!string.IsNullOrEmpty(mobileCss)) ctx.Css.AppendLine($"@media (max-width: {ctx.ContextData.MobileMaxWidth}px) {{ .element-{key} {{ {mobileCss} }} }}");
            }
        }

        private static void AppendInnerContent(Element element, VisitorContext<HtmlGenerationOptions> ctx)
        {
            var inner = element.Props?.InnerText ?? string.Empty;
            if (string.IsNullOrEmpty(inner)) return;

            if (ctx.ContextData.RawHtmlElementTypes.Contains(element.Type) || LooksLikeHtml(inner))
            {
                ctx.Html.Append(inner);
            }
            else
            {
                ctx.Html.Append(System.Net.WebUtility.HtmlEncode(inner));
            }
        }

        private void RenderRow(Element element, VisitorContext<HtmlGenerationOptions> ctx, string key)
        {
            var rowClass = $"row-{key}";
            ctx.Css.AppendLine($".{rowClass} {{ display: grid; grid-template-columns: repeat(12, 1fr); }}");

            // Mobile-specific style for the row container
            if (element.Props?.Mobile?.Style != null)
            {
                var mobileCss = ConvertStylesToCss(element.Props.Mobile.Style);
                if (!string.IsNullOrEmpty(mobileCss))
                {
                    ctx.Css.AppendLine($"@media (max-width: {ctx.ContextData.MobileMaxWidth}px) {{ .{rowClass} {{ {mobileCss} }} }}");
                }
            }

            ctx.Html.Append("<div class=\"").Append(rowClass).Append("\">");

            var children = element.Props?.Children;
            if (children != null && children.Count > 0)
            {
                for (int idx = 0; idx < children.Count; idx++)
                {
                    var child = children[idx];
                    var reg = element.Props?.CustomData?.ColumnWidths != null && idx < element.Props.CustomData.ColumnWidths.Count
                        ? element.Props.CustomData.ColumnWidths[idx]
                        : 12;

                    var mob = element.Props?.Mobile?.CustomData?.ColumnWidths != null && idx < element.Props.Mobile.CustomData.ColumnWidths.Count
                        ? element.Props.Mobile.CustomData.ColumnWidths[idx]
                        : reg;

                    var childClass = $"child-{key}-{idx}";

                    ctx.Css.AppendLine($".{childClass} {{ grid-column: span {reg}; }}");

                    if (element.Props?.Mobile?.CustomData?.ColumnWidths != null)
                    {
                        ctx.Css.AppendLine($"@media (max-width: {ctx.ContextData.MobileMaxWidth}px) {{ .{childClass} {{ grid-column: span {mob}; }} }}");
                    }

                    ctx.Html.Append("<div class=\"").Append(childClass).Append("\">");
                    Visit(child, ctx);
                    ctx.Html.Append("</div>");
                }
            }

            ctx.Html.Append("</div>");
        }

        private static void AppendOpenTag(StringBuilder html, string elementType, string mergedClass, string otherAttrs)
        {
            html.Append('<').Append(elementType);
            if (!string.IsNullOrWhiteSpace(mergedClass)) html.Append(" class=\"").Append(mergedClass).Append('\"');
            if (!string.IsNullOrEmpty(otherAttrs)) html.Append(otherAttrs);
            html.Append('>');
        }

        private static void AppendCloseTag(StringBuilder html, string elementType)
        {
            html.Append("</").Append(elementType).Append('>');
        }

        protected static Dictionary<string, object>? ExtractStyleDictionary(object? styleValue)
        {
            if (styleValue is JsonElement je && je.ValueKind == JsonValueKind.Object)
            {
                return System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(je.GetRawText());
            }
            return styleValue as Dictionary<string, object>;
        }

        protected static string ConvertStylesToCss(Dictionary<string, object> styles)
        {
            if (styles == null || styles.Count == 0) return string.Empty;
            var sb = new StringBuilder();
            foreach (var kv in styles)
            {
                var prop = CamelCaseToDashCase(kv.Key);
                var val = kv.Value?.ToString() ?? string.Empty;
                if (!string.IsNullOrEmpty(val)) sb.Append(prop).Append(": ").Append(val).Append("; ");
            }
            return sb.ToString().Trim();
        }

        protected static string CamelCaseToDashCase(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            var result = UpperCaseRegex.Replace(input, "-$1");
            return result.ToLowerInvariant();
        }

        protected static bool LooksLikeHtml(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return false;
            return HtmlTagRegex.IsMatch(input);
        }

    }
}
