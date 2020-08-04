"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shallowequal_1 = __importDefault(require("shallowequal"));
var react_1 = require("react");
var useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
/**
 *
 * @param monitor The monitor to collect state from
 * @param collect The collecting function
 * @param onUpdate A method to invoke when updates occur
 */
function useCollector(monitor, collect, onUpdate) {
    var _a = react_1.useState(function () { return collect(monitor); }), collected = _a[0], setCollected = _a[1];
    var updateCollected = react_1.useCallback(function () {
        var nextValue = collect(monitor);
        if (!shallowequal_1.default(collected, nextValue)) {
            setCollected(nextValue);
            if (onUpdate) {
                onUpdate();
            }
        }
    }, [collected, monitor, onUpdate]);
    // update the collected properties after the first render
    // and the components are attached to dnd-core
    useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect(updateCollected, []);
    return [collected, updateCollected];
}
exports.useCollector = useCollector;
