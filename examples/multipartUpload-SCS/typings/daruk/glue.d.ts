import 'daruk';
import validatorupload from '../../src/glues/validatorupload/index';

declare module 'daruk' {
  interface Glue {
    validatorupload: ReturnType<typeof validatorupload>;
  }
}
