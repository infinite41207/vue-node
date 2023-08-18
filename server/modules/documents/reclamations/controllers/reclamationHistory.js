const ObjectModel = require('../models/reclamationHistory');
const uuidlib = require('uuid');
const objectDescription = 'Ship';
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}');

    if (filter.searchStr) {
      filter.name = {
        [Op.iLike]: `%${filter.searchStr}%`,
      }
      delete filter.searchStr;
    }

    let items = await ObjectModel.findAll({
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
  },

  async findById(req, res, next) {
    let item = await ObjectModel.findByPk(req.params.id);

    if (item) {
      res.status(200).send(item);
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },

  async create(req, res) {
    const objectData = { ...req.body };
    objectData.uuid = uuidlib.v4();

    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          res.status(200).send(newItem);
        } else {
          res.status(400).send({ message: `${objectDescription} is not created` });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send({ message: `${objectDescription} is not created` });
      });
  },

  async update(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.params.id);

    if (existItem) {
      const objectData = { ...req.body };

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem);
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' });
        });
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },

  async changeDeletionMark(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.body.id);
    
    if (existItem) {
      const objectData = { 
        id: req.body.id,
        markedToDelete: !existItem.markedToDelete
      };

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem);
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' });
        });
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },

  async delete(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.params.id);

    if (existItem) {
      await existItem
        .destroy(req.params.id)
        .then(() => {
          res.status(200).send({ message: 'OK' });
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' });
        });
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },
};
