import {deleteObject} from 'firebase/storage';
import {ImageName} from './types';
import {getStorageRef} from './utils';

export const deleteImage = async (imageName: ImageName) => {
  const imageStorageRef = getStorageRef(`images/${imageName}`);
  return deleteObject(imageStorageRef);
};
