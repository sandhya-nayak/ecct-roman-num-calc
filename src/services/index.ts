import { Container } from 'typescript-ioc';

export * from './converter.api';
export * from './converter.service';
export * from './calculator.api';
export * from './calculator.service';

import config from './ioc.config';

Container.configure(...config);
