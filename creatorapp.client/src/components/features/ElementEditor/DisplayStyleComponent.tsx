import React from 'react';
import { Box, Typography, ButtonGroup, Button, TextField } from '@mui/material';
import StyleButtonGroup from './common/StyleButtonGroup';

interface DisplayStyleProps {
    onStyleChange: (styleName: string, newValue: string | any) => void;
    getStyle: (property: string, defaultValue: string) => any;
}

const buttonStyle = {
    fontSize: '0.8rem', 
    padding: '6px 12px',
};

const DisplayStyleComponent: React.FC<DisplayStyleProps> = ({ onStyleChange, getStyle }) => {
    const display = getStyle('display', 'block'); // Fetch current display value

    return (
        <Box paddingTop="20px">
            <Typography variant="h6" fontWeight="bold">Display Style</Typography>
            <ButtonGroup variant="contained" aria-label="display style group">
                {['none', 'block', 'inline', 'flex', 'grid', 'inline-block', 'inline-flex'].map((value) => (
                    <Button
                        key={value}
                        onClick={() => onStyleChange('display', value)}
                        sx={{
                            backgroundColor: display === value ? 'primary.main' : 'transparent',
                            ...buttonStyle
                        }}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Button>
                ))}
            </ButtonGroup>

            {/* Show flex properties if display is set to flex */}
            {(display === 'flex' || display === 'inline-flex') && (
                <Box paddingTop="20px">
                    <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                        Flexbox Properties
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Justify Content */}
                        <StyleButtonGroup
                            label="Justify Content"
                            property="justifyContent"
                            values={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']}
                            currentValue={getStyle('justifyContent', 'flex-start')}
                            onStyleChange={onStyleChange}
                        />

                        {/* Align Items */}
                        <StyleButtonGroup
                            label="Align Items"
                            property="alignItems"
                            values={['flex-start', 'center', 'flex-end', 'stretch', 'baseline']}
                            currentValue={getStyle('alignItems', 'stretch')}
                            onStyleChange={onStyleChange}
                        />

                        {/* Flex Direction */}
                        <StyleButtonGroup
                            label="Flex Direction"
                            property="flexDirection"
                            values={['row', 'column', 'row-reverse', 'column-reverse']}
                            currentValue={getStyle('flexDirection', 'row')}
                            onStyleChange={onStyleChange}
                        />

                        {/* Wrap */}
                        <StyleButtonGroup
                            label="Flex Wrap"
                            property="flexWrap"
                            values={['nowrap', 'wrap', 'wrap-reverse']}
                            currentValue={getStyle('flexWrap', 'nowrap')}
                            onStyleChange={onStyleChange}
                        />

                        <Box display="flex" gap={2}>
                            <Box>
                                <Typography variant="body2">Gap</Typography>
                                <TextField
                                    size="small"
                                    value={getStyle('gap', '')}
                                    onChange={(e) => onStyleChange('gap', e.target.value)}
                                    placeholder="e.g. 16px"
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2">Row Gap</Typography>
                                <TextField
                                    size="small"
                                    value={getStyle('rowGap', '')}
                                    onChange={(e) => onStyleChange('rowGap', e.target.value)}
                                    placeholder="e.g. 8px"
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2">Column Gap</Typography>
                                <TextField
                                    size="small"
                                    value={getStyle('columnGap', '')}
                                    onChange={(e) => onStyleChange('columnGap', e.target.value)}
                                    placeholder="e.g. 8px"
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default DisplayStyleComponent;
