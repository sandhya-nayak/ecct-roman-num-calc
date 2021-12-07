import {Container} from 'typescript-ioc';

import {CalculatorService, ConverterService} from '../../src/services';
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
    service.converter = Container.get(ConverterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given calc with add', () => {
    const methodName = "add";
    test(`calc(${methodName},"I, IV, X,XX") should calculate the result as 35 and return XXXV`, async () => {
      const operands = "I, IV, X,XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 4}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXXV"}});

      expect(await service.calc(methodName,operands)).toEqual("XXXV");
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(5);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'I'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'IV'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'X'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XX'));
      expect(calls[4][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'35'));
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XX"}});

      expect(await service.calc(methodName,operands)).toEqual("XX");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XX'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'20'));
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(0);
    });

    test(`calc(${methodName},"I,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3999}});

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'I'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'MMMCMXCIX'));
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      mockedAxios.get.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XIIII'));
    });

    test(`calc(${methodName},"xIii,xI,x") should calculate the result as 34 and return XXXIV`, async () => {
      const operands = "xIii,xI,x";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 13}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 11}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXXIV"}});

      expect(await service.calc(methodName,operands)).toEqual("XXXIV");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(4);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xIii'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xI'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'x'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'34'));
    });
  });

  describe('Given calc with sub', () => {
    const methodName = "sub";
    test(`calc(${methodName},"L, III, X, VI, I,IX") should calculate the result as 21 and return XXI`, async () => {
      const operands = "L, III, X, VI, I,IX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 50}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 10}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 6}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 9}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XXI"}});

      expect(await service.calc(methodName,operands)).toEqual("XXI");
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(7);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'L'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'III'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'X'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'VI'));
      expect(calls[4][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'I'));
      expect(calls[5][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'IX'));
      expect(calls[6][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'21'));
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XX"}});

      expect(await service.calc(methodName,operands)).toEqual("XX");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XX'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'20'));
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(0);
    });

    test(`calc(${methodName},"I,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3999}});

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'I'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'MMMCMXCIX'));
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      mockedAxios.get.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XIIII'));
    });

    test(`calc(${methodName},"xIii,xI,i") should calculate the result as 1 and return I`, async () => {
      const operands = "xIii,xI,i";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 13}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 11}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "I"}});

      expect(await service.calc(methodName,operands)).toEqual("I");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(4);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xIii'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xI'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'i'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'1'));
    });
  });

  describe('Given calc with mult', () => {
    const methodName = "mult";
    test(`calc(${methodName},"I, II, III, IV,V") should calculate the result as 120 and return CXX`, async () => {
      const operands = "I, II, III, IV,V";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 2}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 4}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 5}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "CXX"}});

      expect(await service.calc(methodName,operands)).toEqual("CXX");
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(6);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'I'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'II'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'III'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'IV'));
      expect(calls[4][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'V'));
      expect(calls[5][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'120'));
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 20}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "XX"}});

      expect(await service.calc(methodName,operands)).toEqual("XX");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XX'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'20'));
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(0);
    });

    test(`calc(${methodName},"II,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "II,MMMCMXCIX";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 2}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 3999}});

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(2);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'II'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'MMMCMXCIX'));
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      mockedAxios.get.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
      
      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'XIIII'));
    });

    test(`calc(${methodName},"xIii,xI,i") should calculate the result as 143 and return CXLIII`, async () => {
      const operands = "xIii,xI,i";
      mockedAxios.get.mockResolvedValueOnce({data: {value: 13}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 11}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: 1}});
      mockedAxios.get.mockResolvedValueOnce({data: {value: "CXLIII"}});

      expect(await service.calc(methodName,operands)).toEqual("CXLIII");

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(4);
      expect(calls[0][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xIii'));
      expect(calls[1][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'xI'));
      expect(calls[2][0]).toBe(service.converter.getURL(service.converter.toNumberMethod,'i'));
      expect(calls[3][0]).toBe(service.converter.getURL(service.converter.toRomanMethod,'143'));
    });
  });
});
