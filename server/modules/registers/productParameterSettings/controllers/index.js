const ObjectModel = require('../models');
const { Op } = require('sequelize');
const httpStatus = require('http-status-codes');

module.exports = {
  async findAll(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}');

    let items = await ObjectModel.findAll({
      where: filter,
      order: ['id'],
    });

    if (items) {
      items = JSON.stringify(items);
      items = JSON.parse(items);

      if (items.length === 0) {
        filter.customerId = { [Op.eq]: null };

        items = await ObjectModel.findAll({
          where: filter,
          order: ['id'],
        });

        if (items) {
          items = JSON.stringify(items);
          items = JSON.parse(items);

          res.status(200).send(items);
        } else {
          console.error(err);
          res.status(400).send({
            message: 'Bad request',
          });
        }
      } else {
        res.status(200).send(items);
      }
    } else {
      console.error(err);
      res.status(400).send({
        message: 'Bad request',
      });
    }
  },
};
