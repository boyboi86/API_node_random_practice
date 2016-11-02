'use strict';

const config = require('../config');
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

const Mongoose = mongoose.connect(config.dbURI);

Mongoose.connection.on('error', error => {
  console.log('cannot establish connection to db')
});

const User = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
})

let userModel = new Mongoose.model('User', User);

module.exports = { Mongoose, userModel }
