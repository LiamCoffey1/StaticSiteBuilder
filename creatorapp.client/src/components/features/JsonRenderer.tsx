import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonElement } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import styles from './JsonRenderer.module.css'; // Import the CSS module
import { Box, Menu, MenuItem, Typography, useTheme } from '@mui/material'; // Import MUI Menu components
import { useElementDragAndDrop } from '../../hooks/useElementDragAndDrop';
import useEditorStore from '../../store/editorStore';
import ReactQuill from 'react-quill';

interface ElementRenderProps {
    element: JsonElement;
    HOC?: (type: any) => React.ComponentType<any>;
    selectedElement: JsonElement | null;
    setSelectedElement: (element: JsonElement) => void;
    onAddElement: (newElement: JsonElement, targetKey: string, position: 'above' | 'inside' | 'below') => void;
    moveElement: (sourceKey: string, targetKey: string, position: 'above' | 'inside' | 'below') => void;
    hoveredKey?: string | null;
    setHoveredKey: (key: string | null) => void;
    mouseOverKey?: string | null;
    setMouseOverKey: React.Dispatch<React.SetStateAction<string | null>>;
    dropPosition?: 'above' | 'inside' | 'below' | null;
    setDropPosition: (position: 'above' | 'inside' | 'below' | null) => void;
    onDeleteElement: (element: JsonElement) => void;
    handleContextMenu: (e: React.MouseEvent, key: JsonElement) => void;
    draggedElement?: JsonElement | null;
    setDraggedElement: (element: JsonElement) => void;
    findElementByKey: (key: string) => JsonElement | null;
    isMobile: boolean;
    handleDragStart: (e: React.DragEvent, element: JsonElement) => void;
    handleDragOver: (e: React.DragEvent, element: JsonElement) => void;
    handleDrop: (e: React.DragEvent, element: JsonElement) => void;
}

const RenderIndicators = ({ element, renderProps, style }: { element: JsonElement, renderProps: ElementRenderProps, style: any }): JSX.Element => {
    const { props } = element;
    const { key } = props;
    const { palette } = useTheme();
    function getSafeType(str) {
        return str
            .replace("p", "Text")
            .replace("div", "Container")
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' ') // Join the words back into a single string
    }
    return (
        <>
        {
            renderProps.selectedElement?.props.key === key && (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -20,
                                left: 0,
                                width: 'fit-content',
                                backgroundColor: 'rgb(102, 99,  178)', // Semi-transparent light blue
                                color: 'white',
                                zIndex: 6,
                                pointerEvents: 'none', // So that it doesn't interfere with mouse events,
                                borderRadius: 1
                            }}
                        >
                            <Typography sx={{ px: 1 }} fontSize="12px">{getSafeType(element.type)}</Typography>
                        </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: style["paddingTop"] || 0,
                            backgroundColor: 'rgba(224, 247, 250, 0.2)', // Semi-transparent light blue
                            zIndex: 5,
                            pointerEvents: 'none', // So that it doesn't interfere with mouse events
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: `-${style["marginTop"] || 0}`,
                            left: 0,
                            width: '100%',
                            height: style["marginTop"] || 0,
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #6561ec 4px, #6561ec 6px)',
                            zIndex: 5,
                            pointerEvents: 'none', // So that it doesn't interfere with mouse events
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: style["padding-bottom"] || 0,
                            backgroundColor: 'rgba(224, 247, 250, 0.3)', // Semi-transparent light blue
                            zIndex: 5,
                            pointerEvents: 'none', // So that it doesn't interfere with mouse events
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: `-${style["marginBottom"] || 0}`,
                            left: 0,
                            width: '100%',
                            height: style["marginBottom"] || 0,
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #6561ec 4px, #6561ec 6px)',

                            zIndex: 5,
                            pointerEvents: 'none',
                        }}

                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: style["paddingLeft"] || 0,
                            height: '100%',
                            background: 'rgba(224, 247, 250, 0.2)', // Different blue for left padding
                            zIndex: 5,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Left Margin */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: `-${style["marginLeft"] || 0}`,
                            width: style["marginLeft"] || 0,
                            height: '100%',
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #6561ec 4px, #6561ec 6px)', // Striped pattern for margin
                            zIndex: 7,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Right Margin */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: `-${style["marginRight"] || 0}`,
                            width: style["marginRight"] || 0,
                            height: '100%',
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #6561ec 4px, #6561ec 6px)', // Striped pattern for margin
                            zIndex: 7,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Right Padding */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: style["padding-right"] || 0,
                            height: '100%',
                            background: 'rgba(224, 247, 250, 0.2)', // Different blue for right padding
                            zIndex: 6,
                            pointerEvents: 'none',
                        }}
                    />
                </>
            )
        }
            {
        renderProps.hoveredKey === key && renderProps.dropPosition === 'above' && (
            <div className={`${styles.dropIndicator} ${styles.dropAbove}`} />
        )
    }
    {
        renderProps.hoveredKey === key && renderProps.dropPosition === 'below' && (
            <div className={`${styles.dropIndicator} ${styles.dropBelow}`} />
        )
    }
    {
        renderProps.hoveredKey === key && renderProps.dropPosition === 'inside' && (
            <Box
                sx={{
                    position: 'absolute',
                    border: '1px solid' + palette.primary.main,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(224, 247, 250, 0.5)', // Semi-transparent light blue
                            zIndex: 5, // Make sure it overlays the element but stays below other overlays,
                            pointerEvents: 'none',
                }}
            />
        )
    }
    </>
    )
}

