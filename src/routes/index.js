const express = require('express');
const { use } = require('../app');
const router = express.Router();
const usersController = require('./usersController');

router.get('/login', usersController.login);
router.get('/register', usersController.register);
router.post('/create', usersController.create, usersController.indexView);

router.post('/login', usersController.apiAuthenticate, usersController.index, usersController.indexView);
router.post('/delete/', usersController.verifyJWT, usersController.delete, usersController.indexView);


router.get('/',usersController.verifyJWT , usersController.index, usersController.indexView);
router.get('/logout', usersController.logout)


module.exports = router;
