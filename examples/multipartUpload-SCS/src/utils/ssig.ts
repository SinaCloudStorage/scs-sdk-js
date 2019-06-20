import crypto = require('crypto');
export default (
  secret_AccessKey: string,
  contentType: string,
  date: string,
  key: string,
  HTTPVerb: string,
  contentMD5: string,
  canonicalizedAmzHeaders: string,
  canonicalizedResource: string
) => {
  let _secret_AccessKey = secret_AccessKey;
  // 文件类型
  let _contentType = contentType;
  // 代表本次请求的有效时间，后端做校验，大概15分钟过期
  let _date = date;
  // 表示操作名，即HTTP的请求方式，应该为PUT、GET、DELETE、HEAD和POST中的一种.请求的方式
  let _HTTPVerb = HTTPVerb;
  // post请求不需要,可以设置为空
  let _contentMD5 = contentMD5;
  // 请求头中所有以x-amz-和x-sina-开头的header，将他们的key转化为小写并按顺序排列，key和value之间用冒号相连，以换行符“\n”连接和结尾，此处设置为空
  let _canonicalizedAmzHeaders = canonicalizedAmzHeaders || '';
  // 是指想要访问的资源,这里不确定是写 '/' 还是bucket+objectName，注意：另外，如果您要访问的URL中带有如下的参数, 则需要加入sub-resource参与签名
  let _canonicalizedResource = canonicalizedResource;
  let StringToSign =
    _HTTPVerb +
    '\n' +
    _contentMD5 +
    '\n' +
    _contentType +
    '\n' +
    _date +
    '\n' +
    _canonicalizedAmzHeaders +
    _canonicalizedResource;
  return crypto
    .createHmac('sha1', _secret_AccessKey)
    .update(StringToSign)
    .digest('base64');
};
