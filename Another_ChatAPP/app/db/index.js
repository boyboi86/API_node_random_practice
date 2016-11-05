'use strict';

const config = require('../config');
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
const logger = require('../logger');

const Mongoose = mongoose.connect(config.dbURI);

Mongoose.connection.on('error', error => {
  logger.log('error','cannot establish connection to db' + error);
});

const User = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
})

let userModel = new Mongoose.model('User', User);

module.exports = { Mongoose, userModel }
