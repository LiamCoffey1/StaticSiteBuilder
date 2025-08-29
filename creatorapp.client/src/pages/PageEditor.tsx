import { Box, Tabs, Tab, Typography, Button, IconButton, Paper, ListItem } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTheme } from '@mui/material/styles'
import MobileIcon from '@mui/icons-material/PhoneAndroid'; // Import mobile icon
import DesktopIcon from '@mui/icons-material/LaptopMac'; // Import desktop icon

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddElement from "../components/features/AddElement";
import ChatboxBindings from "../components/features/ChatboxBindings";
import CodeEditor from "../components/features/CodeEditor";
import ElementEditor from "../components/features/ElementEditor";
import JsonRenderer from "../components/features/JsonRenderer";
import TreeView from "../components/features/TreeView";
import EditorNavbar from "../components/layouts/EditorNavbar";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useEditorStore from "../store/editorStore";
import { useLocation, useNavigate } from "react-router-dom";
import { AddCircle, Layers, Palette } from "@mui/icons-material";

import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';


import TuneIcon from '@mui/icons-material/Tune';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import TouchAppIcon from '@mui/icons-material/TouchApp';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import usePageListStore from "../store/pageListStore";
import BookIcon from '@mui/icons-material/Book';

const PageEditor: React.FC = () => {
    const location = useLocation();
    const pageId = new URLSearchParams(location.search).get('page_id');
    const setPageId = useEditorStore(state => state.setPageId);

    const { pages, selectPage } = usePageListStore();
    const navigate = useNavigate();

    const isPageIdSet = useRef(false);

    useEffect(() => {
        if (pageId && !isPageIdSet.current) {
            // ensure selected page sync
            if (pages.some(p => p.id === pageId)) {
                selectPage(pageId);
                setPageId(pageId); // Set pageId from URL to the store
                isPageIdSet.current = true; // Prevent subsequent updates
            } else {
                navigate('/');
            }
        } else if (!pageId) {
            navigate('/');
        }
    }, [pageId, setPageId, pages, selectPage, navigate]);

    // Destructure all store values to use in the component
    const updatePageIdInUrl = (newPageId: string) => {
        const newUrl = `${window.location.pathname}?page_id=${newPageId}`;
        window.history.replaceState({}, '', newUrl);  // Use pushState if you want to add to history
        selectPage(newPageId);
        setPageId(newPageId);  // Update state with the new pageId
    };
    const {
        content,
        selectedElement,
        setSelectedElement,
        bindings,
        setBindings,
        isFullscreen,
        setIsFullscreen,
        isMobileView,
        setIsMobileView,
        handleUndo,
        handleRedo,
        handleDeleteElement,
        handleAddElement,
    } = useEditorStore();

    const [currentTab, setCurrentTab] = useState(0);
    const [elementCurrentTab, setElementCurrentTab] = useState(0);
    const [editorTab, setEditorTab] = useState(0);


    useEffect(() => {
        // Create a new style element
        const styleElement = document.getElementById('dynamic-css');

        // If the style element doesn't exist, create it
        if (!styleElement) {
            const newStyleElement = document.createElement('style');
            newStyleElement.id = 'dynamic-css';
            newStyleElement.textContent = bindings.css;
            document.head.appendChild(newStyleElement);
        } else {
            styleElement.textContent = bindings.css; // Update with the current cssCode
        }

        // Cleanup function to remove the style element when the component is unmounted
        return () => {
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, [bindings.css]); // Re-run this effect whenever the CSS code changes

    useKeyboardShortcuts({
        'Ctrl+z': handleUndo,
        'Ctrl+Shift+z': handleRedo,
        'Ctrl+y': handleRedo,
        'Delete': () => selectedElement && handleDeleteElement(selectedElement),
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    const handleElementTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setElementCurrentTab(newValue);
    };
    const theme = useTheme(); // Get theme dynamically

    return (
        <>
            <EditorNavbar />
            <CodeEditor />

            <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                {/* Left Sidebar */}
                {!isFullscreen && (<>
                    {/* Left-side vertical button grid */}
                    <Paper
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 0,
                            borderRight: 1, borderColor: 'divider',
                            boxShadow: 3, // Elevation effect (adjust the value for more/less shadow)
                        }}
                    >
                        <Box onClick={() => setEditorTab(0)} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: 1, // Optional: add some space between the icon and text
                            color: editorTab === 0 ? 'rgb(146, 142, 255)' : 'white'
                        }}>
                            <AddCircleIcon />
                            <Typography variant="caption">Add</Typography>
                        </Box>
                        <Box onClick={() => setEditorTab(1)} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 2,
                            borderColor: 'divider',
                            padding: 1, // Optional: add some space between the icon and text,
                            color: editorTab === 1 ? 'rgb(146, 142, 255)' : 'white'
                        }}>
                            <BookIcon sx={{

                            }} />
                            <Typography variant="caption">Pages</Typography>
                        </Box>
                    </Paper>
                    {editorTab === 1 &&
                        <Box
                            sx={{
                                width: 432,
                                bgcolor: 'background.paper', // Adjusts to light/dark theme
                                display: 'flex',
                                flexDirection: 'column', // Stacks Tabs and Content vertically
                            }}
                        >
                            {pages.map(page => (
                                <ListItem onClick={() => { updatePageIdInUrl(page.id) }} key={page.id} sx={{ display: 'flex', margin: 0, justifyContent: 'space-between',  padding: 0 }}>
                                    <Paper sx={{ width: '100%', display: 'flex', border: 1, borderColor: 'divider', justifyContent: 'space-between', alignItems: 'center', padding: 1, }}>
                                        <Typography variant="body1">{page.name}</Typography>
                                    </Paper>
                                </ListItem>
                            ))}
                        </Box>
                    }
                    {editorTab === 0 &&
                        <Box
                            sx={{
                                width: 350,
                                bgcolor: 'background.paper', // Adjusts to light/dark theme
                                borderRight: `1px solid ${theme.palette.divider}`, // Uses MUI's contrast divider
                                display: 'flex',
                                flexDirection: 'column', // Stacks Tabs and Content vertically
                            }}
                        >
                            <Tabs
                                orientation="horizontal"
                                variant="standard"
                                value={currentTab}
                                onChange={handleTabChange}
                                aria-label="Editor Tabs"
                                sx={{
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <Tab
                                    icon={<AddCircle />} // Icon for "Add Element"
                                    aria-label="Add Element"
                                    sx={{ color: 'text.primary', fontSize: 12 }}
                                />
                                <Tab
                                    icon={<Layers />} // Icon for "Layers"
                                    aria-label="Layers"
                                    sx={{ color: 'text.primary', fontSize: 12 }}
                                />
                                <Tab
                                    icon={<Palette />} // Icon for "Swatches"
                                    aria-label="Swatches"
                                    sx={{ color: 'text.primary', fontSize: 12 }}
                                />
                            </Tabs>

                            {/* Box for content to fill remaining height and be scrollable */}
                            <Box
                                sx={{
                                    flexGrow: 1, // Fill remaining height
                                    paddingBottom: '30px',
                                    overflowY: 'auto', // Enables vertical scrolling
                                    padding: '10px', // Optional: Adds padding inside the box
                                }}
                            >
                                {currentTab === 0 && <AddElement />}
                                {currentTab === 1 && (
                                    <>
                                        <Typography variant="h5" sx={{ marginTop: 3, mb: 3 }}>
                                            Layers
                                        </Typography>
                                        <TreeView />
                                    </>
                                )}
                                {currentTab === 2 && (
                                    <ChatboxBindings bindings={bindings} onUpdateBindings={setBindings} />
                                )}
                            </Box>
                        </Box>
                    }
                </>)}

                {/* Middle Canvas (Rendered View) */}
                <Box
                    sx={{
                        flexGrow: 1,
                        padding: 2,
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{

                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            border: 1,
                            borderColor: 'divider',
                            marginBottom: 2,
                            paddingX: 2,
                        }}
                    >
                        {/* Left: Page Settings Button */}
                        <Button
                            startIcon={<SettingsIcon />}
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Page Settings
                        </Button>

                        {/* Middle: View Mode Icons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DesktopIcon
                                onClick={() => setIsMobileView(false)}
                                sx={{
                                    fontSize: 30,
                                    cursor: 'pointer',
                                    color: !isMobileView ? 'primary.main' : 'text.secondary',
                                }}
                            />
                            <MobileIcon
                                onClick={() => setIsMobileView(true)}
                                sx={{
                                    fontSize: 30,
                                    cursor: 'pointer',
                                    color: isMobileView ? 'primary.main' : 'text.secondary',
                                }}
                            />
                        </Box>

                        {/* Right: Fullscreen Button */}
                        <IconButton> {/* Define this function */}
                            <FullscreenIcon />
                        </IconButton>
                    </Box>

                    {isMobileView ? (
                        <div
                            className="top-container"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        >
                            <Box
                                sx={{
                                    width: '375px',
                                    height: '667px',
                                    borderRadius: (theme) => theme.shape.borderRadius,
                                    overflow: 'auto',
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <DndProvider backend={HTML5Backend}>
                                    <JsonRenderer />
                                </DndProvider>
                            </Box>
                        </div>
                    ) : (
                        <div
                            className="top-container"
                            style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', width: '100%' }}
                        >
                            <DndProvider backend={HTML5Backend}>
                                <JsonRenderer />
                            </DndProvider>
                        </div>
                    )}
                </Box>

                {/* Right Sidebar */}
                {!isFullscreen && (
                    <Box
                        sx={{
                            width: 350,
                            bgcolor: 'background.paper', // Adjusts to light/dark theme
                            borderRight: `1px solid ${theme.palette.divider}`, // Uses MUI's contrast divider
                            display: 'flex',
                            flexDirection: 'column', // Stacks Tabs and Content vertically
                        }}
                    >

                        <Tabs
                            orientation="horizontal"
                            variant="standard"
                            value={elementCurrentTab}
                            onChange={handleElementTabChange}
                            aria-label="Editor Tabs"
                            sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Tab
                                icon={<TuneIcon />} // Icon for "Add Element"
                                aria-label="Add Element"
                                sx={{ color: 'text.primary', fontSize: 12 }}
                            />
                            <Tab
                                icon={<FormatPaintIcon />} // Icon for "Layers"
                                aria-label="Layers"
                                sx={{ color: 'text.primary', fontSize: 12 }}
                            />
                            <Tab
                                icon={<TouchAppIcon />} // Icon for "Swatches"
                                aria-label="Swatches"
                                sx={{ color: 'text.primary', fontSize: 12 }}
                            />
                        </Tabs>

                        <Box
                            sx={{
                                flexGrow: 1, // Fill remaining height
                                paddingBottom: '30px',
                                overflowY: 'auto', // Enables vertical scrolling
                                padding: '10px', // Optional: Adds padding inside the box
                            }}
                        >
                            {selectedElement && <ElementEditor currentTab={elementCurrentTab} />}
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default PageEditor;
