import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextProps {
    draggingKey: string;
    setDraggingKey: (key: string) => void;
}

const DragDropContext = createContext<DragDropContextProps | undefined>(undefined);

export const useDragDropContext = (): DragDropContextProps => {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error('useDragDropContext must be used within a TreeNodeProvider');
    }
    return context;
}

interface TreeNodeProviderProps {
    children: ReactNode;
}

export const TreeNodeProvider: React.FC<TreeNodeProviderProps> = ({ children }) => {
    const [draggingKey, setDraggingKey] = useState<string>('');

    return (
        <DragDropContext.Provider value={{ draggingKey, setDraggingKey }}>
            {children}
        </DragDropContext.Provider>
    );
};
