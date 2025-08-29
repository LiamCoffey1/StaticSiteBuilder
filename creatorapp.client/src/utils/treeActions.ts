import { JsonElement, Position } from "../types";

export const removeChildByKey = (element: JsonElement, key: string): void => {
    if (!element.props.children) return;

    element.props.children = element.props.children.filter(
        (child) => child.props.key !== key
    );

    for (const child of element.props.children) {
        removeChildByKey(child, key); // Ensure recursive cleanup if necessary
    }
};

// Finds an element by its key recursively
export const getElementByKey = (element: JsonElement, key: string): JsonElement | null => {
    if (element.props.key === key) return element;

    if (element.props.children) {
        for (const child of element.props.children) {
            const result = getElementByKey(child, key);
            if (result) return result;
        }
    }
    return null;
};

// Updates an element in-place by its key
export const updateElementByKey = (element: JsonElement, key: string, updatedElement: JsonElement): boolean => {
    if (element.props.key === key) {
        Object.assign(element, updatedElement);
        return true;
    }

    if (element.props.children) {
        for (const child of element.props.children) {
            if (updateElementByKey(child, key, updatedElement)) return true;
        }
    }
    return false;
};

// Adds a child to a specific element by key
export const addChildToKey = (element: JsonElement, key: string, elementToAdd: JsonElement): void => {
    const target = getElementByKey(element, key);
    if (!target) return;

    target.props.children = target.props.children || [];
    target.props.children.push(elementToAdd);

    // Maintain parent reference
    elementToAdd.parent = target;
};

// Adds an element relative to a target element (above/below)
export const addRelativeToKey = (
    element: JsonElement,
    key: string,
    elementToAdd: JsonElement,
    position: Position
): void => {
    if (!element.props.children || (position !== 'above' && position !== 'below')) return;

    for (let i = 0; i < element.props.children.length; i++) {
        const child = element.props.children[i];
        if (child.props.key === key) {
            const index = position === "above" ? i : i + 1;
            element.props.children.splice(index, 0, elementToAdd);
            elementToAdd.parent = element;
            return;
        }
    }

    for (const child of element.props.children) {
        addRelativeToKey(child, key, elementToAdd, position);
    }
};

// Utility: Deep copy of an element (without parent references)
export const deepCopy = (element: JsonElement): JsonElement => ({
    ...element,
    props: {
        ...element.props,
        children: element.props.children ? element.props.children.map(deepCopy) : [],
    },
});

// Updates keys recursively to ensure uniqueness
export const updateKeyRecursively = (element: JsonElement, newKey: string): void => {
    element.props.key = newKey;
    if (element.props.children) {
        element.props.children.forEach((child, i) => {
            updateKeyRecursively(child, `${newKey}-child${i}`);
        });
    }
};

// Duplicates an element and inserts it next to the original
export const duplicateElement = (element: JsonElement, newKey: string): void => {
    if (!element.parent) return;

    const clone = deepCopy(element);
    updateKeyRecursively(clone, newKey);

    const parent = element.parent;
    const index = parent.props.children.findIndex((child) => child.props.key === element.props.key);
    parent.props.children.splice(index + 1, 0, clone);
};

export const serialize = (element: JsonElement): JsonElement => {
    const serialized = deepCopy(element); // Create a deep copy of the element
    delete serialized.parent; // Remove the parent reference
    if (serialized.props.children) {
        // Recursively serialize children
        serialized.props.children = serialized.props.children.map((child) => serialize(child));
    }
    return serialized;
};



// Deserialization to restore parent references
export const deserialize = (element: JsonElement, parent: JsonElement | null = null): JsonElement => {
    const clone = deepCopy(element); // Create a deep copy of the element
    clone.parent = parent; // Restore the parent reference

    if (clone.props.children) {
        // Recursively deserialize children
        clone.props.children = clone.props.children.map((child) => deserialize(child, clone));
    }

    return clone;
};

export function treeActions(
    content: JsonElement, // Single root element
    updateContent: (updatedContent: JsonElement) => void, // Callback to update the root element
    setSelectedElement: React.Dispatch<React.SetStateAction<JsonElement | null>>
) {
    const addChild = (elementToAddTo: JsonElement, elementToAdd: JsonElement) => {
        console.log(elementToAddTo, elementToAdd);
        const clonedContent = structuredClone(content);
        elementToAddTo.props.children = [elementToAdd, ...elementToAddTo.props.children]
        console.log(clonedContent);
        updateContent(clonedContent);
    };
    const moveNode = (dragKey: string, dropKey: string, position: Position) => {
        const clonedContent = structuredClone(content); // Clone the root element

        const elementToMove = getElementByKey(clonedContent, dragKey);
        if (!elementToMove) return;

        removeChildByKey(clonedContent, dragKey);

        if (position === "inside") addChildToKey(clonedContent, dropKey, elementToMove);
        else addRelativeToKey(clonedContent, dropKey, elementToMove, position);

        updateContent(clonedContent); // Update the root element
    };

    const handleUpdateElement = (updatedElement: JsonElement) => {
        const clonedContent = structuredClone(content); // Clone the root element

        updateElementByKey(clonedContent, updatedElement.props.key, updatedElement);
        updateContent(clonedContent); // Update the root element
        setSelectedElement(updatedElement);
    };

    const handleDeleteElement = (elementToDelete: JsonElement) => {
        if (!elementToDelete) return;

        const clonedContent = structuredClone(content); // Clone the root element

        removeChildByKey(clonedContent, elementToDelete.props.key);
        updateContent(clonedContent); // Update the root element
        setSelectedElement(null);
    };

    const handleDuplicateElement = (elementToDuplicate: JsonElement) => {
        if (!elementToDuplicate) return;

        const newKey = `${elementToDuplicate.props.key}-copy`;
        duplicateElement(elementToDuplicate, newKey);

        updateContent(structuredClone(content)); // Update the root element
    };

    const findElementByKey = (key: string): JsonElement | null => {
        return getElementByKey(content, key); // Search within the root element
    };

    const handleAddElement = (newElement: JsonElement, targetKey: string, position: Position) => {
        const clonedContent = structuredClone(content); // Clone the root element

        if (position === "inside") addChildToKey(clonedContent, targetKey, newElement);
        else addRelativeToKey(clonedContent, targetKey, newElement, position);

        updateContent(clonedContent); // Update the root element
    };

    return {
        moveNode,
        handleUpdateElement,
        handleDeleteElement,
        handleDuplicateElement,
        findElementByKey,
        handleAddElement,
        addChild
    };
}


export const isChildOf = (child: JsonElement, parent: JsonElement): boolean => {
    if (!child || !parent) return false;

    let current = child.parent;

    // Traverse up the parent chain
    while (current) {
        if (current.props.key === parent.props.key) {
            return true;
        }
        current = current.parent;
    }

    return false;
};

