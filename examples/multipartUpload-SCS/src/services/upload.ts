/*
 * @Author: makan 
 * @Date: 2019-06-20 20:55:59 
 * @Last Modified by: makan
 * @Last Modified time: 2019-06-20 20:56:09
 */
import { BaseService, Daruk, config, util } from 'daruk';
import rp = require('request-promise');
import fs = require('fs');
import path = require('path');

export default class Upload extends BaseService {
  @config('SinaCloud')
  public SinaCloud: Daruk['config']['SinaCloud'];

  @util()
  public util: Daruk['util'];

  public init(key: string, _ssig: string, date: string, content_type: string) {
    let { bucketName, accessKeyId } = this.SinaCloud;
    let options = {
      method: 'POST',
      uri: `http://${bucketName}.sinastorage.com/${key}?multipart&formatter=json`,
      headers: {
        Authorization: `SINA ${accessKeyId}:${_ssig}`,
        Date: date,
        'Content-Type': content_type
      },
      json: true
    };
    return new Promise((resolve) => {
      rp(options)
        .then((data) => {
          resolve({ status: 200, message: 'multipart upload  init', data });
        })
        .catch((e) => {
          resolve({ status: 403, message: JSON.stringify(e), data: { UploadId: '', __attr: '', Bucket: '', Key: '' } });
        });
    });
  }
  public part(key: string, partNumber: number, uploadId: string, _ssig: string, date: string, content_type: string, file: any, total: number) {
    let { bucketName, accessKeyId } = this.SinaCloud;
    let options = {
      method: 'PUT',
      uri: `http://${bucketName}.sinastorage.com/${key}?partNumber=${partNumber}&uploadId=${uploadId}&formatter=json`,
      headers: {
        Authorization: `SINA ${accessKeyId}:${_ssig}`,
        Date: date,
        'Content-Length': file.size,
        'Content-MD5': '',
        'Content-Type': content_type
      },
      body: fs.createReadStream(path.resolve(__dirname, file.path))
    };
    return new Promise((resolve) => {
      rp(options)
        .then(async () => {
          if (partNumber == total) {
            let list = await this.listparts(content_type, date, key, uploadId);
            await this.mergeFile(date, key, uploadId, list);
            resolve({ status: 200, message: 'upload  success', url: `http://${bucketName}.sinastorage.com/${key}` });
          } else {
            resolve({ status: 200, message: 'multipart upload  success'});
          }
        })
        .catch((e) => {
          resolve({ status: 403, message: JSON.stringify(e) });
        });
    });
  }
  private mergeFile(date: string, key: string, uploadId: string, list: any[]) {
    // 合并分片
    let { bucketName, secretAccessKey, accessKeyId } = this.SinaCloud;
    let HTTPVerb = 'POST';
    let contentMD5 = '';
    let canonicalizedAmzHeaders = '';
    let canonicalizedResource = '/' + bucketName + '/' + key + `?uploadId=${uploadId}`;
    let _ssig = this.util.ssig(secretAccessKey, 'text/json', date, key, HTTPVerb, contentMD5, canonicalizedAmzHeaders, canonicalizedResource);
    let options = {
      method: 'POST',
      uri: `http://${bucketName}.sinastorage.com/${key}?uploadId=${uploadId}&formatter=json`,
      headers: {
        Authorization: `SINA ${accessKeyId}:${_ssig}`,
        Date: date,
        'Content-Type': 'text/json'
      },
      json: true,
      resolveWithFullResponse: true,
      body: list
    };
    return new Promise((resolve) => {
      rp(options)
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          resolve({});
        });
    });
  }
  private listparts(contentType: string, date: string, key: string, uploadId: string): Promise<any[]> {
    // 查找文件分片
    let { bucketName, secretAccessKey, accessKeyId } = this.SinaCloud;
    let HTTPVerb = 'GET';
    let contentMD5 = '';
    let canonicalizedAmzHeaders = '';
    let canonicalizedResource = '/' + bucketName + '/' + key + `?uploadId=${uploadId}`;
    let _ssig = this.util.ssig(secretAccessKey, contentType, date, key, HTTPVerb, contentMD5, canonicalizedAmzHeaders, canonicalizedResource);
    let options = {
      method: 'GET',
      uri: `http://${bucketName}.sinastorage.com/${key}?uploadId=${uploadId}&formatter=json`,
      headers: {
        Authorization: `SINA ${accessKeyId}:${_ssig}`,
        Date: date,
        'Content-Type': contentType
      },
      json: true
    };
    return new Promise((resolve) => {
      rp(options)
        .then((data) => {
          resolve(data.Parts);
        })
        .catch((_) => {
          resolve([]);
        });
    });
  }
}
