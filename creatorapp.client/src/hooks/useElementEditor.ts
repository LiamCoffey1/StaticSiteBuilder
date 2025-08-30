import { useState, useEffect } from 'react';
import { JsonElement } from '../types';

interface SpacingValues {
    Top: string;
    Right: string;
    Bottom: string;
    Left: string;
}

interface UseElementEditorProps {
    element: JsonElement;
    isMobile: boolean;
    onUpdateElement: (element: JsonElement) => void;
}

export const useElementEditor = ({ element, isMobile, onUpdateElement }: UseElementEditorProps) => {
    const [innerText, setInnerText] = useState<string>('');
    const [cssStyles, setCssStyles] = useState<{ [key: string]: string }>({});
    const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
    const [margin, setMargin] = useState<SpacingValues>({ Top: '', Right: '', Bottom: '', Left: '' });
    const [padding, setPadding] = useState<SpacingValues>({ Top: '', Right: '', Bottom: '', Left: '' });
    const [newStyleName, setNewStyleName] = useState('');
    const [newStyleValue, setNewStyleValue] = useState('');

    useEffect(() => {
        if (element) {
            setInnerText(element.props.innerText || '');
            setCssStyles(element.props.attributes?.style || {});
            setAttributes(element.props.attributes || {});
            updateSpacingValues();
        }
    }, [element, isMobile]);

    const updateSpacingValues = () => {
        setMargin({
            Top: getStyle('marginTop', ''),
            Bottom: getStyle('marginBottom', ''),
            Left: getStyle('marginLeft', ''),
            Right: getStyle('marginRight', '')
        });
        setPadding({
            Top: getStyle('paddingTop', ''),
            Bottom: getStyle('paddingBottom', ''),
            Left: getStyle('paddingLeft', ''),
            Right: getStyle('paddingRight', '')
        });
    };

    const getStyle = (property: string, defaultValue: string) => {
        if (isMobile) {
            return element.props.mobile?.style?.[property] ||
                element.props.attributes?.style?.[property] ||
                defaultValue;
        }
        return element.props.attributes?.style?.[property] || defaultValue;
    };

    const updateElementWithStyles = (styles: { [key: string]: string }) => {
        if (isMobile) {
            return {
                ...element,
                props: {
                    ...element.props,
                    mobile: {
                        ...element.props.mobile,
                        style: styles,
                    },
                },
            };
        }
        return {
            ...element,
            props: {
                ...element.props,
                attributes: {
                    ...element.props.attributes,
                    style: styles,
                },
            },
        };
    };

    const onStyleChange = (styleName: string, newValue: string) => {
        const currentStyles = isMobile
            ? { ...element.props.mobile?.style, [styleName]: newValue }
            : { ...cssStyles, [styleName]: newValue };

        setCssStyles(currentStyles);
        onUpdateElement(updateElementWithStyles(currentStyles));
    };

    const handleInnerTextChange = (value: string) => {
        setInnerText(value);
        onUpdateElement({
            ...element,
            props: {
                ...element.props,
                innerText: value,
            },
        });
    };

    const handleSpacingChange = (
        type: 'margin' | 'padding',
        side: 'Top' | 'Right' | 'Bottom' | 'Left',
        value: string
    ) => {
        const property = `${type}${side}`;
        onStyleChange(property, value);

        if (type === 'margin') {
            setMargin(prev => ({ ...prev, [side]: value }));
        } else {
            setPadding(prev => ({ ...prev, [side]: value }));
        }
    };

    const handleAttributeChange = (key: string, value: string) => {
        const updatedAttributes = { ...attributes, [key]: value };
        setAttributes(updatedAttributes);
        onUpdateElement({
            ...element,
            props: {
                ...element.props,
                attributes: updatedAttributes,
            },
        });
    };

    const handleAddAttribute = () => {
        const newKey = prompt('Enter attribute key (e.g., "id")');
        const newValue = prompt('Enter attribute value (e.g., "myElement")');
        if (newKey && newValue) {
            handleAttributeChange(newKey, newValue);
        }
    };

    const handleRemoveAttribute = (key: string) => {
        const { [key]: _, ...updatedAttributes } = attributes;
        setAttributes(updatedAttributes);
        onUpdateElement({
            ...element,
            props: {
                ...element.props,
                attributes: updatedAttributes,
            },
        });
    };

    const handleAddStyle = () => {
        if (!newStyleName) return;
        onStyleChange(newStyleName, newStyleValue);
        setNewStyleName('');
        setNewStyleValue('');
    };

    const handleRemoveStyle = (styleName: string) => {
        const currentStyles = isMobile
            ? { ...element.props.mobile?.style }
            : { ...cssStyles };

        delete currentStyles[styleName];
        setCssStyles(currentStyles);
        onUpdateElement(updateElementWithStyles(currentStyles));
    };

    return {
        // State
        innerText,
        cssStyles,
        attributes,
        margin,
        padding,
        newStyleName,
        newStyleValue,

        // Setters
        setNewStyleName,
        setNewStyleValue,

        // Handlers
        getStyle,
        onStyleChange,
        handleInnerTextChange,
        handleSpacingChange,
        handleAttributeChange,
        handleAddAttribute,
        handleRemoveAttribute,
        handleAddStyle,
        handleRemoveStyle,
    };
};