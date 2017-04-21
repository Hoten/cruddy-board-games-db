'use strict';
module.exports = function(sequelize, DataTypes) {
    var game = sequelize.define('game', {
        name: {
            type: DataTypes.STRING,
            validate: {
                len: [3, 100]
            }
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                len: [3, 100]
            }
        },
        numberOfPlayers: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 100000
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return game;
};
