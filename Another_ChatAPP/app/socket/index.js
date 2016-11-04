'use strict';

const helper = require('../helper');

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;
  /*This is in charge of the namespace /roomslist in rooms.ejs to perform a handshake*/
  io.of('/roomslist').on('connection', socket => {
    /*When rooms.ejs emits 'getChatRoom' event it will perform a callback
      and serialize the list of chatroom and emits it back*/
    socket.on('getChatRoom', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    })
    socket.on('createNewRoom', newRoomInput => {
      /*Check if current new room exists or not, if not create one*/
      if(!helper.findRoomByName(allrooms, newRoomInput)){
          allrooms.push({
            room: newRoomInput,
            roomID: helper.randomHex(),
            user: []
          })
          /* Emit an updated list  to creator */
          socket.emit('chatRoomsList', JSON.stringify(allrooms));
          /*Emits an updated list to all open sockets*/
          socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    })
  })
}
