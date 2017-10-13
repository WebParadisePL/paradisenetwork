'use strict';

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var routes = require('./app/server/routes');
var session = require('./app/server/session');
var passport = require('./app/server/auth');

app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, './app/server/views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './app/client')));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

app.use(function(request, response, next) {
	response.status(404).render('pagenotfound');
});

app.listen(app.get('port'), function() {
	console.log('Server is running!');
});