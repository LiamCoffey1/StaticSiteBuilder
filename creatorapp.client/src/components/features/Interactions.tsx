import React, { useState, useEffect, useCallback } from "react";
import { MenuItem, Select, TextField, FormControl, InputLabel, Box, Typography } from "@mui/material";
import useEditorStore from "../../store/editorStore";

const Interactions = () => {
    const { selectedElement, handleUpdateElement } = useEditorStore();
    const [interaction, setInteraction] = useState({ type: "", target: "" });

    useEffect(() => {
        if (selectedElement?.props?.customData?.interactions?.[0]) {
            setInteraction(selectedElement.props.customData.interactions[0]);
        }
    }, [selectedElement]);

    const handleInteractionChange = useCallback((field, value) => {
        const newInteraction = { ...interaction, [field]: value };
        setInteraction(newInteraction);

        const updatedInteractions = selectedElement?.props?.customData?.interactions ? [...selectedElement.props.customData.interactions] : [];
        updatedInteractions[0] = newInteraction;

        const updatedElement = {
            ...selectedElement,
            props: {
                ...selectedElement.props,
                customData: {
                    ...selectedElement.props.customData,
                    interactions: updatedInteractions,
                },
            },
        };

        handleUpdateElement(updatedElement);
    }, [interaction, selectedElement, handleUpdateElement]);

    return (
        <Box sx={{ p: 1 }}>
            <Typography>On Click</Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Action</InputLabel>
                <Select
                    value={interaction.type}
                    onChange={(e) => handleInteractionChange("type", e.target.value)}
                >
                    <MenuItem value="toggleVisibility">Toggle Visibility</MenuItem>
                    <MenuItem value="showElement">Show Element</MenuItem>
                    <MenuItem value="hideElement">Hide Element</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <TextField
                    label="Target Element ID"
                    value={interaction.target}
                    onChange={(e) => handleInteractionChange("target", e.target.value)}
                />
            </FormControl>
        </Box>
    );
};

export default Interactions;
