import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
export const getStorageRef = (storagePath) => ref(getStorage(), storagePath);
export const uploadImage = async (imageStorageRef, imageData) => {
    await uploadBytes(imageStorageRef, imageData);
    return await getDownloadURL(imageStorageRef);
};
