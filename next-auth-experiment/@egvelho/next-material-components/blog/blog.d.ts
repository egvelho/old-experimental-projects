/// <reference types="react" />
import { NoResultsProps } from "../no-results";
import { SearchHeaderProps } from "../search-header";
import { PostCardGridProps } from "./post-card-grid";
export declare type BlogProps = SearchHeaderProps & PostCardGridProps & NoResultsProps;
export declare function Blog({ title, background, searchOptions, searchDefaultValue, searchPlaceholder, searchNoOptionsText, searchDisabled, searchMultiple, loading, dark, color, onRequestMorePosts, onSearchSelect, hasMorePosts, posts, noResultsText, }: BlogProps): JSX.Element;
