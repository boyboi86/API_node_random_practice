'use strict';

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    host: process.env.host || "",
    dbURI: process.env.dbURI,
    sessionSecret: process.env.sessionSecret
  }
} else {
  //By using module.exports you can save a line of code JSON.parse()
  module.exports = require('./development.json');
}
