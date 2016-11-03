'use strict';

/*Social authentication logic*/
require('./auth')();

/*Create a socket.io server to wrap around http that will wrap around the app itself*/
/*This architecture will ensure fallback in case if websocket doesn't do a handshake*/
let ioServer = app => {
  /*locals will persist in machine memory*/
  app.locals.chatrooms = [];
  const server = require('http').Server(app);
  /*bind the http server to socket.io instance*/
  const io = require('socket.io')(server);
  io.use((socket, next) => {
    /*by using io.use it will invoke a callback with socket and next as params*/
    /*Passing into the callback the socket module 3 params
    so that the session can pass their express-session req to socket.req but nothing is required for it to be res so we used {}*/
    require('./session')(socket.request, {}, next);
  });
  require('./socket')(io, app);
  /*merely return server because socket.io has been locked together*/
  return server;
}

module.exports = {
  router : require('./routes')(),
  session: require('./session'),
  ioServer
};
