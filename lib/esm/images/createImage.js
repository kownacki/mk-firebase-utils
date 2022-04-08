import { generateUid } from '../common';
import { getStorageRef, uploadImage } from './utils';
export const createImage = async (imageData) => {
    await import('../mime.min.js');
    const extension = window.mime.getExtension(imageData.type);
    const imageName = `${generateUid()}${extension ? `.${extension}` : ''}`;
    const imageStorageRef = getStorageRef(`images/${imageName}`);
    const downloadUrl = await uploadImage(imageStorageRef, imageData);
    return { name: imageName, url: downloadUrl };
};
