const ObjectModel = require("../models/index");
const objectDescription = "ShipUnloading";
const ModelService = require("../service");
const exchangeObjectService = require("@services/exchangeObjectService");
const objectVersionsService = require("@services/objectVersionsService");
const { Op, Sequelize } = require("sequelize");

const User = require("@catalogs/users/models");
const Warehouse = require("@catalogs/warehouses/models");
const Box = require("@catalogs/boxes/models");
const Scale = require("@catalogs/scales/models");
const Position = require("@catalogs/positions/models");
const Disposition = require("@documents/dispositions/models");
const moment = require("moment");

module.exports = {
  async findAll(req, res, next) {

    const filter = JSON.parse(req.query.filter || "{}");
    const pagination = JSON.parse(req.query.pagination || "{}");
    const sort = JSON.parse(req.query.sort || "{}");

    if (filter.searchStr) {
      filter.numberStr = {
        [Op.iLike]: `%${filter.searchStr}%`,
      };
      delete filter.searchStr;
    }

    if (filter.period) {
      const dateFrom = filter.period[0];
      const dateTo = moment(filter.period[1]).endOf("day").toISOString();

      filter.date = { [Op.between]: [dateFrom, dateTo] };
      delete filter.period;
    }

    let order = [];
    if (sort.sortBy) {
      let sortItem = sort.sortBy.split(".");
      if (sort.sortDesc === true) {
        sortItem.push("DESC");
      }
      order.push(sortItem);
    }

    order.push(["createdAt"]);

    const include = [
      {
        model: Warehouse,
        attributes: ["id", "name"],
        as: "warehouse",
      },
      {
        model: Box,
        attributes: ["id", "name"],
        as: "box",
      },
      // {
      //   model: ObjectModel,
      //   attributes: ["id", "number"],
      //   as: "base",
      // },
      {
        model: Position,
        attributes: ["id", "name"],
        as: "position",
      },
      {
        model: Scale,
        attributes: ["id", "name"],
        as: "scale",
      },
      {
        model: User,
        attributes: ["id", "name"],
        as: "author",
      },
      {
        model: Disposition ,
        attributes: ["id" , "number"] ,
        as: "disposition",
      }
    ];

    if (pagination.page) {
      let limit = pagination.limit;
      let offset = 0 + (pagination.page - 1) * limit;
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset,
        limit,
        order,
        include,
      });
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        order,
        include,
      });
    }

    if (items) {
      items = JSON.stringify(items);
      items = JSON.parse(items);

      res.status(200).send(items);
    } else {
      console.error(err);
      res.status(400).send({
        message: "Bad request",
      });
    }
  },

  async findById(req, res, next) {
    const include = [
      {
        model: Warehouse,
        attributes: ["id", "name"],
        as: "warehouse",
      },
      {
        model: Box,
        attributes: ["id", "name"],
        as: "box",
      },
      // {
      //   model: ObjectModel,
      //   attributes: ["id", "number"],
      //   as: "base",
      // },
      {
        model: Position,
        attributes: ["id", "name"],
        as: "position",
      },
      {
        model: Scale,
        attributes: ["id", "name"],
        as: "scale",
      },
      {
        model: User,
        attributes: ["id", "name"],
        as: "author",
      },
      {
        model: Disposition ,
        attributes: ["id" , "number"] ,
        as: "disposition",
      }
    ];

    let item = await ObjectModel.findByPk(req.params.id, {
      include,
    });

    if (item) {
      res.status(200).send(item);
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },

  async create(req, res) {

    const objectData = { ...req.body };

    await ModelService.setNumbers(objectData);

    if (objectData.presentation) {
      delete objectData.presentation;
    }
    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          const exchangeData = {
            objectId: newItem.id,
            objectName: "shipUnloading",
            objectDescription: getDocumentPresentation(newItem),
            sent: false,
            changeType: 0,
          };
          await exchangeObjectService.registerToExchange(exchangeData);

          const changesData = {
            objectId: newItem.id,
            objectName: "shipUnloading",
            description: "Stworzono",
          };
          await objectVersionsService.addChanges(changesData, req);

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
      if (objectData.presentation) {
        delete objectData.presentation;
      }

      if (!objectData.maxDecrease || objectData.maxDecrease === null) {
        objectData.maxDecrease = 0;
      }
      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          const exchangeData = {
            objectId: updatedItem.id,
            objectName: "shipUnloading",
            objectDescription: getDocumentPresentation(updatedItem),
            sent: false,
            changeType: 1,
          };
          await exchangeObjectService.registerToExchange(exchangeData);

          const changesData = {
            objectId: updatedItem.id,
            objectName: "shipUnloading",
            description: "Zmieniono",
          };
          await objectVersionsService.addChanges(changesData, req);

          res.status(200).send(updatedItem);
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: "Błąd wewnętrzny" });
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
        markedToDelete: !existItem.markedToDelete,
      };

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem);
        })
        .catch((err) => {
          res.status(400).send({ message: "Błąd wewnętrzny" });
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
          res.status(200).send({ message: "OK" });
        })
        .catch((err) => {
          res.status(400).send({ message: "Błąd wewnętrzny" });
        });
    } else {
      res.status(400).send({ message: `${objectDescription} not found` });
    }
  },

  async getSubordination(req, res) {
    let subordination = [];

    let currObjectData;

    const currentObject = await ObjectModel.findByPk(req.params.id, {
      attributes: ["id", "number", "numberStr", "createdAt", "presentation", "markedToDelete"],
    });
  },
};

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.date).format("DD MM YYYY HH:mm:ss");
  return `Rozładunek statku nr ${documentData.numberStr} od ${createdAt}`;
}
