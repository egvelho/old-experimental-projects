"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const no_results_1 = require("../no-results");
const search_header_1 = require("../search-header");
const post_card_grid_1 = require("./post-card-grid");
function Blog({ title, background, searchOptions, searchDefaultValue, searchPlaceholder, searchNoOptionsText, searchDisabled, searchMultiple, loading, dark, color, onRequestMorePosts, onSearchSelect, hasMorePosts, posts, noResultsText, }) {
    const searchHeaderProps = {
        title,
        background,
        searchOptions,
        searchDefaultValue,
        searchPlaceholder,
        searchNoOptionsText,
        searchDisabled,
        searchMultiple,
        onSearchSelect,
        loading,
        dark,
    };
    const postCardGridProps = {
        color,
        onRequestMorePosts,
        hasMorePosts,
        posts,
    };
    const noResultsProps = {
        noResultsText,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(search_header_1.SearchHeader, Object.assign({}, searchHeaderProps)),
        posts.length > 0 ? (react_1.default.createElement(post_card_grid_1.PostCardGrid, Object.assign({}, postCardGridProps))) : (react_1.default.createElement(no_results_1.NoResults, Object.assign({}, noResultsProps)))));
}
exports.Blog = Blog;
//# sourceMappingURL=blog.js.map