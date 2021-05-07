const express = require('express');
const bodyParser = require("body-parser");
const dbmanager = require('./database/database-manager')
const auth = require('./utils/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');
   next();
});

app.use((req, res, next) => {
	console.log('incoming request');
	console.log(req);
   next();
});

app.get('/images', auth.authenticateRequest, function (req, res) {
	dbmanager.getUserImages(
		req._securitycontext.id,
		(data)=> {res.status(200).send(data)},
		()=> {res.sendStatus(500)}
	)
});

app.post('/login', function (req, res) {
	auth.authenticateUser(
		req.body,
		(authResponse)=> {res.send(authResponse)},
		()=> {res.sendStatus(401)},
		()=>{res.sendStatus(500)});
	
});

app.post('/signup', function (req, res) {
	dbmanager.insertUser(req.body,
		 (s)=> {res.sendStatus(200)},
		 (e)=>{res.sendStatus(500)});
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});