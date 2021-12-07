import {CalculatorApi} from './calculator.api';
import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import {Errors} from 'typescript-rest';

export class CalculatorService implements CalculatorApi {
  converter: ConverterApi;
  logger: LoggerApi;
  
  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('CalculatorService');
  }

  async calc(method:string, operands:string): Promise<string> {
    this.logger.info(`Calling ${method}() with ${operands}`);
    if(operands.trim() === "") {
      throw new Errors.BadRequestError();
    }
    const operandArray = operands.split(",");
    let output = await this.converter.toNumber(operandArray[0]);
    for (const operand of operandArray.slice(1)){
      switch(method){
        case "add":
          output += await this.converter.toNumber(operand);
          break;
        case "sub":
          output -= await this.converter.toNumber(operand);
          break;
        case "mult":
          output *= await this.converter.toNumber(operand);
          break;
      }
    };
    if(output > 3999 || output < 0) {
      throw new Errors.NotImplementedError();
    }
    return (await this.converter.toRoman(output));
  }
}
