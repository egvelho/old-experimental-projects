/// <reference types="react" />
export interface ItemListProps {
    title: string;
    titleColor: string;
    background: string;
    backgroundIsDark?: boolean;
    items: Item[];
}
export declare function ItemList({ title, titleColor, background, backgroundIsDark, items, }: ItemListProps): JSX.Element;
interface Item {
    text: string;
    image: string;
}
export {};
