"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// suppress the useLayoutEffect warning on server side.
exports.useIsomorphicLayoutEffect = typeof window !== 'undefined' ? react_1.useLayoutEffect : react_1.useEffect;
