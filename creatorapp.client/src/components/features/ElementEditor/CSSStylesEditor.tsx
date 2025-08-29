import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

interface CssStylesEditorProps {
    cssStyles: Record<string, string>;
    newStyleName: string;
    newStyleValue: string;
    setNewStyleName: (value: string) => void;
    setNewStyleValue: (value: string) => void;
    handleStyleChange: (e: React.ChangeEvent<HTMLInputElement>, styleName: string) => void;
    handleRemoveStyle: (styleName: string) => void;
    handleAddStyle: () => void;
}

const CssStylesEditor: React.FC<CssStylesEditorProps> = ({
    cssStyles,
    newStyleName,
    newStyleValue,
    setNewStyleName,
    setNewStyleValue,
    handleStyleChange,
    handleRemoveStyle,
    handleAddStyle,
}) => {
    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold">
                CSS Styles
            </Typography>
            {Object.entries(cssStyles).map(([styleName, styleValue]) => (
                <Box key={styleName} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <Typography>{styleName}:</Typography>
                    <TextField
                        type="text"
                        value={styleValue}
                        onChange={(e) => handleStyleChange(e, styleName)}
                        sx={{ marginLeft: 1, width: '150px' }}
                        variant="outlined"
                        size="small"
                    />
                    <Button
                        variant="outlined"
                        onClick={() => handleRemoveStyle(styleName)}
                        sx={{ marginLeft: 1 }}
                    >
                        Remove
                    </Button>
                </Box>
            ))}
            <Box sx={{ display: 'flex', marginBottom: 2 }}>
                <TextField
                    label="CSS Property"
                    value={newStyleName}
                    onChange={(e) => setNewStyleName(e.target.value)}
                    sx={{ marginRight: 1, width: '150px' }}
                    variant="outlined"
                    size="small"
                />
                <TextField
                    label="Value"
                    value={newStyleValue}
                    onChange={(e) => setNewStyleValue(e.target.value)}
                    sx={{ marginRight: 1, width: '150px' }}
                    variant="outlined"
                    size="small"
                />
                <Button variant="contained" onClick={handleAddStyle} sx={{ height: '40px' }}>
                    Add Style
                </Button>
            </Box>
        </Box>
    );
};

export default CssStylesEditor;
