import { getFirestore } from 'firebase-admin/firestore';
import { baseGet, baseUpdate } from './common';
export * from './common';
const getDoc = (docPath) => {
    return getFirestore().doc(docPath).get();
};
export const get = (path) => {
    return baseGet(getDoc, path);
};
const setDoc = (docPath, data, options) => {
    const docRef = getFirestore().doc(docPath);
    return options ? docRef.set(data, options) : docRef.set(data);
};
export const update = (path, data) => {
    return baseUpdate(setDoc, path, data);
};
