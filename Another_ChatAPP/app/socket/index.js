'use strict';

module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;

  allrooms.push({
    room: 'Good Food',
    roomID: '0001',
    users: []
  })

  allrooms.push({
    room: 'Cloud Computering',
    roomID: '0002',
    users: []
  })
  /*This is in charge of the namespace /roomslist in rooms.ejs to perform a handshake*/
  io.of('/roomslist').on('connection', socket => {
    /*When rooms.ejs emits 'getChatRoom' event it will perform a callback
      and serialize the list of chatroom and emits it back*/
    socket.on('getChatRoom', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    })
  })
}
