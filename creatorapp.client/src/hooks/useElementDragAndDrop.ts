import { useState } from 'react';
import { JsonElement, Position } from '../types';
import { isChildOf } from '../utils/treeActions';

interface UseDragAndDropProps {
    onAddElement: (newElement: JsonElement, targetKey: string, position: Position) => void;
    moveElement: (sourceKey: string, targetKey: string, position: Position) => void;
    draggedElement?: JsonElement | null;
    setDraggedElement: (element: JsonElement) => void;
    onDeleteElement: (element: JsonElement) => void;
    findElementByKey: (key: string) => JsonElement | null;
    hoveredKey?: string | null;
    setHoveredKey: (key: string | null) => void;
    mouseOverKey?: string | null;
    setMouseOverKey: React.Dispatch<React.SetStateAction<string | null>>;
    dropPosition?: Position | null;
    setDropPosition: (position: Position | null) => void;
}

interface DropRules {
    allowedDropElements: string[];
    canDrop?: (element: JsonElement, target: JsonElement, position: Position) => boolean;
    dropAction: (
        element: JsonElement,
        target: JsonElement,
        position: Position,
        newElement: boolean,
        actions: any
    ) => void;
}

const dropRules: Record<string, DropRules> = {
    p: {
        allowedDropElements: ['*'],
        canDrop: (element, target, position) => position !== 'inside',
        dropAction: (element, target, position, newElement, actions) => {
            dropRules['default'].dropAction(element, target, position, newElement, actions);
        },
    },
    button: {
        allowedDropElements: ['*'],
        canDrop: (element, target, position) => position !== 'inside',
        dropAction: (element, target, position, newElement, actions) => {
            dropRules['default'].dropAction(element, target, position, newElement, actions);
        },
    },
    html: {
        allowedDropElements: ['*'],
        canDrop: (element, target, position) => position !== 'inside',
        dropAction: (element, target, position, newElement, actions) => {
            dropRules['default'].dropAction(element, target, position, newElement, actions);
        },
    },
    column: {
        allowedDropElements: ['column', 'row', 'button'],
        canDrop: (element, target, position) => {
            if (element.type === 'column' && ['left', 'right', 'inside'].includes(position))
                return true;
            return element.type !== 'column' && position === 'inside';
        },
        dropAction: (element, target, position, newElement, actions) => {
            if (target.type === 'column' && element.type === 'column') {
                actions.moveElement(target.props.key, element.props.key, 'above');
            } else {
                actions.moveElement(target.props.key, element.props.key, 'inside');
            }
        },
    },
    row: {
        allowedDropElements: ['*'],
        canDrop: (element, target, position) =>
            element.type !== 'column' && ['above', 'below'].includes(position),
        dropAction: (element, target, position, newElement, actions) => {
            if (newElement) {
                actions.onAddElement?.(target, element.props.key, position);
            } else {
                actions.moveElement?.(target.props.key, element.props.key, position);
            }
        },
    },
    default: {
        allowedDropElements: ['*'],
        canDrop: (element, target, position) => element.type && element.type !== 'column',
        dropAction: (element, target, position, newElement, actions) => {
            if (newElement) {
                actions.onAddElement?.(target, element.props.key, position);
            } else {
                actions.moveElement?.(target.props.key, element.props.key, position);
            }
        },
    },
};

export const useElementDragAndDrop = ({
    onAddElement,
    moveElement,
    onDeleteElement,
    findElementByKey,
    hoveredKey,
    setHoveredKey,
    dropPosition,
    setDropPosition,
    draggedElement,
    setDraggedElement,
}: UseDragAndDropProps) => {
    const handleDragStart = (e: React.DragEvent, element: JsonElement) => {
        e.stopPropagation();
        

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({ key: element.props.key }));
        e.dataTransfer.setData('text/plain', 'existing');

        // Optionally set a custom drag image
        setTimeout(() => {
           setDraggedElement(element);
            // Logic that you want to run after the state is updated
            // You can now safely do your drag logic here
            console.log("Drag event logic after state update");
        }, 0); // 0 milliseconds will schedule it for the next event loop tick
    };

    const handleDrop = (e: React.DragEvent, element: JsonElement) => {
        e.preventDefault();

        // Log the JSON data for debugging
        const jsonString = e.dataTransfer.getData('application/json');
        console.log('Dropped JSON string:', jsonString);
        if (!jsonString) {
            console.error('No JSON data found in drop event.');
            return;
        }
        const existingElement = e.dataTransfer.getData('text/plain') === 'existing';
        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            return;
        }
        const dragged = existingElement ? findElementByKey(data.key) : data;

        // If dragged element is not valid or dropping on itself or its child, abort.
        if (!dragged || dragged.props.key === element.props.key || isChildOf(element, dragged)) return;

        const targetDropRules = dropRules[element.type] || dropRules.default;
        const canDrop =
            targetDropRules.canDrop?.(dragged, element, dropPosition!) ??
            targetDropRules.allowedDropElements.includes(dragged.type);

        if (canDrop) {
            targetDropRules.dropAction(element, dragged, dropPosition!, !existingElement, {
                onDeleteElement,
                onAddElement,
                moveElement,
            });
            e.stopPropagation();
        }

        setHoveredKey(null);
        setDropPosition(null);
    };

    const handleDragOver = (e: React.DragEvent, element: JsonElement) => {
        e.preventDefault();
        if (
            !draggedElement ||
            draggedElement.props.key === element.props.key ||
            isChildOf(element, draggedElement)
        )
            return;

        const dropRect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - dropRect.top;
        const offsetX = e.clientX - dropRect.left;

        let calculatedPosition: Position = 'inside';

        // Define the thresholds for top 10% and bottom 10%
        const topThreshold = dropRect.height * 0.2; // 10% of the height
        const bottomThreshold = dropRect.height * 0.8; // 90% of the height

        if (offsetY < topThreshold) {
            calculatedPosition = 'above'; // Top 10%
        } else if (offsetY > bottomThreshold) {
            calculatedPosition = 'below'; // Bottom 10%
        } else {
            calculatedPosition = 'inside'; // Middle 80%
        }

        if (element.type === 'column') {
            if (offsetX < dropRect.width / 3) calculatedPosition = 'left';
            else if (offsetX > (2 * dropRect.width) / 3) calculatedPosition = 'right';
        }

        const targetDropRules = dropRules[element.type] || dropRules.default;
        const canDrop =
            targetDropRules.canDrop?.(draggedElement, element, calculatedPosition) ??
            targetDropRules.allowedDropElements.includes(draggedElement.type);

        if (canDrop) {
            setDropPosition(calculatedPosition);
            setHoveredKey(element.props.key);
            e.stopPropagation();
        }
    };

    return {
        hoveredKey,
        dropPosition,
        draggedElement,
        setHoveredKey,
        setDropPosition,
        handleDragStart,
        handleDrop,
        handleDragOver,
    };
};
