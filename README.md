scs-sdk-js
==========

新浪云存储(SCS) SDK for Node.js

### Installation

	npm install scs-sdk

### Usage
  
#### 初始化`SinaCloud`

```javascript
var SinaCloud = require('scs-sdk');
```

#### 配置

##### 方法1:

```javascript

var config = new SinaCloud.Config({
	accessKeyId: '你的accessKey', 
	secretAccessKey: '你的secretKey',
	sslEnabled: false
});

//全局生效:
SinaCloud.config = config;
```
  

##### 方法2:
  
创建一个json文件`config.json`:

```javascript

{
	"accessKeyId": "你的accessKey", 
	"secretAccessKey": "你的secretKey",
	"sslEnabled": true
}
```

加载`config.json`:

```javascript

//全局生效:
SinaCloud.config.loadFromPath('./config.json');
```
  
##### 方法3:

```javascript

var config = new SinaCloud.Config({
	accessKeyId: '你的accessKey', 
	secretAccessKey: '你的secretKey',
	sslEnabled: false
});

//实例化:
var s3 = new SinaCloud.S3();
//当前实例生效:
s3.config = config;
```
  
#### 实例化

##### 示例1:

```javascript

var s3 = new SinaCloud.S3();
```
  
##### 示例2:

```javascript

var mybucket = new SinaCloud.S3({params: {Bucket: 'mybucket'}});
```

##### 示例3:

```javascript

var myobject = new SinaCloud.S3({params: {Bucket: 'mybucket', Key: 'mykey'}});
```

#### 调用

##### 创建一个bucket并上传一个文件:

```javascript

var SinaCloud = require('scs-sdk');
SinaCloud.config.loadFromPath('./config.json');

var myBucket = new SinaCloud.S3({params: {Bucket: 'myBucket'}});
myBucket.createBucket(function() {
	var data = {Key: 'myKey', Body: 'Hello!'};
	myBucket.putObject(data, function(err, data) {
		if (err) {
			console.log("Error uploading data: ", err);
		} else {
			console.log("Successfully uploaded data to myBucket/myKey");
		}
	});
});
```
	

##### 列出所有bucket:

```javascript

var s3 = new SinaCloud.S3();

s3.listBuckets(function(err, data) {
	if (err)
		console.log(err, err.stack); // an error occurred
	else
		console.log(data);           // successful response
});
```
	
##### 列出bucket中的文件:

```javascript

var params = {
	Bucket: 'bucket-name',	//required
	Delimiter: '/',			//用'/'折叠
	Marker: '',				//分页标签
	MaxKeys: 100,			//最大成员数
	Prefix: 'xxx'			//按前缀查询
};

s3.listObjects(params, function(err, data) {

	if (err) 
		console.log(err, err.stack); // an error occurred
	else     
		console.log(data);           // successful response
});
```
	
##### 下载文件示例1:

```javascript

var s3 = new SinaCloud.S3();
var params = {Bucket: 'myBucket', Key: 'myImageFile.jpg'};
var file = require('fs').createWriteStream('/path/to/file.jpg');
s3.getObject(params).createReadStream().pipe(file);
```

##### 下载文件示例2:

```javascript

var s3 = new SinaCloud.S3();
var params = {Bucket: 'myBucket', Key: 'myImageFile.jpg'};
var file = require('fs').createWriteStream('/path/to/file.jpg');

s3.getObject(params).on('httpData', function(chunk) {
	file.write(chunk); 
}).on('httpDone', function() {
	file.end();
}).on('httpDownloadProgress', function(progress) {
	console.log(progress);
}).on('error', function(error) {
	console.log(error);
}).on('success', function() {
	console.log('success');
}).on('httpHeaders', function(statusCode, headers) {
	console.log('statusCode: ' + statusCode + "\n", headers);
}).send();
```
	
##### 上传文件示例1：

```javascript

var s3 = new SinaCloud.S3();
var file = require('fs').createReadStream('/path/to/file.jpg');
var params = {Bucket: 'myBucket', Key: 'myImageFile.jpg', Body: file};
s3.putObject(params).on('httpHeaders', function(statusCode, headers) { 
	console.log(headers);
}).on('httpUploadProgress', function(progress) {
	console.log(progress);
}).on('error', function(error) {
	console.log(error);
}).on('success', function() {
	console.log('success');
}).send();
```
	
##### 上传文件示例2：

```javascript

var fileName = '/file/path/IMG_3218.JPG';
var remoteFilename = 'IMG_3218.JPG';
var s3 = new SinaCloud.S3();
var fileBuffer = require('fs').readFileSync(fileName);

s3.putObject({
	ACL: 'public-read',
	Bucket: 'mybucket',
	Key: remoteFilename,
	Body: fileBuffer
}, function(error, response) {
	if (error) {
		console.log(error);
	} else {
		console.log('uploaded file[' + fileName + '] to [' + remoteFilename + ']');
	}
});
```

##### 上传文件示例3：

```javascript

var myBucket = new SinaCloud.S3({params: {Bucket: 'myBucket'}});
var data = {Key: 'myKey', Body: 'Hello!'};
myBucket.putObject(data, function(err, data) {
	if (err) {
		console.log("Error uploading data: ", err);
	} else {
		console.log("Successfully uploaded data to myBucket/myKey");
	}
});
```

##### 获取bucket的acl信息:
	
```javascript

var s3bucket = new SinaCloud.S3({params: {Bucket: 'myBucket'}});

s3bucket.getBucketAcl(function(err, data) {
	if (err) {
		console.log(err);	// an error occurred
	} else {
		console.log(data);	// successful response
	}
});
```

##### 删除一个文件:

```javascript

var s3 = new SinaCloud.S3();
var params = {Bucket: 'myBucket', Key: 'myImageFile.jpg'};
s3.deleteObject(params, function(err, data) {
	if (err) {
		console.log(err);	// an error occurred
	} else {
		console.log(data);	// successful response
	}
});
```
	
##### 删除一个bucket:

```javascript

var s3 = new SinaCloud.S3();
var params = {Bucket: 'myBucket'};
s3.deleteBucket(params, function(err, data) {
	if (err) {
		console.log(err);	// an error occurred
	} else {
		console.log(data);	// successful response
	}
});
```
	
##### 获取一个带有签名的用于下载的url:

```javascript

var s3 = new SinaCloud.S3();

// This URL will expire in one minute (60 seconds)
var params = {Bucket: 'myBucket', Key: 'myKey', Expires: 60};
var url = s3.getSignedUrl('getObject', params);
console.log("The URL is", url);
```
	
	
