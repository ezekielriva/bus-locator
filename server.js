'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger'),
    socketio = require('socket.io'),
    util = require('meanio/lib/util'),
    appPath = process.cwd();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db, socketio);

// Start the app by listening on <port>, optional hostname
var server = app.listen(config.port, config.hostname);
console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

app.io = app.socketio.listen(server);
console.log('Socketio app listen');
function bootstrapSocketIo() {
        // Skip the app/routes/middlewares directory as it is meant to be
        // used and shared by routes as further middlewares and is not a
        // route by itself
        util.walk(appPath + '/server', 'socket', '', function(path) {
            require(path)(app.io);
        });
    }
bootstrapSocketIo();

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
