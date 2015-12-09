'use strict';

var express = require('express');
var controller = require('./onsite.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);

module.exports = router;
