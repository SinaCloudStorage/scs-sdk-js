scs-sdk-js
==========

新浪云存储(SCS) SDK for Node.js

### Installation

	npm install aws-sdk

### Usage
  
#### 初始化`SinaCloud`

	var SinaCloud = require('scs-sdk');

#### 配置

##### 方法1:

	var config = new SinaCloud.Config({
		accessKeyId: '你的accessKey', secretAccessKey: '你的secretKey'
	});
  
  	//全局生效:
  	SinaCloud.config = config;
  

##### 方法2:
  
创建一个json文件`config.json`:

	{
		"accessKeyId": "你的accessKey", 
		"secretAccessKey": "你的secretKey"
	}

加载`config.json`:

	//全局生效:
	SinaCloud.config.loadFromPath('./config.json');
  
##### 方法3:

	var config = new SinaCloud.Config({
		accessKeyId: '你的accessKey', secretAccessKey: '你的secretKey'
	});
  
	//实例化:
	var s3 = new SinaCloud.S3();
	//当前示例生效:
	s3.config = config;
  
#### 实例化

##### 示例1:
  
	var s3 = new SinaCloud.S3();
  
##### 示例2:

	var mybucket = new SinaCloud.S3({params: {Bucket: 'mybucket'}});

##### 示例3:

	var myobject = new SinaCloud.S3({params: {Bucket: 'mybucket', Key: 'mykey'}});


#### 调用

##### 创建一个bucket并上传一个文件:
	
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
	

##### 列出所有bucket:

	var s3 = new SinaCloud.S3();
	
	s3.listBuckets(function(err, data) {
		if (err)
			console.log(err, err.stack); // an error occurred
		else
			console.log(data);           // successful response
	});
	
##### 列出bucket中的文件:

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


##### 获取bucket的acl信息:

	s3bucket.getBucketAcl(function(err, data) {

		if (err) 
			console.log(err);	// an error occurred
		else	
			console.log(data);	// successful response
	});
	
	
