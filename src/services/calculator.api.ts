export abstract class CalculatorApi {
  abstract add(operands: string): Promise<string>;
}
