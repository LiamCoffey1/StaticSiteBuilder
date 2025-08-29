import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import {
    Typography,
    Paper,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from '@mui/material';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

import NSWEPropertyGrid from './ElementEditor/NSWEPropertyGrid';
import DisplayStyleComponent from './ElementEditor/DisplayStyleComponent';
import SizeStyleComponent from './ElementEditor/AlignmentStyleComponent';
import ImageEditor from './ElementEditor/ImageEditorComponent';
import HtmlEditor from './ElementEditor/HtmlEditorComponent';
import RowEditor from './ElementEditor/RowEditorComponent';
import CssStylesEditor from './ElementEditor/CSSStylesEditor';
import TextContentEditor from './ElementEditor/TextContentEditor';
import GeneralAttributesEditor from './ElementEditor/GeneralAttributesEditor';

import {
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import useEditorStore from '../../store/editorStore';
import Interactions from './Interactions';
import PositionStyleComponent from './ElementEditor/PositionStyleComponent';
import BorderStyleComponent from './ElementEditor/BorderStyleComponent';
import FlexItemStyleComponent from './ElementEditor/FlexItemStyleComponent';
import ShadowStyleComponent from './ElementEditor/ShadowStyleComponent';
import TransitionStyleComponent from './ElementEditor/TransitionStyleComponent';



interface ElementEditorProps {
    currentTab: number;
}

const ElementEditor: React.FC<ElementEditorProps> = (props) => {
    const { isMobileView: isMobile, selectedElement: element, handleUpdateElement: onUpdateElement, addChild: onAddChild } = useEditorStore();
    const [innerText, setInnerText] = useState<string>('');
    const [cssStyles, setCssStyles] = useState<{ [key: string]: string }>({});
    const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
    const [elementType, setElementType] = useState<string>(element.type || '');

    // Margin/Padding state (single declaration)
    const [margin, setMargin] = useState({ Top: 10 as any, Right: 10 as any, Bottom: 10 as any, Left: 10 as any });
    const [padding, setPadding] = useState({ Top: 10 as any, Right: 10 as any, Bottom: 10 as any, Left: 10 as any });

    const [newStyleName, setNewStyleName] = useState('');
    const [newStyleValue, setNewStyleValue] = useState('');


    useEffect(() => {
        if (element) {
            // Initialize the state with the current element's values
            setInnerText(element.props.innerText || '');
            setCssStyles(element.props.attributes?.style || {});
            setAttributes(element.props.attributes || {});
            setElementType(element.type || '');
            getMargins();
        }

    }, [element, isMobile]);



    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, false] }],
        [{ 'font': ['sans-serif', 'serif', 'Inter', 'Poppins'] }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ fontSize: ['12px', '16px', '20px', '24px', '32px'] }], // Custom font sizes
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'fontWeight': ['400', '500', '600', '700'] }],
        ['link', 'image'],
        ['clean']
    ];

    const handleInteractionChange = (e: React.ChangeEvent<HTMLInputElement>, interaction: string) => {
        const newStyleValue = e.target.value;

        // If mobile, update mobile style overrides, else update desktop style
      
            const updatedDesktopStyles = {
                ...cssStyles,
                [styleName]: newStyleValue,
            };

            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: {
                        ...element.props.attributes,
                        style: updatedDesktopStyles,
                    },
                },
            };
            onUpdateElement(updatedElement);
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>, styleName: string) => {
        const newStyleValue = e.target.value;

        // If mobile, update mobile style overrides, else update desktop style
        if (isMobile) {
            const updatedMobileStyles = {
                ...element.props.mobile?.style,
                [styleName]: newStyleValue,
            };

            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        ...element.props.mobile,
                        style: updatedMobileStyles,
                    },
                },
            };
            setCssStyles(updatedMobileStyles);  // Update the state for mobile styles
            onUpdateElement(updatedElement);
        } else {
            const updatedDesktopStyles = {
                ...cssStyles,
                [styleName]: newStyleValue,
            };

            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: {
                        ...element.props.attributes,
                        style: updatedDesktopStyles,
                    },
                },
            };
            setCssStyles(updatedDesktopStyles);  // Update the state for desktop styles
            onUpdateElement(updatedElement);
        }
    };

    const getStyle = (property: string, defaultValue: string) => {
        if (isMobile) {
            // First, check mobile style
            const mobileStyle = element.props.mobile?.style?.[property];
            if (mobileStyle) return mobileStyle;

            // If mobile style doesn't exist, fall back to desktop style
            const desktopStyle = element.props.attributes?.style?.[property];
            if (desktopStyle) return desktopStyle;

            // If neither exists, return default value
            return defaultValue;
        } else {
            // Not mobile: check desktop style
            const desktopStyle = element.props.attributes?.style?.[property];
            if (desktopStyle) return desktopStyle;

            // If desktop style doesn't exist, return default value
            return defaultValue;
        }
    };

    const getMargins = () => {
        setMargin({ Top: getStyle('marginTop', ''), Bottom: getStyle('marginBottom', ''), Left: getStyle('marginLeft', ''), Right: getStyle('marginRight', '') });
        setPadding({ Top: getStyle('paddingTop', ''), Bottom: getStyle('paddingBottom', ''), Left: getStyle('paddingLeft', ''), Right: getStyle('paddingRight', '') });
    }

    const handleAddAttribute = () => {
        const newKey = prompt('Enter attribute key (e.g., "id")');
        const newValue = prompt('Enter attribute value (e.g., "myElement")');
        if (newKey && newValue) {
            const updatedAttributes = {
                ...attributes,
                [newKey]: newValue,
            };
            setAttributes(updatedAttributes);
            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: updatedAttributes,
                },
            };
            onUpdateElement(updatedElement);
        }
    };

    const handleRemoveAttribute = (key: string) => {
        const updatedAttributes = { ...attributes };
        delete updatedAttributes[key];
        setAttributes(updatedAttributes);
        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                attributes: updatedAttributes,
            },
        };
        onUpdateElement(updatedElement);
    };

    const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const updatedAttributes = {
            ...attributes,
            [key]: e.target.value,
        };
        setAttributes(updatedAttributes);
        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                attributes: updatedAttributes,
            },
        };
        onUpdateElement(updatedElement);
    };

    const onStyleChange = (styleName: string, newValue: string | any) => {
        if (isMobile) {
            // If mobile, update the mobile styles
            const updatedMobileStyles = {
                ...element.props.mobile?.style,
                [styleName]: newValue,
            };

            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        ...element.props.mobile,
                        style: updatedMobileStyles,
                    },
                },
            };

            // Update the component state and pass the updated element
            setCssStyles(updatedMobileStyles);
            onUpdateElement(updatedElement);
        } else {
            // If not mobile, update the regular (desktop) styles
            const updatedDesktopStyles = {
                ...cssStyles,
                [styleName]: newValue,
            };

            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: {
                        ...element.props.attributes,
                        style: updatedDesktopStyles,
                    },
                },
            };

            // Update the component state and pass the updated element
            setCssStyles(updatedDesktopStyles);
            onUpdateElement(updatedElement);
        }
    };

    // Handler for Background Color
    const handleBackgroundColorChange = (color: any) => {
        onStyleChange('backgroundColor', color.hex);
    };

    const handleInnerTextChange = (value: string) => {
        setInnerText(value);
        const updatedElement = {
            ...element,
            props: {
                ...element.props,
                innerText: value,
            },
        };
        onUpdateElement(updatedElement);
    };

    // Margin and Padding change handlers for NSWEPropertyGrid
    const handleMarginChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string) => {
        onStyleChange('margin' + side, value);
        setMargin((prev) => ({ ...prev, [side]: value as any }));
    };

    const handlePaddingChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string) => {
        onStyleChange('padding' + side, value);
        setPadding((prev) => ({ ...prev, [side]: value as any }));
    };

    // CSS styles editor add/remove handlers
    const handleAddStyle = () => {
        if (!newStyleName) return;
        if (isMobile) {
            const updatedMobileStyles = {
                ...element.props.mobile?.style,
                [newStyleName]: newStyleValue,
            } as any;
            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        ...element.props.mobile,
                        style: updatedMobileStyles,
                    },
                },
            };
            setCssStyles(updatedMobileStyles);
            onUpdateElement(updatedElement);
        } else {
            const updatedDesktopStyles = {
                ...cssStyles,
                [newStyleName]: newStyleValue,
            } as any;
            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: {
                        ...element.props.attributes,
                        style: updatedDesktopStyles,
                    },
                },
            };
            setCssStyles(updatedDesktopStyles);
            onUpdateElement(updatedElement);
        }
        setNewStyleName('');
        setNewStyleValue('');
    };

    const handleRemoveStyle = (styleName: string) => {
        if (isMobile) {
            const updatedMobileStyles = { ...(element.props.mobile?.style || {}) } as any;
            delete (updatedMobileStyles as any)[styleName];
            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        ...element.props.mobile,
                        style: updatedMobileStyles,
                    },
                },
            };
            setCssStyles(updatedMobileStyles);
            onUpdateElement(updatedElement);
        } else {
            const updatedDesktopStyles = { ...cssStyles } as any;
            delete (updatedDesktopStyles as any)[styleName];
            const updatedElement = {
                ...element,
                props: {
                    ...element.props,
                    attributes: {
                        ...element.props.attributes,
                        style: updatedDesktopStyles,
                    },
                },
            };
            setCssStyles(updatedDesktopStyles);
            onUpdateElement(updatedElement);
        }
    };


    return (
        <Paper
            elevation={3}
            sx={{
                width:350,
                height: '100%',
                overflow: 'auto',
                color: 'text.primary', // Ensures readability
            }}
        >
            {props.currentTab === 0 && (
                <>
                    <Typography variant="h6" fontWeight="bold" sx={{ paddingBottom: 3 }} gutterBottom>
                        Edit Selected Element
                    </Typography>
                    <Accordion defaultExpanded sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Element Properties</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            {elementType === 'row' && (
                                <RowEditor
                                    element={element}
                                    onUpdate={onUpdateElement}
                                    onAddChild={onAddChild}
                                    isMobile={isMobile}
                                />
                            )}
                            {(elementType === 'image' || elementType === 'img') && (
                                <ImageEditor element={element} onUpdateElement={onUpdateElement} />
                            )}
                            {elementType === 'html' && (
                                <HtmlEditor element={element} onUpdateElement={onUpdateElement} />
                            )}

                            <TextContentEditor
                                innerText={innerText}
                                setInnerText={handleInnerTextChange}
                            />

                        </AccordionDetails>
                    </Accordion>
                    {/* General Attributes */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>General Attributes</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <GeneralAttributesEditor
                                attributes={attributes}
                                handleAttributeChange={handleAttributeChange}
                                handleRemoveAttribute={handleRemoveAttribute}
                                handleAddAttribute={handleAddAttribute}
                            />
                        </AccordionDetails>
                    </Accordion>
                </>
            )}

            {props.currentTab === 1 && (
                <>
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Display Styles</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <DisplayStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                            <SizeStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                            <FlexItemStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Position */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Position</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <PositionStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Margin */}
                    <Accordion sx={{
                        marginBottom: 0,
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Margin</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                            border: 1, // Optional: Add border to match the theme
                            borderColor: 'divider', // Optional: Use theme divider color for border
                        }}>
                            <NSWEPropertyGrid title="Margin" padding={margin} handleChange={handleMarginChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Padding */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Padding</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <NSWEPropertyGrid title="Padding" padding={padding} handleChange={handlePaddingChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Background Color */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Background Color</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <ChromePicker
                                color={getStyle('backgroundColor', '#ffffff')}
                                onChangeComplete={handleBackgroundColorChange}
                            />
                        </AccordionDetails>
                    </Accordion>

                    {/* Border */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Border & Outline</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <BorderStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Shadow */}
                    <Accordion sx={{
                        border: 1,
                        borderColor: 'divider',
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Shadow</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ShadowStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Transition */}
                    <Accordion sx={{
                        border: 1,
                        borderColor: 'divider',
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Transition</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TransitionStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    {/* CSS Styles */}
                    <Accordion sx={{
                        border: 1, // Optional: Add border to match the theme
                        borderColor: 'divider', // Optional: Use theme divider color for border
                    }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>CSS Styles</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                        }}>
                            <CssStylesEditor
                                cssStyles={cssStyles}
                                newStyleName={newStyleName}
                                newStyleValue={newStyleValue}
                                setNewStyleName={setNewStyleName}
                                setNewStyleValue={setNewStyleValue}
                                handleStyleChange={handleStyleChange}
                                handleRemoveStyle={handleRemoveStyle}
                                handleAddStyle={handleAddStyle}
                            />
                        </AccordionDetails>
                    </Accordion>

                </>
            )}
            {props.currentTab === 2 && <Interactions/> }
        </Paper>
    );

};

export default ElementEditor;
