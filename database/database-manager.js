var mysql = require('mysql');
var config = require('../config.json')

var _connection;

var getConnection = function(){
	var connection;
	
	if (!_connection){
		connection = mysql.createConnection({
		    host     : config.host,
		    user     : config.username,
		    password : config.password,
		    database : config.name
		});

		connection.connect(function(err) {
		    if (err) throw err;
		});
	} else {
		connection = _connection;
	}
	
	return connection;
}

var insertUser = function(insertUserRequest, onSuccess, onError){
	var sql = 'INSERT INTO USERS (firstName, lastName, email, display_name, status) VALUES (?, ?, ?, ?, ?)';
	connection.query(this.getConnection(), [insertUserRequest.fistName, insertUserRequest.lastName, insertUserRequest.email, insertUserRequest.displayName, 'ACTIVE'], function (err, data){
		if (err){
			onError(err);
		}
		else{
			onSuccess(data);
		}
	});	
};

var getUser = function(username, onSuccess, onError){
	var sql = 'SELECT firstName, lastName, id, email, registered_on, display_name, status from USERS WHERE display_name = ?';
	connection.query(this.getConnection(), [username], function (err, data){
		if (err){
			onError(err);
		}
		else{
			onSuccess(data);
		}
	});	
};

var getUserImages = function(userid, onSuccess, onError){
	var sql = 'SELECT id, user_id, ref, uploaded_on from USER_IMAGES WHERE id = ?';
	connection.query(this.getConnection(), [userid], function (err, data){
		if (err){
			onError(err);
		}
		else{
			onSuccess(data);
		}
	});	
}

var databaseManager = {
	insertUser: this.insertUser,
	getUserImages: this.getUserImages
};


module.exports = databaseManager;