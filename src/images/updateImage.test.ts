/**
 * @jest-environment jsdom
 */
import firebaseStorage from 'firebase/storage';
import {Path} from '../common';
import {createFirebaseStorageMock} from '../testutils';
import {update} from '../web';
import {createImage} from './createImage';
import {deleteImage} from './deleteImage';
import {updateImage} from './updateImage';
import {Image, ImageData} from './types';

const fakeCreatedImage = {name: 'fake-image'} as Image;

jest.mock('firebase/storage', () => ({}));
const firebaseStorageMock = createFirebaseStorageMock();
Object.assign(firebaseStorage, firebaseStorageMock);

jest.mock('../web', () => {
  return {
    update: jest.fn(),
  };
});

jest.mock('./createImage', () => {
  return {
    createImage: jest.fn(),
  };
});
(createImage as jest.Mock).mockReturnValue(fakeCreatedImage);

jest.mock('./deleteImage', () => {
  return {
    deleteImage: jest.fn(),
  };
});

describe('updateImage', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Updates image - old image name provided', async () => {
    const pathStub = {doc: 'doc-stub', field: 'field-stub'} as Path;
    const imageDataStub = {type: 'stub-type'} as ImageData;
    const oldImageNameStub = 'image-name-stub';

    const updateImageResult = await updateImage(pathStub, imageDataStub, oldImageNameStub);

    expect(deleteImage).toBeCalledWith(oldImageNameStub);
    expect(createImage).toBeCalledWith(imageDataStub);
    expect(update).toBeCalledWith(pathStub, fakeCreatedImage);
    expect(updateImageResult).toBe(fakeCreatedImage);
  });

  it('Updates image - no old image', async () => {
    const pathStub = {doc: 'doc-stub', field: 'field-stub'} as Path;
    const imageDataStub = {type: 'stub-type'} as ImageData;

    const updateImageResult = await updateImage(pathStub, imageDataStub);

    expect(deleteImage).not.toBeCalled()
    expect(createImage).toBeCalledWith(imageDataStub);
    expect(update).toBeCalledWith(pathStub, fakeCreatedImage);
    expect(updateImageResult).toBe(fakeCreatedImage);
  });
});
