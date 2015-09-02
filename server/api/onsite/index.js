'use strict';

var express = require('express');
var controller = require('./onsite.controller');

var router = express.Router();

//router.get('/:id/:date', controller.index);
//router.get('/:id/:date', controller.index);

router.get('/:id', controller.index);
//router.get('/:id', controller.show);

//router.get('/:id/:date', controller.show);

//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
