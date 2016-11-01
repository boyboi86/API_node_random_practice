'use strict';
/*Objectify routes content must not be array or null*/
const helper = require('../helper');
/*render method can only be called with there is a view folder plus whe the view engine is set
  it will be called as long as the file name is same as the res.render */
module.exports = () => {
  let routes = {
      'get': {
      '/': (req, res, next) => {
        res.render('login');
      },
      '/rooms': (req, res, next) => {
          res.render('rooms');
      },
      '/chat': (req, res, next) => {
        res.render('chatroom');
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
