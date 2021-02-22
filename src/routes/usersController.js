"use strict";

const User = require("../models/user")
const jsonWebToken = require('jsonwebtoken')
const db = require('../models/index')
const httpStatus = require('http-status');

module.exports = {
    index: async (req, res, next) => {
        const users = await db.User.findAll();
        res.render('login', { title: 'Docker-Node.js', content: users });
    },
    show: async (req, res, next) => {
      await db.User.findOne({
        where:{
          email:req.body.email,
          password:req.body.password,
        }
      }).then(usr=>{
        var data = {
          title: 'ログインしました！',
          content: usr
        }
        res.render('show', data);
      })
    },
    apiAuthenticate: async (req, res, next) => {
      await db.User.findOne({
            where:{
              email:req.body.email,
              password:req.body.password,
            }
        }).then(usr=>{
            if (usr != null) {
              const payload = {
                id : usr.id,
                email : usr.email,
                password : usr.password
              }
              console.log("payload", payload)//{ id: 1, name: 'Taro', password: 'yamada' }
              var token = jsonWebToken.sign(payload, 'secret');
              
              // トークンを返します。
              res.json({
                success: true,
                msg: "Authentication successfully finished",
                token: token
              });
              next()

            } else {
              var data = {
                title:'Users/Login',
                content:'名前かパスワードに問題があります。再度入力下さい。'
              }
              res.render('users/login', data);
            }
        })
    },
    verifyJWT: (req, res, next) => {

      var token = req.body.token || req.query.token || req.headers['x-access-token'];

      if (token) {
        jsonWebToken.verify(token, 'secret', function(error, decoded) {
          if (error) {
            return res.json({ success: false, message: 'トークンの認証に失敗しました。' });
          } else {
            // 認証に成功したらdecodeされた情報をrequestに保存する
            req.decoded = decoded;
            next();
          }
        })
      } else {
        return res.status(403).send({
            success: false,
            message: 'トークンがありません。',
        });
      }
    }
      
}