'use strict';

var express = require('express');
var controller = require('./locations.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:userid/:id', controller.show);
router.post('/:userid', controller.create);
router.put('/:userid/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:userid/:id', controller.destroy);

module.exports = router;
