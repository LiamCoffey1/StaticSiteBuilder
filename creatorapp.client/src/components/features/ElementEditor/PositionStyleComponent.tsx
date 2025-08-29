import React from 'react';
import { Box, Typography, TextField, ButtonGroup, Button } from '@mui/material';

interface PositionStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const PositionStyleComponent: React.FC<PositionStyleProps> = ({ onStyleChange, getStyle }) => {
    const position = getStyle('position', 'static');

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>Position</Typography>
            <ButtonGroup variant="contained">
                {['static', 'relative', 'absolute', 'fixed', 'sticky'].map((p) => (
                    <Button key={p} onClick={() => onStyleChange('position', p)} sx={{ backgroundColor: position === p ? 'primary.main' : 'transparent' }}>
                        {p}
                    </Button>
                ))}
            </ButtonGroup>

            <Box display="flex" gap={2} marginTop={2}>
                {['top', 'right', 'bottom', 'left'].map((side) => (
                    <Box key={side}>
                        <Typography variant="body2">{side}</Typography>
                        <TextField
                            size="small"
                            value={getStyle(side, '')}
                            onChange={(e) => onStyleChange(side, e.target.value)}
                            placeholder="e.g. 0, 10px"
                        />
                    </Box>
                ))}
            </Box>

            <Box display="flex" gap={2} marginTop={2}>
                <Box>
                    <Typography variant="body2">zIndex</Typography>
                    <TextField size="small" value={getStyle('zIndex', '')} onChange={(e) => onStyleChange('zIndex', e.target.value)} />
                </Box>
                <Box>
                    <Typography variant="body2">Box Sizing</Typography>
                    <TextField size="small" value={getStyle('boxSizing', 'content-box')} onChange={(e) => onStyleChange('boxSizing', e.target.value)} />
                </Box>
            </Box>
        </Box>
    );
};

export default PositionStyleComponent;
