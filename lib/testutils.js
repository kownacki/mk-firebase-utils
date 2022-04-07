"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirebaseStorageMock = void 0;
const createFirebaseStorageMock = () => {
    const storageInstanceMock = { app: 'app-stub' };
    const fakeRef = { 'fake-ref': 'fake-ref' };
    const fakeDownloadUrl = 'download-url';
    return {
        getStorage: jest.fn().mockReturnValue(storageInstanceMock),
        ref: jest.fn().mockReturnValue(fakeRef),
        getDownloadURL: jest.fn().mockReturnValue(Promise.resolve(fakeDownloadUrl)),
        uploadBytes: jest.fn().mockReturnValue(Promise.resolve()),
        deleteObject: jest.fn().mockReturnValue(Promise.resolve()),
        storageInstanceMock,
        fakeRef,
        fakeDownloadUrl,
    };
};
exports.createFirebaseStorageMock = createFirebaseStorageMock;
