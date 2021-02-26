"use strict";

const User = require("../models/user")
const jsonWebToken = require('jsonwebtoken')
const db = require('../models/index')
const httpStatus = require('http-status');
const passport = require("passport");


module.exports = {
    login: async (req, res, next) => {
        const users = await db.User.findAll();
        res.render('layout', { layout_name: 'login', title: 'login', content: users });
    },
    register: async (req, res, next) => {
        const users = await db.User.findAll();
        res.render('layout', { layout_name: 'Register', title: 'Register', content: users });
    },
    index: (req, res, next) => {
      db.User.findAll()
        .then(users => {
          res.locals.users = users;
          next();
        })
        .catch(error => {
          console.log(`Error fetching users: ${error.message}`);
          next(error);
        });
    },
    indexView: (req, res) => {
      res.render("layout", { layout_name: 'index', title: 'Index' });
    },
    create: (req, res, next) => {
      const form = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      };
      db.sequelize.sync()
        .then(() => db.User.create(form)
        .then(usr=> {
          const payload = {
            id : usr.id,
            email : usr.email,
            password : usr.password
          }
          console.log("payload", payload)//{ id: 1, name: 'Taro', password: 'yamada' }
          var token = jsonWebToken.sign(payload, 'secret');
          req.session.token = token;
          res.redirect('/')
        })
        .catch(err=> {
          var data = {
            title: 'Users/Add',
            form: form,
            err: err
          }
          res.render('error', data);
        })
        )
    },
    delete: (req, res, next) => {
      db.sequelize.sync()
      .then(() => db.User.destroy({
        where:{id:req.body.id}
      }))
      .then(usr => {
        res.redirect('/');
      });
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
              let data = {
                success: true,
                title: "Authentication successfully finished",
                token: token,
                content: usr
              };
              req.session.token = token;
              next()
            } else {
              res.render('error');
            }
        })
    },
    authenticate: passport.authenticate("local", {
      failureRedirect: "/users/login",
      successRedirect: "/users",
    }),
    verifyJWT: (req, res, next) => {
      var token = req.session.token
      if (token) {
        jsonWebToken.verify(token, 'secret', function(error, decoded) {
          if (error) {
            return res.json({ success: false, message: 'トークンの認証に失敗しました。' });
          } else {
            // 認証に成功したらdecodeされた情報をrequestに保存する
            console.log("認証に成功しました")
            req.decoded = decoded;
            next();
          }
        })
      } else {
        res.redirect('/login')
      }
    },
    logout: (req, res, next) => {
      req.session.token = null;
      res.redirect('/login')
    },
      
}