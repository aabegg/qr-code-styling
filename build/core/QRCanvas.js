"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateImageSize_1 = __importDefault(require("../tools/calculateImageSize"));
const errorCorrectionPercents_1 = __importDefault(require("../constants/errorCorrectionPercents"));
const QRDot_1 = __importDefault(require("../figures/dot/canvas/QRDot"));
const QRCornerSquare_1 = __importDefault(require("../figures/cornerSquare/canvas/QRCornerSquare"));
const QRCornerDot_1 = __importDefault(require("../figures/cornerDot/canvas/QRCornerDot"));
const gradientTypes_1 = __importDefault(require("../constants/gradientTypes"));
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
class QRCanvas {
    constructor(options) {
        this._canvas = canvas_1.createCanvas(options.width, options.height);
        this._options = options;
    }
    get context() {
        return this._canvas.getContext("2d");
    }
    get width() {
        return this._canvas.width;
    }
    get height() {
        return this._canvas.height;
    }
    getCanvas() {
        return this._canvas;
    }
    clear() {
        const canvasContext = this.context;
        if (canvasContext) {
            canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
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
            this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
        }
    }
    drawBackground() {
        const canvasContext = this.context;
        const options = this._options;
        if (canvasContext) {
            if (options.backgroundOptions.gradient) {
                const gradientOptions = options.backgroundOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = gradient;
            }
            else if (options.backgroundOptions.color) {
                canvasContext.fillStyle = options.backgroundOptions.color;
            }
            canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
    drawDots(filter) {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const canvasContext = this.context;
        if (!canvasContext) {
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
        const dot = new QRDot_1.default({ context: canvasContext, type: options.dotsOptions.type });
        canvasContext.beginPath();
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }
                if (!this._qr.isDark(i, j)) {
                    continue;
                }
                dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize, (xOffset, yOffset) => {
                    if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                        return false;
                    if (filter && !filter(i + xOffset, j + yOffset))
                        return false;
                    return !!this._qr && this._qr.isDark(i + xOffset, j + yOffset);
                });
            }
        }
        if (options.dotsOptions.gradient) {
            const gradientOptions = options.dotsOptions.gradient;
            const gradient = this._createGradient({
                context: canvasContext,
                options: gradientOptions,
                additionalRotation: 0,
                x: xBeginning,
                y: yBeginning,
                size: count * dotSize
            });
            gradientOptions.colorStops.forEach(({ offset, color }) => {
                gradient.addColorStop(offset, color);
            });
            canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
        }
        else if (options.dotsOptions.color) {
            canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
        }
        canvasContext.fill("evenodd");
    }
    drawCorners(filter) {
        if (!this._qr) {
            throw "QR code is not defined";
        }
        const canvasContext = this.context;
        if (!canvasContext) {
            throw "QR code is not defined";
        }
        const options = this._options;
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (filter && !filter(column, row)) {
                return;
            }
            const x = xBeginning + column * dotSize * (count - 7);
            const y = yBeginning + row * dotSize * (count - 7);
            if ((_a = options.cornersSquareOptions) === null || _a === void 0 ? void 0 : _a.type) {
                const cornersSquare = new QRCornerSquare_1.default({ context: canvasContext, type: (_b = options.cornersSquareOptions) === null || _b === void 0 ? void 0 : _b.type });
                canvasContext.beginPath();
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
            }
            else {
                const dot = new QRDot_1.default({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                for (let i = 0; i < squareMask.length; i++) {
                    for (let j = 0; j < squareMask[i].length; j++) {
                        if (!((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j])) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => { var _a; return !!((_a = squareMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                    }
                }
            }
            if ((_d = options.cornersSquareOptions) === null || _d === void 0 ? void 0 : _d.gradient) {
                const gradientOptions = options.cornersSquareOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x,
                    y,
                    size: cornersSquareSize
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
            }
            else if ((_e = options.cornersSquareOptions) === null || _e === void 0 ? void 0 : _e.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
            }
            canvasContext.fill("evenodd");
            if ((_f = options.cornersDotOptions) === null || _f === void 0 ? void 0 : _f.type) {
                const cornersDot = new QRCornerDot_1.default({ context: canvasContext, type: (_g = options.cornersDotOptions) === null || _g === void 0 ? void 0 : _g.type });
                canvasContext.beginPath();
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
            }
            else {
                const dot = new QRDot_1.default({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                for (let i = 0; i < dotMask.length; i++) {
                    for (let j = 0; j < dotMask[i].length; j++) {
                        if (!((_h = dotMask[i]) === null || _h === void 0 ? void 0 : _h[j])) {
                            continue;
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, (xOffset, yOffset) => { var _a; return !!((_a = dotMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                    }
                }
            }
            if ((_j = options.cornersDotOptions) === null || _j === void 0 ? void 0 : _j.gradient) {
                const gradientOptions = options.cornersDotOptions.gradient;
                const gradient = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    size: cornersDotSize
                });
                gradientOptions.colorStops.forEach(({ offset, color }) => {
                    gradient.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
            }
            else if ((_k = options.cornersDotOptions) === null || _k === void 0 ? void 0 : _k.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersDotOptions.color;
            }
            canvasContext.fill("evenodd");
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
        const canvasContext = this.context;
        if (!canvasContext) {
            throw "canvasContext is not defined";
        }
        if (!this._image) {
            throw "image is not defined";
        }
        const options = this._options;
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);
        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        const dw = width - options.imageOptions.margin * 2;
        const dh = height - options.imageOptions.margin * 2;
        canvasContext.drawImage(this._image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
    }
    _createGradient({ context, options, additionalRotation, x, y, size }) {
        let gradient;
        if (options.type === gradientTypes_1.default.radial) {
            gradient = context.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
        }
        else {
            const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
            const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
            let x0 = x + size / 2;
            let y0 = y + size / 2;
            let x1 = x + size / 2;
            let y1 = y + size / 2;
            if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                x0 = x0 - size / 2;
                y0 = y0 - (size / 2) * Math.tan(rotation);
                x1 = x1 + size / 2;
                y1 = y1 + (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                y0 = y0 - size / 2;
                x0 = x0 - size / 2 / Math.tan(rotation);
                y1 = y1 + size / 2;
                x1 = x1 + size / 2 / Math.tan(rotation);
            }
            else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                x0 = x0 + size / 2;
                y0 = y0 + (size / 2) * Math.tan(rotation);
                x1 = x1 - size / 2;
                y1 = y1 - (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                y0 = y0 + size / 2;
                x0 = x0 + size / 2 / Math.tan(rotation);
                y1 = y1 - size / 2;
                x1 = x1 - size / 2 / Math.tan(rotation);
            }
            gradient = context.createLinearGradient(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
        }
        return gradient;
    }
}
exports.default = QRCanvas;
//# sourceMappingURL=QRCanvas.js.map