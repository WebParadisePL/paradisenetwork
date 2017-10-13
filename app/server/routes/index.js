'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.get('/', function(request, response, next) {
	if (request.isAuthenticated()) {
		response.redirect('/index');
	} else {
		response.render('login', {
			success: request.flash('success')[0],
			errors: request.flash('error')
		});
	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/index',
	failureRedirect: '/',
	failureFlash: true
}));

router.post('/register', function(request, response, next) {
	var credentials = {'username': request.body.username, 'password': request.body.password};
	
	if (credentials.username === '' || credentials.password === '') {
		request.flash('error', 'Missing Credentials!');
		response.redirect('/');
	} else {
		User.findOne({'username': new RegExp('^' + request.body.username + '$', 'i'), 'userId': null}, function(error, user) {
			if (error) {
				throw error;
			}
			
			if (user) {
				request.flash('error', 'Username Already Exists!');
				response.redirect('/');
			} else {
				User.create(credentials, function(error, newUser) {
					if (error) {
						throw error;
					}
					
					request.flash('success', 'Your Account Has Been Created!');
					response.redirect('/');
				});
			}
		});
	}
});

router.get('/oauth/twitter', passport.authenticate('twitter'));
router.get('/oauth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/index',
	failureRedirect: '/',
	failureFlash: true
}));

router.get('/index', [User.isAuthenticated, function(request, response, next) {
	response.render('index', {user: request.user});
}]);

router.get('/logout', function(request, response, next) {
	request.logout();
	request.session = null;
	response.redirect('/');
});

module.exports = router;