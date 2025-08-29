using CreatorApp.Domain.Models;
using FluentAssertions;
using Moq;

namespace CreatorApp.Generator.Tests
{
    public class HtmlGeneratorTests
    {
        private readonly Mock<ITemplateRepository> _templateRepositoryMock;
        private readonly HtmlGenerator _sut;

        public HtmlGeneratorTests()
        {
            _templateRepositoryMock = new Mock<ITemplateRepository>();
            _sut = new HtmlGenerator(_templateRepositoryMock.Object);
        }

        [Fact]
        public void GenerateHtml_WithSimpleElement_GeneratesCorrectHtml()
        {
            // Arrange
            var element = new Element
            {
                Type = "div",
                Props = new Props
                {
                    InnerText = "Hello World",
                    Key = "test-div"
                }
            };

            _templateRepositoryMock
                .Setup(x => x.LoadTemplate(It.IsAny<string>()))
                .Returns("<html>{styles}{content}</html>");

            // Act
            var result = _sut.GenerateHtml(element);

            // Assert
            result.Should().Contain("<div class=\"element-test-div\">Hello World</div>");
            result.Should().Contain("<body>");
            result.Should().Contain("</body>");
        }

        [Fact]
        public void GenerateHtml_WithNestedElements_GeneratesCorrectStructure()
        {
            // Arrange
            var rootElement = new Element
            {
                Type = "div",
                Props = new Props
                {
                    Key = "container",
                    Children = new List<Element>
                    {
                        new Element
                        {
                            Type = "p",
                            Props = new Props { InnerText = "Paragraph 1" }
                        },
                        new Element
                        {
                            Type = "p", 
                            Props = new Props { InnerText = "Paragraph 2" }
                        }
                    }
                }
            };

            _templateRepositoryMock
                .Setup(x => x.LoadTemplate(It.IsAny<string>()))
                .Returns("{content}{styles}");

            // Act
            var result = _sut.GenerateHtml(rootElement);

            // Assert
            result.Should().Contain("Paragraph 1");
            result.Should().Contain("Paragraph 2");
            result.Should().Contain("<div class=\"element-container\">");
        }

        [Fact]
        public void GenerateHtml_WithStyles_IncludesStylesInOutput()
        {
            // Arrange
            var element = new Element
            {
                Type = "div",
                Props = new Props
                {
                    Key = "styled-div",
                    Attributes = new Dictionary<string, object>
                    {
                        ["style"] = new Dictionary<string, object>
                        {
                            ["backgroundColor"] = "red",
                            ["fontSize"] = "16px"
                        }
                    }
                }
            };

            _templateRepositoryMock
                .Setup(x => x.LoadTemplate(It.IsAny<string>()))
                .Returns("<html>{styles}{content}</html>");

            // Act
            var result = _sut.GenerateHtml(element);

            // Assert
            result.Should().Contain("<style>");
            result.Should().Contain(".element-styled-div");
            result.Should().Contain("background-color: red");
            result.Should().Contain("font-size: 16px");
        }
    }
}