'use strict';

const config = require('../config');
const mongoose = require('mongoose');

const Mongoose = mongoose.connect(config.dbURI);

Mongoose.connection.on('error', error => {
  console.log('cannot establish connection to db')
});

module.exports = { Mongoose }
