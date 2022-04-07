import {padStart, random, get as loGet, setWith} from 'lodash';
import {DocumentSnapshot as FirebaseDocumentSnapshot, SetOptions as FirestoreSetOptions} from 'firebase/firestore';
import {DocumentSnapshot as FirebaseAdminDocumentSnapshot, SetOptions as FirestoreAdminSetOptions} from 'firebase-admin/firestore';

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

type GetDoc = (doc: Doc) => Promise<DocumentSnapshot>;

export const baseGet = async (getDoc: GetDoc, path: Path) => {
  const docData = (await getDoc(path.doc)).data() || {};
  return isRootPath(path) ? docData : loGet(docData, path.field as string);
};

type SetDoc = (doc: Doc, data: any, options?: SetOptions) => Promise<any>;

export const baseUpdate = async (setDoc: SetDoc, path: Path, data: any) => {
  return isRootPath(path)
    ? setDoc(path.doc, data)
    : setDoc(path.doc, setWith({}, path.field as string, data, Object), {mergeFields: [path.field as string]});
};
