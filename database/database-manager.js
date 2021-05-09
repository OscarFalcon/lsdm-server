var mysql = require('mysql2');
var config = require('../config.json')

var _connection;

const getConnection = function(){
	var connection;
	
	console.log()
	if (!_connection){
		connection = mysql.createConnection({
		    host     : config.database.host,
		    user     : config.database.user,
		    password : config.database.password,
		    database : config.database.name
		});
		
		console.log(config);

		connection.connect(function(err) {
		    if (err) throw err;
		});
	} else {
		connection = _connection;
	}
	
	return connection;
}

const insertUser = function(insertUserRequest, onSuccess, onError){
	const sql = 'INSERT INTO USERS (firstName, lastName, email, display_name, password, status) VALUES (?, ?, ?, ?, ?, ?)';
	getConnection().query(
		sql, 
		[insertUserRequest.firstName, insertUserRequest.lastName,insertUserRequest.email,
			 insertUserRequest.username, insertUserRequest.password, 'ACTIVE'], 
		function (err, data){
		
		if (err){
			console.log(err);
			onError(err);
		}
		else{
			onSuccess(data);
		}
	});	
};

const getUser = function(username, password, onSuccess, onError){
	const sql = 'SELECT id, display_name, firstName, lastName, email, registered_on, status from USERS WHERE display_name = ? and password = ?';
	getConnection().query(sql, [username, password], function (err, data){
		if (err){
			console.log(err);
			onError(err);
		}
		else{
			console.log(data);
			onSuccess(data);
		}
	});	
};


const insertImage = function(insertImageReq, onSuccess, onError){
	const sql = 'INSERT INTO user_images(user_id, ref, title, author, length, width) VALUES (?, ?, ?, ?, ?, ?)';
	getConnection().query(sql, [
		insertImageReq.userId,
		insertImageReq.ref,
		insertImageReq.title,
		insertImageReq.author,
		insertImageReq.length,
		insertImageReq.width
	 ],
	 function (err, data){
		if (err){
			console.log(err);
			onError(err);
		}else {
			onSuccess(data);
		}
	});
}

const deleteImage = function(imageId, onSuccess, onError){
	const sql = 'DELETE FROM user_images WHERE id = ?';
	getConnection().query(sql, [imageId], function (err, data){
  		if (err){
  			console.log(err);
  			onError(err);
  		} else {
  			console.log(data);
  			onSuccess(data);
  		}
	});
};

const getUserImages = function(userid, onSuccess, onError){
	const sql = 'SELECT * from USER_IMAGES WHERE user_id = ?';
	getConnection().query(sql, [userid], function (err, data){
		if (err){
			console.log(err);
			onError(err);
		}
		else{
			console.log(data);
			onSuccess(data);
		}
	});	
}


var databaseManager = {
	insertUser : insertUser,
	getUser: getUser,
	getUserImages: getUserImages,
	insertImage : insertImage,
	deleteImage: deleteImage
};


module.exports = databaseManager;