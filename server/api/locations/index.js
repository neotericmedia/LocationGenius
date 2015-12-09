'use strict';

var express = require('express');
var controller = require('./locations.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:userid/:id', auth.isAuthenticated(), controller.show);
router.post('/:userid', auth.isAuthenticated(), controller.create);
router.put('/:userid/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:userid/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
