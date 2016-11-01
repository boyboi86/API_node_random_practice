'use strict';

const router = require('express').Router();

//iterate thru the above Objectify and perform a recursive method to call
let _registerRoutes = (routes, method) => {
  for (let key in routes){
    if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      //after fufilled criteria then go ahead and run
      _registerRoutes(routes[key], key);
    } else {
      //register routes
      if(method === 'get'){
        router.get(key, routes[key]);
      } else if(method === 'post'){
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
}

let route = routes => {
  _registerRoutes(routes);
  return router;
}

module.exports = {
  route
}
