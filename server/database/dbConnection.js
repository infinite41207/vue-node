const Sequelize = require('sequelize')
const uuid = require('uuid')

const { db_name, db_user, db_password, db_dialect, db_host, db_port } = require('./config')

const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: db_dialect,
  host: db_host,
  port: db_port,
  logging: false,
  define: {
    hooks: {
      beforeValidate: (record, options) => {
        if (record.dataValues.id === null) {
          record.dataValues.id = uuid.v4()
        }
      },
    },
  },
})

module.exports = sequelize
