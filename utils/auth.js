const jwt = require('jsonwebtoken');
const dbmanager = require('../database/database-manager')
const config = require('../config.json');

const authenticateUser = function(loginRequest, onLoginAuthSuccess, onLoginAuthFailed, onError){
	var response = { success: false, jwt: null };
	
	dbmanager.getUser(loginRequest.username, loginRequest.password, 
		(data)=> {
			console.log(data);
			if (data.length === 1){
				var row = data[0];
				onLoginAuthSuccess(
					{
						success: true,
						jwt: jwt.sign(
							{id : row.id, username: row.display_name, email: row.email},
							config.auth.TOKEN_SECRET, { expiresIn: '14400s' })
					}
				)		
			} else {
				onLoginAuthFailed();
			}
		},
		(e)=>{
			onError(e);			
		});
};

const authenticateRequest = function authenticateToken(req, res, next) {
	const token = req.get('Authorization');
 	if (token == null){
		console.log("Null token");
  		res.status(401).send({  message: "Unauthorized" });
		return;
  	}

	jwt.verify(token, config.auth.TOKEN_SECRET, (err, jwt) => {
		if (err){
			console.log(err);
			res.status(401).send({message: "Unauthorized" });
		} else {
			console.log(jwt);
			req._securitycontext = jwt;
			next();
		}
  });
};

module.exports = {
	authenticateUser: authenticateUser,
	authenticateRequest: authenticateRequest
};

