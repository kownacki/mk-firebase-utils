import { DocumentSnapshot as FirebaseDocumentSnapshot, SetOptions as FirestoreSetOptions } from 'firebase/firestore';
import { DocumentSnapshot as FirebaseAdminDocumentSnapshot, SetOptions as FirestoreAdminSetOptions } from 'firebase-admin/firestore';
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
declare type GetDoc = (doc: Doc) => Promise<DocumentSnapshot>;
export declare const baseGet: (getDoc: GetDoc, path: Path) => Promise<any>;
declare type SetDoc = (doc: Doc, data: any, options?: SetOptions) => Promise<any>;
export declare const baseUpdate: (setDoc: SetDoc, path: Path, data: any) => Promise<any>;
export {};
