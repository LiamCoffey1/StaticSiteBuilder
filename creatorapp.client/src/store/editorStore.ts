import { create } from 'zustand';
import { JsonElement, BindingData, Position } from '../types';
import { addChildToKey, addRelativeToKey, deserialize, duplicateElement, getElementByKey, removeChildByKey, serialize, updateElementByKey } from '../utils/treeActions';

interface Page {
    id: string;
    name: string;
    content: JsonElement;
    bindings: BindingData;
}

interface EditorStore {
    pageId: string;
    content: JsonElement;
    bindings: BindingData;
    selectedElement: JsonElement | null;
    draggedElement: JsonElement | null;
    undoStack: JsonElement[];
    redoStack: JsonElement[];
    isFullscreen: boolean;
    isCodeEditorOpen: boolean;
    isMobileView: boolean;
    copyStyleElement: JsonElement | null;

    setPageId: (id: string) => void;
    setContent: (content: JsonElement) => void;
    setSelectedElement: (el: JsonElement | null) => void;
    setDraggedElement: (el: JsonElement | null) => void;
    setBindings: (b: BindingData) => void;
    setIsFullscreen: (v: boolean) => void;
    setIsCodeEditorOpen: (v: boolean) => void;
    setIsMobileView: (v: boolean) => void;
    setCopyStyleElement: (el: JsonElement | null) => void;

    moveNode: (dragKey: string, dropKey: string, position: Position) => void;
    handleUpdateElement: (updated: JsonElement) => void;
    handleDeleteElement: (el: JsonElement) => void;
    handleDuplicateElement: (el: JsonElement) => void;
    findElementByKey: (key: string) => JsonElement | null;
    handleAddElement: (el: JsonElement, targetKey: string, position: Position) => void;
    onContextMenuAction: (key: JsonElement, action: string) => void;
}

const fetchConfiguration = (pageId: string): { bindings: BindingData, content: JsonElement } => {
    const storedPages = localStorage.getItem('pages');
    if (storedPages) {
        const pages: Page[] = JSON.parse(storedPages);
        const page = pages.find(p => p.id === pageId);
        if (page) {
            return {
                bindings: page.bindings || { css: '', bindings: [], default: { index: 0 } },
                content: deserialize(page.content) || {
                    type: "ROOT",
                    props: {
                        key: "root",
                        children: [],
                    },
                    parent: null,
                },
            };
        }
    }
    return {
        content: {
            type: "ROOT",
            props: {
                key: "root",
                children: [],
            },
            parent: null,
        },
        bindings: { css: '', bindings: [], default: { index: 0 } },
    };
};

const useEditorStore = create<EditorStore>((set, get) => {
    const initialBindings = { css: '', bindings: [], default: { index: 0 } };
    const initialContent: JsonElement = {
        type: "ROOT",
        props: {
            key: "root",
            children: [],
        },
        parent: null,
    };

    const initialUndoStack: JsonElement[] = [];
    const initialRedoStack: JsonElement[] = [];

    const setPageId = (newPageId: string) => {
        const { bindings, content } = fetchConfiguration(newPageId);
        set({ pageId: newPageId, bindings, content });
    };

    const updateContent = (newContent: JsonElement) => {
        const { content, undoStack } = get();
        set({
            content: newContent,
            undoStack: [...undoStack, content],
            redoStack: [],
        });
    };

    const addChild = (elementToAddTo: JsonElement, elementToAdd: JsonElement) => {
        const clonedContent = structuredClone(get().content);
        elementToAddTo.props.children = [elementToAdd, ...elementToAddTo.props.children];
        updateContent(clonedContent);
    };

    const moveNode = (dragKey: string, dropKey: string, position: Position) => {
        const clonedContent = structuredClone(get().content);
        const elementToMove = getElementByKey(clonedContent, dragKey);
        if (!elementToMove) return;

        removeChildByKey(clonedContent, dragKey);
        if (position === "inside") addChildToKey(clonedContent, dropKey, elementToMove);
        else addRelativeToKey(clonedContent, dropKey, elementToMove, position);

        updateContent(clonedContent);
    };

    const handleUpdateElement = (updatedElement: JsonElement) => {
        const clonedContent = structuredClone(get().content);
        updateElementByKey(clonedContent, updatedElement.props.key, updatedElement);
        updateContent(clonedContent);
        set({ selectedElement: updatedElement });
    };

    const handleDeleteElement = (elementToDelete: JsonElement) => {
        if (!elementToDelete) return;
        const clonedContent = structuredClone(get().content);
        removeChildByKey(clonedContent, elementToDelete.props.key);
        updateContent(clonedContent);
        set({ selectedElement: null });
    };

    const handleDuplicateElement = (elementToDuplicate: JsonElement) => {
        if (!elementToDuplicate) return;
        const newKey = `${elementToDuplicate.props.key}-copy`;
        duplicateElement(elementToDuplicate, newKey);
        updateContent(structuredClone(get().content));
    };

    const findElementByKey = (key: string): JsonElement | null => {
        return getElementByKey(get().content, key);
    };

    const handleAddElement = (newElement: JsonElement, targetKey: string, position: Position) => {
        const clonedContent = structuredClone(get().content);
        if (position === "inside") addChildToKey(clonedContent, targetKey, newElement);
        else addRelativeToKey(clonedContent, targetKey, newElement, position);
        updateContent(clonedContent);
    };

    const onContextMenuAction = (key: JsonElement, action: string) => {
        if (action === 'delete') {
            handleDeleteElement(key);
        } else if (action === 'duplicate') {
            handleDuplicateElement(key);
        } else if (action === 'copy_style') {

        } else if (action === 'paste_style') {
        }

    };

    return {
        onContextMenuAction,
        pageId: '',
        setPageId,
        undoStack: initialUndoStack,
        redoStack: initialRedoStack,
        content: initialContent,
        setContent: updateContent,
        draggedElement: null,
        setDraggedElement: (element) => set({ draggedElement: element }),
        selectedElement: null,
        setSelectedElement: (element) => set({ selectedElement: element }),
        bindings: initialBindings,
        setBindings: (newBindings) => set({ bindings: newBindings }),
        isFullscreen: false,
        setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
        isCodeEditorOpen: false,
        setIsCodeEditorOpen: (isCodeEditorOpen) => set({ isCodeEditorOpen }),
        isMobileView: false,
        setIsMobileView: (isMobileView) => set({ isMobileView }),
        copyStyleElement: null,
        setCopyStyleElement: (element) => set({ copyStyleElement: element }),
        handleUndo: () => {
            const { undoStack, redoStack, content } = get();
            if (undoStack.length > 0) {
                const previousContent = undoStack.pop();
                set({ content: previousContent as JsonElement, redoStack: [...redoStack, content] });
            }
        },
        handleRedo: () => {
            const { undoStack, redoStack, content } = get();
            if (redoStack.length > 0) {
                const nextContent = redoStack.pop();
                set({ content: nextContent as JsonElement, undoStack: [...undoStack, content] });
            }
        },
        moveNode,
        handleUpdateElement,
        handleDeleteElement,
        handleDuplicateElement,
        findElementByKey,
        handleAddElement,
        addChild,
    };
});

export default useEditorStore;
