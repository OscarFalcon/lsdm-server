var AWS = require('aws-sdk');
var config = require('../config.json');

s3 = new AWS.S3({apiVersion: '2006-03-01'});

AWS.config.update({
	region: 'us-west-2'
});


const putBucket = function (path, fileBuffer, onSuccess, onError){	
	s3.putObject({
		Bucket: config.aws.BUCKET,
		Key: path, 
		Body: fileBuffer,
		ACL: 'public-read', 
	},
		(err, data) => { 
	   	if (err){
	   		console.log(err);
				onError(err);
	   	} else {
	   		console.log(data);
	   		onSuccess(data);
	   	}   	
	});
}

const getObject = function(key, onSuccess, onError){
	var params = { Bucket: config.aws.BUCKET, Key: key };

	s3.getObject(params, function(err, data) {
	  if (err) {
		  console.log(err);
		  return onError(err);
	  }
	  else{
		  onSuccess(data);
	  }
  });
}

const deleteObject = function(key, onSuccess, onError){
	var params = { Bucket: config.aws.BUCKET, Key: key };
	s3.deleteObject(params, function(err, data) {
		if (err){
			console.log(err);
			onError(err);
		} else{
			console.log(data);
			onSuccess(data);
		}
	});
};

module.exports = {
	s3PutObject : putBucket,
	getObject: getObject,
	s3DeleteObject: deleteObject
};


