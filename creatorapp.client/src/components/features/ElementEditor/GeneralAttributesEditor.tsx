import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

interface GeneralAttributesEditorProps {
    attributes: Record<string, string>;
    handleAttributeChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
    handleRemoveAttribute: (key: string) => void;
    handleAddAttribute: () => void;
}

const GeneralAttributesEditor: React.FC<GeneralAttributesEditorProps> = ({
    attributes,
    handleAttributeChange,
    handleRemoveAttribute,
    handleAddAttribute,
}) => {
    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold">
                General Attributes
            </Typography>
            {Object.entries(attributes)
                .filter(([key]) => key !== 'style')
                .map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography>{key}:</Typography>
                        <TextField
                            type="text"
                            value={value}
                            onChange={(e) => handleAttributeChange(e, key)}
                            sx={{ marginLeft: 1, width: '150px' }}
                            variant="outlined"
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => handleRemoveAttribute(key)}
                            sx={{ marginLeft: 1 }}
                        >
                            Remove
                        </Button>
                    </Box>
                ))}
            <Button variant="contained" onClick={handleAddAttribute} sx={{ marginTop: 1 }}>
                Add New Attribute
            </Button>
        </Box>
    );
};

export default GeneralAttributesEditor;
