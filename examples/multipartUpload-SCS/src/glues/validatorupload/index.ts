import Joi = require('joi');
let init = Joi.object({
  // 可以在这里做上传的限制，允许的类型。
  'x-amz-type': Joi.string()
    .regex(/\/(?:jpeg|png|gif|jpg|webp|mp4|webm|ogg|pdf)/i)
    .error(() => '文件上传类型不支持'),
  'x-amz-date': Joi.string()
    .trim()
    .required(),
  'x-amz-size': Joi.number()
    .integer()
    .min(1)
    .required()
}).unknown();

let part = Joi.object({
  'x-amz-type': Joi.string()
    .trim()
    .required(),
  'x-amz-date': Joi.string()
    .trim()
    .required(),
  'x-amz-id': Joi.string()
    .trim()
    .required(),
  'x-amz-key': Joi.string()
    .trim()
    .required(),
  'x-amz-partnumber': Joi.number()
    .min(1)
    .required(),
  'x-amz-total': Joi.number()
    .min(1)
    .required()
}).unknown();

export default () => {
  return {
    init,
    part
  };
};
