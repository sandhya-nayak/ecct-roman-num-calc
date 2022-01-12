import { ContainerConfiguration, Scope } from 'typescript-ioc';
import { CalculatorApi } from './calculator.api';
import { CalculatorService } from './calculator.service';
import { ConverterApi } from './converter.api';
import { ConverterService } from './converter.service';

const config: ContainerConfiguration[] = [
  {
    bind: CalculatorApi,
    to: CalculatorService,
    scope: Scope.Singleton,
  },
  {
    bind: ConverterApi,
    to: ConverterService,
    scope: Scope.Singleton,
  },
];

export default config;
