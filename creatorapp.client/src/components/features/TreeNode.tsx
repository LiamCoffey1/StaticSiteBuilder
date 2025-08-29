import React, { useState } from 'react';
import { JsonElement } from '../types';
import { useDrag, useDrop } from 'react-dnd';
import { useDragDropContext } from './DragDropContext';
import { Box, Button, Typography, Collapse, IconButton, useTheme } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface TreeNodeProps {
    element: JsonElement;
    onSelect: (element: JsonElement) => void;
    selectedElement: JsonElement | null;
    onMove: (dragKey: string, hoverKey: string, position: 'inside' | 'above' | 'below') => void;
    index: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ element, onSelect, selectedElement, onMove, index }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const isSelected = selectedElement && selectedElement.props.key === element.props.key;
    const { palette } = useTheme();
    // MUI Styles (sx prop)
    const nodeStyle = {
        padding: '8px 16px',
        border: 1,
        borderColor: isSelected ? palette.primary.main : 'divider',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '4px',
    };

    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSelectNode = () => {
        onSelect(element);
    };
    function getSafeType(str) {
        return str
            .replace("p", "Text")
            .replace("div", "Container")
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' ') // Join the words back into a single string
    }
    return (
        <Box sx={{
            marginLeft: 1,
        }}>
            <Box sx={{
                ...nodeStyle,
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust hover color as needed
                },
            }}  onClick={handleSelectNode}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {element.props.children && element.props.children.length > 0 && (
                        <IconButton size="small" onClick={handleCollapseToggle} sx={{ padding: 0 }}>
                            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                        </IconButton>
                    )}
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {getSafeType(element.type)}
                    </Typography>
                    {/* Add any other custom icons/buttons for drag/drop or additional actions */}
                </Box>
            </Box>
            <Collapse  in={!isCollapsed}>
                <Box sx={{ paddingLeft: 1 }}>
                    {element.props.children && element.props.children.length > 0 && (
                        element.props.children.map((child, childIndex) => {
                            if (typeof child === 'string') {
                                return (
                                    <Box key={childIndex} sx={nodeStyle}>
                                        <Typography variant="body2">{child}</Typography>
                                    </Box>
                                );
                            } else {
                                return (
                                    <TreeNode
                                        key={child.props.key}
                                        element={child}
                                        onSelect={onSelect}
                                        selectedElement={selectedElement}
                                        onMove={onMove}
                                        index={childIndex}
                                    />
                                );
                            }
                        })
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

export default TreeNode;
