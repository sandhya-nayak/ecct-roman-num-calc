import { ObjectFactory } from 'typescript-ioc';
import {config} from '../../package.json';

const baseConverterUrl: string =
  process.env.CONVERTER_URL ||
  config.baseConverterUrl ||
  'http://ecct-roman-num-conv:80';

export const converterConfigFactory: ObjectFactory = () => ({
  baseConverterUrl,
});
