"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdate = exports.getGet = exports.generateUid = exports.isRootPath = exports.createPath = exports.Path = void 0;
const lodash_1 = require("lodash");
const joinFields = (fields) => fields.filter((field) => field).join('.');
class Path {
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
exports.Path = Path;
const createPath = (doc, field) => new Path(doc, field);
exports.createPath = createPath;
const isRootPath = (path) => !path.field;
exports.isRootPath = isRootPath;
const generateUid = (timestamp = Date.now()) => `${timestamp}${(0, lodash_1.padStart)(String((0, lodash_1.random)(1, 10 ** 9 - 1)), 9, '0')}`;
exports.generateUid = generateUid;
const getGet = (getDoc) => {
    return async (path) => {
        const docData = (await getDoc(path.doc)).data() || {};
        return (0, exports.isRootPath)(path) ? docData : (0, lodash_1.get)(docData, path.field);
    };
};
exports.getGet = getGet;
const getUpdate = (setDoc) => {
    return async (path, data) => {
        return (0, exports.isRootPath)(path)
            ? setDoc(path.doc, data)
            : setDoc(path.doc, (0, lodash_1.setWith)({}, path.field, data, Object), { mergeFields: [path.field] });
    };
};
exports.getUpdate = getUpdate;
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
