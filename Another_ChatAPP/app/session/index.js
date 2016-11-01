'use strict';

const config = require('../config');
const session = require('express-session');
const mongostore = require('connect-mongo')(session);
const db = require('../db');

/** resave always false otherwise session will keep spawning,
  saveUnitialized can only occur when authentication is true
  if store is not stated everything will be kept in memory */
if(process.env.NODE_ENV === 'production'){
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new mongostore({
      mongooseConnection: db.mongoose.connection
    })
  })
} else {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
}
