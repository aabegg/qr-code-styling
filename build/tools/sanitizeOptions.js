"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeGradient(gradient) {
    const newGradient = Object.assign({}, gradient);
    if (!newGradient.colorStops || !newGradient.colorStops.length) {
        throw "Field 'colorStops' is required in gradient";
    }
    if (newGradient.rotation) {
        newGradient.rotation = Number(newGradient.rotation);
    }
    else {
        newGradient.rotation = 0;
    }
    newGradient.colorStops = newGradient.colorStops.map((colorStop) => (Object.assign(Object.assign({}, colorStop), { offset: Number(colorStop.offset) })));
    return newGradient;
}
function sanitizeOptions(options) {
    const newOptions = Object.assign({}, options);
    newOptions.width = Number(newOptions.width);
    newOptions.height = Number(newOptions.height);
    newOptions.margin = Number(newOptions.margin);
    newOptions.imageOptions = Object.assign(Object.assign({}, newOptions.imageOptions), { hideBackgroundDots: Boolean(newOptions.imageOptions.hideBackgroundDots), imageSize: Number(newOptions.imageOptions.imageSize), margin: Number(newOptions.imageOptions.margin) });
    if (newOptions.margin > Math.min(newOptions.width, newOptions.height)) {
        newOptions.margin = Math.min(newOptions.width, newOptions.height);
    }
    newOptions.dotsOptions = Object.assign({}, newOptions.dotsOptions);
    if (newOptions.dotsOptions.gradient) {
        newOptions.dotsOptions.gradient = sanitizeGradient(newOptions.dotsOptions.gradient);
    }
    if (newOptions.cornersSquareOptions) {
        newOptions.cornersSquareOptions = Object.assign({}, newOptions.cornersSquareOptions);
        if (newOptions.cornersSquareOptions.gradient) {
            newOptions.cornersSquareOptions.gradient = sanitizeGradient(newOptions.cornersSquareOptions.gradient);
        }
    }
    if (newOptions.cornersDotOptions) {
        newOptions.cornersDotOptions = Object.assign({}, newOptions.cornersDotOptions);
        if (newOptions.cornersDotOptions.gradient) {
            newOptions.cornersDotOptions.gradient = sanitizeGradient(newOptions.cornersDotOptions.gradient);
        }
    }
    if (newOptions.backgroundOptions) {
        newOptions.backgroundOptions = Object.assign({}, newOptions.backgroundOptions);
        if (newOptions.backgroundOptions.gradient) {
            newOptions.backgroundOptions.gradient = sanitizeGradient(newOptions.backgroundOptions.gradient);
        }
    }
    return newOptions;
}
exports.default = sanitizeOptions;
//# sourceMappingURL=sanitizeOptions.js.map