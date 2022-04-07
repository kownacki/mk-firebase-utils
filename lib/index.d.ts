import { DocumentSnapshot as FirebaseDocumentSnapshot, SetOptions as FirestoreSetOptions } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { DocumentSnapshot as FirebaseAdminDocumentSnapshot, SetOptions as FirestoreAdminSetOptions } from 'firebase-admin/firestore';
import { Storage as FirebaseAdminStorage } from 'firebase-admin/storage';
export declare type Storage = FirebaseStorage | FirebaseAdminStorage;
export declare type DocumentSnapshot = FirebaseDocumentSnapshot | FirebaseAdminDocumentSnapshot;
export declare type SetOptions = FirestoreSetOptions | FirestoreAdminSetOptions;
export declare type Doc = string;
export declare type Field = string | RootField;
export declare type RootField = undefined;
export declare class Path {
    doc: Doc;
    field: Field;
    constructor(doc: Doc, field?: Field);
    extend(extension: Field): Path;
}
export declare const createPath: (doc: Doc, field?: Field) => Path;
export declare const isRootPath: (path: Path) => boolean;
export declare const generateUid: (timestamp?: number) => string;
export declare const getGet: (getDoc: (doc: Doc) => Promise<DocumentSnapshot>) => (path: Path) => Promise<any>;
export declare const getUpdate: (setDoc: (doc: Doc, data: any, options?: SetOptions | undefined) => Promise<any>) => (path: Path, data: any) => Promise<any>;
