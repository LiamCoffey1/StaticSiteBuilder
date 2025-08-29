namespace CreatorApp.Server.Defaults
{
    public static class DefaultPages
    {
        public const string DefaultsJson = """
[
    {
        "id": "1755040555975",
        "name": "Test2",
        "content": {
            "type": "ROOT",
            "props": {
                "key": "root",
                "children": [
                    {
                        "type": "div",
                        "props": {
                            "key": "container2-1755040194776",
                            "children": [],
                            "attributes": {
                                "className": "container2",
                                "style": {
                                    "marginBottom": "20px",
                                    "background": "whitesmoke",
                                    "paddingTop": "30px",
                                    "marginLeft": "10px",
                                    "marginRight": "10px",
                                    "paddingBottom": "30px",
                                    "paddingLeft": "30px",
                                    "paddingRight": "30px",
                                    "border": "1px solid grey"
                                }
                            }
                        }
                    },
                    {
                        "type": "html",
                        "props": {
                            "key": "html-1755040194776",
                            "innerText": "<p>This is a paragraph.</p>",
                            "children": [],
                            "attributes": {
                                "className": "container",
                                "style": {
                                    "marginBottom": "20px",
                                    "padding": 10,
                                    "border": "1px solid grey"
                                }
                            }
                        }
                    },
                    {
                        "type": "p",
                        "props": {
                            "key": "text-1755040194776",
                            "innerText": "This is a paragraph.",
                            "children": [],
                            "attributes": {
                                "className": "text",
                                "style": {
                                    "marginBottom": "20px",
                                    "fontFamily": "Arial",
                                    "paddingLeft": "5px",
                                    "paddingRight": "5px",
                                    "color": "black"
                                }
                            }
                        }
                    },
                    {
                        "type": "button",
                        "props": {
                            "key": "button-1755040194776",
                            "innerText": "Click Me",
                            "children": [],
                            "attributes": {
                                "className": "button",
                                "style": {
                                    "marginBottom": "20px",
                                    "color": "black"
                                }
                            }
                        }
                    },
                    {
                        "type": "row",
                        "props": {
                            "key": "row-1755040194776",
                            "children": [
                                {
                                    "type": "column",
                                    "props": {
                                        "key": "column-1-1755040194776",
                                        "children": [
                                            {
                                                "type": "button",
                                                "props": {
                                                    "key": "button-1-1755040194776",
                                                    "innerText": "Button 1",
                                                    "children": [],
                                                    "attributes": {
                                                        "className": "row-button",
                                                        "style": { "color": "blue" }
                                                    }
                                                }
                                            }
                                        ],
                                        "attributes": {
                                            "className": "column-container",
                                            "style": { "padding": "8px", "border": "1px dashed black" }
                                        }
                                    }
                                },
                                {
                                    "type": "column",
                                    "props": {
                                        "key": "column-2-1755040194776",
                                        "children": [
                                            {
                                                "type": "p",
                                                "props": {
                                                    "key": "paragraph-1755040194776",
                                                    "innerText": "Paragraph inside row",
                                                    "children": [],
                                                    "attributes": {
                                                        "className": "row-paragraph",
                                                        "style": { "fontSize": "14px" }
                                                    }
                                                }
                                            }
                                        ],
                                        "attributes": {
                                            "className": "column-container",
                                            "style": { "padding": "8px", "border": "1px dashed black" }
                                        }
                                    }
                                }
                            ],
                            "attributes": {
                                "className": "row-container",
                                "style": { "padding": "10px", "border": "1px solid gray" }
                            }
                        }
                    },
                    {
                        "type": "image",
                        "props": {
                            "key": "image-1755040194776",
                            "innerText": "",
                            "children": [],
                            "attributes": {
                                "className": "image",
                                "src": "{CDN_BASE}/vite.svg",
                                "style": { "color": "white" }
                            }
                        }
                    }
                ]
            }
        },
        "bindings": {
            "css": "",
            "bindings": [],
            "default": { "index": 0 }
        }
    }
]
""";
    }
}
