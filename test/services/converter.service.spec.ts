import {Container} from 'typescript-ioc';
import {ConverterService} from '../../src/services';
import axios from 'axios';
import {BadRequestError, InternalServerError} from 'typescript-rest/dist/server/model/errors';

jest.mock('axios');
let mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Converter service', () =>{

  let service: ConverterService;

  beforeAll(() => {
    service = Container.get(ConverterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('toNumber', () => {
    test(`toNumber() should make 1 call and return response when called with valid input`, async () => {
      const input = "XX", output = 20;

      mockedAxios.get.mockResolvedValueOnce({data: output});
      
      expect(await service.toNumber(input)).toEqual(output);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,input));
    });

    // test(`toNumber() should make 1 call and throw Bad Request Error when called with invalid input`, async () => {
    //   const input = "IXX";
      
    //   mockedAxios.get.mockImplementationOnce(() => {
    //     throw new BadRequestError("Invalid input");
    //   });
      
    //   await expect(service.toNumber(input)).rejects.toThrow(BadRequestError);

    //   const calls = mockedAxios.get.mock.calls;
    //   expect(calls.length).toBe(1);
    //   expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,input));
    // });
    
    test(`toNumber() should throw Internal Server Error when not a valid response or Bad Request Error`, async () => {
      const input = "";
      
      mockedAxios.get.mockImplementationOnce(() => {
        throw new Error();
      });
      
      await expect(service.toNumber(input)).rejects.toThrow(InternalServerError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toNumberMethod,input));
    });
  });

  describe('toRoman', () => {
    test(`toRoman() should make 1 call and return response when called with valid input`, async () => {
      const input = 20, output = "XX";
      
      mockedAxios.get.mockResolvedValueOnce({data: output});
      
      expect(await service.toRoman(input)).toEqual(output);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toRomanMethod,input));
    });

    // test(`toRoman() should make 1 call and throw Bad Request Error when called with invalid input`, async () => {
    //   const input = -5;
      
    //   mockedAxios.get.mockImplementationOnce(() => {
    //     throw new BadRequestError("Invalid input");
    //   });
      
    //   await expect(service.toRoman(input)).rejects.toThrow(BadRequestError);

    //   const calls = mockedAxios.get.mock.calls;
    //   expect(calls.length).toBe(1);
    //   expect(calls[0][0]).toBe(service.getURL(service.toRomanMethod,input));
    // });

    test(`toRoman() should throw Internal Server Error when not a valid response or Bad Request Error`, async () => {
      const input = 1.5;
      
      mockedAxios.get.mockImplementationOnce(() => {
        throw new Error();
      });
      
      await expect(service.toRoman(input)).rejects.toThrow(InternalServerError);

      const calls = mockedAxios.get.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(service.getURL(service.toRomanMethod,input));
    });
  });
});
