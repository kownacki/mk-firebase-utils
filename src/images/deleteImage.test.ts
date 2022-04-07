/**
 * @jest-environment jsdom
 */
import firebaseStorage from 'firebase/storage';
import {createFirebaseStorageMock} from '../testutils';
import {deleteImage} from './deleteImage';

jest.mock('firebase/storage', () => ({}));
const firebaseStorageMock = createFirebaseStorageMock();
Object.assign(firebaseStorage, firebaseStorageMock);

describe('deleteImage', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deletes image', async () => {
    const imageNameStub = 'image-name-stub';

    await deleteImage(imageNameStub);

    expect(firebaseStorageMock.ref).toBeCalledWith(firebaseStorageMock.storageInstanceMock, `images/${imageNameStub}`);
    expect(firebaseStorageMock.deleteObject).toBeCalledWith(firebaseStorageMock.fakeRef);
  });
});
