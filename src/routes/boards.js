const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
const User = require("../models/user")
const Board = require("../models/board")
const pnum = 10;

// トップページ
router.get('/',(req, res, next)=> {
  res.redirect('/boards/0');
});

// トップページにページ番号をつけてアクセス
router.get('/:page',(req, res, next)=> {
  db.Board.findAll({
    limit: pnum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(board => {
    const data = {
      title: 'Boards',
      login:req.session.user,
      content: board,
    }
    console.log("board[0].User.nameの中身", board[1].User.name)
    res.render('layout', { layout_name: 'boards/index', data});
  });
});

// メッセージフォームの送信処理
router.post('/add',(req, res, next)=> {
    const form = {
        userId: req.session.user.id,
        title: req.body.title,
        message:req.body.msg
    };
  db.sequelize.sync()
    .then(() => db.Board.create(form)
    .then(brd=>{
      console.log("brd", brd)
      res.redirect('/boards');
    })
    .catch((err)=>{
      console.log("エラー", err)
      res.redirect('/boards');
    })
    )
});

// 利用者のホーム
router.get('/home/:user/:id/:page',(req, res, next)=> {
  if (check(req,res)){ return };
  const id = req.params.id * 1;
  const pg = req.params.page * 1;
  db.Board.findAll({
    where: {userId: id},
    offset: pg * pnum,
    limit: pnum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login:req.session.login,
      userId:id,
      userName:req.params.user,
      content: brds,
      page:pg
    }
    res.render('boards/home', data);
  });
});

module.exports = router;
