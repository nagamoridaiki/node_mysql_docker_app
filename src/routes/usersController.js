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

              
              jsonWebToken.verify(token, "secret", (errors, payload) => {
                console.log("payload2", payload.id)
                
                if (payload) {
                  console.log("OK! VERIFY JWT TOKEN", payload)
                } else {
                  res.status(httpStatus.UNAUTHORIZED).json({
                    error: true,
                    message: "Cannot verify API token."
                  });
                  next();
                }
              });

              /*
              // トークンを返します。
              res.json({
                success: true,
                msg: "Authentication successfully finished",
                token: token
              });
              next();*/
            } else {
              var data = {
                title:'Users/Login',
                content:'名前かパスワードに問題があります。再度入力下さい。'
              }
              res.render('users/login', data);
            }
        })
    },



}