import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';
import {CalculatorApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockCalculatorService implements CalculatorApi {
  calc = jest.fn().mockName('calc');
}

describe('calculator.controller', () => {

  let app: Application;
  let mockCalc: jest.Mock;

  beforeEach(() => {
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
            .get('/add/')
            .query({operands: input})
            .expect(200);
        
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
            .get('/sub/')
            .query({operands: input})
            .expect(200);
        
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
            .get('/mult/')
            .query({operands: input})
            .expect(200);
        
        const calls = mockCalc.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toMatch("mult");
        expect(calls[0][1]).toBe(input);
      });
    });
  });
});
