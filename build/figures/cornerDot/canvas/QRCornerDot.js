"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cornerDotTypes_1 = __importDefault(require("../../../constants/cornerDotTypes"));
class QRCornerDot {
    constructor({ context, type }) {
        this._context = context;
        this._type = type;
    }
    draw(x, y, size, rotation) {
        const context = this._context;
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
        drawFunction.call(this, { x, y, size, context, rotation });
    }
    _rotateFigure({ x, y, size, context, rotation = 0, draw }) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    }
    _basicDot(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
            } }));
    }
    _basicSquare(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.rect(-size / 2, -size / 2, size, size);
            } }));
    }
    _drawDot({ x, y, size, context, rotation }) {
        this._basicDot({ x, y, size, context, rotation });
    }
    _drawSquare({ x, y, size, context, rotation }) {
        this._basicSquare({ x, y, size, context, rotation });
    }
}
exports.default = QRCornerDot;
//# sourceMappingURL=QRCornerDot.js.map