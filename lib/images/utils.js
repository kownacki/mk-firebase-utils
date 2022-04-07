"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.getStorageRef = void 0;
const storage_1 = require("firebase/storage");
const getStorageRef = (storagePath) => (0, storage_1.ref)((0, storage_1.getStorage)(), storagePath);
exports.getStorageRef = getStorageRef;
const uploadImage = async (imageStorageRef, imageData) => {
    await (0, storage_1.uploadBytes)(imageStorageRef, imageData);
    return await (0, storage_1.getDownloadURL)(imageStorageRef);
};
exports.uploadImage = uploadImage;
