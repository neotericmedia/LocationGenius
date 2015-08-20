'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OnsiteSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Onsite', OnsiteSchema);