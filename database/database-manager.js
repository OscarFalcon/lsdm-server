var mysql = require('mysql2');
var config = require('../config.json')

var _connection;

var getConnection = function(){
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

var insertUser = function(insertUserRequest, onSuccess, onError){
	var sql = 'INSERT INTO USERS (firstName, lastName, email, display_name, password, status) VALUES (?, ?, ?, ?, ?, ?)';
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

var getUser = function(username, password, onSuccess, onError){
	var sql = 'SELECT id, display_name, firstName, lastName, email, registered_on, status from USERS WHERE display_name = ? and password = ?';
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

var getUserImages = function(userid, onSuccess, onError){
	var sql = 'SELECT * from USER_IMAGES WHERE user_id = ?';
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
	getUserImages: getUserImages
};


module.exports = databaseManager;