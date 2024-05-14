"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
function createContext(initialContext, persistKeys = []) {
    const Context = react_1.default.createContext({
        context: Object.assign(Object.assign({}, initialContext), retrieveStoredContext()),
        setContext(context) { },
    });
    setWindowContext(initialContext);
    setWindowSetContext(() => { });
    return {
        Context,
        useContext() {
            return react_1.default.useContext(Context);
        },
        ContextProvider({ children }) {
            var _a;
            const [partialContext, setPartialContext] = react_1.default.useState(initialContext);
            const context = (_a = getWindowContext()) !== null && _a !== void 0 ? _a : Object.assign(Object.assign({}, initialContext), partialContext);
            const setContext = (context) => queuedSetContext(setPartialContext, context);
            react_1.default.useEffect(() => {
                const storedContext = retrieveStoredContext();
                const nextContext = Object.assign(Object.assign({}, partialContext), storedContext);
                setWindowContext(nextContext);
                setWindowSetContext(setPartialContext);
                setContext(nextContext);
            }, []);
            react_1.default.useEffect(() => {
                setWindowSetContext(setPartialContext);
                queuedSetContext(setPartialContext);
                if (document.readyState !== "complete") {
                    return;
                }
                storeContextOnPersistedKeysChange(partialContext, context, persistKeys);
            }, [partialContext]);
            return (react_1.default.createElement(Context.Provider, { value: {
                    context,
                    setContext,
                } }, children));
        },
        getContext() {
            var _a;
            const setContext = getWindowSetContext();
            return {
                context: (_a = getWindowContext()) !== null && _a !== void 0 ? _a : initialContext,
                setContext: setContext
                    ? (context) => queuedSetContext(setContext, context)
                    : () => { },
            };
        },
    };
}
exports.createContext = createContext;
function setWindowContext(context) {
    var _a;
    if (typeof window === "undefined") {
        return;
    }
    window["__context"] = Object.assign(Object.assign({}, ((_a = window["__context"]) !== null && _a !== void 0 ? _a : {})), context);
}
function setWindowSetContext(setContext) {
    if (typeof window === "undefined") {
        return;
    }
    window["__setContext"] = setContext;
}
function getWindowContext() {
    if (typeof window === "undefined") {
        return undefined;
    }
    return window["__context"];
}
function getWindowSetContext() {
    if (typeof window === "undefined") {
        return undefined;
    }
    return window["__setContext"];
}
function storeContextOnPersistedKeysChange(partialContext, context, persistKeys = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const partialContextKeys = Object.keys(partialContext);
        const persistedKeysChanged = partialContextKeys.some((key) => persistKeys.includes(key));
        if (persistedKeysChanged) {
            const previousStoredContext = retrieveStoredContext();
            const nextContext = partialContextKeys.reduce((partialContext, key) => (Object.assign(Object.assign({}, partialContext), { [key]: context[key] })), {});
            const nextStoredContext = Object.assign(Object.assign({}, previousStoredContext), nextContext);
            storeContext(nextStoredContext);
        }
    });
}
function storeContext(context) {
    if (typeof window === "undefined") {
        return;
    }
    localStorage.setItem("context", JSON.stringify(context));
}
function retrieveStoredContext() {
    if (typeof window === "undefined") {
        return {};
    }
    const stringifiedContext = localStorage.getItem("context");
    if (stringifiedContext) {
        const context = JSON.parse(stringifiedContext);
        return context;
    }
    else {
        return {};
    }
}
function popContextQueueAt(at) {
    const contextAt = window.__contextQueue[at][1];
    window.__contextQueue.splice(at, 1);
    return contextAt;
}
function lockContextQueueAt(at) {
    if (window.__contextQueue[at][0] === true) {
        return false;
    }
    else {
        window.__contextQueue[at][0] = true;
        return true;
    }
}
function getContextQueueItem() {
    if (lockContextQueueAt(0)) {
        return popContextQueueAt(0);
    }
    return undefined;
}
function pushToContextQueue(context) {
    window.__contextQueue.push([false, context]);
}
function startContextQueue() {
    if (window.__contextQueue === undefined) {
        window.__contextQueue = [];
    }
}
function contextQueueIsEmpty() {
    return window.__contextQueue.length === 0;
}
function queuedSetContext(setContext, context) {
    if (typeof window === "undefined") {
        return;
    }
    startContextQueue();
    if (context !== undefined) {
        pushToContextQueue(context);
    }
    else if (contextQueueIsEmpty()) {
        return;
    }
    const queuedContext = getContextQueueItem();
    if (queuedContext !== undefined) {
        setWindowContext(queuedContext);
        setContext(queuedContext);
    }
}
//# sourceMappingURL=create-context.js.map