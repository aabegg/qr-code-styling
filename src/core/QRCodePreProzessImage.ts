import { Options } from "..";
import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import sanitizeOptions from "../tools/sanitizeOptions";
import defaultOptions, { RequiredOptions } from "./QROptions";
import QRSVG, { PrecalcImageSizeResult } from "./QRSVG";
import fs from "fs";
import { DOMParser } from "@xmldom/xmldom";
import { QRCode } from "../types";
import qrcode from "qrcode-generator";

export interface ImagePreProzessResult {
  imageSize: PrecalcImageSizeResult;
  svgElement: SVGSVGElement;
}

export class QRCodePreProzessImage {
  _options: RequiredOptions;
  _qr?: QRCode;
  _svg?: QRSVG;

  constructor(options?: Partial<Options>) {
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;
    this.preCalc();
  }


  async preCalc(): Promise<ImagePreProzessResult> {

    this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
    this._qr.make();

    this._svg = new QRSVG(this._options);

    const imageSizeResult = await this._svg.preClacImageSizeAndPosition(this._qr);

    const buffer = fs.readFileSync(this._options.image);
    const doc = new DOMParser().parseFromString(buffer.toString());

    const svgElement = doc.getElementsByTagName("svg").item(0);  

    svgElement.setAttribute("width", imageSizeResult.dw.toString(10));
    svgElement.setAttribute("height", imageSizeResult.dh.toString(10));
    svgElement.setAttribute("x", imageSizeResult.dx.toString(10));
    svgElement.setAttribute("y", imageSizeResult.dy.toString(10));

    return { imageSize: imageSizeResult, svgElement: svgElement };
  }
}
