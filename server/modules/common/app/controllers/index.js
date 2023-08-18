const Sequelize = require('@database/dbConnection')

module.exports = {
  async getObjectMetadata(req, res, next) {
    const { objectType, tableName } = req.query

    let Model
    if (objectType) {
      Model = Sequelize.models[objectType]
    } else {
      Object.keys(Sequelize.models).forEach((key) => {
        let table = Sequelize.models[key].getTableName()
        if (table === tableName) {
          Model = Sequelize.models[key]
        }
      })
    }

    if (!Model) {
      console.error('Model not found')
      return res.status(400).send({ message: 'Model not found' })
    }

    let attributes = []
    let associations = []

    Object.keys(Model.associations).forEach((key) => {
      const association = {}

      if (Model.associations[key].hasOwnProperty('options')) {
        associations.push({ field: key, foreignKey: Model.associations[key].options.foreignKey })
      }
    })

    const attribs = Model.getAttributes
    for (let key in Model.rawAttributes) {
      let attrib = {
        field: key,
        type: Model.rawAttributes[key].type.key,
      }

      if (Model.rawAttributes[key].references) {
        attrib.model = Model.rawAttributes[key].references.model

        const association = associations.find((el) => {
          return el.foreignKey === key
        })

        if (association) {
          attrib.field = association.field
          attrib.foreignKey = key
        }
      }

      attributes.push(attrib)
    }

    res.status(200).send(attributes)
  },

  async getObjects(req, res, next) {
    let objects = []

    Object.keys(Sequelize.models).forEach((model) => {
      const ObjectModel = Sequelize.models[model]

      if (ObjectModel.options.mainModel) {
        objects.push({ model, name: ObjectModel.options.name, tableName: ObjectModel.getTableName() })
      }
    })

    objects.sort((a, b) => (a.model.toLowerCase() > b.model.toLowerCase() ? 1 : -1))

    res.status(200).send(objects)
  },

  async getModels(req, res, next) {
    let objects = []

    Object.keys(Sequelize.models).forEach((model) => {
      let tableName = Sequelize.models[model].getTableName()
      objects.push({ model, tableName, name: Sequelize.models[model].options.name })
    })

    res.status(200).send(objects)
  },
}
