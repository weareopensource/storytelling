'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Box = mongoose.model('Box'),
  Slide = mongoose.model('Slide'),
  Image = mongoose.model('Image'),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

  exports.list = function(req, res) {
    Box.find()
    .sort('-created')
    .populate({
      path: 'content.imageId',
      model: 'Image'})
    .exec()
    .then(function(boxes) {
      return res.json(boxes);
    })
    .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  };

/**
 * Create an box
 */
exports.create = function(req, res) {
  const boxP = Box.create(req.body)
  const slideP = Slide.findOne({ _id: req.body.slideId });
  console.log(req.body);
  Promise.all([boxP, slideP])
  .then(function(result) {
    const box = result[0];
    const slide = result[1];
    Box.find({"slideId": mongoose.Types.ObjectId(req.body.slideId)}).exec().then(function(boxes){
      console.log(boxes)
        for (var item in boxes){
          if(slide.boxIds.indexOf(boxes[item]._id)===-1)
            slide.boxIds.push(boxes[item]._id)
        }
        return Slide.findByIdAndUpdate(req.body.slideId, slide);
      });
    })
    .then(function(slide) {
      console.log('slide', slide);
      return boxP;
    })
    .then(function(box) {
      return res.json(box);
    })
    .catch(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        })
      }
    });
};


exports.update = function(req, res) {
  console.log(req.params, req.body);
  Box.findByIdAndUpdate(req.params.boxId, req.body)
  .exec()
  .then(function(box) {
    return res.json(box);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a box
 */
exports.delete = function(req, res) {
  Box.findByIdAndRemove(req.params.boxId)
  .populate({path:'content.imageId', model :'Image'})
  .exec()
  .then(function(box) {
    Image.findByIdAndRemove(box.content.imageId._id).exec();
    return res.json(box);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

exports.findOneById = function(id) {
  Box.findById(id)
  .exec()
  .then(function(box) {
    if (!box) {
      return res.status(404).send({
        message: 'No box with that identifier has been found'
      });
    }
    req.box = box;
    next();
  })
  .catch(function(err) {
    return next(err);
  });
}

exports.updateBackground = function (req, res){
  console.log(req.body);
  var slide = {
    background : req.body.background
  }
  Slide.findByIdAndUpdate(req.body.id, slide).exec()
  .then(function(slide){
     res.json('OK');
  });
  res.json('ok');

}
