import {getFirestore, getDoc as fbGetDoc, doc as fbDoc, setDoc as fbSetDoc, SetOptions} from 'firebase/firestore'
import {baseGet, baseUpdate, Doc, Path} from './common';

export * from './common';

const getDoc = (docPath: Doc) => {
  const docRef = fbDoc(getFirestore(), docPath);
  return fbGetDoc(docRef);
};

export const get = (path: Path) => {
  return baseGet(getDoc, path);
}

const setDoc = (docPath: Doc, data: any, options?: SetOptions) => {
  const docRef = fbDoc(getFirestore(), docPath);
  return options ? fbSetDoc(docRef, data, options) : fbSetDoc(docRef, data);
}

export const update = (path: Path, data: any) => {
  return baseUpdate(setDoc, path, data);
};

export * from './images';
