'use strict';

module.exports = function(io) {
  console.log('Index Controller SOCKET');
  var users = {};
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('send:user_location', function(user) {
      console.log('send:user_location', user);
      if( user.id ) {
        users[user.id] = {
          id: user.id,
          latitude: user.latitude,
          longitude: user.longitude
        };
        socket.broadcast.emit('send:update_location', users[user.id]);
      }
    });

    socket.on('beforeDisconnect', function(userId) {
      delete users[userId];
      socket.broadcast.emit('user:disconnect', userId);
      socket.disconnect();
    });

    socket.on('disconnect', function(){
      console.log('a user disconnect');
    });
  });
};
