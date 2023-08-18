const ExchangeObject = require("../models");
const exchangeObjectService = require("@services/exchangeObjectService");

module.exports = {
  async findAll(req, res, next) {
    let exchangeObjects = await ExchangeObject.findAll();

    if (exchangeObjects) {
      exchangeObjects = JSON.stringify(exchangeObjects);
      exchangeObjects = JSON.parse(exchangeObjects);

      res.status(200).send(exchangeObjects);
    } else {
      console.error(err);
      res.status(400).send({
        message: "Bad request",
      });
    }
  },

  async delete(req, res) {
    const existExchangeObject = await ExchangeObject.findByPk(req.params.id);

    if (existExchangeObject) {
      ExchangeObject.destroy({
        where: {
          id: req.params.id,
        },
      }).catch((err) =>
        res.starus(400).send({
          message: "błąd wewnętrzny",
        })
      );

      res.status(200).send({ message: "OK" });
    } else {
      res.status(400).send({ message: "Exchange object not found" });
    }
  },

  async objectsSend(req, res, next) {
    let exchangeObjects = await ExchangeObject.findAll({ where: { sent: false } });

    if (exchangeObjects) {
      exchangeObjects = JSON.stringify(exchangeObjects);
      exchangeObjects = JSON.parse(exchangeObjects);

      const dataForSend = await exchangeObjectService.prepareDataForSend(exchangeObjects);
      res.status(200).send(dataForSend);
    } else {
      console.error(err);
      res.status(400).send({
        message: "Bad request",
      });
    }
  },

  async confirmExchange(req, res, next) {
    loadedObjects = req.body.objects;
    for (let exchangeId of loadedObjects) {
      const existExchangeObject = await ExchangeObject.findByPk(exchangeId).catch((error) => {
        console.error(err);
        res.status(400).send({
          message: "Internal error",
        });
      });

      if (existExchangeObject) {
        await exchangeObjectService.markAsExchanged(existExchangeObject);

        await ExchangeObject.destroy({ where: { id: exchangeId } }).catch((err) => {
          console.error(err);
          res.status(400).send({
            message: "Internal error",
          });
        });
      } else {
        res.status(400).send({
          message: "Exchange object not found",
        });
      }
    }

    res.status(200).send({
      message: "OK",
    });
  },

  async findById(req, res, next) {
    const exchangeObject = await ExchangeObject.findByPk(req.params.id);

    if (exchangeObject) {
      res.status(200).send(exchangeObject);
    } else {
      res.status(400).send({ message: "Exchange objact not find" });
    }
  },

  async objectsLoad(req, res, next) {
    const exchangeData = req.body;

    try {
      await exchangeObjectService.loadObjects(exchangeData);

      res.status(200).send({ message: "OK" });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: error });
    }
  },

  async update(req, res, next) {
    const existItem = await ExchangeObject.findByPk(req.params.id);

    if (existItem) {
      const objectData = { ...req.body };

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem);
        })
        .catch((err) => {
          res.status(400).send({ message: "Błąd wewnętrzny" });
        });
    } else {
      res.status(400).send({ message: `Exchange object not found` });
    }
  },
};
