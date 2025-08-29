import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import Diamond from "@mui/icons-material/Diamond";
import useEditorStore from "../../store/editorStore";
import { serialize } from "../../utils/treeActions";
import { JsonElement } from "../../types";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import usePageListStore from "../../store/pageListStore";
import { publishSite } from "../../api/site";
import { useSnackbar } from "../../context/SnackbarContext";

function EditorNavbar() {
    const { showSnackbar } = useSnackbar();
    const {
        pages,
        savePage
    } = usePageListStore()
    const {
        pageId,
        bindings,
        content,
        setContent,
        addChild,
        undoStack,
        redoStack,
        handleUndo,
        handleRedo,
        isFullscreen,
        setIsCodeEditorOpen,
        setIsFullscreen,
        setIsMobileView,
        isMobileView,
    } = useEditorStore();

    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const handleSavePage = async () => {
        if (saving) return;
        setSaving(true);
        try {
            await savePage(pageId, content, bindings);
            showSnackbar('Page saved', 'success');
        } catch (e) {
            showSnackbar('Failed to save page', 'error');
        } finally {
            setSaving(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promptText, setPromptText] = useState("");
    const [temperature, setTemperature] = useState(0.8);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState("deepseek-r1:14b");

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



    const generateText = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/generate_block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model || 'deepseek-coder-v2',
                    prompt: promptText,
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
                    console.log(extractedHtml)
                }

                const jsonElement: JsonElement | null = htmlToJsonElement(extractedHtml);
                if (jsonElement) {
                    addChild(content, jsonElement);
                    setContent(content);
                    console.log('element version', jsonElement);
                }


                setIsModalOpen(false);

                // Pass only the HTML content to the editor
            } else {
                console.error('Error:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateWebsite = async () => {
        if (publishing) return;
        setPublishing(true);
        const serializedPages = pages.map(page => ({
            id: page.id,
            name: page.name,
            content: serialize(page.content)
        }));
        try {
            await publishSite({ pages: serializedPages });
            showSnackbar('Site published successfully', 'success');
        } catch (error) {
            console.error('Error publishing site:', error);
            showSnackbar('Failed to publish site', 'error');
        } finally {
            setPublishing(false);
        }
    };

    const publishSiteAction = async () => { };
    let navigate = useNavigate();
    return (
        <>
            <AppBar position="static" sx={{
                border: 1, // Optional: Add border to match the theme
                borderColor: 'divider', // Optional: Use theme divider color for border
            } }>
                <Toolbar>
                    <IconButton color="primary" onClick={() => navigate('/')}>
                        <Home />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Page Editor
                    </Typography>
                    <Button color="inherit" onClick={() => setIsModalOpen(true)}>
                        <Diamond />
                    </Button>
                    <Button color="inherit" onClick={() => setIsCodeEditorOpen(true)}>
                        <CodeIcon />
                    </Button>
                    <Button
                        color="inherit"
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                    >
                        <UndoIcon />
                    </Button>
                    <Button
                        color="inherit"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                    >
                        <RedoIcon />
                    </Button>

                    <Button sx={{ pl: 3, pr: 3 }}  color="primary" variant="contained" onClick={handleSavePage} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button sx={{ pl: 3, pr: 3 }} color="primary" variant="contained" onClick={handleGenerateWebsite} disabled={publishing}>
                        {publishing ? 'Publishing...' : 'Generate'}
                    </Button>
                    
                </Toolbar>
            </AppBar>

            {/* Modal for AI Prompt Input */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Enter AI Prompt
                    </Typography>
                    {/* Model Selection Dropdown */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                    
                        <InputLabel>Select AI Model</InputLabel>
                        <Select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            label="Select AI Model"
                        >
                            <MenuItem value="deepseek-coder-v2">deepseek-coder-v2</MenuItem>
                            <MenuItem value="deepseek-r1:7B">deepseek-r1:7B</MenuItem>
                            <MenuItem value="deepseek-r1:8B">deepseek-r1:8B</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Describe what you want to generate..."
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Temperature"
                        variant="outlined"
                        inputProps={{ min: 0, max: 2, step: 0.1 }}
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button
                            disabled={loading}
                            variant="contained"
                            sx={{ ml: 2 }}
                            onClick={() => {
                                generateText();
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default EditorNavbar;
