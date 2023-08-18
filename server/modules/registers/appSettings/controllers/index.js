const AppSetting = require('../models/index');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async findAll(req, res, next) {
    let filter = {};

    if (req.body.filter) {
      filter = req.body.filter;
    }

    const response = await AppSetting.findAll({ where: filter, order: ['id'] });

    if (response) {
      res.status(200).send(response);
    } else {
      console.log(err);
      res.status(400).send({
        message: 'Bad request',
      });
    }
  },

  async findByKey(req, res, next) {
    let filter = {
      key: req.body.userSettingItemKey,
    };

    let response = await UserSettingItem.findAll({ where: filter });
    if (!response) {
      res.status(400).send({ message: 'Ustawienie użytkownika nie znaleziony' });
      return;
    }

    if (response.length === 0) {
      res.status(400).send({ message: 'Ustawienie użytkownika nie znaleziony' });
    }

    filter = {
      userId: req.body.userId,
      userSettingItemId: response[0].id,
    };

    response = await UserSetting.findAll({ where: filter });

    if (response) {
      // console.log('response: ', JSON.stringify(response, null, 2))

      if (response.length === 0) {
        res.status(400).send({ message: 'Ustawienie użytkownika nie znaleziony' });
      } else {
        let returnValue;
        if (response[0].valueType === 'Numer') returnValue = response[0].valueNumber;
        else if (response[0].valueType === 'Tekst') returnValue = response[0].valueString;
        else if (response[0].valueType === 'Logiczne') returnValue = response[0].valueBoolean;
        else if (response[0].valueType === 'Ref') returnValue = response[0].valueRef;
        res.status(200).send(returnValue);
      }
    } else {
      res.status(400).send({ message: 'Ustawienie użytkownika nie znaleziony' });
    }
  },

  async createItem(req, res, next) {
    let response;
    try {
      response = await catalogService.createItem(itemModel, req.body);
      return res.status(response.httpStatus).send(response);
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
    }
  },

  async update(req, res, next) {
    const existUserSetting = await UserSetting.findByPk(req.params.id);

    if (existUserSetting) {
      //update only img url and description
      const { imgUrl, description, sortNumber } = req.body;

      const updatedProduct = await existUserSetting.update(req.body).catch((err) => {
        res.status(400).send({ message: 'błąd wewnętrzny' });
      });

      res.status(200).send({ message: 'OK' });
    } else {
      res.status(400).send({ message: 'Ustawienie użytkownika nie znaleziony' });
    }
  },
};
