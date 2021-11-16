/// <reference types="node" />
import QRCanvas from "./QRCanvas";
import QRSVG from "./QRSVG";
import { RequiredOptions } from "./QROptions";
import { Extension, QRCode, Options } from "../types";
export default class QRCodeStyling {
    _options: RequiredOptions;
    _container?: HTMLElement;
    _canvas?: QRCanvas;
    _svg?: QRSVG;
    _qr?: QRCode;
    _canvasDrawingPromise?: Promise<void>;
    _svgDrawingPromise?: Promise<void>;
    constructor(options?: Partial<Options>);
    _getQRStylingElement(): Promise<QRCanvas | QRSVG>;
    update(options?: Partial<Options>): void;
    getRawData(extension?: Extension): Promise<Buffer | null>;
    saveAsTmpFile(extension?: Extension): Promise<string>;
    _getUrlFromQRCanvas(canvas: QRCanvas, extension: Extension): string;
    static createTmpFile(): Promise<string>;
}
