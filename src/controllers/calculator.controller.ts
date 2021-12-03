import {Path, GET, QueryParam} from 'typescript-rest';
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

  @Path('/add')
  @GET
  async add(@QueryParam('operands') operands:string): Promise<object> {
    this.logger.info(`Adding ${operands}`);
    const resp = await this.service.calc("add",operands);
    return {value: resp};
  }

  @Path('/sub')
  @GET
  async sub(@QueryParam('operands') operands:string): Promise<object> {
    this.logger.info(`Subtracting ${operands}`);
    const resp = await this.service.calc("sub",operands);
    return {value: resp};
  }

  @Path('/mult')
  @GET
  async mult(@QueryParam('operands') operands:string): Promise<object> {
    this.logger.info(`Multiplying ${operands}`);
    const resp = await this.service.calc("mult",operands);
    return {value: resp};
  }
}
