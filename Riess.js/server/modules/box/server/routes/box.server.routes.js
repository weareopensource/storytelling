'use strict';

/**
 * Module dependencies
 */
var boxPolicy = require('../policies/box.server.policy'),
  box = require('../controllers/box.server.controller');

module.exports = function(app) {
  // users-list all box
  app.route('/api/boxes').all(boxPolicy.isAllowed)
  .get(box.list)
  .post(box.create);

  // Single box routes
  app.route('/api/boxes/:boxId')
  //.all(boxPolicy.isAllowed)
  .get(box.findOneById)
    .patch(box.update)
    .delete(box.delete);

    app.route('/api/boxes/:boxId')
//    .all(boxPolicy.isAllowed)
    app.route('/api/boxes/background').all(boxPolicy.isAllowed)
    .post(box.updateBackground)
};
