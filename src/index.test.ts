/**
 * @jest-environment jsdom
 */
import _, {padStart, set} from 'lodash';
import {Path, createPath, isRootPath, generateUid, getGet, getUpdate, DocumentSnapshot} from './index';

const fakeNow = 123456;
const fakeRandomResult = 42424242;

jest.spyOn(global.Date, 'now').mockReturnValue(fakeNow);
jest.mock('lodash', () => {
  return {
    ...(jest.requireActual('lodash') as object),
    random: jest.fn(),
  };
});
(_.random as jest.Mock).mockReturnValue(fakeRandomResult);

describe('firebaseUtils', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Path', () => {
    describe('Creating with createPath', () => {
      it('Creates path with doc and field provided', () => {
        const path = createPath('doc-part', 'field-part');
        expect(path).toBeInstanceOf(Path);
        expect(path).toEqual({doc: 'doc-part', field: 'field-part'});
      });

      it('Creates path with only doc provided', () => {
        const path = createPath('doc-part');
        expect(path).toEqual({doc: 'doc-part'});
      });

      it('Creates path with empty string field but stores it as undefined', () => {
        const path = createPath('doc-part', '');
        expect(path).toEqual({doc: 'doc-part', field: undefined});
      });

      it('Throws if doc is empty', () => {
        expect(() => createPath('')).toThrow(new TypeError('\'doc\' parameter cannot be empty.'));
      });
    });

    describe('.extend', () => {
      it('Extends empty field', () => {
        const path = createPath('doc-part');
        const extension = 'extension1.extension2';
        expect(path.extend(extension)).toEqual({doc: 'doc-part', field: extension});
      });

      it('Doesn\'t extend field with empty extension', () => {
        const field = 'field-part';
        const path = createPath('doc-part', field);
        const extension = '';
        expect(path.extend(extension)).toEqual({doc: 'doc-part', field: field});
      });

      it('Doesn\'t extend field with undefined', () => {
        const field = 'field-part';
        const path = createPath('doc-part', field);
        expect(path.extend(undefined)).toEqual({doc: 'doc-part', field: field});
      });

      it('Doesn\'t extend empty field with empty extension', () => {
        const path = createPath('doc-part');
        expect(path.extend('')).toEqual({doc: 'doc-part', field: undefined});
      });

      it('Doesn\'t extend empty field with undefined', () => {
        const path = createPath('doc-part');
        expect(path.extend(undefined)).toEqual({doc: 'doc-part', field: undefined});
      });

      it('Extends simple field with simple extension', () => {
        const path = createPath('doc-part', 'field-part');
        expect(path.extend('extension')).toEqual({doc: 'doc-part', field: 'field-part.extension'});
      });

      it('Extends simple field with complex extension', () => {
        const path = createPath('doc-part', 'field-part');
        const extension = 'extension1.extension2.extension3';
        expect(path.extend(extension)).toEqual({doc: 'doc-part', field: `field-part.${extension}`});
      });

      it('Extends complex field with simple extension', () => {
        const field = 'field1.field2.field3';
        const path = createPath('doc-part', field);
        expect(path.extend('extension')).toEqual({doc: 'doc-part', field: `${field}.extension`});
      });

      it('Extends complex field with complex extension', () => {
        const field = 'field1.field2.field3';
        const path = createPath('doc-part', field);
        const extension = 'extension1.extension2.extension3';
        expect(path.extend(extension)).toEqual({doc: 'doc-part', field: `${field}.${extension}`});
      });
    });
  });

  describe('isRootPath', () => {
    it('Returns true if field is empty', () => {
      expect(isRootPath(createPath('doc-part'))).toBe(true);
    });

    it('Returns false if field is not empty', () => {
      expect(isRootPath(createPath('doc-part', 'field-part'))).toBe(false);
    });
  });

  describe('generateUid', () => {
    it('Generates uid - no parameters', () => {
      expect(generateUid()).toBe(`${fakeNow}${padStart(String(fakeRandomResult), 9, '0')}`);
    });

    it('Generates uid - with parameter', () => {
      const timestamp = 987654;
      expect(generateUid(timestamp)).toBe(`${timestamp}${padStart(String(fakeRandomResult), 9, '0')}`);
    });
  });

  describe('getGet', () => {
    const createGetDocMock = (dataStub?: any) => {
      const documentSnapshotStub = {
        data: () => dataStub,
      } as unknown as DocumentSnapshot;
      return jest.fn().mockReturnValue(Promise.resolve(documentSnapshotStub));
    }

    it('Generates "get" function', async () => {
      const getDocMock = createGetDocMock();

      const getData = getGet(getDocMock);

      expect(getData).toBeInstanceOf(Function);
    });

    describe('Generated "get" function', () => {
      const createGetDataFixture = (pathStub: Path, docStub?: object) => {
        const getDocMock = createGetDocMock(docStub);
        const getData = getGet(getDocMock);
        return {
          pathStub,
          docStub,
          getDocMock,
          getData,
        }
      }

      type GetDataFixture = ReturnType<typeof createGetDataFixture>;

      const expectGetDataToHaveCalledGetDocMock = (getGetFixture: GetDataFixture) => {
        expect(getGetFixture.getDocMock).toBeCalledWith(getGetFixture.pathStub.doc);
      }

      it('Gets data - root path', async () => {
        const pathStub = createPath('doc-part');
        const dataStub = {};
        const getDataFixture = createGetDataFixture(pathStub, dataStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toBe(dataStub);
      });

      it('Gets data - root level field', async () => {
        const field = 'simple-field';
        const pathStub = createPath('doc-part', field);
        const dataStub = {};
        const docStub = {[field]: dataStub};
        const getDataFixture = createGetDataFixture(pathStub, docStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toBe(dataStub);
      });

      it('Gets data - complex field', async () => {
        const field = 'field1.field2.field3';
        const pathStub = createPath('doc-part', field);
        const dataStub = {};
        const docStub = set({}, field, dataStub);
        const getDataFixture = createGetDataFixture(pathStub, docStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toBe(dataStub);
      });

      it('Gets data - doc doesn\'t exist - root path', async () => {
        const pathStub = createPath('doc-part');
        const docStub = undefined;
        const getDataFixture = createGetDataFixture(pathStub, docStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toEqual({});
      });

      it('Gets data - doc exists but data doesn\'t exist', async () => {
        const field = 'field1.field2.field3';
        const pathStub = createPath('doc-part', field);
        const docStub = {field1: {}};
        const getDataFixture = createGetDataFixture(pathStub, docStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toBeUndefined();
      });

      it('Gets data - doc doesn\'t exist - complex path', async () => {
        const field = 'field1.field2.field3';
        const pathStub = createPath('doc-part', field);
        const docStub = undefined;
        const getDataFixture = createGetDataFixture(pathStub, docStub)

        const getDataResult = await getDataFixture.getData(pathStub);

        expectGetDataToHaveCalledGetDocMock(getDataFixture);
        expect(getDataResult).toBeUndefined();
      });
    });
  });

  describe('getUpdate', () => {
    const createSetDocMock = () => {
      return jest.fn().mockReturnValue(Promise.resolve());
    }

    it('Generates "update" function', async () => {
      const setDocMock = createSetDocMock();

      const updateData = getUpdate(setDocMock);

      expect(updateData).toBeInstanceOf(Function);
    });

    describe('Generated "update" function', () => {
      const createUpdateDataFixture = () => {
        const setDocMock = createSetDocMock().mockReturnValue(Promise.resolve());
        const updateData = getUpdate(setDocMock);
        return {
          setDocMock,
          updateData,
        }
      }

      it('Updates data - root path', async () => {
        const pathStub = createPath('doc-part');
        const dataStub = {data: 'data'};
        const updateDataFixture = createUpdateDataFixture();

        await updateDataFixture.updateData(pathStub, dataStub);

        expect(updateDataFixture.setDocMock).toBeCalledWith(pathStub.doc, dataStub);
      });

      it('Updates data - root level field', async () => {
        const field = 'simple-field';
        const pathStub = createPath('doc-part', field);
        const dataStub = {data: 'data'};
        const updateDataFixture = createUpdateDataFixture();

        await updateDataFixture.updateData(pathStub, dataStub);

        expect(updateDataFixture.setDocMock).toBeCalledWith(pathStub.doc, {[field]: dataStub}, {mergeFields: [pathStub.field]});
      });

      it('Updates data - complex field', async () => {
        const field = 'field1.field2.field3';
        const pathStub = createPath('doc-part', field);
        const dataStub = {data: 'data'};
        const updateDataFixture = createUpdateDataFixture();

        await updateDataFixture.updateData(pathStub, dataStub);

        expect(updateDataFixture.setDocMock).toBeCalledWith(pathStub.doc, set({}, field, dataStub), {mergeFields: [pathStub.field]});
      });
    });
  });
});
