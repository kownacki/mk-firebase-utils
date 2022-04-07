"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.get = void 0;
const firestore_1 = require("firebase/firestore");
const common_1 = require("./common");
__exportStar(require("./common"), exports);
const getDoc = (docPath) => {
    const docRef = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), docPath);
    return (0, firestore_1.getDoc)(docRef);
};
const get = (path) => {
    return (0, common_1.baseGet)(getDoc, path);
};
exports.get = get;
const setDoc = (docPath, data, options) => {
    const docRef = (0, firestore_1.doc)((0, firestore_1.getFirestore)(), docPath);
    return options ? (0, firestore_1.setDoc)(docRef, data, options) : (0, firestore_1.setDoc)(docRef, data);
};
const update = (path, data) => {
    return (0, common_1.baseUpdate)(setDoc, path, data);
};
exports.update = update;
__exportStar(require("./images"), exports);
