'use strict';

const winston = require('winston');
/* The below is as good as require('./winston/logger').Logger */
const logger = new (winston.Logger)({
  transports: [
  /*The below should be used for production to prevent users from reading methods*/
    // new (winston.transports.File)({
    //   level:'debug',
    //   filename: './ChatAppdebug.log',
    //   handleExceptions: true
    // }),
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      handleExceptions: true
    })
  ],
  exitOnError: false
})

module.exports = logger;
