import React from 'react';
import { Box, Typography, TextField, ButtonGroup, Button } from '@mui/material';

interface BorderStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const BorderStyleComponent: React.FC<BorderStyleProps> = ({ onStyleChange, getStyle }) => {
    const renderSide = (side: 'Top' | 'Right' | 'Bottom' | 'Left') => (
        <Box display="flex" gap={1} alignItems="center">
            <TextField size="small" label={`Width ${side}`} value={getStyle(`border${side}Width`, '')} onChange={(e) => onStyleChange(`border${side}Width`, e.target.value)} sx={{ width: 90 }} />
            <TextField size="small" label={`Style ${side}`} value={getStyle(`border${side}Style`, '')} onChange={(e) => onStyleChange(`border${side}Style`, e.target.value)} sx={{ width: 120 }} />
            <TextField size="small" label={`Color ${side}`} value={getStyle(`border${side}Color`, '')} onChange={(e) => onStyleChange(`border${side}Color`, e.target.value)} sx={{ width: 120 }} />
        </Box>
    );

    const renderRadius = (corner: 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft') => (
        <TextField size="small" label={corner} value={getStyle(`border${corner}Radius`, '')} onChange={(e) => onStyleChange(`border${corner}Radius`, e.target.value)} sx={{ width: 120 }} />
    );

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>Border</Typography>

            <Box display="flex" flexDirection="column" gap={1}>
                {renderSide('Top')}
                {renderSide('Right')}
                {renderSide('Bottom')}
                {renderSide('Left')}
            </Box>

            <Typography variant="subtitle1" marginTop={2}>Radius</Typography>
            <Box display="flex" gap={1}>
                {renderRadius('TopLeft')}
                {renderRadius('TopRight')}
                {renderRadius('BottomRight')}
                {renderRadius('BottomLeft')}
            </Box>

            <Typography variant="subtitle1" marginTop={2}>Outline</Typography>
            <Box display="flex" gap={1}>
                <TextField size="small" label={`Width`} value={getStyle(`outlineWidth`, '')} onChange={(e) => onStyleChange(`outlineWidth`, e.target.value)} sx={{ width: 90 }} />
                <TextField size="small" label={`Style`} value={getStyle(`outlineStyle`, '')} onChange={(e) => onStyleChange(`outlineStyle`, e.target.value)} sx={{ width: 120 }} />
                <TextField size="small" label={`Color`} value={getStyle(`outlineColor`, '')} onChange={(e) => onStyleChange(`outlineColor`, e.target.value)} sx={{ width: 120 }} />
                <TextField size="small" label={`Offset`} value={getStyle(`outlineOffset`, '')} onChange={(e) => onStyleChange(`outlineOffset`, e.target.value)} sx={{ width: 120 }} />
            </Box>
        </Box>
    );
};

export default BorderStyleComponent;
