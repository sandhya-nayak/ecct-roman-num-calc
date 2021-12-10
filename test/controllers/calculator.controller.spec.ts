import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';
import { Errors } from 'typescript-rest';
import {CalculatorApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockCalculatorService implements CalculatorApi {
  calc = jest.fn().mockName('calc');
}

describe('calculator.controller', () => {

  let app: Application;
  let mockCalc: jest.Mock;

  beforeAll(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    Container.bind(CalculatorApi).scope(Scope.Singleton).to(MockCalculatorService);

    const mockService: CalculatorApi = Container.get(CalculatorApi);
    mockCalc = mockService.calc as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given /add', () => {
    describe('When checking for valid input', () => {
      const input = 'X,IV,XVI';
      const output = 'XXX';

      beforeEach(() => {
        mockCalc.mockResolvedValueOnce(output);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`add(${input}) should make a call to calc with add and ${input}, and return correct calculated value ${output}`, async() => {
        await request(app)
            .get('/add')
            .query({operands: input})
            .expect(200);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("add");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When checking for invalid input', () => {
      const input = 'XIIIIX,III,II';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.BadRequestError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      test(`add(${input}) should make a call to calc with add and throw Bad Request Error, `, async() => {
        await request(app)
            .get('/add')
            .query({operands: input})
            .expect(400);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("add");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When calculated value is invalid', () => {
      const input = 'MMMCMXCIX,MMMCMXCIX';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.NotImplementedError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`add(input) throws Not Implemented Error, `, async() => {
        await request(app)
            .get('/add')
            .query({operands: input})
            .expect(501);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("add");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When any other error is thrown', () => {
      const input = 'some input';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Error();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`add(input) throws Internal Server Error, `, async() => {
        await request(app)
            .get('/add')
            .query({operands: input})
            .expect(500);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("add");
        expect(calls[0][1]).toBe(input);
      });
    });
  });

  describe('Given /sub', () => {
    describe('When checking for valid input', () => {
      const input = 'XVI,X,IV';
      const output = 'II';

      beforeEach(() => {
        mockCalc.mockResolvedValueOnce(output);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`sub(${input}) should make a call to calc with sub and ${input}, and return correct calculated value ${output}`, async() => {
        await request(app)
            .get('/sub')
            .query({operands: input})
            .expect(200);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("sub");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When checking for invalid input', () => {
      const input = 'XIIIIX,III,II';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.BadRequestError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      test(`sub(${input}) should make a call to calc with sub and throw Bad Request Error, `, async() => {
        await request(app)
            .get('/sub')
            .query({operands: input})
            .expect(400);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("sub");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When calculated value is invalid', () => {
      const input = 'X,MMMCMXCIX';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.NotImplementedError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`sub(input) throws Not Implemented Error, `, async() => {
        await request(app)
            .get('/sub')
            .query({operands: input})
            .expect(501);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("sub");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When any other error is thrown', () => {
      const input = 'some input';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Error();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`sub(input) throws Internal Server Error, `, async() => {
        await request(app)
            .get('/sub')
            .query({operands: input})
            .expect(500);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("sub");
        expect(calls[0][1]).toBe(input);
      });
    });
  });

  describe('Given /mult', () => {
    describe('When checking for valid input', () => {
      const input = 'X,IV,XVI';
      const output = 'DCXL';

      beforeEach(() => {
        mockCalc.mockResolvedValueOnce(output);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`mult(${input}) should make a call to calc with mult and ${input}, and return correct calculated value ${output}`, async() => {
        await request(app)
            .get('/mult')
            .query({operands: input})
            .expect(200);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("mult");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When checking for invalid input', () => {
      const input = 'XIIIIX,III,II';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.BadRequestError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      test(`mult(${input}) should make a call to calc with mult and throw Bad Request Error, `, async() => {
        await request(app)
            .get('/mult')
            .query({operands: input})
            .expect(400);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("mult");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When calculated value is invalid', () => {
      const input = 'X,MMMCMXCIX';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Errors.NotImplementedError();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`mult(input) throws Not Implemented Error, `, async() => {
        await request(app)
            .get('/mult')
            .query({operands: input})
            .expect(501);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("mult");
        expect(calls[0][1]).toBe(input);
      });
    });

    describe('When any other error is thrown', () => {
      const input = 'some input';
  
      beforeEach(() => {
        mockCalc.mockImplementationOnce(() => {
          throw new Error();
        });
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`mult(input) throws Internal Server Error, `, async() => {
        await request(app)
            .get('/mult')
            .query({operands: input})
            .expect(500);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("mult");
        expect(calls[0][1]).toBe(input);
      });
    });
  });

  describe('Given /div', () => {
    describe('When checking for valid input', () => {
      const input = 'LX,III,II';
      const output = 'X';

      beforeEach(() => {
        mockCalc.mockResolvedValueOnce(output);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test(`div(${input}) should make a call to calc with div and ${input}, and return correct calculated value ${output}`, async() => {
        await request(app)
            .get('/div')
            .query({operands: input})
            .expect(200);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("div");
        expect(calls[0][1]).toBe(input);
      });
    });
  });

  describe('When checking for invalid input', () => {
    const input = 'XIIIIX,III,II';

    beforeEach(() => {
      mockCalc.mockImplementationOnce(() => {
        throw new Errors.BadRequestError();
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test(`div(${input}) should make a call to calc with div and throw Bad Request Error, `, async() => {
      await request(app)
          .get('/div')
          .query({operands: input})
          .expect(400);
      
      const calls = mockCalc.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toMatch("div");
      expect(calls[0][1]).toBe(input);
    });
  });

  describe('When calculated value is invalid', () => {
    const input = 'X,MMMCMXCIX';

    beforeEach(() => {
      mockCalc.mockImplementationOnce(() => {
        throw new Errors.NotImplementedError();
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test(`div(input) throws Not Implemented Error, `, async() => {
      await request(app)
          .get('/div')
          .query({operands: input})
          .expect(501);
      
      const calls = mockCalc.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toMatch("div");
      expect(calls[0][1]).toBe(input);
    });
  });

  describe('When any other error is thrown', () => {
    const input = 'some input';

    beforeEach(() => {
      mockCalc.mockImplementationOnce(() => {
        throw new Error();
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test(`div(input) throws Internal Server Error, `, async() => {
      await request(app)
          .get('/div')
          .query({operands: input})
          .expect(500);
      
      const calls = mockCalc.mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toMatch("div");
      expect(calls[0][1]).toBe(input);
    });
  });
});