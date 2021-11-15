"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotTypes_1 = __importDefault(require("../../../constants/dotTypes"));
const xmldom_1 = require("@xmldom/xmldom");
class QRDot {
    constructor({ svg, type }) {
        this._xmlDoc = new xmldom_1.DOMImplementation().createDocument(null, null);
        this._svg = svg;
        this._type = type;
    }
    draw(x, y, size, getNeighbor) {
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
        drawFunction.call(this, { x, y, size, getNeighbor });
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
    _basicSideRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size}` +
                    `h ${size / 2}` +
                    `a ${size / 2} ${size / 2}, 0, 0, 0, 0 ${-size}`);
            } }));
    }
    _basicCornerRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size}` +
                    `h ${size}` +
                    `v ${-size / 2}` +
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}`);
            } }));
    }
    _basicCornerExtraRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size}` +
                    `h ${size}` +
                    `a ${size} ${size}, 0, 0, 0, ${-size} ${-size}`);
            } }));
    }
    _basicCornersRounded(args) {
        const { size, x, y } = args;
        this._rotateFigure(Object.assign(Object.assign({}, args), { draw: () => {
                this._element = this._xmlDoc.createElementNS("http://www.w3.org/2000/svg", "path");
                this._element.setAttribute("d", `M ${x} ${y}` +
                    `v ${size / 2}` +
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${size / 2} ${size / 2}` +
                    `h ${size / 2}` +
                    `v ${-size / 2}` +
                    `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}`);
            } }));
    }
    _drawDot({ x, y, size }) {
        this._basicDot({ x, y, size, rotation: 0 });
    }
    _drawSquare({ x, y, size }) {
        this._basicSquare({ x, y, size, rotation: 0 });
    }
    _drawRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, rotation: 0 });
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
            this._basicCornerRounded({ x, y, size, rotation });
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
            this._basicSideRounded({ x, y, size, rotation });
            return;
        }
    }
    _drawExtraRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x, y, size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x, y, size, rotation: 0 });
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
            this._basicCornerExtraRounded({ x, y, size, rotation });
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
            this._basicSideRounded({ x, y, size, rotation });
            return;
        }
    }
    _drawClassy({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x, y, size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, rotation: 0 });
    }
    _drawClassyRounded({ x, y, size, getNeighbor }) {
        const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x, y, size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x, y, size, rotation: 0 });
    }
}
exports.default = QRDot;
//# sourceMappingURL=QRDot.js.map