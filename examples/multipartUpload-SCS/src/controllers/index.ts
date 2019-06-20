/*
 * @Author: makan 
 * @Date: 2018-06-20 20:55:50 
 * @Last Modified by: makan
 * @Last Modified time: 2019-06-20 20:56:21
 */
import { BaseController, get, post, Daruk, config, util, glue } from 'daruk';
import crypto = require('crypto');
import Joi = require('joi');
import mime = require('mime');
import uuidv4 = require('uuid/v4');
export default class Index extends BaseController {
  @config('SinaCloud')
  public SinaCloud: Daruk['config']['SinaCloud'];

  @util()
  public util: Daruk['util'];

  @glue('validatorupload')
  public validatorupload: Daruk['glue']['validatorupload'];

  @get('/')
  public async index() {
    await this.ctx.render('index');
  }

  @post('/init')
  public async init() {
    const { error } = Joi.validate(this.ctx.header, this.validatorupload.init);
    if (error) {
      this.ctx.body = { status: '405', message: error.details[0].message };
    } else {
      let { bucketName, secretAccessKey } = this.SinaCloud;
      let content_type = this.ctx.header['x-amz-type'];
      let date = this.ctx.header['x-amz-date'];
      let fileName = uuidv4().substr(0, 8) + '.' + mime.getExtension(content_type);
      let fileSize = this.ctx.header['x-amz-size'];
      let HTTPVerb = 'POST';
      let contentMD5 = '';
      let canonicalizedAmzHeaders = '';
      let key =
        crypto
          .createHash('md5')
          .update(content_type + date + fileName + fileSize)
          .digest('hex') +
        '/' +
        fileName;
      let canonicalizedResource = '/' + bucketName + '/' + key + '?multipart';
      let _ssig = this.util.ssig(secretAccessKey, content_type, date, key, HTTPVerb, contentMD5, canonicalizedAmzHeaders, canonicalizedResource);
      const { upload } = this.service;
      this.ctx.body = await upload.init(key, _ssig, date, content_type);
    }
  }

  @post('/part')
  public async part() {
    const { error } = Joi.validate(this.ctx.header, this.validatorupload.part);
    if (error) {
      this.ctx.body = { status: '405', message: error.details[0].message };
    } else {
      let { secretAccessKey, bucketName } = this.SinaCloud;
      let content_type = this.ctx.header['x-amz-type'];
      let date = this.ctx.header['x-amz-date'];
      let HTTPVerb = 'PUT';
      let contentMD5 = '';
      let canonicalizedAmzHeaders = '';
      let _key = this.ctx.header['x-amz-key'];
      let uploadId = this.ctx.header['x-amz-id'];
      let partNumber = this.ctx.header['x-amz-partnumber'];
      let total = this.ctx.header['x-amz-total'];
      let canonicalizedResource = '/' + bucketName + '/' + _key + `?partNumber=${partNumber}&uploadId=${uploadId}`;
      let _ssig = this.util.ssig(secretAccessKey, content_type, date, _key, HTTPVerb, contentMD5, canonicalizedAmzHeaders, canonicalizedResource);
      let file = this.ctx.request.files.file;
      const { upload } = this.service;
      this.ctx.body = await upload.part(_key, partNumber, uploadId, _ssig, date, content_type, file, total);
    }
  }
}
