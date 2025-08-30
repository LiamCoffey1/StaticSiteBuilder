import { Editor } from "@monaco-editor/react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { JsonElement } from "../../../types";

interface HtmlEditorProps {
    element: JsonElement;
    onUpdateElement: (updatedElement: JsonElement) => void;
}

const DEFAULT_HTML = '<p>Paragraph</p>';

const HtmlEditor: React.FC<HtmlEditorProps> = ({ element, onUpdateElement }) => {
    const [htmlCode, setHtmlCode] = useState(element.props.innerText || DEFAULT_HTML);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHtmlCode(element.props.innerText || DEFAULT_HTML);
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

    return (
        <Box>
            <Typography variant="h6" marginBottom={2}>
                HTML Editor
            </Typography>
           
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
          
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 1300 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default HtmlEditor;
