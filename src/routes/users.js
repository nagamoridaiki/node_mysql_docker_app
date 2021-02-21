const express = require('express');
const router = express.Router();
const db = require('../models');
const usersController = require('./usersController');


router.get('/', usersController.index);

module.exports = router;
