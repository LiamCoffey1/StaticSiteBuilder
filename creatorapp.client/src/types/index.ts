export interface Chatbox {
    bindingConfig: BindingData;
    elements: JsonElement[];
    content: JsonElement;
}

export interface UserAttributes {
    isMod: boolean;
    isOwner: boolean;
    isVIP: boolean;
}

export interface ConditionBinding {
    condition: keyof UserAttributes;
    index: number;
}

export interface BindingData {
    css: string;
    bindings: ConditionBinding[];
    default: {
        index: number;
    };
}

export type Position = 'above' | 'inside' | 'below' | 'left' | 'right';


export interface BaseElement {
    type: string;
    props: {
        key: string;
        innerText?: string;
        children: JsonElement[];
        attributes?: { [key: string]: any }; // Dynamic attributes
        customData?: {
            [key: string]: any; // Additional custom data for the element
            interactions?: Interaction[]; // List of interactions
        };
        mobile?: {
            style?: { [key: string]: any };  // Mobile-specific style overrides
            customData?: { [key: string]: any };  // Mobile-specific customData overrides
        };
    };
    parent: JsonElement | null; // Runtime-only reference to the parent element
}

export interface RowElement extends BaseElement {
    type: 'row';
    props: {
        key: string;
        children: JsonElement[];
        attributes?: { [key: string]: any };
        customData?: {
            layout?: 'horizontal' | 'vertical';
            gutter?: number;
            interactions?: Interaction[]; // List of interactions
        };
    };
}

export type JsonElement = RowElement | BaseElement;

export interface Interaction {
    type: 'toggleVisibility' | 'showElement' | 'hideElement';
    target: string;
}



export interface ElementNode {
    data: JsonElement,
    firstChild?: ElementNode
    nextSibling?: ElementNode 
}