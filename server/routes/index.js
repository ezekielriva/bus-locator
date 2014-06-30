'use strict';

module.exports = function(app) {

    // Home route
    var index = require('../controllers/index');

    app.route('/').get(function(req, res) {
      index.render(req, res);
    });
};
