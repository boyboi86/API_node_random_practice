'use strict';

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;
  /*This is in charge of the namespace /roomslist in rooms.ejs to perform a handshake*/
  io.of('/roomslist').on('connection', socket => {
    console.log('socket.io connected to client');
  })
}
