import { useState } from 'react';
import { JsonElement } from '../types';

const useUndoRedo = (
    configuration: JsonElement[],
    setConfiguration: React.Dispatch<React.SetStateAction<JsonElement[]>>
) => {
    const [undoStack, setUndoStack] = useState<JsonElement[][]>([]);
    const [redoStack, setRedoStack] = useState<JsonElement[][]>([]);

    const updateConfiguration = (updatedTree: JsonElement[]) => {
        setUndoStack((prevUndoStack) => [...prevUndoStack, configuration]);
        setRedoStack([]); // Clear redo stack on new action
        setConfiguration(updatedTree);
    };

    const handleUndo = () => {
        if (undoStack.length === 0) return;
        const previousState = undoStack[undoStack.length - 1];
        setRedoStack((prevRedoStack) => [configuration, ...prevRedoStack]);
        setConfiguration(previousState);
        setUndoStack((prevUndoStack) => prevUndoStack.slice(0, -1));
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[0];
        setUndoStack((prevUndoStack) => [...prevUndoStack, configuration]);
        setConfiguration(nextState);
        setRedoStack((prevRedoStack) => prevRedoStack.slice(1));
    };

    return { updateConfiguration, handleUndo, handleRedo, undoStack, redoStack };
};

export default useUndoRedo;

