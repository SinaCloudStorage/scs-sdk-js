/**
 * Daruk 配置
 */
import { Daruk } from 'daruk';
import path = require('path');

export default function(daruk: Daruk) {
  const { rootPath } = daruk.options;

  const darukConfig: any = {};

  darukConfig.middlewareOrder = ['handle-error', 'koa-favicon', 'koa-static', 'koa-compress', 'koa-ejs'];
  darukConfig.middleware = {
    'koa-favicon': (mid: Function) => {
      return mid(`${rootPath}/public/favicon.ico`);
    },
    'koa-static': (mid: Function) => {
      return mid(path.join(rootPath, './public'));
    },
    'koa-compress': (mid: Function) => {
      return mid({
        threshold: 1024,
        flush: require('zlib').Z_SYNC_FLUSH
      });
    },
    'koa-ejs': (mid: Function) => {
      mid(daruk, {
        root: path.join(rootPath, './view'),
        viewExt: 'html',
        cache: true,
        debug: false
      });
      return false;
    }
  };
  darukConfig.util = {
    testUtil: () => {}
  };
  darukConfig.timer = {};

  return darukConfig;
}
