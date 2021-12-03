import {Path} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {CalculatorApi} from '../services';
import {LoggerApi} from '../logger';

@Path('/')
export class CalculatorController {

  @Inject
  service: CalculatorApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child('CalculatorController');
  }

}