import 'react-quill/dist/quill.snow.css';
import { serialize } from '../../utils/treeActions';


const InlineEditor = () => {
    const [text, setText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef(null);

    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };
    useEffect(() => {
        console.log(isEditing);
    }, [isEditing])

    return (
        <div style={{ display: "inline-block", position: "relative" }}>
            {/* Editable Text Mode */}
            {!isEditing && (<>
                <IconButton sx={{ color: 'red', position: 'absolute', top: 0, right: 20, zIndex: 1 }} onClick={() => {  setIsEditing(true) }} size="small" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
                <div
                    dangerouslySetInnerHTML={{ __html: text }}
                />
                </>
            )}

            {/* Editor Mode */}
            {isEditing && (
                <div style={{ display: "inline-block", position: "relative" }}>
                    {/* Floating Toolbar */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-40px",
                            left: "0",
                            zIndex: 1000,
                            background: "white",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                            padding: "5px",
                            borderRadius: "4px",
                        }}
                    >
                        <ReactQuill
                            ref={editorRef}
                            value={text}
                            onChange={setText}
                            modules={modules}
                            theme="snow"
                            style={{
                                minWidth: "150px",
                                minHeight: "30px",
                                display: "inline-block",
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};




const renderElement = ({
    type,
    innerText,
    childElements,
    attributes,
    key,
    style,
    isRow,
    renderProps,
    element,
}) => {
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'], // Only show bold, italic, and underline
            [{ list: 'ordered' }, { list: 'bullet' }], // Lists
            ['link'], // Add links
        ],
    };
    if (type === 'p' || type === 'h1' || type === 'button' || type === 'html') {
        return innerText ? (
            <div
                contentEditable={true }
                dangerouslySetInnerHTML={{ __html: innerText }}
            />
        ) : null;
    }

    if (type === 'input' || type === 'textarea') {
        // Handle <input> and <textarea> tags separately
        return null;
    }

    if (type === 'a') {
        return (
            <a {...attributes} key={key} style={style}>
                {innerText || childElements}
            </a>
        );
    }

    if (isRow) {
        return (
            <div
                className="row"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                }}
            >
                {childElements?.map((child, index) => {
                    const columnWidth = renderProps.isMobile
                        ? element.props.mobile?.customData?.columnWidths?.[index]
                        : element.props.customData?.columnWidths?.[index];

                    const columnSpan = columnWidth || 12;

                    return (
                        <div
                            key={index}
                            style={{ gridColumn: `span ${columnSpan}` }}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (type === 'img' || type === 'image') {
        return <img {...attributes} key={key} />;
    }

    return childElements || (innerText && innerText.length ? (
        <div dangerouslySetInnerHTML={{ __html: innerText }} />
    ) : null);
};

const RenderElement = ({ element, renderProps }: { element: JsonElement, renderProps: ElementRenderProps }): JSX.Element => {
    const { type, props } = element;
    const { key, innerText, children, attributes } = props;
    const cmpType = useMemo(() => ['row', 'column', 'img', 'input', 'textarea', 'html'].includes(type) ? 'div' : type, [type]);

    const Component = renderProps.HOC ? renderProps.HOC(cmpType) : (cmpType as React.ElementType);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        renderProps.onDeleteElement?.(element);
    }, [element, renderProps]);

    const { palette } = useTheme();

    const containerStyle = useMemo(() => {
        const style: React.CSSProperties = { position: 'relative' };
        if (renderProps.mouseOverKey === key || renderProps.selectedElement?.props.key === key) {
            const borderWidth = renderProps.mouseOverKey === key ? 2 : 3;
            style.border = `${borderWidth}px solid ${palette.primary.main}`;
        }
        return style;
    }, [palette.primary.main, renderProps.mouseOverKey, renderProps.selectedElement, key]);

    const computedStyle = useMemo(() => ({
        ...(renderProps.isMobile ? element.props.mobile?.style || {} : {}),
        ...containerStyle,
        ...attributes?.style
    }), [containerStyle, element.props.mobile?.style, attributes?.style, renderProps.isMobile]);

    const childElements = useMemo(() => children?.map((child) => (
        <RenderElement key={child.props.key} element={child} renderProps={renderProps} />
    )), [children, renderProps]);

    // Event handlers
    const handleDragStart = useCallback((e: React.DragEvent) => renderProps.handleDragStart(e, element), [renderProps, element]);
    const handleDragOver = useCallback((e: React.DragEvent) => renderProps.handleDragOver(e, element), [renderProps, element]);
    const handleDrop = useCallback((e: React.DragEvent) => renderProps.handleDrop(e, element), [renderProps, element]);
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        renderProps.handleContextMenu(e, element);
    }, [renderProps, element]);
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        renderProps.setSelectedElement?.(element);
    }, [renderProps, element]);
    const handleMouseEnter = useCallback(() => {
        if (!renderProps.hoveredKey) renderProps.setMouseOverKey(key);
    }, [renderProps, key]);
    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        renderProps.setMouseOverKey(null);
    }, [renderProps]);

    return (
        <Component
            {...attributes}
            style={computedStyle}
            key={key}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => {
                renderProps.setHoveredKey(null);
                renderProps.setDropPosition(null);
            }}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {renderElement({
                type,
                innerText,
                childElements,
                attributes,
                key,
                style: computedStyle,
                isRow: type === 'row',
                renderProps,
                element,
            })}

            {renderProps.selectedElement?.props.key === key && (
                <IconButton sx={{ color: 'red', position: 'absolute', top: 0, right: 0 }} onClick={handleDelete} size="small" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            )}
            <RenderIndicators element={element} renderProps={renderProps} style={computedStyle} />
        </Component>
    );
};

