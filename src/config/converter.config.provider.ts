import { ObjectFactory } from 'typescript-ioc';
import {config} from '../../package.json';

const baseConverterUrl: string =
  process.env.CONVERTER_URL ||
  config.baseConverterUrl;

export const converterConfigFactory: ObjectFactory = () => ({
  baseConverterUrl,
});
