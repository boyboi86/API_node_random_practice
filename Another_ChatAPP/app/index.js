'use strict';

// const router = require('express').Router();
//
// router.get('/', (req, res , next) => {
//   // res.sendFile(__dirname + '/views/login.htm');
//   res.render('login');
// });

/*Social authentication logic*/
require('./auth')();

module.exports = {
  router : require('./routes')(),
  session: require('./session')
};
