"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isObject = (obj) => !!obj && typeof obj === "object" && !Array.isArray(obj);
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source === undefined || !isObject(target) || !isObject(source))
        return target;
    target = Object.assign({}, target);
    Object.keys(source).forEach((key) => {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = sourceValue;
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return mergeDeep(target, ...sources);
}
exports.default = mergeDeep;
//# sourceMappingURL=merge.js.map