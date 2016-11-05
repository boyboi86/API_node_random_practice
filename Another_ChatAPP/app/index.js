'use strict';

/*Social authentication logic*/
require('./auth')();
/*Redis configs*/
const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

/*Create a socket.io server to wrap around http that will wrap around the app itself*/
/*This architecture will ensure fallback in case if websocket doesn't do a handshake*/
let ioServer = app => {
  /*locals will persist in machine memory*/
  app.locals.chatrooms = [];
  const server = require('http').Server(app);
  /*bind the http server to socket.io instance*/
  const io = require('socket.io')(server);
  /*Set io to use ONLY websocket*/
  io.set('transports', ['websocket']);
  /*Config the pubClient of redis*/
  let pubClient = redis(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
  })
  /*subscribe client using redis to get back information in buffer state otherwise it will return as string*/
  let subClient = redis(config.redis.port, config.redis.host, {
    return_buffers: true,
    auth_pass: config.redis.password
  })
  io.adapter(adapter({
    pubClient,
    subClient
  }))
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
  ioServer,
  logger: require('./logger')
};
