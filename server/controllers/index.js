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

    socket.on('user location', function(user) {
      console.log('user location', user);
      var expected_user,
          user_index;

      expected_user = users.filter(function(element, index) {
        if( element.id === user.id ) {
          user_index = index;
          return true;
        }
        return false;
      });

      if ( expected_user.length > 0 ) {
        users[user_index] = user;
      } else {
        if ( user.id ) {
          users.push(user);
        }
      }
    });

    setInterval(function() {
      socket.emit('retrieve users', users);
    }, 1000);
  });


  io.on('disconnect', function(socket){
    console.log('a user disconnect');
  });
};
