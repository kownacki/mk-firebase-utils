/// <reference types="jest" />
export declare const createFirebaseStorageMock: () => {
    getStorage: jest.Mock<any, any>;
    ref: jest.Mock<any, any>;
    getDownloadURL: jest.Mock<any, any>;
    uploadBytes: jest.Mock<any, any>;
    deleteObject: jest.Mock<any, any>;
    storageInstanceMock: {
        app: string;
    };
    fakeRef: {
        'fake-ref': string;
    };
    fakeDownloadUrl: string;
};
export declare type FirebaseStorageMock = ReturnType<typeof createFirebaseStorageMock>;
