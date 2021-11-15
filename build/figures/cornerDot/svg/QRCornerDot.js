"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cornerDotTypes_1 = __importDefault(require("../../../constants/cornerDotTypes"));
const xmldom_1 = require("@xmldom/xmldom");
class QRCornerDot {
    constructor({ svg, type }) {
        this._xmlDoc = new xmldom_1.DOMImplementation().createDocument(null, null);
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const type = this._type;
        let drawFunction;
        switch (type) {
            case cornerDotTypes_1.default.square:
                drawFunction = this._drawSquare;
                break;
            case cornerDotTypes_1.default.dot:
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
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "circle");
                this._element.setAttribute("cx", String(x + size / 2));
                this._element.setAttribute("cy", String(y + size / 2));
                this._element.setAttribute("r", String(size / 2));
            } }));
    }
    _basicSquare(args) {
        const { size, x, y } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
                this._element.setAttribute("x", String(x));
                this._element.setAttribute("y", String(y));
                this._element.setAttribute("width", String(size));
                this._element.setAttribute("height", String(size));
            } }));
    }
    _drawDot({ x, y, size, rotation }) {
        this._basicDot({ x, y, size, rotation });
    }
    _drawSquare({ x, y, size, rotation }) {
        this._basicSquare({ x, y, size, rotation });
    }
}
exports.default = QRCornerDot;
//# sourceMappingURL=QRCornerDot.js.map