const JsonRenderer: React.FC = () => {
    const {
        content,
        configuration,
        draggedElement,
        setDraggedElement,
        selectedElement,
        moveNode: moveElement,
        setSelectedElement,
        handleAddElement: onAddElement,
        isMobileView: isMobile,
        handleDeleteElement: onDeleteElement,
        onContextMenuAction,
        findElementByKey,
    } = useEditorStore();

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<'above' | 'inside' | 'below' | null>(null);
    const [mouseOverKey, setMouseOverKey] = useState<string | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [contextKey, setContextKey] = useState<JsonElement | null>(null);

    const {
        handleDragStart,
        handleDrop,
        handleDragOver,
    } = useElementDragAndDrop({
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
        mouseOverKey,
        setMouseOverKey,
    });

    const handleContextMenu = useCallback((event: React.MouseEvent, key: JsonElement) => {
        event.preventDefault(); // Prevent the default context menu
        setContextKey(key);
        console.log(JSON.stringify(serialize(key)));
        setMenuAnchorEl(event.currentTarget); // Use the current target directly
    }, []);

    const handleClose = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleMenuItemClick = useCallback((action: string) => {
        if (contextKey) {
            onContextMenuAction(contextKey, action);
            handleClose();
        }
    }, [contextKey, onContextMenuAction, handleClose]);

    const MemoizedRenderElement = React.memo(RenderElement);

    const renderElementProps = useMemo(() => ({
        selectedElement,
        setSelectedElement,
        onAddElement,
        moveElement,
        hoveredKey,
        setHoveredKey,
        dropPosition,
        setDropPosition,
        mouseOverKey,
        setMouseOverKey,
        onDeleteElement,
        handleContextMenu,
        draggedElement,
        setDraggedElement,
        findElementByKey,
        isMobile,
        handleDragStart,
        handleDrop,
        handleDragOver,
    }), [
        selectedElement,
        setSelectedElement,
        onAddElement,
        moveElement,
        hoveredKey,
        setHoveredKey,
        dropPosition,
        setDropPosition,
        mouseOverKey,
        setMouseOverKey,
        onDeleteElement,
        handleContextMenu,
        draggedElement,
        setDraggedElement,
        findElementByKey,
        isMobile,
        handleDragStart,
        handleDrop,
        handleDragOver,
    ]);

    const renderedElements = useMemo(() => content.props.children.map((element) => (
        <MemoizedRenderElement
            key={element.props.key}
            element={element}
            renderProps={renderElementProps}
        />
    )), [MemoizedRenderElement, content.props.children, renderElementProps, isMobile]);

    return (
        <div className={styles.jsonRenderer}>
            {renderedElements}
            <Menu
                anchorEl={menuAnchorEl}
                open={menuAnchorEl !== null}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('delete')}>Delete</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('duplicate')}>Duplicate</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('copy_style')}>Copy Style</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('paste_style')}>Paste Style</MenuItem>
            </Menu>
        </div>
    );
};


export default JsonRenderer;