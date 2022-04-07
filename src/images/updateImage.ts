import {Path} from '../common';
import {update} from '../web';
import {createImage} from './createImage';
import {deleteImage} from './deleteImage';
import {ImageData, ImageName} from './types';

export const updateImage = async (path: Path, imageData: ImageData, oldImageName?: ImageName) => {
  if (oldImageName) {
    deleteImage(oldImageName);
  }
  const image = await createImage(imageData);
  update(path, image);
  return image;
};
