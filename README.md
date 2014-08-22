scs-sdk-js
==========

新浪云存储(SCS) SDK for JavaScript, available for browsers and mobile devices, or Node.js backends

### Installation

#### In Node.js

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


