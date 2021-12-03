import {Container} from 'typescript-ioc';

import {CalculatorService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';
import axios from 'axios';
import { BadRequestError, NotImplementedError } from 'typescript-rest/dist/server/model/errors';

jest.mock('axios');
let mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Calculator service', () =>{

  let app: ApiServer;
  let service: CalculatorService;

  beforeAll(() => {
    app = buildApiServer();
    service = Container.get(CalculatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given add()', () => {
    test(`add(I, IV, X,XX) should calculate the result as 35 and return XXXV`, async () => {
      const operands = "I, IV, X,XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 4}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXXV"}});

      expect(await service.add(operands)).toEqual("XXXV");
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(5);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'I'));
      expect(calls[1][0]).toBe(service.getURL(service.toNumberMethod,'IV'));
      expect(calls[2][0]).toBe(service.getURL(service.toNumberMethod,'X'));
      expect(calls[3][0]).toBe(service.getURL(service.toNumberMethod,'XX'));
      expect(calls[4][0]).toBe(service.getURL(service.toRomanMethod,'35'));
    });

    test(`add(XX) should return XX`, async () => {
      const operands = "XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XX"}});
      expect(await service.add(operands)).toEqual("XX");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'XX'));
      expect(calls[1][0]).toBe(service.getURL(service.toRomanMethod,'20'));
    });

    test(`add() should throw Bad Request Error`, async () => {
      const operands = "";
      await expect(service.add(operands)).rejects.toThrow(BadRequestError);
    });

    test(`add(I,MMMCMXCIX) should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3999}});
      await expect(service.add(operands)).rejects.toThrow(NotImplementedError);
    });

    test('add(XIIII) should throw Bad Request Error', async () => {
      const operands = "XIIII";
      mockedAxios.get.mockImplementationOnce(() => {
        throw new BadRequestError();
      });
      await expect(service.add(operands)).rejects.toThrow(BadRequestError);
      const calls = mockedAxios.get.mock.calls;

      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'XIIII'));
    });

    test('add(xIii,xI,x) should calculate the result as 34 and return XXXIV', async () => {
      const operands = "xIii,xI,x";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 13}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 11}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXXIV"}});
      expect(await service.add(operands)).toEqual("XXXIV");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(4);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'xIii'));
      expect(calls[1][0]).toBe(service.getURL(service.toNumberMethod,'xI'));
      expect(calls[2][0]).toBe(service.getURL(service.toNumberMethod,'x'));
      expect(calls[3][0]).toBe(service.getURL(service.toRomanMethod,'34'));
    });
  });

  describe('Given sub()', () => {
    test(`sub(L, III, X, VI, I,IX) should calculate the result as 21 and return XXI`, async () => {
      const operands = "L, III, X, VI, I,IX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 50}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 6}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 9}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXI"}});

      expect(await service.sub(operands)).toEqual("XXI");
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(7);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'L'));
      expect(calls[1][0]).toBe(service.getURL(service.toNumberMethod,'III'));
      expect(calls[2][0]).toBe(service.getURL(service.toNumberMethod,'X'));
      expect(calls[3][0]).toBe(service.getURL(service.toNumberMethod,'VI'));
      expect(calls[4][0]).toBe(service.getURL(service.toNumberMethod,'I'));
      expect(calls[5][0]).toBe(service.getURL(service.toNumberMethod,'IX'));
      expect(calls[6][0]).toBe(service.getURL(service.toRomanMethod,'21'));
    });

    test(`sub(XX) should return XX`, async () => {
      const operands = "XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XX"}});
      expect(await service.sub(operands)).toEqual("XX");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'XX'));
      expect(calls[1][0]).toBe(service.getURL(service.toRomanMethod,'20'));
    });

    test(`sub() should throw Bad Request Error`, async () => {
      const operands = "";
      await expect(service.sub(operands)).rejects.toThrow(BadRequestError);
    });

    test(`sub(I,MMMCMXCIX) should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3999}});
      await expect(service.sub(operands)).rejects.toThrow(NotImplementedError);
    });

    test('sub(XIIII) should throw Bad Request Error', async () => {
      const operands = "XIIII";
      mockedAxios.get.mockImplementationOnce(() => {
        throw new BadRequestError();
      });
      await expect(service.sub(operands)).rejects.toThrow(BadRequestError);
      const calls = mockedAxios.get.mock.calls;

      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'XIIII'));
    });

    test('sub(xIii,xI,i) should calculate the result as 1 and return I', async () => {
      const operands = "xIii,xI,i";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 13}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 11}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "I"}});
      expect(await service.sub(operands)).toEqual("I");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(4);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,'xIii'));
      expect(calls[1][0]).toBe(service.getURL(service.toNumberMethod,'xI'));
      expect(calls[2][0]).toBe(service.getURL(service.toNumberMethod,'i'));
      expect(calls[3][0]).toBe(service.getURL(service.toRomanMethod,'1'));
    });
  });
});
