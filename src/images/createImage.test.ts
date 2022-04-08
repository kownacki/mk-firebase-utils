/**
 * @jest-environment jsdom
 */
import firebaseStorage from 'firebase/storage';
import Mime from 'mime/Mime';
import {generateUid} from '../common';
import '../mime.min.js';
import {createFirebaseStorageMock} from '../testutils';
import {createImage} from './createImage';
import {Image, ImageData} from './types';

const fakeGeneratedUid = 'generated-uid';

jest.mock('firebase/storage', () => ({}));
const firebaseStorageMock = createFirebaseStorageMock();
Object.assign(firebaseStorage, firebaseStorageMock);

jest.mock('../common', () => {
  return {
    generateUid: jest.fn(),
  };
});
(generateUid as jest.Mock).mockReturnValue(fakeGeneratedUid);

jest.mock('../mime.min.js', () => {
  window.mime = {
    getExtension: jest.fn(),
  } as unknown as Mime;
});

describe('createImage', () => {
  afterAll(() => {
    jest.restoreAllMocks();
    delete (window as {mime?: Mime}).mime;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createCreateImageFixture = (imageDataStub: ImageData, extension: string | null) => {
    (window.mime.getExtension as jest.Mock).mockReturnValue(extension);
    const expectedGeneratedName = `${fakeGeneratedUid}${extension ? `.${extension}` : ''}`;

    return {
      imageDataStub,
      expectedGeneratedName,
    }
  }

  type CreateImageFixture = ReturnType<typeof createCreateImageFixture>;

  const expectCorrectImageCreation = (fixture: CreateImageFixture, resultImage: Image) => {
    expect((window.mime as Mime).getExtension).toBeCalledWith(fixture.imageDataStub.type);
    expect(generateUid).toBeCalled();
    expect(firebaseStorageMock.ref).toBeCalledWith(firebaseStorageMock.storageInstanceMock, `images/${fixture.expectedGeneratedName}`);
    expect(firebaseStorageMock.uploadBytes).toBeCalledWith(firebaseStorageMock.fakeRef, fixture.imageDataStub);
    expect(firebaseStorageMock.getDownloadURL).toBeCalledWith(firebaseStorageMock.fakeRef);
    expect(resultImage).toEqual({name: fixture.expectedGeneratedName, url: firebaseStorageMock.fakeDownloadUrl});
  }

  it('Creates image', async () => {
    const fakeExtension = 'extension-stub';
    const imageDataStub = {type: 'stub-type'} as ImageData;
    const fixture = createCreateImageFixture(imageDataStub, fakeExtension);

    const resultImage = await createImage(imageDataStub);

    expectCorrectImageCreation(fixture, resultImage);
  });

  it('Creates image - no extension', async () => {
    const fakeExtension = null;
    const imageDataStub = {type: 'stub-type'} as ImageData;
    const fixture = createCreateImageFixture(imageDataStub, fakeExtension);

    const resultImage = await createImage(imageDataStub);

    expectCorrectImageCreation(fixture, resultImage);
  });
});
