import React from 'react';
import { ChromePicker } from 'react-color';
import {
    Typography,
    Paper,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import 'react-quill/dist/quill.snow.css';

// Component imports
import NSWEPropertyGrid from './ElementEditor/NSWEPropertyGrid';
import DisplayStyleComponent from './ElementEditor/DisplayStyleComponent';
import SizeStyleComponent from './ElementEditor/AlignmentStyleComponent';
import ImageEditor from './ElementEditor/ImageEditorComponent';
import HtmlEditor from './ElementEditor/HtmlEditorComponent';
import RowEditor from './ElementEditor/RowEditorComponent';
import CssStylesEditor from './ElementEditor/CSSStylesEditor';
import TextContentEditor from './ElementEditor/TextContentEditor';
import GeneralAttributesEditor from './ElementEditor/GeneralAttributesEditor';
import PositionStyleComponent from './ElementEditor/PositionStyleComponent';
import BorderStyleComponent from './ElementEditor/BorderStyleComponent';
import FlexItemStyleComponent from './ElementEditor/FlexItemStyleComponent';
import ShadowStyleComponent from './ElementEditor/ShadowStyleComponent';
import TransitionStyleComponent from './ElementEditor/TransitionStyleComponent';
import Interactions from './Interactions';

import useEditorStore from '../../store/editorStore';
import { useElementEditor } from '../../hooks/useElementEditor';

interface ElementEditorProps {
    currentTab: number;
}

const ACCORDION_STYLE = {
    border: 1,
    borderColor: 'divider',
};

const ElementEditor: React.FC<ElementEditorProps> = ({ currentTab }) => {
    const {
        isMobileView: isMobile,
        selectedElement: element,
        handleUpdateElement: onUpdateElement,
        addChild: onAddChild
    } = useEditorStore();

    const {
        innerText,
        cssStyles,
        attributes,
        margin,
        padding,
        newStyleName,
        newStyleValue,
        setNewStyleName,
        setNewStyleValue,
        getStyle,
        onStyleChange,
        handleInnerTextChange,
        handleSpacingChange,
        handleAttributeChange,
        handleAddAttribute,
        handleRemoveAttribute,
        handleAddStyle,
        handleRemoveStyle,
    } = useElementEditor({ element, isMobile, onUpdateElement });

    const handleBackgroundColorChange = (color: any) => {
        onStyleChange('backgroundColor', color.hex);
    };

    const renderElementSpecificEditor = () => {
        const elementType = element.type;

        if (elementType === 'row') {
            return (
                <RowEditor
                    element={element}
                    onUpdate={onUpdateElement}
                    onAddChild={onAddChild}
                    isMobile={isMobile}
                />
            );
        }

        if (elementType === 'image' || elementType === 'img') {
            return <ImageEditor element={element} onUpdateElement={onUpdateElement} />;
        }

        if (elementType === 'html') {
            return <HtmlEditor element={element} onUpdateElement={onUpdateElement} />;
        }

        return null;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: 350,
                height: '100%',
                overflow: 'auto',
                color: 'text.primary',
            }}
        >
            {currentTab === 0 && (
                <>
                    <Typography variant="h6" fontWeight="bold" sx={{ paddingBottom: 3 }} gutterBottom>
                        Edit Selected Element
                    </Typography>

                    <Accordion defaultExpanded sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Element Properties</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {renderElementSpecificEditor()}
                            <TextContentEditor
                                innerText={innerText}
                                setInnerText={handleInnerTextChange}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>General Attributes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <GeneralAttributesEditor
                                attributes={attributes}
                                handleAttributeChange={(e, key) => handleAttributeChange(key, e.target.value)}
                                handleRemoveAttribute={handleRemoveAttribute}
                                handleAddAttribute={handleAddAttribute}
                            />
                        </AccordionDetails>
                    </Accordion>
                </>
            )}

            {currentTab === 1 && (
                <>
                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Display Styles</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DisplayStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                            <SizeStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                            <FlexItemStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Position</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <PositionStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Margin</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <NSWEPropertyGrid
                                title="Margin"
                                padding={margin}
                                handleChange={(side, value) => handleSpacingChange('margin', side, value)}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Padding</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <NSWEPropertyGrid
                                title="Padding"
                                padding={padding}
                                handleChange={(side, value) => handleSpacingChange('padding', side, value)}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Background Color</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ChromePicker
                                color={getStyle('backgroundColor', '#ffffff')}
                                onChangeComplete={handleBackgroundColorChange}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Border & Outline</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <BorderStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Shadow</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ShadowStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Transition</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TransitionStyleComponent getStyle={getStyle} onStyleChange={onStyleChange} />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={ACCORDION_STYLE}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>CSS Styles</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CssStylesEditor
                                cssStyles={cssStyles}
                                newStyleName={newStyleName}
                                newStyleValue={newStyleValue}
                                setNewStyleName={setNewStyleName}
                                setNewStyleValue={setNewStyleValue}
                                handleStyleChange={(e, key) => onStyleChange(key, e.target.value)}
                                handleRemoveStyle={handleRemoveStyle}
                                handleAddStyle={handleAddStyle}
                            />
                        </AccordionDetails>
                    </Accordion>
                </>
            )}

            {currentTab === 2 && <Interactions />}
        </Paper>
    );
};

export default ElementEditor;