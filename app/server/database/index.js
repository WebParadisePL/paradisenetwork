'use strict';

var config = require('../config');
var mongoose = require('mongoose');

var dbURI = 'mongodb://' + encodeURIComponent(config.db.username) + ':' + encodeURIComponent(config.db.password) + '@' + config.db.host + ':' + config.db.port + '/' + config.db.name;

mongoose.connect(dbURI);

mongoose.Promise = global.Promise;

module.exports = {
	mongoose,
	models: {
		user: require('./schemas/user.js')
	}
}