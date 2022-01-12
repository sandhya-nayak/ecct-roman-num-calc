import { CalculatorApi } from './calculator.api';
import { ConverterApi } from './converter.api';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { Errors } from 'typescript-rest';

export class CalculatorService implements CalculatorApi {
  converter: ConverterApi;
  logger: LoggerApi;

  constructor(
    @Inject
    logger: LoggerApi,
    @Inject
    converter: ConverterApi
  ) {
    this.logger = logger.child('CalculatorService');
    this.converter = converter;
  }

  reducers = {
    add: (a: number, b: number) => a + b,
    sub: (a: number, b: number) => a - b,
    mult: (a: number, b: number) => a * b,
  };

  gcd = (x: number, y: number) => (!y ? x : this.gcd(y, x % y));

  async calc(method: string, operands: string): Promise<string> {
    this.logger.info(`Calling ${method}() with ${operands}`);

    if (operands.trim() === '') throw new Errors.BadRequestError();

    const operandArray = await Promise.all(
      operands
        .split(',')
        .map(async (operand) => await this.converter.toNumber(operand))
    );

    let result = 0,
      divisor = 1,
      remainder = 0;

    if (method == 'div') {
      result = operandArray[0];
      if (operandArray.length > 1) {
        divisor = operandArray.slice(1).reduce(this.reducers['mult']);
        remainder = result % divisor;
        result = Math.floor(result / divisor);
        const gcdVal = this.gcd(remainder, divisor);
        divisor /= gcdVal;
        remainder /= gcdVal;
      }
    } else result = operandArray.reduce(this.reducers[method]);

    if (result > 3999 || result < 0) throw new Errors.NotImplementedError();

    return (
      (await this.converter.toRoman(result)) +
      (!remainder
        ? ''
        : ' (' +
          (await this.converter.toRoman(remainder)) +
          '/' +
          (await this.converter.toRoman(divisor)) +
          ')')
    );
  }
}
