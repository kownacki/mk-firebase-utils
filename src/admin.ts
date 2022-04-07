import {getFirestore, SetOptions} from 'firebase-admin/firestore';
import {baseGet, baseUpdate, Doc, Path} from './common';

export * from './common';

const getDoc = (docPath: Doc) => {
  return getFirestore().doc(docPath).get();
}

export const get = (path: Path) => {
  return baseGet(getDoc, path);
}

const setDoc = (docPath: Doc, data: any, options?: SetOptions) => {
  const docRef = getFirestore().doc(docPath);
  return options ? docRef.set(data, options) : docRef.set(data);
};

export const update = (path: Path, data: any) => {
  return baseUpdate(setDoc, path, data);
};
