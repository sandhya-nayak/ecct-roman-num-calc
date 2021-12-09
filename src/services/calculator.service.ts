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
    @Inject
    converter: ConverterApi,
  ) {
    this.logger = logger.child('CalculatorService');
    this.converter = converter;
  }

  async calc(method:string, operands:string): Promise<string> {
    this.logger.info(`Calling ${method}() with ${operands}`);
    if(operands.trim() === "") {
      throw new Errors.BadRequestError();
    }
    const operandArray = operands.split(",");
    let output = await this.converter.toNumber(operandArray[0]);
    let divisor = 1, remainder = 0;
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
        case "div":
          divisor *= await this.converter.toNumber(operand);
          break;
      }
    };
    if(method == "div") {
      const gcd = (x: number, y: number) => (!y ? x : gcd(y, x % y));
      const gcdVal = gcd(output,divisor);
      divisor = divisor/gcdVal;
      remainder = output%divisor;
      output = Math.round(output/(gcdVal*divisor));
    }
    if(output > 3999 || output < 0) {
      throw new Errors.NotImplementedError();
    }
    return (await this.converter.toRoman(output) + ((remainder == 0)?"":(" ("+await this.converter.toRoman(remainder)+"/"+await this.converter.toRoman(divisor)+")")));
  }
}
