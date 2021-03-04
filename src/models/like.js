'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Like.init({
        userId: {
            type: DataTypes.INTEGER,
            references: 'User',
            referencesKey: 'id',
            allowNull: false
        },
        boardId: {
            type: DataTypes.INTEGER,
            references: 'Board',
            referencesKey: 'id',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Like',
    });
    Like.associate = function(models) {
        models.User.belongsToMany(models.Board, { through: Like });
        models.Board.belongsToMany(models.User, { through: Like });
    };
    return Like;
};