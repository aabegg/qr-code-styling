"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateImageSize_1 = __importDefault(require("../tools/calculateImageSize"));
const errorCorrectionPercents_1 = __importDefault(require("../constants/errorCorrectionPercents"));
const QRDot_1 = __importDefault(require("../figures/dot/svg/QRDot"));
const QRCornerSquare_1 = __importDefault(require("../figures/cornerSquare/svg/QRCornerSquare"));
const QRCornerDot_1 = __importDefault(require("../figures/cornerDot/svg/QRCornerDot"));
const gradientTypes_1 = __importDefault(require("../constants/gradientTypes"));
const xmldom_1 = require("@xmldom/xmldom");
const canvas_1 = require("canvas");
const squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
const dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
class QRSVG {
    constructor(options) {
        this._xmlDoc = new xmldom_1.DOMImplementation().createDocument(null, null);
        this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._element.setAttribute("width", String(options.width));
        this._element.setAttribute("height", String(options.height));
        this._defs = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._element.appendChild(this._defs);
        this._options = options;
    }
    get width() {
        return this._options.width;
    }
    get height() {
        return this._options.height;
    }
    getElement() {
        return this._element;
    }
    clear() {
        var _a;
        const oldElement = this._element;
        this._element = oldElement.cloneNode(false);
        (_a = oldElement === null || oldElement === void 0 ? void 0 : oldElement.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(this._element, oldElement);
        this._defs = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._element.appendChild(this._defs);
    }
    async drawQR(qr) {
        const count = qr.getModuleCount();
        const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        let drawImageSize = {
            hideXDots: 0,
            hideYDots: 0,
            width: 0,
            height: 0
        };
        this._qr = qr;
        if (this._options.image) {
            if (this._options.imagePreProzess) {
                drawImageSize = this._options.imagePreProzess.imageSize.drawImageSize;
            }
            else {
                await this.loadImage();
                if (!this._image)
                    return;
                const { imageOptions, qrOptions } = this._options;
                const coverLevel = imageOptions.imageSize * errorCorrectionPercents_1.default[qrOptions.errorCorrectionLevel];
                const maxHiddenDots = Math.floor(coverLevel * count * count);
                drawImageSize = calculateImageSize_1.default({
                    originalWidth: this._image.width,
                    originalHeight: this._image.height,
                    maxHiddenDots,
                    maxHiddenAxisDots: count - 14,
                    dotSize
                });
            }
        }
        this.clear();
        this.drawBackground();
        this.drawDots((i, j) => {
            var _a, _b, _c, _d, _e, _f;
            if (this._options.imageOptions.hideBackgroundDots) {
                if (i >= (count - drawImageSize.hideXDots) / 2 &&
                    i < (count + drawImageSize.hideXDots) / 2 &&
                    j >= (count - drawImageSize.hideYDots) / 2 &&
                    j < (count + drawImageSize.hideYDots) / 2) {
                    return false;
                }
            }
            if (((_a = squareMask[i]) === null || _a === void 0 ? void 0 : _a[j]) || ((_b = squareMask[i - count + 7]) === null || _b === void 0 ? void 0 : _b[j]) || ((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j - count + 7])) {
                return false;
            }
            if (((_d = dotMask[i]) === null || _d === void 0 ? void 0 : _d[j]) || ((_e = dotMask[i - count + 7]) === null || _e === void 0 ? void 0 : _e[j]) || ((_f = dotMask[i]) === null || _f === void 0 ? void 0 : _f[j - count + 7])) {
                return false;
            }
            return true;
        });
        this.drawCorners();
        if (this._options.image) {
            if (this._options.imagePreProzess) {
                this._element.appendChild(this._options.imagePreProzess.svgElement);
            }
            else {
                this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
            }
        }
    }
    async preClacImageSizeAndPosition(qr) {
        const count = qr.getModuleCount();
        const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        let drawImageSize = {
            hideXDots: 0,
            hideYDots: 0,
            width: 0,
            height: 0
        };
        this._qr = qr;
        await this.loadImage();
        if (!this._image)
            return;
        const { imageOptions, qrOptions } = this._options;
        const coverLevel = imageOptions.imageSize * errorCorrectionPercents_1.default[qrOptions.errorCorrectionLevel];
        const maxHiddenDots = Math.floor(coverLevel * count * count);
        drawImageSize = calculateImageSize_1.default({
            originalWidth: this._image.width,
            originalHeight: this._image.height,
            maxHiddenDots,
            maxHiddenAxisDots: count - 14,
            dotSize
        });
        const options = this._options;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - drawImageSize.width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - drawImageSize.height) / 2;
        const dw = drawImageSize.width - options.imageOptions.margin * 2;
        const dh = drawImageSize.height - options.imageOptions.margin * 2;
        return { drawImageSize, dx, dy, dw, dh };
    }
    drawBackground() {
        var _a, _b;
        const element = this._element;
        const options = this._options;
        if (element) {
            const gradientOptions = (_a = options.backgroundOptions) === null || _a === void 0 ? void 0 : _a.gradient;
            const color = (_b = options.backgroundOptions) === null || _b === void 0 ? void 0 : _b.color;
            if (gradientOptions || color) {
                this._createColor({
                    options: gradientOptions,
                    color: color,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    height: options.height,
                    width: options.width,
                    name: "background-color"
                });
            }
        }
    }
    drawDots(filter) {
        var _a, _b;
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const options = this._options;
        const count = this._qr.getModuleCount();
        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dot = new QRDot_1.default({ svg: this._element, type: options.dotsOptions.type });
        this._dotsClipPath = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        this._dotsClipPath.setAttribute("id", "clip-path-dot-color");
        this._defs.appendChild(this._dotsClipPath);
        this._createColor({
            options: (_a = options.dotsOptions) === null || _a === void 0 ? void 0 : _a.gradient,
            color: options.dotsOptions.color,
            additionalRotation: 0,
            x: xBeginning,
            y: yBeginning,
            height: count * dotSize,
            width: count * dotSize,
            name: "dot-color"
        });
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }
                if (!((_b = this._qr) === null || _b === void 0 ? void 0 : _b.isDark(i, j))) {
                    continue;
                }
                dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize, (xOffset, yOffset) => {
                    if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                        return false;
                    if (filter && !filter(i + xOffset, j + yOffset))
                        return false;
                    return !!this._qr && this._qr.isDark(i + xOffset, j + yOffset);
                });
                if (dot._element && this._dotsClipPath) {
                    this._dotsClipPath.appendChild(dot._element);
                }
            }
        }
    }
    drawCorners() {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const element = this._element;
        const options = this._options;
        if (!element) {
            throw "Element code is not defined";
        }
        const count = this._qr.getModuleCount();
        const minSize = Math.min(options.width, options.height) - options.margin * 2;
        const dotSize = Math.floor(minSize / count);
        const cornersSquareSize = dotSize * 7;
        const cornersDotSize = dotSize * 3;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        [
            [0, 0, 0],
            [1, 0, Math.PI / 2],
            [0, 1, -Math.PI / 2]
        ].forEach(([column, row, rotation]) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const x = xBeginning + column * dotSize * (count - 7);
            const y = yBeginning + row * dotSize * (count - 7);
            let cornersSquareClipPath = this._dotsClipPath;
            let cornersDotClipPath = this._dotsClipPath;
            if (((_a = options.cornersSquareOptions) === null || _a === void 0 ? void 0 : _a.gradient) || ((_b = options.cornersSquareOptions) === null || _b === void 0 ? void 0 : _b.color)) {
                cornersSquareClipPath = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersSquareClipPath.setAttribute("id", `clip-path-corners-square-color-${column}-${row}`);
                this._defs.appendChild(cornersSquareClipPath);
                this._cornersSquareClipPath = this._cornersDotClipPath = cornersDotClipPath = cornersSquareClipPath;
                this._createColor({
                    options: (_c = options.cornersSquareOptions) === null || _c === void 0 ? void 0 : _c.gradient,
                    color: (_d = options.cornersSquareOptions) === null || _d === void 0 ? void 0 : _d.color,
                    additionalRotation: rotation,
                    x,
                    y,
                    height: cornersSquareSize,
                    width: cornersSquareSize,
                    name: `corners-square-color-${column}-${row}`
                });
            }
            if ((_e = options.cornersSquareOptions) === null || _e === void 0 ? void 0 : _e.type) {
                const cornersSquare = new QRCornerSquare_1.default({ svg: this._element, type: options.cornersSquareOptions.type });
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
                if (cornersSquare._element && cornersSquareClipPath) {
                    cornersSquareClipPath.appendChild(cornersSquare._element);
                }
            }
            else {
                const dot = new QRDot_1.default({ svg: this._element, type: options.dotsOptions.type });
                for (let i = 0; i < squareMask.length; i++) {
                    for (let j = 0; j < squareMask[i].length; j++) {
                        if (!((_f = squareMask[i]) === null || _f === void 0 ? void 0 : _f[j])) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => { var _a; return !!((_a = squareMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                        if (dot._element && cornersSquareClipPath) {
                            cornersSquareClipPath.appendChild(dot._element);
                        }
                    }
                }
            }
            if (((_g = options.cornersDotOptions) === null || _g === void 0 ? void 0 : _g.gradient) || ((_h = options.cornersDotOptions) === null || _h === void 0 ? void 0 : _h.color)) {
                cornersDotClipPath = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersDotClipPath.setAttribute("id", `clip-path-corners-dot-color-${column}-${row}`);
                this._defs.appendChild(cornersDotClipPath);
                this._cornersDotClipPath = cornersDotClipPath;
                this._createColor({
                    options: (_j = options.cornersDotOptions) === null || _j === void 0 ? void 0 : _j.gradient,
                    color: (_k = options.cornersDotOptions) === null || _k === void 0 ? void 0 : _k.color,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    height: cornersDotSize,
                    width: cornersDotSize,
                    name: `corners-dot-color-${column}-${row}`
                });
            }
            if ((_l = options.cornersDotOptions) === null || _l === void 0 ? void 0 : _l.type) {
                const cornersDot = new QRCornerDot_1.default({ svg: this._element, type: options.cornersDotOptions.type });
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
                if (cornersDot._element && cornersDotClipPath) {
                    cornersDotClipPath.appendChild(cornersDot._element);
                }
            }
            else {
                const dot = new QRDot_1.default({ svg: this._element, type: options.dotsOptions.type });
                for (let i = 0; i < dotMask.length; i++) {
                    for (let j = 0; j < dotMask[i].length; j++) {
                        if (!((_m = dotMask[i]) === null || _m === void 0 ? void 0 : _m[j])) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => { var _a; return !!((_a = dotMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                        if (dot._element && cornersDotClipPath) {
                            cornersDotClipPath.appendChild(dot._element);
                        }
                    }
                }
            }
        });
    }
    loadImage() {
        return new Promise((resolve, reject) => {
            const options = this._options;
            const image = new canvas_1.Image();
            if (!options.image) {
                return reject("Image is not defined");
            }
            this._image = image;
            image.onload = () => {
                resolve();
            };
            image.src = options.image;
        });
    }
    drawImage({ width, height, count, dotSize }) {
        const options = this._options;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        const dw = width - options.imageOptions.margin * 2;
        const dh = height - options.imageOptions.margin * 2;
        const image = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", options.image || "");
        image.setAttribute("x", String(dx));
        image.setAttribute("y", String(dy));
        image.setAttribute("width", `${dw}px`);
        image.setAttribute("height", `${dh}px`);
        this._element.appendChild(image);
    }
    _createColor({ options, color, additionalRotation, x, y, height, width, name }) {
        const size = width > height ? width : height;
        const rect = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("height", String(height));
        rect.setAttribute("width", String(width));
        rect.setAttribute("clip-path", `url('#clip-path-${name}')`);
        if (options) {
            let gradient;
            if (options.type === gradientTypes_1.default.radial) {
                gradient = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
                gradient.setAttribute("id", name);
                gradient.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient.setAttribute("fx", String(x + width / 2));
                gradient.setAttribute("fy", String(y + height / 2));
                gradient.setAttribute("cx", String(x + width / 2));
                gradient.setAttribute("cy", String(y + height / 2));
                gradient.setAttribute("r", String(size / 2));
            }
            else {
                const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
                const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
                let x0 = x + width / 2;
                let y0 = y + height / 2;
                let x1 = x + width / 2;
                let y1 = y + height / 2;
                if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                    (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                    x0 = x0 - width / 2;
                    y0 = y0 - (height / 2) * Math.tan(rotation);
                    x1 = x1 + width / 2;
                    y1 = y1 + (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                    y0 = y0 - height / 2;
                    x0 = x0 - width / 2 / Math.tan(rotation);
                    y1 = y1 + height / 2;
                    x1 = x1 + width / 2 / Math.tan(rotation);
                }
                else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                    x0 = x0 + width / 2;
                    y0 = y0 + (height / 2) * Math.tan(rotation);
                    x1 = x1 - width / 2;
                    y1 = y1 - (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                    y0 = y0 + height / 2;
                    x0 = x0 + width / 2 / Math.tan(rotation);
                    y1 = y1 - height / 2;
                    x1 = x1 - width / 2 / Math.tan(rotation);
                }
                gradient = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                gradient.setAttribute("id", name);
                gradient.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient.setAttribute("x1", String(Math.round(x0)));
                gradient.setAttribute("y1", String(Math.round(y0)));
                gradient.setAttribute("x2", String(Math.round(x1)));
                gradient.setAttribute("y2", String(Math.round(y1)));
            }
            options.colorStops.forEach(({ offset, color }) => {
                const stop = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop.setAttribute("offset", `${100 * offset}%`);
                stop.setAttribute("stop-color", color);
                gradient.appendChild(stop);
            });
            rect.setAttribute("fill", `url('#${name}')`);
            this._defs.appendChild(gradient);
        }
        else if (color) {
            rect.setAttribute("fill", color);
        }
        this._element.appendChild(rect);
    }
}
exports.default = QRSVG;
//# sourceMappingURL=QRSVG.js.map