import {getDownloadURL, getStorage, ref, StorageReference, uploadBytes} from 'firebase/storage';
import {DownloadUrl, ImageData} from './types';

export const getStorageRef = (storagePath: string) => ref(getStorage(), storagePath);

export const uploadImage = async (imageStorageRef: StorageReference, imageData: ImageData): Promise<DownloadUrl> => {
  await uploadBytes(imageStorageRef, imageData);
  return await getDownloadURL(imageStorageRef);
}
