'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = '/img/user.png';

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		default: null
	},
	userId: {
		type: String,
		default: null
	},
	picture: {
		type: String,
		default: DEFAULT_USER_PICTURE
	}
});

UserSchema.pre('save', function(next) {
	var user = this;
	
	if (!user.picture) {
		user.picture = DEFAULT_USER_PICTURE;
	}
	
	if (!user.isModified('password')) {
		return next();
	}
	
	bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
		if (error) {
			return next(error);
		}
		
		bcrypt.hash(user.password, salt, null, function(error, hash) {
			if (error) {
				return next(error);
			}
			
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.validatePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(error, isMatch) {
		if (error) {
			return callback(error);
		}
		
		callback(null, isMatch);
	});
};

var userModel = mongoose.model('user', UserSchema);

module.exports = userModel;