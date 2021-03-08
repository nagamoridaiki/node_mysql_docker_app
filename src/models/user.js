'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "名前は必ず入力して下さい。"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "パスワードは必ず入力下さい。"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "メールアドレスを入力下さい。"
                }
            }
        },
    }, {});
    User.associate = function(models) {
        //User.hasMany(models.Board);
        User.belongsToMany(models.Board, {
            through: 'Like',
            as: 'Board',
            foreignKey: 'like_user_id'
        });
    };
    return User;
};