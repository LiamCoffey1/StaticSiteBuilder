import React from 'react';
import { Box, Typography, TextField, ButtonGroup, Button } from '@mui/material';

interface TransitionStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const TransitionStyleComponent: React.FC<TransitionStyleProps> = ({ onStyleChange, getStyle }) => {
    const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>Transition</Typography>
            <Box display="flex" gap={2}>
                <Box>
                    <Typography variant="body2">Properties (comma-separated)</Typography>
                    <TextField size="small" value={getStyle('transitionProperty', '')} onChange={(e) => onStyleChange('transitionProperty', e.target.value)} placeholder="e.g. all, opacity, transform" />
                </Box>
                <Box>
                    <Typography variant="body2">Duration</Typography>
                    <TextField size="small" value={getStyle('transitionDuration', '200ms')} onChange={(e) => onStyleChange('transitionDuration', e.target.value)} placeholder="e.g. 200ms" />
                </Box>
                <Box>
                    <Typography variant="body2">Delay</Typography>
                    <TextField size="small" value={getStyle('transitionDelay', '0ms')} onChange={(e) => onStyleChange('transitionDelay', e.target.value)} placeholder="e.g. 0ms" />
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography variant="body2">Timing Function</Typography>
                <ButtonGroup variant="contained">
                    {timingFunctions.map(tf => (
                        <Button key={tf} onClick={() => onStyleChange('transitionTimingFunction', tf)} sx={{ backgroundColor: getStyle('transitionTimingFunction', 'ease') === tf ? 'primary.main' : 'transparent' }}>{tf}</Button>
                    ))}
                </ButtonGroup>
            </Box>
        </Box>
    );
};

export default TransitionStyleComponent;
