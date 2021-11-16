import { ImageSizeResult } from "../tools/calculateImageSize";
import { RequiredOptions } from "./QROptions";
import { QRCode, FilterFunction, Gradient } from "../types";
import { Image } from "canvas";
export interface PrecalcImageSizeResult {
    drawImageSize: ImageSizeResult;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
}
export default class QRSVG {
    _xmlDoc: XMLDocument;
    _element: SVGSVGElement;
    _defs: SVGDefsElement;
    _dotsClipPath?: SVGClipPathElement;
    _cornersSquareClipPath?: SVGElement;
    _cornersDotClipPath?: SVGElement;
    _options: RequiredOptions;
    _qr?: QRCode;
    _image?: Image;
    constructor(options: RequiredOptions);
    get width(): number;
    get height(): number;
    getElement(): SVGElement;
    clear(): void;
    drawQR(qr: QRCode): Promise<void>;
    preClacImageSizeAndPosition(qr: QRCode): Promise<PrecalcImageSizeResult>;
    drawBackground(): void;
    drawDots(filter?: FilterFunction): void;
    drawCorners(): void;
    loadImage(): Promise<void>;
    drawImage({ width, height, count, dotSize }: {
        width: number;
        height: number;
        count: number;
        dotSize: number;
    }): void;
    _createColor({ options, color, additionalRotation, x, y, height, width, name }: {
        options?: Gradient;
        color?: string;
        additionalRotation: number;
        x: number;
        y: number;
        height: number;
        width: number;
        name: string;
    }): void;
}
