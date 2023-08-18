const Parameter = require('../models/parameter');
const { Sequelize } = require('sequelize');

module.exports = {
  async findAll(req, res, next) {
    const { productId, lang } = req.body;

    let query = {
      where: { productId },
      order: [['serialNumber', 'ASC']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'productId', 'filterDefault', 'filter'],
      },
    };

    const needTranslate = lang && lang !== 'pl';

    if (needTranslate === false) {
      query.attributes.exclude.push('lang');
    }

    let productParameters = await Parameter.findAll(query);

    if (productParameters) {
      productParameters = JSON.stringify(productParameters);
      productParameters = JSON.parse(productParameters);

      if (needTranslate === true) {
        for (let param of productParameters) {
          if (param.lang) {
            const translates = JSON.parse(param.lang);
            param.name = translates[lang] ? translates[lang] : param.name;
          }
        }
      }

      res.status(200).send(productParameters);
    } else {
      res.status(400).send({
        message: 'Bad request',
      });
    }
  },

  async findById(req, res, next) {
    const currentParameter = await Parameter.findByPk(req.params.id);

    if (currentParameter) {
      res.status(200).send(currentParameter);
    } else {
      res.status(400).send({ message: 'Product parameter not find' });
    }
  },
};
