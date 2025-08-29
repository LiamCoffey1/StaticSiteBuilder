import React from 'react';
import {
    Folder as ContainerIcon,
    Code as HtmlIcon,
    Https as HeadingIcon,
    TextFields as TextIcon,
    Image as ImageIcon,
    ViewArray as RowIcon,
} from '@mui/icons-material';

import { JsonElement } from '../types';

// Precomputing keys to avoid calling Date.now() multiple times
const generateKey = (prefix: string) => `${prefix}-${Date.now()}`;

// Row with columns preset
export const rowWithColumns: JsonElement = {
    type: 'row',
    props: {
        key: generateKey('row'),
        children: [
            {
                type: 'column',
                props: {
                    key: generateKey('column-1'),
                    children: [
                        {
                            type: 'button',
                            props: {
                                key: generateKey('button-1'),
                                innerText: 'Button 1',
                                children: [],
                                attributes: {
                                    className: 'row-button',
                                    style: { color: 'blue' },
                                },
                            },
                        },
                    ],
                    attributes: {
                        className: 'column-container',
                        style: { padding: '8px', border: '1px dashed black' },
                    },
                },
            },
            {
                type: 'column',
                props: {
                    key: generateKey('column-2'),
                    children: [
                        {
                            type: 'p',
                            props: {
                                key: generateKey('paragraph'),
                                innerText: 'Paragraph inside row',
                                children: [],
                                attributes: {
                                    className: 'row-paragraph',
                                    style: { fontSize: '14px' },
                                },
                            },
                        },
                    ],
                    attributes: {
                        className: 'column-container',
                        style: { padding: '8px', border: '1px dashed black' },
                    },
                },
            },
        ],
        attributes: {
            className: 'row-container',
            style: { padding: '10px', border: '1px solid gray' },
        },
    },
};

// Preset elements
export const presetElements: JsonElement[] = [
    {
        type: 'div',
        props: {
            key: generateKey('container'),
            children: [],
            attributes: {
                className: 'container',
                style: { padding: 10, border: '1px solid grey' },
            },
        },
    },
    {
        type: 'html',
        props: {
            key: generateKey('html'),
            innerText: '<p>This is a paragraph.</p>',
            children: [],
            attributes: {
                className: 'container',
                style: { padding: 10, border: '1px solid grey' },
            },
        },
    },
    {
        type: 'p',
        props: {
            key: generateKey('text'),
            innerText: 'This is a paragraph.',
            children: [],
            attributes: {
                className: 'text',
                style: { fontFamily: 'Arial' },
            },
        },
    },
    {
        type: 'button',
        props: {
            key: generateKey('button'),
            innerText: 'Click Me',
            children: [],
            attributes: {
                className: 'button',
                style: { color: 'black' },
            },
        },
    },
    { ...rowWithColumns }, // Spread rowWithColumns preset
    {
        type: 'image',
        props: {
            key: generateKey('image'),
            innerText: '',
            children: [],
            attributes: {
                className: 'image',
                src: 'https://localhost:5173/vite.svg',
                style: { color: 'white' },
            },
        },
    },
];

// Icon map for UI elements
export const iconMap: Record<string, JSX.Element> = {
    div: <ContainerIcon />,
    html: <HtmlIcon />,
    h1: <HeadingIcon />,
    p: <TextIcon />,
    button: <ContainerIcon />,
    row: <RowIcon />,
    image: <ImageIcon />,
};

// Labels for elements
export const elementLabels: Record<string, string> = {
    div: 'Container (div)',
    html: 'HTML',
    h1: 'Heading (h1)',
    p: 'Text (p)',
    button: 'Button (button)',
    row: 'Row',
    image: 'Image',
};
