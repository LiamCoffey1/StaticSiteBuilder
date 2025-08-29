import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface SizeStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const SizeStyleComponent: React.FC<SizeStyleProps> = ({ onStyleChange, getStyle }) => {
    const renderStyleField = (label: string, styleName: string, defaultValue: string) => (
        <Box>
            <Typography variant="body2">{label}</Typography>
            <TextField
                value={getStyle(styleName, defaultValue)}
                onChange={(e) => onStyleChange(styleName, e.target.value)}
                variant="outlined"
                size="small"
                sx={{ width: '120px' }}
            />
        </Box>
    );

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                Size
            </Typography>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                {renderStyleField('Width', 'width', 'auto')}
                {renderStyleField('Height', 'height', 'auto')}
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                {renderStyleField('Min Width', 'minWidth', '')}
                {renderStyleField('Min Height', 'minHeight', '')}
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                {renderStyleField('Max Width', 'maxWidth', '')}
                {renderStyleField('Max Height', 'maxHeight', '')}
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                {renderStyleField('Aspect Ratio', 'aspectRatio', '')}
            </Box>
        </Box>
    );
};

export default SizeStyleComponent;
