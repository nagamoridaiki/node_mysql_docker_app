'use strict';
module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
        user_id: {
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
                    msg: "メッセージは必須です。"
                }
            }
        }
    }, {});
    Board.associate = function(models) {
        //Board.belongsTo(models.User);
        Board.belongsToMany(models.User, {
            through: 'Like',
            as: 'User',
            foreignKey: 'like_board_id'
        });
    };
    return Board;
};