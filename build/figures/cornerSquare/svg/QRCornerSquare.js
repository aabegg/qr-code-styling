"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cornerSquareTypes_1 = __importDefault(require("../../../constants/cornerSquareTypes"));
const xmldom_1 = require("@xmldom/xmldom");
class QRCornerSquare {
    constructor({ svg, type }) {
        this._xmlDoc = new xmldom_1.DOMImplementation().createDocument(null, null);
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerSquareTypes_1.default.square:
                drawFunction = this._drawSquare;
                break;
            case cornerSquareTypes_1.default.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case cornerSquareTypes_1.default.dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x, y, size, rotation });
    }
    _rotateFigure({ x, y, size, rotation = 0, draw }) {
        var _a;
        const cx = x + size / 2;
        const cy = y + size / 2;
        draw();
        (_a = this._element) === null || _a === void 0 ? void 0 : _a.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
    }
    _basicDot(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x + size / 2} ${y}` +
                    `a ${size / 2} ${size / 2} 0 1 0 0.1 0` +
                    `z` +
                    `m 0 ${dotSize}` +
                    `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` +
                    `Z`);
            } }));
    }
    _basicSquare(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size}` +
                    `h ${size}` +
                    `v ${-size}` +
                    `z` +
                    `M ${x + dotSize} ${y + dotSize}` +
                    `h ${size - 2 * dotSize}` +
                    `v ${size - 2 * dotSize}` +
                    `h ${-size + 2 * dotSize}` +
                    `z`);
            } }));
    }
    _basicExtraRounded(args) {
        const { size, x, y } = args;
        const dotSize = size / 7;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("clip-rule", "evenodd");
                this._element.setAttribute("d", `M ${x} ${y + 2.5 * dotSize}` +
                    `v ${2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
                    `h ${2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
                    `v ${-2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
                    `h ${-2 * dotSize}` +
                    `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
                    `M ${x + 2.5 * dotSize} ${y + dotSize}` +
                    `h ${2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
                    `v ${2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
                    `h ${-2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
                    `v ${-2 * dotSize}` +
                    `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`);
            } }));
    }
    _drawDot({ x, y, size, rotation }) {
        this._basicDot({ x, y, size, rotation });
    }
    _drawSquare({ x, y, size, rotation }) {
        this._basicSquare({ x, y, size, rotation });
    }
    _drawExtraRounded({ x, y, size, rotation }) {
        this._basicExtraRounded({ x, y, size, rotation });
    }
}
exports.default = QRCornerSquare;
//# sourceMappingURL=QRCornerSquare.js.map