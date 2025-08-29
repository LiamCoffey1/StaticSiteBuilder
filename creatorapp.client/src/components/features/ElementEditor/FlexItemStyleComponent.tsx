import React from 'react';
import { Box, Typography, TextField, ButtonGroup, Button } from '@mui/material';

interface FlexItemStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const FlexItemStyleComponent: React.FC<FlexItemStyleProps> = ({ onStyleChange, getStyle }) => {
    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>Flex Item</Typography>
            <Box display="flex" gap={2}>
                <Box>
                    <Typography variant="body2">Order</Typography>
                    <TextField size="small" value={getStyle('order', '')} onChange={(e) => onStyleChange('order', e.target.value)} />
                </Box>
                <Box>
                    <Typography variant="body2">Flex Grow</Typography>
                    <TextField size="small" value={getStyle('flexGrow', '')} onChange={(e) => onStyleChange('flexGrow', e.target.value)} />
                </Box>
                <Box>
                    <Typography variant="body2">Flex Shrink</Typography>
                    <TextField size="small" value={getStyle('flexShrink', '')} onChange={(e) => onStyleChange('flexShrink', e.target.value)} />
                </Box>
                <Box>
                    <Typography variant="body2">Flex Basis</Typography>
                    <TextField size="small" value={getStyle('flexBasis', '')} onChange={(e) => onStyleChange('flexBasis', e.target.value)} />
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography variant="body2">Align Self</Typography>
                <ButtonGroup variant="contained">
                    {['auto', 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'].map((v) => (
                        <Button key={v} onClick={() => onStyleChange('alignSelf', v)} sx={{ backgroundColor: getStyle('alignSelf', 'auto') === v ? 'primary.main' : 'transparent' }}>{v}</Button>
                    ))}
                </ButtonGroup>
            </Box>
        </Box>
    );
};

export default FlexItemStyleComponent;
