'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Slide = mongoose.model('Slide'),
  Presentation = mongoose.model('Presentation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

exports.create = function (req, res) {
  const slideP = Slide.create(req.body)
  const presentationP = Presentation.findOne({ _id: req.body.presentationId });

  Promise.all([slideP, presentationP])
  .then(function(result) {
    const slide = result[0];
    const presentation = result[1];
    presentation.slideIds.push(slide._id)
    return Presentation.findByIdAndUpdate(presentation.id, presentation);
  })
  .then(function(presentation) {
    return slideP;
  })
  .then(function(slide) {
    return res.json(slide);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    })
  });
};

exports.update = function(req, res, next) {
  //transfer image object to id string
  //if (presentation.presentation.slideImage && presentation.presentation.slideImage._id) presentation.presentation.slideImage = presentation.presentation.slideImage._id;

  Slide.findByIdAndUpdate(req.params.slideId, req.body)
  .exec()
  .then(function(slide) {
    res.json(slide);
  })
  .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
    })
  })
}

exports.delete = function(req, res) {
  const slideId = req.params.slideId
  const slideP = Slide.findByIdAndRemove(slideId).exec();

  slideP
  .then(function(slide) {
    return Presentation.findById(slide.presentationId);
  })
  .then(function(presentation) {
    presentation.slideIds = presentation.slideIds.filter(function(slideId) {
      return slideId.toString() !== req.params.slideId;
    });
    return Presentation.findByIdAndUpdate(presentation._id, presentation)
  })
  .then(function(presentation) {
    return slideP
  })
  .then(function(slide) {
    return res.json(slide);
  })
  .catch(function(err) {
    return res.status(422).send({
    message: errorHandler.getErrorMessage(err)
    })
  });
};

exports.findOneByID = function(req, res) {

  if (!mongoose.Types.ObjectId.isValid(req.params.slideId)) {
    return res.status(400).send({
      message: 'slide is invalid'
    });
  }
  const slideId = req.params.slideId;

  Slide.findById(slideId).populate({
    path: 'boxIds'
  })
  .exec()
  .then(function(slide) {
    return res.json(slide);
  })
  .catch(function(err) {
    return res.status(404).send({
      message: 'No slide with that identifier has been found'
    });
  });
};
