const express = require('express');
const router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/', async function(req, res) {
  const users = await db.User.findAll();
  res.render('login', { title: 'Docker-Node.js', content: users });
});

router.post('/create', async function(req, res) {
  const newTask = db.Task.build({
    task: req.body.task,
    done: false
  });
  await newTask.save();
  res.redirect('/');
});

router.post('/update', async function(req, res) {
  const task = await db.Task.findByPk(req.body.id);
  if (task) {
    task.done = !!(req.body.done);
    await task.save();
  }
  res.redirect('/');
});

router.post('/delete', async function(req, res) {
  const task = await db.Task.findByPk(req.body.id);
  if (task) {
    await task.destroy();
  }
  res.redirect('/');
});

module.exports = router;
