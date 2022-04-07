"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImage = void 0;
const web_1 = require("../web");
const createImage_1 = require("./createImage");
const deleteImage_1 = require("./deleteImage");
const updateImage = async (path, imageData, oldImageName) => {
    if (oldImageName) {
        (0, deleteImage_1.deleteImage)(oldImageName);
    }
    const image = await (0, createImage_1.createImage)(imageData);
    (0, web_1.update)(path, image);
    return image;
};
exports.updateImage = updateImage;
