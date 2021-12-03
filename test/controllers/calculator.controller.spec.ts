import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';

import {CalculatorApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockCalculatorService implements CalculatorApi {
  add = jest.fn().mockName('add');
}

describe('calculator.controller', () => {

  let app: Application;
  let mockAdd: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    Container.bind(CalculatorApi).scope(Scope.Singleton).to(MockCalculatorService);

    const mockService: CalculatorApi = Container.get(CalculatorApi);
    mockAdd = mockService.add as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

});
