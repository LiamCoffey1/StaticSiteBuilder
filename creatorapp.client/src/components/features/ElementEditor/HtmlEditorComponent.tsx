import { Editor } from "@monaco-editor/react";
import { Box, Button, TextField, Typography, Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import { JsonElement } from "../../../types";
import useEditorStore from "../../../store/editorStore";

interface HtmlEditorProps {
    element: JsonElement;
    onUpdateElement: (updatedElement: JsonElement) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ element, onUpdateElement }) => {
    const { addChild, content } = useEditorStore();
    const [htmlCode, setHtmlCode] = useState(element.props.innerText || '<p>Paragraph</p>');
    const [prompt, setPrompt] = useState("");

    const [model, setModel] = useState("deepseek-coder-v2");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync state with element prop if it changes
        setHtmlCode(element.props.innerText || '<p>Paragraph</p>');
    }, [element]);

    const handleEditorChange = (value: string | undefined) => {
        const updatedHtmlCode = value || '';
        setHtmlCode(updatedHtmlCode);

        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                innerText: updatedHtmlCode,
            },
        };

        onUpdateElement(updatedElement);
    };


    /**
     * Converts an HTML string into a structured BaseElement JSON model.
     */
    function htmlToJsonElement(html: string): JsonElement | null {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const root = doc.body.firstElementChild;

        if (!root) return null; // No valid HTML found

        function parseElement(element: Element, parent: JsonElement | null = null): JsonElement {
            const children: JsonElement[] = [];

            // Recursively parse child nodes
            element.childNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    children.push(parseElement(node as Element, null)); // Child elements
                }
            });

            // Extract attributes
            const attributes: { [key: string]: any } = {};
            for (const attr of element.attributes) {
                attributes[attr.name] = attr.value;
            }

            // Extract styles properly as an object
            let style: { [key: string]: any } | undefined;
            if (attributes["style"]) {
                style = {};
                attributes["style"].split(";").forEach((styleRule: string) => {
                    const [key, value] = styleRule.split(":").map((s) => s.trim());
                    if (key && value) {
                        style[key] = value;
                    }
                });
                attributes["style"] = style; // Remove the style string from attributes
            }

            // Construct the JsonElement object
            const baseElement: JsonElement = {
                type: element.tagName.toLowerCase(),
                props: {
                    key: crypto.randomUUID(), // Unique key
                    innerText: element.textContent?.trim() || undefined,
                    children,
                    attributes: Object.keys(attributes).length ? attributes : undefined,
                    customData: {},
                    mobile: {
                        style: style, // Now style is an object
                        customData: {},
                    },
                },
                parent: parent,
            };

            // Attach parent references to children
            baseElement.props.children.forEach((child) => (child.parent = baseElement));

            return baseElement;
        }

        return parseElement(root, null);
    }

    // Example mapping of Tailwind classes to CSS properties
    const generateDirectionalSpacingMappings = (spacingPrefix, cssPrefix) => {
        const directions = ['t', 'r', 'b', 'l', 'x', 'y', ''];
        const spacingValues = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
            'px', '0.5', '1.5', '2.5'
        ];

        const mappings = {};

        // Loop through each direction (t = top, r = right, b = bottom, l = left, x = left-right, y = top-bottom)
        directions.forEach(direction => {
            spacingValues.forEach(value => {
                let className = '';
                let property = '';
                let newValue = value / 4;
                // Handle 'px' (left-right) and 'py' (top-bottom) correctly for padding and margin
                if (direction === 'x') {
                    className = `${spacingPrefix}x-${value}`;
                    property = `${cssPrefix}-left: ${value === 'px' ? '1px' : newValue + 'rem'}; padding-right: ${value === 'px' ? '1px' : newValue + 'rem'};`;
                } else if (direction === 'y') {
                    className = `${spacingPrefix}y-${value}`;
                    property = `${cssPrefix}-top: ${value === 'px' ? '1px' : newValue + 'rem'}; padding-bottom: ${value === 'px' ? '1px' : newValue + 'rem'};`;
                } else if (direction) {
                    let appliedDirection = 'top';
                    if (direction == 'b') {
                        appliedDirection = 'bottom'
                    }
                    if (direction == 'l') {
                        appliedDirection = 'left'
                    }
                    if (direction == 'r') {
                        appliedDirection = 'right'
                    }
                    className = `${spacingPrefix}${direction}-${value}`;
                    property = `${cssPrefix}-${appliedDirection}: ${value === 'px' ? '1px' : newValue + 'rem'};`;
                } else {
                    className = `${spacingPrefix}-${value}`;
                    property = `${cssPrefix}: ${value === 'px' ? '1px' : newValue + 'rem'};`;
                }

                mappings[className] = property;
            });
        });

        return mappings;
    };

    const widthHeightMappings = (prefix, cssPrefix) => {
        const spacingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        const mappings = {};

        spacingValues.forEach(value => {
            let className = `${prefix}-${value}`;
            let newValue = value / 4;

            mappings[className] = `${cssPrefix}: ${newValue}rem;`;
        });

        return mappings;
    };

    // Generate width and height mappings dynamically
    const widthMappings = widthHeightMappings('w', 'width');
    const heightMappings = widthHeightMappings('h', 'height');
    const gapMappings = widthHeightMappings('gap', 'gap');

    // Generate directional margin and padding mappings dynamically
    const marginMappings = generateDirectionalSpacingMappings('m', 'margin');
    const paddingMappings = generateDirectionalSpacingMappings('p', 'padding');

    const defaultColors = {
        red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            950: "#450a0a",
        },
        orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            950: "#431407",
        },
        amber: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03",
        },
        yellow: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "#eab308",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
            950: "#422006",
        },
        lime: {
            50: "#f7fee7",
            100: "#ecfccb",
            200: "#d9f99d",
            300: "#bef264",
            400: "#a3e635",
            500: "#84cc16",
            600: "#65a30d",
            700: "#4d7c0f",
            800: "#3f6212",
            900: "#365314",
            950: "#1a2e05",
        },
        green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
        },
        emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
            950: "#022c22",
        },
        teal: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042e2b",
        },
        cyan: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
            800: "#155e75",
            900: "#164e63",
            950: "#083344",
        },
        sky: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
            950: "#082f49",
        },
        blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#172554",
        },
        indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b",
        },
        violet: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
            950: "#2e1065",
        },
        purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
            950: "#3b0764",
        },
        fuchsia: {
            50: "#fdf4ff",
            100: "#fae8ff",
            200: "#f5d0fe",
            300: "#f0abfc",
            400: "#e879f9",
            500: "#d946ef",
            600: "#c026d3",
            700: "#a21caf",
            800: "#86198f",
            900: "#701a75",
            950: "#4a0c5e",
        },
        pink: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
            800: "#9d174d",
            900: "#831843",
            950: "#500724",
        },
        rose: {
            50: "#fff1f2",
            100: "#ffe4e6",
            200: "#fecdd3",
            300: "#fda4af",
            400: "#fb7185",
            500: "#f43f5e",
            600: "#e11d48",
            700: "#be123c",
            800: "#9f1239",
            900: "#881337",
            950: "#4c0519",
        },
        slate: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617",
        },
        gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#030712",
        },
        zinc: {
            50: "#fafafa",
            100: "#f4f4f5",
            200: "#e4e4e7",
            300: "#d4d4d8",
            400: "#a1a1aa",
            500: "#71717a",
            600: "#52525b",
            700: "#3f3f46",
            800: "#27272a",
            900: "#18181b",
            950: "#0f0f11",
        },
        neutral: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0a0a0a",
        },

        stone: {
            50: "#fafaf9",
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            700: "#44403c",
            800: "#292524",
            900: "#1c1917",
            950: "#0c0a09",
        },
    };

    // 2. Helper function: Convert a hex color (e.g. "#aabbcc" or "#abc") to an "R,G,B" string.
    // Hex to RGB conversion function (unchanged)
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            throw new Error('Invalid hex color: ' + hex);
        }
        return `${r},${g},${b}`;
    }

    // Generate background and text color mappings
    function generateColorMappings() {
        const mappings = {};

        // Generate background and text color mappings for each color
        Object.keys(defaultColors).forEach(colorName => {
            const colorValue = defaultColors[colorName];

            // If the color has multiple shades (e.g., blue, gray)
            if (typeof colorValue === 'object') {
                Object.keys(colorValue).forEach(shade => {
                    const hex = colorValue[shade];
                    const rgb = hexToRgb(hex);

                    // Generate background color mapping
                    const bgClassName = `bg-${colorName}-${shade}`;
                    mappings[bgClassName] = `background-color: rgb(${rgb}, 1);`;

                    // Generate text color mapping
                    const textClassName = `text-${colorName}-${shade}`;
                    mappings[textClassName] = `color: rgba(${rgb}, 1);`;

                    const borderClassName = `border-${colorName}`;
                    mappings[borderClassName] = `border: rgba(${rgb}, 1);`;
                });
            } else if (typeof colorValue === 'string') {
                const rgb = hexToRgb(colorValue);

                // Single color mapping (background)
                const bgClassName = `bg-${colorName}`;
                mappings[bgClassName] = `background-color: rgba(${rgb}, 1);`;

                // Single color mapping (text)
                const textClassName = `text-${colorName}`;
                mappings[textClassName] = `color: rgba(${rgb}, 1);`;

                const borderClassName = `border-${colorName}`;
                mappings[borderClassName] = `border: rgba(${rgb}, 1);`;
            }
        });

        return mappings;
    }

    const bgColorMappings = generateColorMappings();
    console.log(bgColorMappings);

    // Combine the mappings
    const tailwindToCssMap = {
        border: 'border-width: 3px;',
        'flex-1': 'flex: 1 1 0%;',
        'flex-col': 'flex-direction: column;',
        'min-h-screen': 'min-height: 100vh;',
        'font-poppins': 'font-family: "Poppins", sans-serif;',
        'hero': 'padding: 5rem 0; display: flex; align-items: center; justify-content: center;',
        'bg-blue-500': 'background-color: #3b82f6;',
        'text-white': 'color: white;',
        'text-center': 'text-align: center;',
        'text-4xl': 'font-size: 2.25rem;',
        'md:text-6xl': 'font-size: 3.75rem;',
        'font-bold': 'font-weight: bold;',
        'mb-4': 'margin-bottom: 1rem;',
        'mb-8': 'margin-bottom: 2rem;',
        'text-lg': 'font-size: 1.125rem;',
        'md:text-2xl': 'font-size: 1.5rem;',
        'bg-white': 'background-color: #ffffff;',
        'text-blue-500': 'color: #3b82f6;',
        'py-3': 'padding-top: 0.75rem; padding-bottom: 0.75rem;',
        'px-6': 'padding-left: 1.5rem; padding-right: 1.5rem;',
        'py-4': 'padding-top: 1rem; padding-bottom: 1rem;',
        'px-12': 'padding-left: 3rem; padding-right: 3rem;',
        'rounded-full': 'border-radius: 9999px;',
        'font-semibold': 'font-weight: 600;',
        'hover:bg-blue-600': 'hover:background-color: #2563eb;',
        'hover:text-white': 'hover:color: white;',
        'transition': 'transition: all 0.3s ease;',
        'duration-300': 'transition-duration: 0.3s;',
        'py-12': 'padding-top: 3rem; padding-bottom: 3rem;',
        'container': 'max-width: 1280px; width: 1000;',
        'mx-auto': 'margin-left: auto; margin-right: auto;',
        'grid': 'display: grid;',
        'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr));',
        'md:grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
        'lg:grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
        'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
        'w-16': 'width: 4rem;',
        'h-16': 'height: 4rem;',
        'font-medium': 'font-weight: 500;',
        'cta': 'padding-top: 3rem; padding-bottom: 3rem; background-color: #ffffff; text-align: center;',
        'text-3xl': 'font-size: 1.875rem;',
        'max-w-md': 'max-width: 28rem;',
        'shadow-md': 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
        'shadow-lg': 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);',
        'shadow': 'box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);',
        'p-6': 'padding: 1.5rem;',
        'rounded-lg': 'border-radius: .5rem;',
        'justify-center': 'justify-content: center;',
        'items-center': 'align-items: center;',
        'flex': 'display: flex;',
        'w-full': 'width: 100%;',
        'w-screen': 'width: 100vw;',
        'w-min': 'width: min-content;',
        'w-max': 'width: max-content;',
        'min-w-0': 'min-width: 0;',
        'min-w-full': 'min-width: 100%;',
        'min-w-min': 'min-width: min-content;',
        'min-w-max': 'min-width: max-content;',
        'max-w-0': 'max-width: 0;',
        'max-w-none': 'max-width: none;',
        'max-w-xs': 'max-width: 20rem;',
        'max-w-sm': 'max-width: 24rem;',
        'max-w-lg': 'max-width: 32rem;',
        'max-w-xl': 'max-width: 36rem;',
        'max-w-2xl': 'max-width: 42rem;',
        'max-w-3xl': 'max-width: 48rem;',
        'max-w-4xl': 'max-width: 56rem;',
        'max-w-5xl': 'max-width: 64rem;',
        'max-w-6xl': 'max-width: 72rem;',
        'max-w-7xl': 'max-width: 80rem;',
        'max-w-full': 'max-width: 100%;',
        'max-w-min': 'max-width: min-content;',
        'max-w-max': 'max-width: max-content;',
        'max-w-prose': 'max-width: 65ch;',
        'max-w-screen-sm': 'max-width: 640px;',
        'max-w-screen-md': 'max-width: 768px;',
        'max-w-screen-lg': 'max-width: 1024px;',
        'max-w-screen-xl': 'max-width: 1280px;',
        'max-w-screen-2xl': 'max-width: 1536px;',
        'flex-1': 'flex: 1 1 0%;',
        'flex-auto': 'flex: 1 1 auto;',
        'flex-initial': 'flex: 0 1 auto;',
        'flex-none': 'flex: none;',
        'flex-shrink-0': 'flex-shrink: 0;',
        'flex-shrink': 'flex-shrink: 1;',
        'flex-grow-0': 'flex-grow: 0;',
        'justify-between': 'justify-content: space-between;',
        ...marginMappings,  // Add margin classes
        ...paddingMappings,  // Add padding classes
        ...widthMappings,
        ...heightMappings,
        ...bgColorMappings,
        ...gapMappings
    };

    console.log(paddingMappings, marginMappings);


    // Function to convert Tailwind classes to inline styles
    function convertTailwindToInlineStyles(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const elements = doc.querySelectorAll('*');

        const images = doc.querySelectorAll('img');
        images.forEach(image => {
            image.setAttribute('src', 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='); // Placeholder URL, change as needed
        });

        elements.forEach(element => {
            const tailwindClasses = element.classList;
            let inlineStyles = [];

            // Loop through each Tailwind class and add the corresponding CSS to the inline style
            tailwindClasses.forEach(tailwindClass => {
                if (tailwindClass.includes('gray')) {
                    console.log('gray', tailwindClass, tailwindToCssMap[tailwindClass]);
                }
                if (tailwindToCssMap[tailwindClass]) {
                    inlineStyles.push(tailwindToCssMap[tailwindClass]);
                }
            });

            // Apply the inline styles to the element
            if (inlineStyles.length > 0) {
                element.setAttribute('style', inlineStyles.join(' '));
            }

            // Remove the Tailwind classes from the element
            element.removeAttribute('class');
        });

        return doc.body.innerHTML;
    }

    const generateText = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/generate_block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    max_length: 100,
                    temperature: 0.0,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                let rawText = data.generated_text;

                // Try to extract HTML if wrapped in triple backticks
                let htmlMatch = rawText.match(/```html([\s\S]*?)```/);
                let extractedHtml = htmlMatch ? htmlMatch[1].trim() : rawText.trim();

                // Remove any non-HTML text (before/after detected HTML)
                const htmlTagMatch = extractedHtml.match(/<([a-z]+)(\s|>)/i);
                if (htmlTagMatch) {
                    extractedHtml = extractedHtml.substring(extractedHtml.indexOf(htmlTagMatch[0]));
                }




              
                const jsonElement: JsonElement | null = htmlToJsonElement(convertTailwindToInlineStyles(extractedHtml));
                if (jsonElement) {
                    // addChild(content, jsonElement);
                }

                handleEditorChange(extractedHtml + convertTailwindToInlineStyles(extractedHtml))

                //onUpdateElement(content);
            } else {
                console.error('Error:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    const convertTailwindToBlock = () => {
        const jsonElement: JsonElement | null = htmlToJsonElement(convertTailwindToInlineStyles(htmlCode));
        if (jsonElement) {
            addChild(content, jsonElement);
            onUpdateElement(content);
        }
    }

    return (
        <Box>
            <Typography variant="h6" marginBottom={2}>
                HTML Editor
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={convertTailwindToBlock}
                disabled={loading}
            >
                Generate Text
            </Button>
            <Editor
                height="400px"
                defaultLanguage="html"
                value={htmlCode}
                onChange={handleEditorChange}
                options={{
                    theme: 'vs-dark',
                    minimap: { enabled: false },
                }}
            />
            <TextField
                label="Enter prompt"
                variant="outlined"
                multiline
                rows={10}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                    
                        <InputLabel>Select AI Model</InputLabel>
                        <Select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            label="Select AI Model"
                        >
                            <MenuItem value="deepseek-coder-v2">deepseek-coder-v2</MenuItem>
                            <MenuItem value="deepseek-r1:7B">deepseek-r1:7B</MenuItem>
                    <MenuItem value="codellama:13b">codellama:13b</MenuItem>
                    <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                    <MenuItem value="gpt-4o-mini">gpt-4o-mini</MenuItem>
                    <MenuItem value="gpt-4">gpt-4</MenuItem>
                    <MenuItem value="ode-davinci-002">code-davinci-002</MenuItem>
                    
                    <MenuItem value="o3-mini">o3-mini</MenuItem>
                        </Select>
                    </FormControl>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={generateText}
                disabled={loading}
            >
                Generate Text
            </Button>

            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 1300 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default HtmlEditor;
