const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const mysql = require('./DbConfig.js'); // importing dbConfig
const session = require('express-session');
const routes = require('./routes/routes.js'); //importing route
const fileUpload = require('express-fileupload');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(fileUpload());
app.use((request,response,next)=>{
	response.header("Access-Control-Allow-Origin","*");
	response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
	next();
});
app.use('/uploadedTdModel', express.static('uploadedTdModel'));
mysql.connect();
routes(app); //register the route
app.listen(process.env.PORT || 8080);
