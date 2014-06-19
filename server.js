'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger'),
    socketio = require('socket.io');

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

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
