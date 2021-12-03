import {CalculatorApi} from './calculator.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import axios, { AxiosResponse } from 'axios';
import { NotImplementedError, BadRequestError } from 'typescript-rest/dist/server/model/errors';

export class CalculatorService implements CalculatorApi {
  logger: LoggerApi;
  baseURL = "https://ecct-roman-num-conv-snyk-roman-num-conv.eco-training-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud/";
  toNumberMethod="to-number";
  toRomanMethod="to-roman";
  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('CalculatorService');
  }

  getURL(method:string,value:string|number){
    return `${this.baseURL}${method}?value=${value}`
  }

  async toOperandsArray(operands: string): Promise<Array<number>> {
    const operandArray = operands.split(",");
    let operandArrayNumeric = new Array<number>(operandArray.length);
    let response:AxiosResponse<any,any>;
    for(var i = 0; i < operandArray.length; i++){
      response = await axios.get(this.getURL(this.toNumberMethod,operandArray[i].trim()));
      operandArrayNumeric[i] = response.data.value;
    }
    return operandArrayNumeric;
  }

  async toRoman(num: number): Promise<string> {
    return (await axios.get(this.getURL(this.toRomanMethod,num))).data.value;
  }

  async add(operands: string): Promise<string> {
    this.logger.info(`Adding ${operands}`);
    if(operands.trim() === "") {
      throw new BadRequestError();
    }
    const operandArrayNumeric = await this.toOperandsArray(operands);
    let sum = 0;
    operandArrayNumeric.forEach((operand) => sum = sum+operand);
    if(sum > 3999) {
      throw new NotImplementedError();
    }
    return await this.toRoman(sum);
  }
}
