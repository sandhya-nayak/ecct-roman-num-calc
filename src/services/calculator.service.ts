import {CalculatorApi} from './calculator.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import axios, { AxiosResponse } from 'axios';
import { Errors } from 'typescript-rest';
import { async } from 'q';

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

  async getOperandValue(operand: string): Promise<number> {
    let response = await axios.get(this.getURL(this.toNumberMethod,operand.trim()));
    return response.data.value;
  }
  
  async calc(method:string, operands:string): Promise<string> {
    this.logger.info(`Calling ${method}() with ${operands}`);
    if(operands.trim() === "") {
      throw new Errors.BadRequestError();
    }
    const operandArray = operands.split(",");
    let output = await this.getOperandValue(operandArray[0]);
    for (const operand of operandArray.slice(1)){
      switch(method){
        case "add":
          output += await this.getOperandValue(operand);
          break;
        case "sub":
          output -= await this.getOperandValue(operand);
          break;
      }
    };
    if(output > 3999 || output < 0) {
      throw new Errors.NotImplementedError();
    }
    return (await axios.get(this.getURL(this.toRomanMethod,output))).data.value;
  }

  async add(operands: string): Promise<string>{
    return await this.calc("add",operands);
  }

  async sub(operands: string): Promise<string>{
    return await this.calc("sub",operands);
  }
}
