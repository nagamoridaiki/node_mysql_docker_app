const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
const User = require("../models/user")
const Board = require("../models/board")
const Like = require("../models/like")

module.exports = {
    index: (req, res, next) => {
        db.Board.findAll({
            include: 'User',
            order: [
                ['id', 'DESC']
              ],
        })
        .then(async(board) => {
            const data = {
                title: 'Boards',
                login: req.session.user,
                content: board,
            }
            res.render('layout', { layout_name: 'boards/index', data });
        });
    },
    add: (req, res, next) => {
        const data = {
            title: 'Boards/Add',
            login: req.session.user,
            err: null
        }
        res.render('layout', { layout_name: 'boards/add', data });
    },
    create: (req, res, next) => {
        const form = {
            userId: req.session.user.id,
            title: req.body.title,
            message: req.body.msg
        };
        db.sequelize.sync()
            .then(() => db.Board.create(form)
                .then(brd => {
                    res.redirect('/boards');
                })
                .catch((err) => {
                    const data = {
                        title: 'Boards',
                        login: req.session.user,
                        err: err,
                    }
                    res.render('layout', { layout_name: 'boards/add', data });
                })
            )
    },
    edit: async(req, res, next) => {
        const BoardId = req.params.id;
        await db.Board.findOne({
            where: {
                id: BoardId,
            }
        }).then(board => {
            const data = {
                title: 'Boards/Edit',
                login: req.session.user,
                board: board,
                err: null
            }
            res.render('layout', { layout_name: 'boards/edit', data });
        });
    },
    update: async(req, res, next) => {
        const BoardId = req.params.id;
        await db.Board.update({
            title: req.body.title,
            message: req.body.msg
        }, {
            where: { id: BoardId, }
        }).then(() => {
            res.redirect('/boards');
        }).catch((err) => {
            res.render('layout', { layout_name: 'error', title: 'ERROR', msg: '記事編集に失敗しました。' });
            res.sendStatus(500)
        })
    },
    delete: async(req, res, next) => {
        db.sequelize.sync()
        .then(async() => {
            const borad_id = req.params.id;
            await db.Board.destroy({
                where:{id: borad_id}
            })
            return borad_id;
        }).then(async(borad_id) => {
            await db.Like.destroy({
                where:{boardId: borad_id}
            })
        }).then(() => {
            res.redirect('/boards');
        }).catch((err) => {
            res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
        });

    },
    like: async(req, res, next) => {
            //いいねがついているかを判定する。
        await db.Like.findOne({
            where: {
                userId: req.body.userId,
                boardId: req.body.boardId,
            }
            //既にいいねがついている場合はいいねをはずす。
        }).then(async(like) => {
            if (like) {
                console.log("Like delete !!!!!")
                    //既にいいねがついている場合はいいねをはずす。
                await db.Like.destroy({
                    where: {
                        userId: req.body.userId,
                        boardId: req.body.boardId,
                    }
                }).then(() => {
                    res.redirect('/boards');
                })
            } else {
                console.log("Like make it !!!!!")
                    //いいねをつける
                const form = {
                    userId: req.body.userId,
                    boardId: req.body.boardId,
                };
                db.sequelize.sync()
                    .then(async() => {
                        await db.Like.create(form);
                    }).then(() => {
                        res.redirect('/boards');
                    })
                    .catch((err) => {
                        res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
                    });
            }
        }).catch((err) => {
            res.render('layout', { layout_name: 'error', title: 'ERROR', msg: err });
            res.sendStatus(500)
        });

    }
}