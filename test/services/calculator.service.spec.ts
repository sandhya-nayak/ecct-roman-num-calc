import {Container, Scope} from 'typescript-ioc';

import {CalculatorService, ConverterApi} from '../../src/services';
import { BadRequestError, NotImplementedError } from 'typescript-rest/dist/server/model/errors';

class MockConverterService implements ConverterApi {
  toNumber = jest.fn().mockName('toNumber');
  toRoman = jest.fn().mockName('toRoman');
  getURL = jest.fn().mockName('getURL');
  toNumberMethod = "to-number";
  toRomanMethod = "to-roman";
}

describe('Calculator service', () =>{

  let service: CalculatorService;
  let mockToNumber: jest.Mock;
  let mockToRoman: jest.Mock;

  beforeAll(() => {
    service = Container.get(CalculatorService);
    Container.bind(ConverterApi).scope(Scope.Singleton).to(MockConverterService);
    service.converter = Container.get(ConverterApi);
    mockToNumber = service.converter.toNumber as jest.Mock;
    mockToRoman = service.converter.toRoman as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  
  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given calc with add', () => {
    const methodName = "add";
    test(`calc(${methodName},"I, IV, X,XX") should calculate the result as 35 and return XXXV`, async () => {
      const operands = "I, IV, X,XX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [1,4,10,20], toRomanInput = 35, toRomanOutput = "XXXV";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toBe(toRomanOutput);
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      const toNumberInput = operands, toNumberOutput = 20, toRomanInput = 20, toRomanOutput = "XX";

      mockToNumber.mockResolvedValueOnce(toNumberOutput);
      mockToRoman.mockResolvedValueOnce(toRomanOutput);

      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      expect(toNumberCalls[0][0]).toBe(toNumberInput);

      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toBe(toRomanOutput);
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
    });

    test(`calc(${methodName},"I,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [1,3999];
      
      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      
      mockToNumber.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(operands);
    });

    test(`calc(${methodName},"xIii,xI,x") should calculate the result as 34 and return XXXIV`, async () => {
      const operands = "xIii,xI,x";
      const toNumberInputs = operands.split(","), toNumberOutputs = [13,11,10], toRomanInput = 34, toRomanOutput = "XXXIV";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toBe(toRomanOutput);
    });
  });

  describe('Given calc with sub', () => {
    const methodName = "sub";
    test(`calc(${methodName},"L, III, X, VI, I,IX") should calculate the result as 21 and return XXI`, async () => {
      const operands = "L, III, X, VI, I,IX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [50,3,10,6,1,9], toRomanInput = 21, toRomanOutput = "XXI";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      const toNumberInput = operands, toNumberOutput = 20, toRomanInput = 20, toRomanOutput = "XX";

      mockToNumber.mockResolvedValueOnce(toNumberOutput);
      mockToRoman.mockResolvedValueOnce(toRomanOutput);

      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      expect(toNumberCalls[0][0]).toBe(toNumberInput);

      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
    });

    test(`calc(${methodName},"I,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "I,MMMCMXCIX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [1,3999];
      
      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      
      mockToNumber.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(operands);
    });

    test(`calc(${methodName},"xIii,xI,i") should calculate the result as 1 and return I`, async () => {
      const operands = "xIii,xI,i";
      const toNumberInputs = operands.split(","), toNumberOutputs = [13,11,1], toRomanInput = 1, toRomanOutput = "I";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });
  });

  describe('Given calc with mult', () => {
    const methodName = "mult";
    test(`calc(${methodName},"I, II, III, IV,V") should calculate the result as 120 and return CXX`, async () => {
      const operands = "I, II, III, IV,V";
      const toNumberInputs = operands.split(","), toNumberOutputs = [1,2,3,4,5], toRomanInput = 120, toRomanOutput = "CXX";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      const toNumberInput = operands, toNumberOutput = 20, toRomanInput = 20, toRomanOutput = "XX";

      mockToNumber.mockResolvedValueOnce(toNumberOutput);
      mockToRoman.mockResolvedValueOnce(toRomanOutput);

      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      expect(toNumberCalls[0][0]).toBe(toNumberInput);

      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
    });

    test(`calc(${methodName},"II,MMMCMXCIX") should throw Not Implemented Error`, async () => {
      const operands = "II,MMMCMXCIX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [2,3999];
      
      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));

      await expect(service.calc(methodName,operands)).rejects.toThrow(NotImplementedError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";

      mockToNumber.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(operands);
    });

    test(`calc(${methodName},"xIii,xI,i") should calculate the result as 143 and return CXLIII`, async () => {
      const operands = "xIii,xI,i";
      const toNumberInputs = operands.split(","), toNumberOutputs = [13,11,1], toRomanInput = 143, toRomanOutput = "CXLIII";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });
  });

  describe('Given calc with div', () => {
    const methodName = "div";
    test(`calc(${methodName},"LX, III, II") should calculate the result as 10 and return X`, async () => {
      const operands = "LX, III, II";
      const toNumberInputs = operands.split(","), toNumberOutputs = [60,3,2], toRomanInput = 10, toRomanOutput = "X";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      mockToRoman.mockResolvedValueOnce(toRomanOutput);
      
      const receivedOutput = await service.calc(methodName,operands);
    
      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"XX") should return XX`, async () => {
      const operands = "XX";
      const toNumberInput = operands, toNumberOutput = 20, toRomanInput = 20, toRomanOutput = "XX";

      mockToNumber.mockResolvedValueOnce(toNumberOutput);
      mockToRoman.mockResolvedValueOnce(toRomanOutput);

      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      expect(toNumberCalls[0][0]).toBe(toNumberInput);

      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(1);
      expect(toRomanCalls[0][0]).toBe(toRomanInput);

      expect(receivedOutput).toEqual(toRomanOutput);
    });

    test(`calc(${methodName},"") should throw Bad Request Error`, async () => {
      const operands = "";

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);
    });

    test(`calc(${methodName},"I,MMMCMXCIX") should return (I/MMMCMXCIX)`, async () => {
      const operands = "I,MMMCMXCIX";
      const toNumberInputs = operands.split(","), toNumberOutputs = [1,3999], toRomanInputs = [0,1,3999], toRomanOutputs = ["nulla","I","MMMCMXCIX"], output = "nulla (I/MMMCMXCIX)";
      
      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      toRomanOutputs.forEach(numOutput => mockToRoman.mockResolvedValueOnce(numOutput));

      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);

      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(toRomanInputs.length);
      for(let i=0; i<toRomanCalls.length; i++)
        expect(toRomanCalls[i][0]).toBe(toRomanInputs[i]);
      
      expect(receivedOutput).toEqual(output);
    });

    test(`calc(${methodName},"XIIII") should throw Bad Request Error`, async () => {
      const operands = "XIIII";
      
      mockToNumber.mockImplementationOnce(() => {
        throw new BadRequestError();
      });

      await expect(service.calc(methodName,operands)).rejects.toThrow(BadRequestError);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(1);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(operands);
    });

    test(`calc(${methodName},"xIi,V,II") should return I (II/V)`, async () => {
      const operands = "xIi,V,II";
      const toNumberInputs = operands.split(","), toNumberOutputs = [12,5,2], toRomanInputs = [1,2,5], toRomanOutputs = ["I", "II", "V"], output = "I (II/V)";

      toNumberOutputs.forEach(numOutput => mockToNumber.mockResolvedValueOnce(numOutput));
      toRomanOutputs.forEach(numOutput => mockToRoman.mockResolvedValueOnce(numOutput));
      
      const receivedOutput = await service.calc(methodName,operands);

      const toNumberCalls = mockToNumber.mock.calls;
      expect(toNumberCalls.length).toBe(toNumberInputs.length);
      for(let i=0; i<toNumberCalls.length; i++)
        expect(toNumberCalls[i][0]).toBe(toNumberInputs[i]);
      
      const toRomanCalls = mockToRoman.mock.calls;
      expect(toRomanCalls.length).toBe(toRomanInputs.length);
      for(let i=0; i<toRomanCalls.length; i++)
        expect(toRomanCalls[i][0]).toBe(toRomanInputs[i]);
      
      expect(receivedOutput).toEqual(output);
    });
  });
});