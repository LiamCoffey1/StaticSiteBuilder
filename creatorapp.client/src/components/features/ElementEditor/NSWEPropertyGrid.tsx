import React from 'react';
import { Box, Grid, Typography, TextField } from '@mui/material';

interface NWSEDirectionValues {
    Top: number;
    Right: number;
    Bottom: number;
    Left: number;
}

interface NSWEPropertyGridProps {
    title: String;
    padding: NWSEDirectionValues;
    handleChange: (side: keyof NWSEDirectionValues, value: string) => void;
}

const NSWEPropertyGrid: React.FC<NSWEPropertyGridProps> = ({ title, padding, handleChange }) => (
    <Box paddingTop="20px">
        <Typography variant="h6" fontWeight="bold" textAlign="center" marginBottom={2}>
            {title}
        </Typography>
        <Grid container spacing={2}>
            {/* Top - Centered in the first row */}
            <Grid item xs={12} container justifyContent="center">
                <Grid item>
                    <Typography variant="body2">Top</Typography>
                    <TextField
                        value={padding.Top}
                        onChange={(e) => handleChange('Top', e.target.value)}
                        sx={{ width: '100px' }}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
            </Grid>

            {/* Left and Right - Anchored to left and right in the second row */}
            <Grid item xs={12} container justifyContent="space-between">
                <Grid item>
                    <Typography variant="body2">Left</Typography>
                    <TextField
                        value={padding.Left}
                        onChange={(e) => handleChange('Left', e.target.value)}
                        sx={{ width: '100px' }}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                <Grid item>
                    <Typography variant="body2">Right</Typography>
                    <TextField
                        value={padding.Right}
                        onChange={(e) => handleChange('Right', e.target.value)}
                        sx={{ width: '100px' }}
                        variant="outlined"
                        size="small"
                    />x
                </Grid>
            </Grid>

            {/* Bottom - Centered in the third row */}
            <Grid item xs={12} container justifyContent="center">
                <Grid item>
                    <Typography variant="body2">Bottom</Typography>
                    <TextField
                        value={padding.Bottom}
                        onChange={(e) => handleChange('Bottom', e.target.value)}
                        sx={{ width: '100px' }}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
            </Grid>
        </Grid>
    </Box>
);

export default NSWEPropertyGrid;