"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUpdate = exports.baseGet = exports.generateUid = exports.isRootPath = exports.createPath = exports.Path = void 0;
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
const baseGet = async (getDoc, path) => {
    const docData = (await getDoc(path.doc)).data() || {};
    return (0, exports.isRootPath)(path) ? docData : (0, lodash_1.get)(docData, path.field);
};
exports.baseGet = baseGet;
const baseUpdate = async (setDoc, path, data) => {
    return (0, exports.isRootPath)(path)
        ? setDoc(path.doc, data)
        : setDoc(path.doc, (0, lodash_1.setWith)({}, path.field, data, Object), { mergeFields: [path.field] });
};
exports.baseUpdate = baseUpdate;
