'use strict';

var userModel = require('../database').models.user;

var create = function(data, callback) {
	var newUser = new userModel(data);
	newUser.save(callback);
};

var findOne = function(data, callback) {
	userModel.findOne(data, callback);
}

var findById = function(id, callback) {
	userModel.findById(id, callback);
}

var findOrCreate = function(data, callback) {
	findOne({'userId': data.id}, function(error, user) {
		if (error) {
			return callback(error);
		}
		
		if (user) {
			return callback(error, user);
		} else {
			var userData = {
				username: data.displayName,
				userId: data.id,
				picture: data.photos[0].value || null
			};
			
			create(userData, function(error, newUser) {
				callback(error, newUser);
			});
		}
	});
}

var isAuthenticated = function(request, response, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}

module.exports = {
	create,
	findOne,
	findById,
	findOrCreate,
	isAuthenticated
};