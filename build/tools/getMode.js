"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modes_1 = __importDefault(require("../constants/modes"));
function getMode(data) {
    switch (true) {
        case /^[0-9]*$/.test(data):
            return modes_1.default.numeric;
        case /^[0-9A-Z $%*+\-./:]*$/.test(data):
            return modes_1.default.alphanumeric;
        default:
            return modes_1.default.byte;
    }
}
exports.default = getMode;
//# sourceMappingURL=getMode.js.map