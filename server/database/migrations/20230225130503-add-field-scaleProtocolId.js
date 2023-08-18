'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('scales', 'scaleProtocolId', {
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'scale_protocols',
					},
					key: 'id',
				},
			}),
		]);
	},

	async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.removeColumn("scales", "scaleProtocolId", { transaction: t }),
			]);
		});

	}
};
