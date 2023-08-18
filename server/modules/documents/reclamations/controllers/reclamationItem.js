const catalogService = require('@services/catalogsService');
const httpStatus = require('http-status-codes');
const logger = require('@logging/logger');
const ObjectModel = require('../models/reclamationItem');
const uuidlib = require('uuid')

const ReclamationSubjectModel = require('@catalogs/reclamationSubjects/models')
const ReclamationExecutionTypeModel = require('@catalogs/reclamationExecutionTypes/models')
const ReclamationDecisionModel = require('@catalogs/reclamationDecisions/models')
const ReclamationPerpetratorModel = require('@catalogs/reclamationPerpetrator/models')
const ReclamationReasonModel = require('@catalogs/reclamationReasons/models')
const ReclamationClientDemand = require('@catalogs/reclamationClientDemands/models')

module.exports = {
  async findAll(req, res, next) {
    const include = [
      {
        model: ReclamationSubjectModel,
        as: '_reclamationSubject',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationExecutionTypeModel,
        as: '_reclamationExecutionType',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationDecisionModel,
        as: '_reclamationDecision',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationPerpetratorModel,
        as: '_perpetrator',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationReasonModel,
        as: '_reclamationReason',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationClientDemand,
        as: '_clientDemand',
        attributes: ['id', 'description'],
      },
    ]

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
      include
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
    const include = [
      {
        model: ReclamationSubjectModel,
        as: '_reclamationSubject',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationExecutionTypeModel,
        as: '_reclamationExecutionType',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationDecisionModel,
        as: '_reclamationDecision',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationPerpetratorModel,
        as: '_perpetrator',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationReasonModel,
        as: '_reclamationReason',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationClientDemand,
        as: '_clientDemand',
        attributes: ['id', 'description'],
      },
    ]

    let item = await ObjectModel.findByPk(req.params.id, { include });

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

  async deleteAllItems(req, res, next) {
    let response;
    try {
      response = await ObjectModel.destroy({
        where: {
          reclamationId: req.body.reclamationId,
        },
      });
      return res.status(200).send(true);
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err });
      return res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async deleteItem(req, res, next) {
    let response;
    try {
      response = await catalogService.deleteItem(ObjectModel, req.body.id);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err });
      return res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },
};
