export abstract class CalculatorApi {
  abstract calc(method: string, operands: string): Promise<string>;
}
