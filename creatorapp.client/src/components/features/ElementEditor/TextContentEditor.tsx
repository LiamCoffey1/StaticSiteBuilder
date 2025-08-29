import React, { useRef, useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePageListStore from '../../../store/pageListStore';

// Define the custom FontWeight format
const Inline: any = Quill.import('blots/inline');

class FontWeight extends Inline {
    static create(value: string) {
        const node = super.create() as HTMLElement;
        node.style.fontWeight = value; // Apply font-weight style
        return node;
    }

    static formats(node: HTMLElement) {
        return node.style.fontWeight || '400'; // Default to 400 if no value
    }
}

FontWeight.blotName = 'fontWeight';
FontWeight.tagName = 'span';
Quill.register(FontWeight, true); // Register the format with Quill


class FontSize extends Inline {
    static create(value: string) {
        const node = super.create() as HTMLElement;
        node.style.fontSize = value; // Apply font-size style
        return node;
    }

    static formats(node: HTMLElement) {
        return node.style.fontSize || '16px'; // Default font size if none is set
    }
}

FontSize.blotName = 'fontSize';
FontSize.tagName = 'span';
Quill.register(FontSize, true); // Register the format with Quill

const Font: any = Quill.import('formats/font');
Font.whitelist = ['Inter', 'Poppins', 'Arial', 'sans-serif', 'serif', 'Times New Roman']; // Define allowed fonts

Quill.register(Font, true);

interface TextContentEditorProps {
    innerText: string;
    setInnerText: (value: string) => void;
}

const TextContentEditor: React.FC<TextContentEditorProps> = ({
    innerText,
    setInnerText,
}) => {
    const quillRef = useRef<ReactQuill>(null);
    const [linkValue, setLinkValue] = useState('');
    const [openDropdown, setOpenDropdown] = useState(false);
    const { pages } = usePageListStore();
    // Custom toolbar configuration without the default link button
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, false] }],
        [{ 'font': ['sans-serif', 'serif', 'Inter', 'Poppins'] }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ fontSize: ['12px', '16px', '20px', '24px', '32px'] }], // Custom font sizes
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'fontWeight': ['400', '500', '600', '700'] }],
        ['image'],
        ['clean']
    ];

    const handleInnerTextChange = (value: string) => {
        setInnerText(value);
    };

    const handleLinkInsert = () => {
        if (quillRef.current && linkValue) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (!range) return;
            const selectedText = quill.getText(range.index, range.length); // Get the highlighted text

            if (selectedText) {
                // If text is selected, remove the selected text and insert the token with the selected text
                quill.deleteText(range.index, range.length);  // Remove selected text
                quill.insertText(range.index, selectedText);  // Insert the link text
            } else {
                // If no text is selected, insert the link value as text
                quill.insertText(range.index, linkValue);  // Insert the link text
            }

            // Apply the link format to the text
            quill.formatText(range.index, selectedText.length || linkValue.length, 'link', linkValue);

            // Get all links in the editor and remove target and rel attributes
            const links = quillRef.current.getEditor().container.querySelectorAll('a');
            links.forEach((link: Element) => {
                const a = link as HTMLAnchorElement;
                // Remove target and rel attributes
                a.removeAttribute('target');
                a.removeAttribute('rel');
            });

            setLinkValue('');  // Reset link value
            setOpenDropdown(false);  // Close dropdown
        }
    };



    return (
        <Box sx={{ marginBottom: 2, marginTop: 2 }}>
            <Typography>Text Content:</Typography>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    modules={{ toolbar: toolbarOptions }}
                    value={innerText}
                    onChange={handleInnerTextChange}
                />
            </Box>

            {/* Custom Link Dropdown */}
            {openDropdown && (
                <Box sx={{ marginTop: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Page</InputLabel>
                        <Select
                            value={linkValue}
                            onChange={(e) => setLinkValue(`${e.target.value}`)} // Use token format
                            label="Page"
                            autoWidth
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.id} value={`[[PAGE_LINK_${page.id}]]`}>
                                    {page.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={handleLinkInsert} sx={{ marginTop: 1 }}>
                        Insert Link
                    </Button>
                </Box>
            )}

            <Button onClick={() => setOpenDropdown(!openDropdown)} sx={{ marginTop: 2 }}>
                {openDropdown ? 'Close Link Dropdown' : 'Insert Link'}
            </Button>
        </Box>
    );
};

export default TextContentEditor;
