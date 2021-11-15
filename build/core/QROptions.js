"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrTypes_1 = __importDefault(require("../constants/qrTypes"));
const drawTypes_1 = __importDefault(require("../constants/drawTypes"));
const errorCorrectionLevels_1 = __importDefault(require("../constants/errorCorrectionLevels"));
const defaultOptions = {
    type: drawTypes_1.default.canvas,
    width: 300,
    height: 300,
    data: "",
    margin: 0,
    qrOptions: {
        typeNumber: qrTypes_1.default[0],
        mode: undefined,
        errorCorrectionLevel: errorCorrectionLevels_1.default.Q
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        crossOrigin: undefined,
        margin: 0
    },
    dotsOptions: {
        type: "square",
        color: "#000"
    },
    backgroundOptions: {
        color: "#fff"
    }
};
exports.default = defaultOptions;
//# sourceMappingURL=QROptions.js.map