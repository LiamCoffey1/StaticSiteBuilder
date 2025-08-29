using CreatorApp.Domain;
using CreatorApp.Domain.Models;
using FluentAssertions;

namespace CreatorApp.Generator.Tests
{
    public class GenerateHtmlVisitorTests
    {
        private readonly GenerateHtmlVisitor _sut;
        private readonly HtmlGenerationOptions _options;
        private readonly VisitorContext<HtmlGenerationOptions> _context;

        public GenerateHtmlVisitorTests()
        {
            _sut = new GenerateHtmlVisitor();
            _options = new HtmlGenerationOptions();
            _context = new VisitorContext<HtmlGenerationOptions>(_options);
        }

        [Fact]
        public void Visit_NullElement_ReturnsEmptyResult()
        {
            // Act
            var result = _sut.Visit(null!, _context);

            // Assert
            result.Should().NotBeNull();
            result.ContentHtml.Should().BeEmpty();
            result.Css.Should().BeEmpty();
        }

        [Fact]
        public void Visit_ElementWithInlineOnClick_GeneratesOnClickAttribute()
        {
            // Arrange
            _options.UseInlineOnClick = true;
            var element = new Element
            {
                Type = "button",
                Props = new Props
                {
                    InnerText = "Click me",
                    CustomData = new CustomData
                    {
                        Interactions = new List<Interaction>
                        {
                            new() { Type = "handleClick", Target = "button1" }
                        }
                    }
                }
            };

            // Act
            var result = _sut.Visit(element, _context);

            // Assert
            result.ContentHtml.Should().Contain("onclick=\"handleClick('button1')\"");
        }

        [Fact]
        public void Visit_RowElement_GeneratesGridLayout()
        {
            // Arrange
            var rowElement = new Element
            {
                Type = "row",
                Props = new Props
                {
                    Key = "test-row",
                    Children = new List<Element>
                    {
                        new Element { Type = "div", Props = new Props { InnerText = "Col1" } },
                        new Element { Type = "div", Props = new Props { InnerText = "Col2" } }
                    },
                    CustomData = new CustomData
                    {
                        ColumnWidths = new List<int> { 6, 6 }
                    }
                }
            };

            // Act
            var result = _sut.Visit(rowElement, _context);

            // Assert
            result.ContentHtml.Should().Contain("class=\"row-test-row\"");
            result.Css.Should().Contain("display: grid");
            result.Css.Should().Contain("grid-template-columns: repeat(12, 1fr)");
            result.Css.Should().Contain("grid-column: span 6");
        }

        [Theory]
        [InlineData("backgroundColor", "background-color")]
        [InlineData("fontSize", "font-size")]
        [InlineData("marginTop", "margin-top")]
        public void CamelCaseToDashCase_ConvertsCorrectly(string input, string expected)
        {
            // Use reflection to test the protected static method
            var method = typeof(GenerateHtmlVisitor).GetMethod("CamelCaseToDashCase",
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);
            
            var result = method?.Invoke(null, new[] { input });
            
            result.Should().Be(expected);
        }

        [Theory]
        [InlineData("<div>test</div>", true)]
        [InlineData("<p>", true)]
        [InlineData("plain text", false)]
        [InlineData("", false)]
        public void LooksLikeHtml_DetectsHtmlCorrectly(string input, bool expected)
        {
            // Use reflection to test the protected static method
            var method = typeof(GenerateHtmlVisitor).GetMethod("LooksLikeHtml",
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);
            
            var result = method?.Invoke(null, new[] { input });
            
            result.Should().Be(expected);
        }
    }
}