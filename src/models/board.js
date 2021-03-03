'use strict';
module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
        userId: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "利用者は必須です。"
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "タイトルは必須です。"
                },
                len: {
                    args: [1, 50],
                    msg: "1〜50字以内で入力してください"
                }
            }
        },
        message: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "本文は必須です。"
                },
                len: {
                    args: [1, 140],
                    msg: "1〜140字以内で入力してください"
                }
            }
        }
    }, {});
    Board.associate = function(models) {
        Board.belongsTo(models.User);
    };
    return Board;
};