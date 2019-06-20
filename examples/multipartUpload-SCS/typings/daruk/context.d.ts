import { Request } from 'daruk';
interface IRequest extends Request {
  body: any;
  file: any;
  query: any;
  [key: string]: any;
}
declare module 'daruk' {
  interface Context {
    render: (tpl: string, option?: any) => Promise<any>;
    request: IRequest;
  }
}
