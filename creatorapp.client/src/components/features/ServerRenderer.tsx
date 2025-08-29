// components/ServerJsonRenderer.tsx
import React from 'react';
import { JsonElement } from '../../types';

const renderJsonToHtml = (jsonTree: JsonElement[]): JSX.Element[] => {
    return jsonTree.map((element) => {
        const { type, props } = element;

        // Handle children: it can be strings or an array of JsonElement
        const children = props.children
            ? props.children.map(child =>
                     renderJsonToHtml([child])
            )
            : null;

        return React.createElement(type, { key: props.key }, <>{props.innerText}{children}</>);
    });
};

interface ServerJsonRendererProps {
    jsonTree: JsonElement[];
}

const ServerJsonRenderer: React.FC<ServerJsonRendererProps> = ({ jsonTree }) => {
    return <div>{renderJsonToHtml(jsonTree)}</div>;
};

export default ServerJsonRenderer;
