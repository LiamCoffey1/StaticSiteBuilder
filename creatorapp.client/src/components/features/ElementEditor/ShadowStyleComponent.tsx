import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel } from '@mui/material';

interface ShadowStyleProps {
    onStyleChange: (styleName: string, newValue: string) => void;
    getStyle: (property: string, defaultValue: string) => string;
}

const parseBoxShadow = (value: string) => {
    // very naive parser, expects: [inset] <x> <y> <blur>? <spread>? <color>?
    const parts = (value || '').trim().split(/\s+/);
    const result: any = { inset: false, offsetX: '', offsetY: '', blur: '', spread: '', color: '' };
    if (!parts.length) return result;
    let i = 0;
    if (parts[i] === 'inset') { result.inset = true; i++; }
    result.offsetX = parts[i++] ?? '';
    result.offsetY = parts[i++] ?? '';
    result.blur = parts[i++] ?? '';
    // If color appears earlier, spread may be omitted; keep simple
    result.spread = parts[i] && /px|rem|em|%|vh|vw|^-?\d/.test(parts[i]) ? parts[i++] : '';
    result.color = parts.slice(i).join(' ');
    return result;
};

const ShadowStyleComponent: React.FC<ShadowStyleProps> = ({ onStyleChange, getStyle }) => {
    const current = getStyle('boxShadow', '');
    const [inset, setInset] = useState(false);
    const [offsetX, setOffsetX] = useState('0px');
    const [offsetY, setOffsetY] = useState('0px');
    const [blur, setBlur] = useState('10px');
    const [spread, setSpread] = useState('0');
    const [color, setColor] = useState('rgba(0,0,0,0.2)');

    useEffect(() => {
        const p = parseBoxShadow(current);
        if (current) {
            setInset(!!p.inset);
            if (p.offsetX) setOffsetX(p.offsetX);
            if (p.offsetY) setOffsetY(p.offsetY);
            if (p.blur) setBlur(p.blur);
            if (p.spread) setSpread(p.spread);
            if (p.color) setColor(p.color);
        }
    }, [current]);

    const composed = useMemo(() => {
        const parts = [inset ? 'inset' : '', offsetX || '0px', offsetY || '0px', blur || '0px', spread || '0', color || 'rgba(0,0,0,0.2)']
            .filter(Boolean)
            .join(' ');
        return parts;
    }, [inset, offsetX, offsetY, blur, spread, color]);

    useEffect(() => {
        onStyleChange('boxShadow', composed);
    }, [composed]);

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>Shadow</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
                <FormControlLabel control={<Switch checked={inset} onChange={(e) => setInset(e.target.checked)} />} label="Inset" />
                <Box>
                    <Typography variant="body2">Offset X</Typography>
                    <TextField size="small" value={offsetX} onChange={(e) => setOffsetX(e.target.value)} placeholder="e.g. 0px" />
                </Box>
                <Box>
                    <Typography variant="body2">Offset Y</Typography>
                    <TextField size="small" value={offsetY} onChange={(e) => setOffsetY(e.target.value)} placeholder="e.g. 10px" />
                </Box>
                <Box>
                    <Typography variant="body2">Blur</Typography>
                    <TextField size="small" value={blur} onChange={(e) => setBlur(e.target.value)} placeholder="e.g. 20px" />
                </Box>
                <Box>
                    <Typography variant="body2">Spread</Typography>
                    <TextField size="small" value={spread} onChange={(e) => setSpread(e.target.value)} placeholder="e.g. 0" />
                </Box>
                <Box>
                    <Typography variant="body2">Color</Typography>
                    <TextField size="small" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. rgba(0,0,0,0.2)" />
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography variant="body2">Raw box-shadow</Typography>
                <TextField fullWidth size="small" value={current} onChange={(e) => onStyleChange('boxShadow', e.target.value)} />
            </Box>
            <Box marginTop={2} p={2} sx={{ border: '1px solid #ddd', boxShadow: composed, background: '#fff' }}>
                <Typography variant="caption">Preview</Typography>
                <Box mt={1} p={2} sx={{ border: '1px dashed #ccc' }}>Shadow Preview Area</Box>
            </Box>
        </Box>
    );
};

export default ShadowStyleComponent;
