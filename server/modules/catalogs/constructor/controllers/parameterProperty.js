const ParameterProperty = require('../models/parameterProperty');

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}');

    const paramProperties = await ParameterProperty.findAll(filter);
    res
      .status(200)
      .send(paramProperties)
      .catch((err) => {
        console.error(err);
        res.status(400).send({
          message: 'Bad request',
        });
      });
  },
  async findById(req, res, next) {
    const currentValue = await ParameterProperty.findByPk(req.params.id);

    if (currentValue) {
      res.status(200).send(currentValue);
    } else {
      res.status(400).send({ message: 'Param value not find' });
    }
  },
};
