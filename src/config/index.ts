import { ConverterConfig } from './converter.config';
import { converterConfigFactory } from './converter.config.provider';
import { Container } from 'typescript-ioc';

export * from './converter.config';

Container.bind(ConverterConfig).factory(converterConfigFactory);
