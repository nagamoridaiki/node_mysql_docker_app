'use strict';
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        like_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'User',
            key: 'id'
            }
        },
        like_board_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'Board',
            key: 'id'
            }
        }
    });
    return Like;
  };