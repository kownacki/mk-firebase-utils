import { StorageReference } from 'firebase/storage';
import { DownloadUrl, ImageData } from './types';
export declare const getStorageRef: (storagePath: string) => StorageReference;
export declare const uploadImage: (imageStorageRef: StorageReference, imageData: ImageData) => Promise<DownloadUrl>;
