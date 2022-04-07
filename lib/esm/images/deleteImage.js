import { deleteObject } from 'firebase/storage';
import { getStorageRef } from './utils';
export const deleteImage = async (imageName) => {
    const imageStorageRef = getStorageRef(`images/${imageName}`);
    return deleteObject(imageStorageRef);
};
