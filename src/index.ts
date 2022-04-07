import {padStart, random, get, setWith} from 'lodash';
import {DocumentSnapshot as FirebaseDocumentSnapshot, SetOptions as FirestoreSetOptions} from 'firebase/firestore';
import {FirebaseStorage} from 'firebase/storage';
import {DocumentSnapshot as FirebaseAdminDocumentSnapshot, SetOptions as FirestoreAdminSetOptions} from 'firebase-admin/firestore';
import {Storage as FirebaseAdminStorage} from 'firebase-admin/storage';

export type Storage = FirebaseStorage | FirebaseAdminStorage;
export type DocumentSnapshot = FirebaseDocumentSnapshot | FirebaseAdminDocumentSnapshot;
export type SetOptions = FirestoreSetOptions | FirestoreAdminSetOptions;

export type Doc = string;
export type Field = string | RootField;
export type RootField = undefined;

const joinFields = (fields: Field[]) => fields.filter((field) => field).join('.');

export class Path {
  doc: Doc;
  field: Field;
  constructor(doc: Doc, field?: Field) {
    if (!doc) {
      throw new TypeError('\'doc\' parameter cannot be empty.');
    }
    this.doc = doc;
    this.field = field === '' ? undefined : field;
  }
  extend(extension: Field) {
    return new Path(this.doc, joinFields([this.field, extension]));
  }
}

export const createPath = (doc: Doc, field?: Field) => new Path(doc, field);

export const isRootPath = (path: Path) => !path.field;

export const generateUid = (timestamp = Date.now()) => `${timestamp}${padStart(String(random(1, 10**9 - 1)), 9, '0')}`;

export const getGet = (getDoc: (doc: Doc) => Promise<DocumentSnapshot>) => {
  return async (path: Path) => {
    const docData = (await getDoc(path.doc)).data() || {};
    return isRootPath(path) ? docData : get(docData, path.field as string);
  };
}

export const getUpdate = (setDoc: (doc: Doc, data: any, options?: SetOptions) => Promise<any>) => {
  return async (path: Path, data: any) => {
    return isRootPath(path)
      ? setDoc(path.doc, data)
      : setDoc(path.doc, setWith({}, path.field as string, data, Object), {mergeFields: [path.field as string]});
  };
}

// export const createImage = async (blobOrFile) => {
//   await import('./mime.min.js');
//   const extension = mime.getExtension(blobOrFile.type);
//   const name = generateUid() + (extension ? '.' + extension : '');
//   const storageRef = storage.ref('images/' + name);
//   await storageRef.put(blobOrFile);
//   return {name, url: await storageRef.getDownloadURL()};
// };
// export const deleteImage = async (imageName) => {
//   return storage.ref('images/' + imageName).delete()
// };
// export const updateImage = async (path, blobOrFile, oldImageName) => {
//   if (oldImageName) deleteImage(oldImageName);
//   const image = await createImage(blobOrFile);
//   update(path, image);
//   return image;
// };
//
// return {
//   joinFields,
//   isRootField,
//   generateUid,
//   get,
//   update,
//   createImage,
//   deleteImage,
//   updateImage,
// }
