import React, { useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { JsonElement } from '../../types';
import { presetElements, iconMap, elementLabels, sections, sectionData } from '../../Constants/presetElements';
import useEditorStore from '../../store/editorStore';

interface AddElementProps {
    setDraggedElement: (el: JsonElement) => void;
}

interface DraggableElementProps {
    element: JsonElement;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, element: JsonElement) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element, onDragStart }) => {
    const { type } = element;
    return (
        <Paper
            sx={{
                width: '100%',
                height: '100%',
                padding: 2,
                cursor: 'grab',
                borderRadius: 2,
                textAlign: 'center',
                border: 1,
                borderColor: 'divider',
            }}
            draggable
            onDragStart={(event) =>
                onDragStart(
                    event,
                    { ...element, props: { ...element.props, key: `${element.type}-${Date.now()}` } }
                )
            }
        >
            {iconMap[type]}
            <Typography variant="body2" sx={{ marginTop: 1 }}>
                {elementLabels[type]}
            </Typography>
        </Paper>
    );
};

const AddElement: React.FC<AddElementProps> = () => {
    const { setDraggedElement } = useEditorStore();


    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, element: JsonElement) => {
        setDraggedElement(element);
        event.dataTransfer.setData('application/json', JSON.stringify(element));
        event.dataTransfer.setData('text/plain', 'new');
        event.dataTransfer.effectAllowed = 'copyMove';
    };


    return (
        <>
          
            <Box sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{ marginTop: 3, mb:3 }}>
                    Elements
                </Typography>
                <Grid container spacing={2}>
                    {presetElements.map((element, index) => (
                        <Grid item key={index} xs={6}>
                            <DraggableElement element={element} onDragStart={handleDragStart} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{ marginTop: 3, mb: 3 }}>
                Sections
            </Typography>
                <Grid sx={{ padding: 2 }} container spacing={2}>
                    {sections.map((element, index) => (
                        <Paper
                            sx={{
                                width: '100%',
                                height: '100%',
                                padding: 2,
                                marginTop: 1,
                                cursor: 'grab',
                                borderRadius: 2,
                                textAlign: 'center',
                                border: 1,
                                borderColor: 'divider',
                            }}
                            draggable
                            onDragStart={(event) =>
                                handleDragStart(
                                    event,
                                    { ...element, props: { ...element.props, key: `${element.type}-${Date.now()}` } }
                                )
                            }
                        >
                            
                            <Typography te variant="body2" sx={{ marginTop: 1 }}>
                                {sectionData[index].name}
                            </Typography>
                        </Paper>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default AddElement;
