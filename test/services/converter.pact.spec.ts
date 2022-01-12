import {Container} from 'typescript-ioc';
import {ConverterService} from '../../src/services';
import {BadRequestError, InternalServerError} from 'typescript-rest/dist/server/model/errors';
import path from 'path';
import { Pact } from '@pact-foundation/pact';

describe('Converter service', () =>{

  let service: ConverterService;
  let mockProvider: Pact;

  beforeAll(async() => {
    service = Container.get(ConverterService);

    mockProvider = new Pact({
      port: +process.env.CONVERTER_PORT,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      consumer: 'ecct-roman-num-calc',
      provider: 'ecct-roman-num-conv'
    });

    await mockProvider.setup();

    await Promise.all([
      mockProvider.addInteraction({
        state: 'a request is made',
        uponReceiving: `a /to-roman call with value=0`,
        withRequest: {
          method: 'GET',
          path: '/to-roman',
          query: 'value=0'
        },
        willRespondWith: {
          status: 200,
          body: 'nulla',
        }
      }),

      mockProvider.addInteraction({
        state: 'a request is made',
        uponReceiving: `a /to-roman call with value=579`,
        withRequest: {
          method: 'GET',
          path: '/to-roman',
          query: 'value=579'
        },
        willRespondWith: {
          status: 200,
          body: 'DLXXIX',
        }
      }),

      mockProvider.addInteraction({
        state: 'a request is made',
        uponReceiving: `a /to-roman call with value=3999`,
        withRequest: {
          method: 'GET',
          path: '/to-roman',
          query: 'value=3999'
        },
        willRespondWith: {
          status: 200,
          body: 'MMMCMXCIX',
        }
      })
    ]);
  }, 30000);

  afterEach(async() => {
    jest.clearAllMocks();
  });

  afterAll(async() => {
    await mockProvider.verify().finally(async () => {
      await mockProvider.finalize();
    });
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('the service should handle positive integers between 0 and 3999 inclusive', () => {

    describe('a to-roman call with input 0', () => {
      let input = 0, output = "nulla";
      it('should return nulla',async() => {
        expect(await service.toRoman(input)).toEqual(output);
      });
    });

    describe('a to-roman call with input 579', () => {
      let input = 579, output = "DLXXIX";
      it('should return DLXXIX',async() => {
        expect(await service.toRoman(input)).toEqual(output);
      });
    });

    describe('a to-roman call with input 3999', () => {
      let input = 3999, output = "MMMCMXCIX";
      it('should return MMMCMXCIX',async() => {
        expect(await service.toRoman(input)).toEqual(output);
      });
    });
  });
});