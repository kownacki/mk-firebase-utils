import Mime from 'mime/Mime';
import {generateUid} from '../common';
import {Image, ImageData} from './types';
import {getStorageRef, uploadImage} from './utils';

export const createImage = async (imageData: ImageData): Promise<Image> => {
  await import('../mime.min.js');
  const extension = (window.mime as Mime).getExtension(imageData.type);
  const imageName = `${generateUid()}${extension ? `.${extension}` : ''}`;
  const imageStorageRef = getStorageRef(`images/${imageName}`);
  const downloadUrl = await uploadImage(imageStorageRef, imageData);
  return {name: imageName, url: downloadUrl};
};
