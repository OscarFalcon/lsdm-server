const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const dbmanager = require('./database/database-manager')
const auth = require('./utils/auth');
const aws = require('./utils/aws-util');
const dupUtil = require('./utils/duplicate-util');
var config = require('./config.json');

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  // file size limitation in bytes
  limits: { fileSize: 52428800 },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.append('Access-Control-Allow-Headers', ['*']);
   next();
});

app.use((req, res, next) => {
	console.log('incoming request');
	console.log(req);
   next();
});

app.get('/images', auth.authenticateRequest, function (req, res) {
	var userId = req._securitycontext.id;
	dbmanager.getUserImages(
		userId,
		(data)=> {
			if (data.length > 0){
				data.forEach( image => image.ref = config.service = '/images/' + image.id )
			}
			res.status(200).send(data);
		},
		()=> {res.sendStatus(500)}
	)
});

app.get("/images/:imageId", auth.authenticateRequest, function(req, res, next) {
	const key = req._securitycontext.id + '/' + req.params.imageId;
	console.log(key);
	
	aws.getObject(
		key,
		(data) => { res.send(data.Body); },
		() => {res.sendStatus(500);})
});

app.delete("/images/:imageId", auth.authenticateRequest, function(req, res, next) {
	const key = req._securitycontext.id + '/' + req.params.imageId;
	console.log(key);
	
	dbmanager.deleteImage(
		req.params.imageId,
		() => {
			aws.s3DeleteObject(
				key,
				(data) => {res.sendStatus(200)},
				(err) => {res.sendStatus(500)});
		},
		() => res.sendStatus(500)
	);	
});

app.post('/images', auth.authenticateRequest, upload.single('file'), function (req, res) {
	const userId = req._securitycontext.id;
	const fileName = req.file.originalname;
		
	dbmanager.insertImage({
			userId : userId,
			ref : fileName,
			title : "",
			author : "",
			length : 0,
			width : 0
		},
		(insertData) => {
			console.log(insertData);
			
			const path = userId + '/' + insertData.insertId;
			console.log(path);
			aws.s3PutObject(
				path,
				req.file.buffer,
				(data) => {
					res.sendStatus(200);
				},
				() => {res.sendStatus(500)});
		},
		(err) => {res.sendStatus(500)});
});

app.get('/duplicates', auth.authenticateRequest, function (req, res) {
	const userId = req._securitycontext.id;
	dbmanager.getDuplicateImages(
		userId,
		(data)=> { 
			res.send(dupUtil.mapData(data));
		},
		(err)=>{res.sendStatus(500)}
	);
	
	
	
	
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