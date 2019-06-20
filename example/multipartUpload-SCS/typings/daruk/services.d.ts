import 'daruk';
import upload from '../../src/services/upload';

declare module 'daruk' {
  interface Service {
    upload: upload;
  }
}
