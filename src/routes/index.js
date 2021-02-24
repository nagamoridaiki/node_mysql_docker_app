const express = require('express');
const { use } = require('../app');
const router = express.Router();
const usersController = require('./usersController');
const apiRoutes = require("./apiRoutes");

router.use("/api", apiRoutes);

router.get('/', usersController.login);
router.get('/register', usersController.register);
router.post('/create', usersController.create, usersController.indexView);

router.post('/login', usersController.apiAuthenticate, usersController.index, usersController.indexView);

router.get('/index',usersController.verifyJWT , usersController.index, usersController.indexView);



module.exports = router;
