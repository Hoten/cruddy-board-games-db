'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'games',
            'numberOfPlayers',
            Sequelize.STRING
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('games', 'numberOfPlayers');
    }
};
