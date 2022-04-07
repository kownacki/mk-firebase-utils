import { update } from '../web';
import { createImage } from './createImage';
import { deleteImage } from './deleteImage';
export const updateImage = async (path, imageData, oldImageName) => {
    if (oldImageName) {
        deleteImage(oldImageName);
    }
    const image = await createImage(imageData);
    update(path, image);
    return image;
};
