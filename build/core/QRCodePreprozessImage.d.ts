import { Options } from "..";
import { RequiredOptions } from "./QROptions";
import QRSVG, { PrecalcImageSizeResult } from "./QRSVG";
import { QRCode } from "../types";
export interface ImagePreProzessResult {
    imageSize: PrecalcImageSizeResult;
    svgElement: SVGSVGElement;
}
export declare class QRCodePreProzessImage {
    _options: RequiredOptions;
    _qr?: QRCode;
    _svg?: QRSVG;
    constructor(options?: Partial<Options>);
    preCalc(): Promise<ImagePreProzessResult>;
}
