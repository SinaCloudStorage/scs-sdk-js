import { Context, Daruk } from 'daruk';

export default (daruk: Daruk) => {
  return async (ctx: Context, next: Function) => {
    try {
      ctx.error = (code: any, message: any) => {
        if (typeof code === 'string') {
          message = code;
          code = 500;
        }
        ctx.throw(code || 500, message);
      };
      await next();
    } catch (e) {
      let status = e.status || 500;
      let message = e.message;
      daruk.logger.info(message);
      ctx.body = { status, message };
    }
  };
};
