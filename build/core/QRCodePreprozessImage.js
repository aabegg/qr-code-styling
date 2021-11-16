"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodePreProzessImage = void 0;
const getMode_1 = __importDefault(require("../tools/getMode"));
const merge_1 = __importDefault(require("../tools/merge"));
const sanitizeOptions_1 = __importDefault(require("../tools/sanitizeOptions"));
const QROptions_1 = __importDefault(require("./QROptions"));
const QRSVG_1 = __importDefault(require("./QRSVG"));
const fs_1 = __importDefault(require("fs"));
const xmldom_1 = require("@xmldom/xmldom");
const qrcode_generator_1 = __importDefault(require("qrcode-generator"));
class QRCodePreProzessImage {
    constructor(options) {
        this._options = options ? sanitizeOptions_1.default(merge_1.default(QROptions_1.default, options)) : QROptions_1.default;
        this.preCalc();
    }
    async preCalc() {
        this._qr = qrcode_generator_1.default(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
        this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode_1.default(this._options.data));
        this._qr.make();
        this._svg = new QRSVG_1.default(this._options);
        const imageSizeResult = await this._svg.preClacImageSizeAndPosition(this._qr);
        const buffer = fs_1.default.readFileSync(this._options.image);
        const doc = new xmldom_1.DOMParser().parseFromString(buffer.toString());
        const svgElement = doc.getElementsByTagName("svg").item(0);
        svgElement.setAttribute("width", imageSizeResult.dw.toString(10));
        svgElement.setAttribute("height", imageSizeResult.dh.toString(10));
        svgElement.setAttribute("x", imageSizeResult.dx.toString(10));
        svgElement.setAttribute("y", imageSizeResult.dy.toString(10));
        return { imageSize: imageSizeResult, svgElement: svgElement };
    }
}
exports.QRCodePreProzessImage = QRCodePreProzessImage;
//# sourceMappingURL=QRCodePreprozessImage.js.map