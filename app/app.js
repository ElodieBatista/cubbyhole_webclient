/**
 * Module dependencies
 */
var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path'),
	async = require('async'),
	mongoose = require('mongoose'),
	api = require('./routes/api');

// import all models
var User = require('./models/User'),
	Plan = require('./models/Plan');

var DB = require('./tools/DB');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Connect to cloud database
var db = new DB(null, null, '@localhost/Cubbyhole', true);
	db.connect( function (err) {
		if (err) throw err;
	});
	
/**
 * Routes
 */
app.get('/', routes.index);
app.get('/partials/:folder/:name', routes.partials);

/**
 * JSON API
 */
// GET
app.get('/api/users', api.users);


// PUT

// DELETE

// DEFAULT: redirect all other routes to the index page
app.get('*', routes.index);
