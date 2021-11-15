"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getMode_1 = __importDefault(require("../tools/getMode"));
const merge_1 = __importDefault(require("../tools/merge"));
const QRCanvas_1 = __importDefault(require("./QRCanvas"));
const QRSVG_1 = __importDefault(require("./QRSVG"));
const drawTypes_1 = __importDefault(require("../constants/drawTypes"));
const QROptions_1 = __importDefault(require("./QROptions"));
const sanitizeOptions_1 = __importDefault(require("../tools/sanitizeOptions"));
const qrcode_generator_1 = __importDefault(require("qrcode-generator"));
const xmldom_1 = require("@xmldom/xmldom");
class QRCodeStyling {
    constructor(options) {
        this._options = options ? sanitizeOptions_1.default(merge_1.default(QROptions_1.default, options)) : QROptions_1.default;
        this.update();
    }
    async _getQRStylingElement(extension = "png") {
        if (!this._qr)
            throw "QR code is empty";
        if (extension.toLowerCase() === "svg") {
            let promise, svg;
            if (this._svg && this._svgDrawingPromise) {
                svg = this._svg;
                promise = this._svgDrawingPromise;
            }
            else {
                svg = new QRSVG_1.default(this._options);
                promise = svg.drawQR(this._qr);
            }
            await promise;
            return svg;
        }
        else {
            let promise, canvas;
            if (this._canvas && this._canvasDrawingPromise) {
                canvas = this._canvas;
                promise = this._canvasDrawingPromise;
            }
            else {
                canvas = new QRCanvas_1.default(this._options);
                promise = canvas.drawQR(this._qr);
            }
            await promise;
            return canvas;
        }
    }
    update(options) {
        this._options = options ? sanitizeOptions_1.default(merge_1.default(this._options, options)) : this._options;
        if (!this._options.data) {
            return;
        }
        this._qr = qrcode_generator_1.default(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
        this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode_1.default(this._options.data));
        this._qr.make();
        if (this._options.type === drawTypes_1.default.canvas) {
            this._canvas = new QRCanvas_1.default(this._options);
            this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
            this._svgDrawingPromise = undefined;
            this._svg = undefined;
        }
        else {
            this._svg = new QRSVG_1.default(this._options);
            this._svgDrawingPromise = this._svg.drawQR(this._qr);
            this._canvasDrawingPromise = undefined;
            this._canvas = undefined;
        }
    }
    async getRawData(extension = "png") {
        if (!this._qr)
            throw "QR code is empty";
        const element = await this._getQRStylingElement(extension);
        let dataUri;
        if (extension.toLowerCase() === "svg") {
            const serializer = new xmldom_1.XMLSerializer();
            const source = serializer.serializeToString(element.getElement());
            const svgSource = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            return Buffer.from(svgSource, "binary");
        }
        else {
            dataUri = this._getUrlFromQRCanvas(element, extension);
        }
        const regex = /^data:.+\/(.+);base64,(.*)$/;
        const matches = dataUri.match(regex);
        if (matches != null) {
            const data = matches[2];
            return Buffer.from(data, "base64");
        }
        return null;
    }
    _getUrlFromQRCanvas(canvas, extension) {
        if (extension === "png") {
            return canvas.getCanvas().toDataURL("image/png");
        }
        else {
            return canvas.getCanvas().toDataURL("image/jpeg");
        }
    }
}
exports.default = QRCodeStyling;
//# sourceMappingURL=QRCodeStyling.js.map