import { getFirestore, getDoc as fbGetDoc, doc as fbDoc, setDoc as fbSetDoc } from 'firebase/firestore';
import { baseGet, baseUpdate } from './common';
export * from './common';
const getDoc = (docPath) => {
    const docRef = fbDoc(getFirestore(), docPath);
    return fbGetDoc(docRef);
};
export const get = (path) => {
    return baseGet(getDoc, path);
};
const setDoc = (docPath, data, options) => {
    const docRef = fbDoc(getFirestore(), docPath);
    return options ? fbSetDoc(docRef, data, options) : fbSetDoc(docRef, data);
};
export const update = (path, data) => {
    return baseUpdate(setDoc, path, data);
};
export * from './images';
