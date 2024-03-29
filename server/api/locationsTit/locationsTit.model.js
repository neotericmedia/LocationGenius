'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocationsTitSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('LocationsTit', LocationsTitSchema);
