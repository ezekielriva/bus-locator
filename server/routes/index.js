'use strict';

module.exports = function(app) {

    // Home route
    var index = require('../controllers/index');

    app.route('/').get(function(req, res) {
      index.io(app.io);
      index.render(req, res);
    });
};
