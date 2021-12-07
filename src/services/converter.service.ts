import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import axios, {AxiosResponse} from 'axios';
import {BadRequestError, InternalServerError} from 'typescript-rest/dist/server/model/errors';

export class ConverterService implements ConverterApi {
  logger: LoggerApi;
  baseURL = "https://ecct-roman-num-conv-snyk-roman-num-conv.eco-training-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud/";
  toNumberMethod="to-number";
  toRomanMethod="to-roman";
  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('ConverterService');
  }

  async toNumber(value: string): Promise<number> {
    try {
      const response:AxiosResponse = await axios.get(this.getURL(this.toNumberMethod,value.trim()));
      return response.data.value;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new BadRequestError();
      throw new InternalServerError();
    }
  }
  
  async toRoman(value: number): Promise<string> {
    try{
      const response:AxiosResponse = await axios.get(this.getURL(this.toRomanMethod,value));
      return response.data.value;
    }
    catch(error){
      const err = {...error};
      if (err.statusCode === 400) throw new BadRequestError();
      throw new InternalServerError();
    }
  }

  getURL(method:string,value:string|number): string{
    return `${this.baseURL}${method}?value=${value}`;
  }
}