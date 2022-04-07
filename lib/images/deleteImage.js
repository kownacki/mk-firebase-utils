"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
const storage_1 = require("firebase/storage");
const utils_1 = require("./utils");
const deleteImage = async (imageName) => {
    const imageStorageRef = (0, utils_1.getStorageRef)(`images/${imageName}`);
    return (0, storage_1.deleteObject)(imageStorageRef);
};
exports.deleteImage = deleteImage;
