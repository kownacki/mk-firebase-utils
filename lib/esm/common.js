import { padStart, random, get as loGet, setWith } from 'lodash';
const joinFields = (fields) => fields.filter((field) => field).join('.');
export class Path {
    constructor(doc, field) {
        if (!doc) {
            throw new TypeError('\'doc\' parameter cannot be empty.');
        }
        this.doc = doc;
        this.field = field === '' ? undefined : field;
    }
    extend(extension) {
        return new Path(this.doc, joinFields([this.field, extension]));
    }
}
export const createPath = (doc, field) => new Path(doc, field);
export const isRootPath = (path) => !path.field;
export const generateUid = (timestamp = Date.now()) => `${timestamp}${padStart(String(random(1, 10 ** 9 - 1)), 9, '0')}`;
export const baseGet = async (getDoc, path) => {
    const docData = (await getDoc(path.doc)).data() || {};
    return isRootPath(path) ? docData : loGet(docData, path.field);
};
export const baseUpdate = async (setDoc, path, data) => {
    return isRootPath(path)
        ? setDoc(path.doc, data)
        : setDoc(path.doc, setWith({}, path.field, data, Object), { mergeFields: [path.field] });
};
