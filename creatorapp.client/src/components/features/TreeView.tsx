import React from 'react';
import TreeNode from './TreeNode';
import { JsonElement } from '../../types';
import { TreeNodeProvider } from './DragDropContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useEditorStore from '../../store/editorStore';

interface TreeViewProps {
    jsonTree: JsonElement[];
    onElementSelect: (element: JsonElement) => void;
    selectedElement: JsonElement | null;
    setJsonTree: (newTree: JsonElement[]) => void;
}

const TreeView: React.FC<TreeViewProps> = () => {
    const { selectedElement, setSelectedElement, moveNode, content } = useEditorStore()
    return (
        <TreeNodeProvider>
            <DndProvider backend={HTML5Backend}>
                {content.props.children.map((element, index) => (
                    <TreeNode
                        key={element.props.key}
                        element={element}
                        onSelect={setSelectedElement}
                        selectedElement={selectedElement}
                        onMove={moveNode}
                        index={index}
                    />
                ))}
            </DndProvider>
        </TreeNodeProvider>
    );
};

export default TreeView;
