import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import axios, {AxiosResponse} from 'axios';
import {BadRequestError, InternalServerError} from 'typescript-rest/dist/server/model/errors';
import { ConverterConfig } from '../config';

export class ConverterService implements ConverterApi {
  @Inject
  config: ConverterConfig;
  logger: LoggerApi;
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
      return response.data;
    }
    catch(error){
      if (error.response?.status === 400) throw new BadRequestError();
      throw new InternalServerError();
    }
  }
  
  async toRoman(value: number): Promise<string> {
    try{
      const response:AxiosResponse = await axios.get(this.getURL(this.toRomanMethod,value));
      return response.data;
    }
    catch(error){
      if (error.response?.status === 400) throw new BadRequestError();
      throw new InternalServerError();
    }
  }

  getURL(method:string,value:string|number): string{
    return `${this.config.baseConverterUrl}/${method}?value=${value}`;
  }
}