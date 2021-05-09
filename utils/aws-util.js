var AWS = require('aws-sdk');
var config = require('../config.json');

s3 = new AWS.S3({apiVersion: '2006-03-01'});

AWS.config.update({
	region: 'us-west-2'
});


const putBucket = function (path, fileBuffer, onSuccess, onError){	
	s3.putObject({
		Bucket: "wp-large-scale-data-management",
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

module.exports = {
	
	s3PutObject : putBucket
};


