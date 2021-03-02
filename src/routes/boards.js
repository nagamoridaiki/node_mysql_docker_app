const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
const User = require("../models/user")
const Board = require("../models/board")
const boardsController = require('../controllers/boardsController');
const usersController = require('../controllers/usersController');

// トップページ
router.get('/', usersController.verifyJWT, boardsController.index);
router.get('/add', usersController.verifyJWT, boardsController.add);
router.post('/add', usersController.verifyJWT, boardsController.create);
router.get('/edit/:id', usersController.verifyJWT, boardsController.edit);


module.exports = router;
