const ObjectModel = require("../models/index");
const objectDescription = "Inventory";
const { Op, Sequelize } = require("sequelize");

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

    const include = [];

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
    const include = [];

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
        .then(async (updatedItem) => {
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
};
