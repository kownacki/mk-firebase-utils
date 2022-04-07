import { Path } from '../common';
import { ImageData } from './types';
export declare const updateImage: (path: Path, imageData: ImageData, oldImageName?: string | undefined) => Promise<import("./types").Image>;
