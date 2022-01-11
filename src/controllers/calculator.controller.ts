import {Path, GET, QueryParam, Errors} from 'typescript-rest';
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
  async add(@QueryParam('operands') operands:string): Promise<string> {
    this.logger.info(`Adding ${operands}`);
    try{
      const resp = await this.service.calc("add",operands);
      return resp;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new Errors.BadRequestError();
      if (err.statusCode === 501) throw new Errors.NotImplementedError();
      throw new Errors.InternalServerError();
    }
  }

  @Path('/sub')
  @GET
  async sub(@QueryParam('operands') operands:string): Promise<string> {
    this.logger.info(`Subtracting ${operands}`);
    try{
      const resp = await this.service.calc("sub",operands);
      return resp;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new Errors.BadRequestError();
      if (err.statusCode === 501) throw new Errors.NotImplementedError();
      throw new Errors.InternalServerError();
    }
  }

  @Path('/mult')
  @GET
  async mult(@QueryParam('operands') operands:string): Promise<string> {
    this.logger.info(`Multiplying ${operands}`);
    try{
      const resp = await this.service.calc("mult",operands);
      return resp;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new Errors.BadRequestError();
      if (err.statusCode === 501) throw new Errors.NotImplementedError();
      throw new Errors.InternalServerError();
    }
  }

  @Path('/div')
  @GET
  async div(@QueryParam('operands') operands:string): Promise<string> {
    this.logger.info(`Dividing ${operands}`);
    try{
      const resp = await this.service.calc("div",operands);
      return resp;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new Errors.BadRequestError();
      if (err.statusCode === 501) throw new Errors.NotImplementedError();
      throw new Errors.InternalServerError();
    }
  }
}
