import { Editor, useMonaco } from "@monaco-editor/react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import useEditorStore from "../../store/editorStore";

const CodeEditor: React.FC = () => {
    const { bindings, setBindings, isCodeEditorOpen, setIsCodeEditorOpen } = useEditorStore();
    const monaco = useMonaco();
    const [theme, setTheme] = useState("vs-dark");
    const [editorKey, setEditorKey] = useState(0); // Force re-render

    const handleEditorChange = (value: string | undefined) => {
        setBindings({ ...bindings, css: value || "" });
    };

    const handleEditorClose = () => {
        setIsCodeEditorOpen(false);
    };

    useEffect(() => {
        if (monaco) {
            monaco.editor.setTheme(theme);
            setEditorKey(prev => prev + 1); // Force editor to re-render with new theme
        }
    }, [monaco, theme]);

    return (
        <Dialog open={isCodeEditorOpen} onClose={handleEditorClose} fullWidth maxWidth="lg">
            <DialogTitle>Edit CSS</DialogTitle>
            <DialogContent>
                <Editor
                    key={editorKey} // Force re-render when theme changes
                    theme={theme} // Ensures theme is applied
                    height="400px"
                    language="css"
                    value={bindings.css}
                    onChange={handleEditorChange}
                    options={{
                        selectOnLineNumbers: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditorClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CodeEditor;
