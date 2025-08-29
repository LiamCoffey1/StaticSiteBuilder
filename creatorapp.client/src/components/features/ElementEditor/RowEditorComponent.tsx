import { useState, useEffect, useCallback } from "react";
import { JsonElement } from "../../../types";

interface RowEditorProps {
    element: JsonElement;
    onUpdate: (updatedElement: JsonElement) => void;
    onAddChild: (parent: JsonElement, childToAdd: JsonElement) => void;
    isMobile: Boolean;
}

const RowEditor: React.FC<RowEditorProps> = ({ element, onUpdate, onAddChild, isMobile }) => {
    const { attributes = {}, customData = {} } = element.props;
    const [debouncedValue, setDebouncedValue] = useState<number | null>(null);

    const getColumnWidths = (element) => {
        // Check if on mobile screen
        if (isMobile) {
            // First, check if mobile customData columnWidths exist
            const mobileWidths = element.props.mobile?.customData?.columnWidths;
            if (mobileWidths) {
                return mobileWidths; // Return mobile column widths if available
            }

            // If mobile column widths don't exist, fall back to desktop column widths
            const desktopWidths = element.props.customData?.columnWidths;
            if (desktopWidths) {
                return desktopWidths; // Return desktop column widths if available
            }

            // If neither exists, return the default value (e.g., [6, 6])
            return [6, 6]; // Default column widths
        } else {
            // Not mobile: check desktop customData columnWidths
            const desktopWidths = element.props.customData?.columnWidths;
            if (desktopWidths) {
                return desktopWidths; // Return desktop column widths if available
            }

            // If desktop column widths don't exist, return the default value
            return [6, 6]; // Default column widths
        }
    };
    const [columnWidths, setColumnWidths] = useState<number[]>([6, 6]); // Default 50/50 split
    useEffect(() => {
        setColumnWidths(getColumnWidths(element))
    }, [element, isMobile])

    const changeColumnWidth = useCallback((index: number, newValue: number) => {
        const updatedWidths = [...columnWidths];
        updatedWidths[index] = newValue;
        setColumnWidths(updatedWidths); // Trigger state update
        handleUpdate(updatedWidths);
    }, [columnWidths]);

    const handleDebouncedChange = (index: number, newValue: number) => {
        setDebouncedValue(newValue);  // Update the debounced value
        setTimeout(() => changeColumnWidth(index, newValue), 300);  // Debounce for 300ms
    };



    const handleUpdate = (widths) => {
        let updatedElement;
        // Check if on mobile screen
        if (isMobile) {
            // First, check if mobile customData columnWidths exist
            updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        customData: {
                            ...customData,
                            columnWidths: widths
                        }
                    }
                },
            };
        } else {
            updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    customData: {
                        ...customData,
                        columnWidths: widths,
                    },
                },
            }
        }
        onUpdate(updatedElement);
    };

    const onAddRow = () => {
        // Create a new column element
        const newColumn = {
            type: 'column',
            props: {
                key: `column-${Date.now()}`,
                children: [
                    {
                        type: 'p',
                        props: {
                            key: `p-${Date.now()}`,
                            innerText: 'Paragraph inside row',
                            children: [],
                            attributes: {
                                className: 'row-paragraph',
                                style: { fontSize: '14px' },
                            },
                        },
                    },
                ],
                customData: {
                    layout: 'vertical',
                    gutter: 8,
                },
                attributes: {
                    className: 'column-container',
                    style: { padding: '8px', border: '1px dashed black' },
                },
            },
        };

        // Add the new column to the children of the row element
        const updatedChildren = [...(element.props.children || []), newColumn];
        const finalColumnWidths = [...columnWidths, 12];

        // Create the updated element
        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                children: updatedChildren,
                customData: {
                    ...customData,
                    columnWidths: [...columnWidths, 12],
                },
                attributes: {
                    ...attributes,
                    style: {
                        ...attributes.style,
                    },
                },
            },
        };

        // Update state and notify parent
        onUpdate(updatedElement);
    };



    return (
        <div>
            <h3>Edit Row</h3>
            <div>
                <label>
                    Column Widths:
                    <div>
                        {columnWidths.map((width, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => handleDebouncedChange(index, Math.max(1, Math.min(12, Number(e.target.value))))}
                                    min={1}
                                    max={12}
                                    style={{ width: '40px', marginRight: '8px' }}
                                />
                                <span>{`Column ${index + 1}`}</span>
                            </div>
                        ))}
                    </div>
                </label>
            </div>
            <button onClick={onAddRow}>Add Row</button>
        </div>
    );
};

export default RowEditor;