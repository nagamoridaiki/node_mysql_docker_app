const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async function(req, res) {
  const users = await db.User.findAll();

  res.render('login', { title: 'Docker-Node.js', content: users });
});

module.exports = router;
