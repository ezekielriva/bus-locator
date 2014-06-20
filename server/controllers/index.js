'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

    var modules = [];

    // Preparing angular modules list with dependencies
    for (var name in mean.modules) {
        modules.push({
            name: name,
            module: 'mean.' + name,
            angularDependencies: mean.modules[name].angularDependencies
        });
    }

    function isAdmin() {
        return req.user && req.user.roles.indexOf('admin') !== -1;
    }

    // Send some basic starting info to the view
    res.render('index', {
        user: req.user ? {
            name: req.user.name,
            _id: req.user._id,
            username: req.user.username,
            roles: req.user.roles
        } : {},
        modules: modules,
        isAdmin: isAdmin,
        adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
    });
};

exports.io = function(io) {
  console.log('Index Controller SOCKET');
  var users = [];
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('send:user_location', function(user) {
      console.log('send:user_location', user);
      var user_index = -1;

      users.filter(function(element, index) {
        if( element.id === user.id ) {
          user_index = index;
          return true;
        }
        return false;
      });

      if ( user_index >= 0 ) {
        users[user_index].latitude = user.latitude;
        users[user_index].longitude = user.longitude;
      } else {
        if ( user.id ) {
          users.push(user);
        }
      }
    });

    socket.on('beforeDisconnect', function(data) {
      console.log(data);
      var user_index = -1;
      users.filter(function(user, index) {
        if ( user.id === data ) {
          user_index = index;
          return true;
        }
        return false;
      });

      if (user_index >= 0) {
        users.splice(user_index, 1);
      }
      socket.broadcast.emit('user:disconnect', data);
      socket.disconnect();
    });

    socket.on('disconnect', function(){
      console.log('a user disconnect');
    });

    setInterval(function() {
      socket.emit('response:users', users);
    }, 1000);
  });
};
