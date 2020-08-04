"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_1 = require("react");
var DndContext_1 = require("./DndContext");
var refCount = 0;
/**
 * A React component that provides the React-DnD context
 */
exports.DndProvider = react_1.memo(function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var _b = getDndContextValue(props), manager = _b[0], isGlobalInstance = _b[1]; // memoized from props
    /**
     * If the global context was used to store the DND context
     * then where theres no more references to it we should
     * clean it up to avoid memory leaks
     */
    React.useEffect(function () {
        if (isGlobalInstance) {
            refCount++;
        }
        return function () {
            if (isGlobalInstance) {
                refCount--;
                if (refCount === 0) {
                    var context = getGlobalContext();
                    context[instanceSymbol] = null;
                }
            }
        };
    }, []);
    return React.createElement(DndContext_1.DndContext.Provider, { value: manager }, children);
});
exports.DndProvider.displayName = 'DndProvider';
function getDndContextValue(props) {
    if ('manager' in props) {
        var manager_1 = { dragDropManager: props.manager };
        return [manager_1, false];
    }
    var manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
    var isGlobalInstance = !props.context;
    return [manager, isGlobalInstance];
}
var instanceSymbol = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__');
function createSingletonDndContext(backend, context, options, debugMode) {
    if (context === void 0) { context = getGlobalContext(); }
    var ctx = context;
    if (!ctx[instanceSymbol]) {
        ctx[instanceSymbol] = DndContext_1.createDndContext(backend, context, options, debugMode);
    }
    return ctx[instanceSymbol];
}
function getGlobalContext() {
    return typeof global !== 'undefined' ? global : window;
}
