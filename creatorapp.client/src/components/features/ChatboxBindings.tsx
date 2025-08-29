import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Input,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { BindingData, ConditionBinding, UserAttributes } from '../../types';

interface ChatboxBindingsProps {
    bindings: BindingData;
    onUpdateBindings: (newBindings: BindingData) => void;
}

const ChatboxBindings: React.FC<ChatboxBindingsProps> = ({ bindings, onUpdateBindings }) => {
    const handleAddTrigger = () => {
        const newBindings = {
            ...bindings,
            bindings: [
                ...bindings.bindings,
                { condition: 'isMod', index: 1 },
            ],
        };
        onUpdateBindings(newBindings);
    };

    const handleRemoveTrigger = (index: number) => {
        const newBindings = {
            ...bindings,
            bindings: bindings.bindings.filter((_, i) => i !== index),
        };
        onUpdateBindings(newBindings);
    };

    const handleChange = (index: number, field: keyof ConditionBinding, value: any) => {
        const updatedBindings = bindings.bindings.map((binding, i) =>
            i === index ? { ...binding, [field]: value } : binding
        );
        onUpdateBindings({ ...bindings, bindings: updatedBindings });
    };

    const handleDefaultChange = (field: keyof ConditionBinding, value: any) => {
        onUpdateBindings({ ...bindings, default: { ...bindings.default, [field]: value } });
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: '#f7f7f7', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Alert Triggers
            </Typography>
            <Select fullWidth value="Message" variant="outlined" sx={{ mb: 2 }}>
                <MenuItem value="Message">Message</MenuItem>
            </Select>
            {bindings.bindings.map((binding, index) => (
                <Box key={index} sx={{ mb: 2, borderRadius: 1, border: '1px solid #ddd', padding: 2 }}>
                    <Box display="flex" gap={2} alignItems="center">
                        <Select
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 1 }}
                            value={binding.condition}
                            onChange={(e) => handleChange(index, 'condition', e.target.value as keyof UserAttributes)}
                        >
                            <MenuItem value="isMod">isMod</MenuItem>
                            <MenuItem value="isOwner">isOwner</MenuItem>
                            <MenuItem value="isVIP">isVIP</MenuItem>
                        </Select>
                        <TextField
                            type="number"
                            size="small"
                            label="Index"
                            variant="outlined"
                            value={binding.index}
                            onChange={(e) => handleChange(index, 'index', parseInt(e.target.value, 10))}
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 1 }}>
                        <IconButton onClick={() => handleRemoveTrigger(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
            <Box sx={{ mt: 2, borderTop: '1px solid #ddd', pt: 2 }}>
                <Typography variant="subtitle1">Default</Typography>
                <TextField
                    type="number"
                    label="Default Index"
                    size="small"
                    variant="outlined"
                    value={bindings.default.index}
                    onChange={(e) => handleDefaultChange('index', parseInt(e.target.value, 10))}
                    fullWidth
                    sx={{ mt: 1 }}
                />
            </Box>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddTrigger}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
            >
                Add Assignment
            </Button>
        </Box>
    );
};

export default ChatboxBindings;
