export abstract class ConverterApi {
  abstract toNumberMethod: string;
  abstract toRomanMethod: string;
  abstract toNumber(value: string): Promise<number>;
  abstract toRoman(value: number): Promise<string>;
  abstract getURL(method:string,value:string|number): string;
}
