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
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: db.User,
                required: true
            }],
        }).then(board => {
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
    like: async(req, res, next) => {
        console.log("いいねボタンが押されました")
            //いいねがついているかを判定する。
        await db.Like.findOne({
            where: {
                userId: req.body.userId,
                boardId: req.body.boardId,
            }
            //既にいいねがついている場合はいいねをはずす。
        }).then(async(like) => {


            if (like) {
                console.log("既にいいねがついています", like)
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
                console.log("まだいいねがついていないのでこれから付けます。", like)
                    //いいねをつける
                const form = {
                    userId: req.body.userId,
                    boardId: req.body.boardId,
                };
                db.sequelize.sync()
                    .then(() => db.Like.create(form)
                        .then(() => {
                            res.redirect('/boards');
                        }).catch((err) => {
                            res.render('layout', { layout_name: 'error', title: 'ERROR', msg: '記事にいいねができませんでした。' });
                            res.sendStatus(500)
                        }));
            }
        }).catch(() => {
            res.render('layout', { layout_name: 'error', title: 'ERROR', msg: '記事にいいねができませんでした。' });
            res.sendStatus(500)
        });

    }
}