'use strict';
/*Objectify routes content must not be array or null*/
const helper = require('../helper');
const db = require('../db');
const passport = require('passport');
const config = require('../config');
/*render method can only be called with there is a view folder plus whe the view engine is set
  it will be called as long as the file name is same as the res.render */
module.exports = () => {
  let routes = {
      'get': {
        '/': (req, res, next) => {
          res.render('login');
        },
        '/rooms': [helper.isAuthenticated, (req, res, next) => {
          /*Allow passport to save to DB then do another call from existing dbuser to reflect info*/
            res.render('rooms', {
              user: req.user,
              host: config.host
            });
          }],
        '/chat/:id': [helper.isAuthenticated, (req, res, next) => {
          /*render it if the id is found*/
          let getRoom = helper.findRoomById(req.app.locals.chatrooms, req.params.id);
          if(getRoom === undefined){
            return next();
          } else {
            res.render('chatroom', {
              user: req.user,
              host: config.host,
              room: getRoom.room,
              roomID: getRoom.roomID
            });
          }
        }],
        '/auth/facebook': passport.authenticate('facebook'),
        '/auth/facebook/callback': passport.authenticate('facebook', {
          successRedirect: '/rooms',
          failureRedirect: '/'
        }),
        '/auth/twitter': passport.authenticate('twitter'),
        '/auth/twitter/callback': passport.authenticate('twitter', {
          successRedirect: '/rooms',
          failureRedirect: '/'
        }),
        '/logout': (req, res, next) => {
          /*this is a passport method logout(), you can call it simply by req.logout()*/
          req.logout();
          res.redirect('/');
        }
    },

    'post': {
      //there is nothing to post for now
    },
    'NA': (req, res, next) => {
      res.status(404).sendFile(process.cwd() + '/views/404.htm');
    }
  }

return helper.route(routes);
}

// router.get('/', (req, res, next) => {
//   res.render('login');
// })
//
// router.get('/rooms', (req, res, next) => {
//   res.render('rooms');
// })
//
// router.get('/chatroom', (req, res, next) => {
//   res.render('chatroom');
// })
//
// module.exports = router;
