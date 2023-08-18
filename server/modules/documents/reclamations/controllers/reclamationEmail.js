const catalogService = require('@services/catalogsService');
const httpStatus = require('http-status-codes');
const logger = require('@logging/logger');
const IncomingEmailLink = require('@documents/incomingEmails/models/incomingEmailLink');
const IncomingEmail = require('@documents/incomingEmails/models');
const itemModel = require('../models/reclamationEmail');

module.exports = {
  async createItem(req, res, next) {
    let response;
    try {
      const createData = { ...req.body };

      response = await catalogService.createItem(itemModel, createData);

      if (response.httpStatus === 200 && createData.type === 'INCOMING' && createData.uid) {
        await IncomingEmailLink.create({
          emailUid: createData.uid,
          emailId: createData.emailId,
          documentId: createData.reclamationId,
          documentType: 'reclamation',
          emailAccountId: createData.accountId,
        }).catch((error) => {
          console.error(error);
        });

        await IncomingEmail.update({ hasLinks: true }, { where: { id: createData.emailId } }).catch(() => {
          console.error(error);
        });
      }

      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err });
      return res
        .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async getAllItems(req, res, next) {
    let response;
    try {
      response = await catalogService.findAllItems(itemModel, req.query, [], [['emailDate', 'DESC']]);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in getAllItems Controller', { meta: err });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async getItemDetails(req, res, next) {
    let response;
    try {
      response = await catalogService.findItemById(itemModel, req.params.id);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in getItemDetails Controller', { meta: err });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async updateItem(req, res, next) {
    let response;
    try {
      response = await catalogService.updateItem(itemModel, req.body.id, req.body);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async deleteItem(req, res, next) {
    let response;
    try {
      response = await catalogService.deleteItem(itemModel, req.body.id);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },
};
