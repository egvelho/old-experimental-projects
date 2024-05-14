/// <reference types="react" />
export interface SearchHeaderProps {
    title: string;
    background?: string;
    searchOptions: string[];
    searchDefaultValue: string[] | string;
    searchPlaceholder: string;
    searchNoOptionsText: string;
    searchDisabled: boolean;
    loading: boolean;
    dark?: boolean;
    searchMultiple?: boolean;
    onSearchSelect?: (value: string[]) => Promise<void>;
}
export declare function SearchHeader({ title, background, searchOptions, searchDefaultValue, searchPlaceholder, searchNoOptionsText, searchDisabled, loading, dark, searchMultiple, onSearchSelect, }: SearchHeaderProps): JSX.Element;
