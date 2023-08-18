const PropertyValue = require('../models/propertyValue')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    const propertyValues = await PropertyValue.findAll(filter)
    res
      .status(200)
      .send(propertyValues)
      .catch((err) => {
        console.error(err)
        res.status(400).send({
          message: 'Bad request',
        })
      })
  },

  async findById(req, res, next) {
    const propertyValue = await PropertyValue.findByPk(req.params.id)

    if (currentValue) {
      res.status(200).send(propertyValue)
    } else {
      res.status(400).send({ message: 'Property value not find' })
    }
  },
}
