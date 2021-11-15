"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotTypes_1 = __importDefault(require("../../../constants/dotTypes"));
class QRDot {
    constructor({ context, type }) {
        this._context = context;
        this._type = type;
    }
    draw(x, y, size, getNeighbor) {
        const context = this._context;
        const type = this._type;
        let drawFunction;
        switch (type) {
            case dotTypes_1.default.dots:
                drawFunction = this._drawDot;
                break;
            case dotTypes_1.default.classy:
                drawFunction = this._drawClassy;
                break;
            case dotTypes_1.default.classyRounded:
                drawFunction = this._drawClassyRounded;
                break;
            case dotTypes_1.default.rounded:
                drawFunction = this._drawRounded;
                break;
            case dotTypes_1.default.extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case dotTypes_1.default.square:
            default:
                drawFunction = this._drawSquare;
        }
        drawFunction.call(this, { x, y, size, context, getNeighbor });
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
    _basicSideRounded(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    }
    _basicCornerRounded(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    }
    _basicCornerExtraRounded(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
            } }));
    }
    _basicCornersRounded(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(0, size / 2);
                context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    }
    _basicCornersExtraRounded(args) {
        const { size, context } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
            } }));
    }
    _drawDot({ x, y, size, context }) {
        this._basicDot({ x, y, size, context, rotation: 0 });
    }
    _drawSquare({ x, y, size, context }) {
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
    _drawRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerRounded({ x, y, size, context, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, context, rotation });
            return;
        }
    }
    _drawExtraRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            let rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerExtraRounded({ x, y, size, context, rotation });
            return;
        }
        if (neighborsCount === 1) {
            let rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x, y, size, context, rotation });
            return;
        }
    }
    _drawClassy({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x, y, size, context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
    _drawClassyRounded({ x, y, size, context, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, context, rotation: 0 });
    }
}
exports.default = QRDot;
//# sourceMappingURL=QRDot.js.map