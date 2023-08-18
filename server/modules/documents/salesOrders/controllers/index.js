const { Op } = require('sequelize')
const moment = require('moment')
const uuidlib = require('uuid')

// import models
const Order = require('../models/order')
const OrderItem = require('../models/orderItem')
const OrderPrice = require('../models/orderPrice')
const OrderFile = require('../models/orderFile')
const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models')
const Task = require('@documents/tasks/models/task')
const Interaction = require('@documents/interactions/models')
const TaskOrders = require('@documents/tasks/models/taskOrder')
const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')
const Currency = require('@catalogs/currencies/models')
const UnitOfMeasure = require('@catalogs/unitsOfMeasure/models')
const User = require('@catalogs/users/models')

// import services
const orderService = require('../orderService')
const commonService = require('@services/commonService')
const userRightService = require('@services/userRightsService')
const exchangeObjectService = require('@services/exchangeObjectService')
const objectVersionsService = require('@services/objectVersionsService')
const fileService = require('@services/fileService')
const accessService = require('@services/userAccessService')

module.exports = {
  async findAll(req, res, next) {
    try {
      const filter = JSON.parse(req.query.filter || '{}')
      const pagination = JSON.parse(req.query.pagination || '{}')
      const sort = JSON.parse(req.query.sort || '{}')
      const lang = req.query.lang

      const needTranslate = lang && lang !== 'pl'

      let customerFilter
      if (!filter.customerId) {
        customerFilter = await userRightService.getCustomerFilter(req)

        if (customerFilter.fullAccess === false) {
          filter.customerId = { [Op.in]: customerFilter.customers }
        }
      }

      if (filter.searchStr) {
        filter[Op.and] = []
        filter[Op.and].push({ [Op.or]: [{ reference: { [Op.iLike]: `%${filter.searchStr}%` } }, { numberStr: { [Op.iLike]: `%${filter.searchStr}%` } }] })
        delete filter.searchStr
      }

      if (filter.period) {
        const dateFrom = filter.period[0]
        const dateTo = moment(filter.period[1]).endOf('day').toISOString()

        filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
        delete filter.period
      }

      if (req.user.fullRights !== true) {
        const restrictions = await accessService.accessRestrictions(req, Order)

        if (restrictions.use === true) {
          const accessUsers = restrictions.users
          if (filter[Op.and]) {
            filter[Op.and].push({ [Op.or]: [{ authorId: accessUsers }] })
          } else {
            filter[Op.or] = [{ authorId: accessUsers }]
          }
        }
      }

      let order = []
      if (sort.sortBy) {
        let sortItem = sort.sortBy.split('.')
        if (sort.sortDesc === true) {
          sortItem.push('DESC')
        }
        order.push(sortItem)
      }

      order.push(['id'])

      let orders = null

      const include = [
        {
          model: Customer,
          attributes: ['id', 'name', 'abbreviation', 'presentation'],
          as: 'customer',
        },
        {
          model: Currency,
          attributes: ['id', 'name'],
          as: 'currency',
        },
        {
          model: SalesOrderStatus,
          as: 'status',
          attributes: ['id', 'name', 'color', 'lang'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
      ]

      const attributes = { exclude: ['customerId', 'authorId', 'currencyId', 'statusId'] }

      if (pagination.page) {
        let limit = pagination.limit
        let offset = 0 + (pagination.page - 1) * limit
        orders = await Order.findAndCountAll({
          where: filter,
          offset: offset,
          limit: limit,
          attributes,
          include,
          order,
        })
      } else {
        orders = await Order.findAll({
          where: filter,
          attributes,
          include,
          order,
        })
      }

      if (orders) {
        orders = JSON.stringify(orders)
        orders = JSON.parse(orders)

        if (pagination.page) {
          for (let orderItem of orders.rows) {
            if (needTranslate === true && orderItem.status.lang) {
              const translates = JSON.parse(orderItem.status.lang)
              orderItem.status.name = translates[lang] ? translates[lang] : orderItem.status.name
            }
          }
        } else {
          for (let orderItem of orders) {
            if (needTranslate === true && orderItem.status.lang) {
              const translates = JSON.parse(orderItem.status.lang)
              orderItem.status.name = translates[lang] ? translates[lang] : orderItem.status.name
            }
          }
        }

        res.status(200).send(orders)
      } else {
        res.status(200).send([])
      }
    } catch (error) {
      console.error(error)
      res.status(400).send({ message: error })
    }
  },

  async findById(req, res, next) {
    const currentOrder = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['name'] },
        {
          model: Currency,
          attributes: ['id', 'name'],
          as: 'currency',
        },
        {
          model: Customer,
          attributes: ['id', 'name', 'abbreviation', 'presentation'],
          as: 'customer',
        },
        {
          model: OrderItem,
          as: 'products',
          include: [
            { model: Product, as: 'product' },
            { model: UnitOfMeasure, as: 'unitOfMeasure' },
            { model: OrderPrice, as: 'prices' },
          ],
        },
        { model: OrderFile, as: 'files' },
      ],
    })

    if (currentOrder) {
      for (let product of currentOrder.products) {
        product.choosenParameters = JSON.parse(product.choosenParameters)
      }

      for (let file of currentOrder.files) {
        file.size = (file.size / 1000).toFixed(1)
      }

      res.status(200).send(currentOrder)
    } else {
      res.status(200).send({ message: 'Order is not find' })
    }
  },

  async create(req, res) {
    const { products, owner, ...orderData } = req.body

    if (orderData.deliveryDate == '') {
      orderData.deliveryDate = null
    }

    if (!orderData.number) {
      await orderService.setOrderNumber(orderData)
    }

    orderData.numberStr = orderData.prefix + '-' + orderData.number.toString().padStart(6, '0')

    if (!orderData.authorId) {
      await commonService.setAuthor(orderData, req)
    }

    await Order.create(orderData)
      .then(async (newOrder) => {
        if (newOrder) {
          for (let productRow of products) {
            productRow.choosenParameters = JSON.stringify(productRow.choosenParameters)
            productRow.productId = productRow.productId

            const itemRow = await OrderItem.create({ ...productRow, orderId: newOrder.id }).catch((err) => {
              console.log(err)
              res.status(400).send({ message: 'Product row write error' })
            })

            if (itemRow) {
              for (let price of productRow.prices) {
                await OrderPrice.create({ ...price, orderItemId: itemRow.id }).catch((err) => {
                  console.log(err)
                  res.status(400).send({ message: 'Price write error!' })
                })
              }
            }
          }

          const exchangeData = {
            objectId: newOrder.id,
            objectName: 'order',
            objectDescription: getOrderPresentation(newOrder),
            sent: false,
            changeType: 0,
          }

          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: newOrder.id,
            objectName: 'order',
            description: 'Stworzono',
          }

          await objectVersionsService.addChanges(changesData, req)

          if (owner && owner.type === 'task' && owner.id !== null) {
            await addOrderToTask(newOrder.id, owner.id)
          }

          res.status(200).send({ id: newOrder.id })
        } else {
          res.status(400).send({ message: 'Order is not created' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(400).send({ message: 'Order is not created' })
      })
  },

  async update(req, res, next) {
    const existOrder = await Order.findByPk(req.params.id)

    if (existOrder) {
      const { products, ...orderData } = req.body
      if (orderData.presentation) {
        delete orderData.presentation
      }

      const updateOrder = await existOrder.update(orderData).catch((err) => {
        res.status(400).send({ message: 'błąd wewnętrzny' })
      })

      await OrderItem.destroy({ where: { orderId: req.params.id }, include: { model: OrderPrice, as: 'prices' } }).catch((err) => {
        res.status(400).send({ message: 'błąd wewnętrzny' })
      })

      if (updateOrder && products.length > 0) {
        for (let productRow of products) {
          productRow.choosenParameters = JSON.stringify(productRow.choosenParameters)
          productRow.productId = productRow.productId

          // temp solution for unitOfMeasure
          // remove after adding of units to products
          if (!productRow.unitOfMeasureStr) {
            productRow.unitOfMeasureStr = 'szt'
          }
          //------------------------------

          const itemRow = await OrderItem.create({ ...productRow, orderId: req.params.id }).catch((err) => {
            res.status(400).send({ message: 'Product row write error' })
          })

          if (itemRow) {
            for (let price of productRow.prices) {
              await OrderPrice.create({ ...price, orderItemId: itemRow.id }).catch((err) => {
                res.status(400).send({ message: 'Price write error!' })
              })
            }
          }
        }
      }

      const exchangeData = {
        objectId: existOrder.id,
        objectName: 'order',
        objectDescription: getOrderPresentation(existOrder),
        sent: false,
        changeType: 1,
      }

      await exchangeObjectService.registerToExchange(exchangeData)

      const changesData = {
        objectId: existOrder.id,
        objectName: 'order',
        description: 'Zmieniono',
      }

      await objectVersionsService.addChanges(changesData, req)

      res.status(200).send({ id: existOrder.id })
    } else {
      res.status(400).send({ message: 'Zamówienie nie znaleziono' })
    }
  },

  async delete(req, res) {
    const existOrder = await Order.findByPk(req.params.id)

    if (existOrder) {
      const { number, createdAt, prefix } = existOrder

      Order.destroy({
        where: {
          id: req.params.id,
        },
        include: { model: OrderItem, as: 'products', include: { model: OrderPrice, as: 'prices' } },
      })
        .then(async (result) => {
          const exchangeData = {
            objectId: req.params.id,
            objectName: 'order',
            objectDescription: getOrderPresentation({ number, createdAt, prefix }),
            sent: false,
            changeType: 3,
          }

          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: req.params.id,
            objectName: 'order',
            description: 'Usunięto',
          }

          await objectVersionsService.addChanges(changesData, req)
        })
        .catch((err) =>
          res.starus(400).send({
            message: 'błąd wewnętrzny',
          })
        )

      res.status(200).send({ message: 'OK' })
    } else {
      res.status(400).send({ message: 'Zamówienie nie znaleziono' })
    }
  },

  async changeDeletionMark(req, res) {
    const existOrder = await Order.findByPk(req.body.orderId)

    if (existOrder) {
      const newMarkedToDelete = !existOrder.markedToDelete
      let newData = {
        markedToDelete: newMarkedToDelete,
        prefix: newMarkedToDelete ? 'D' : 'O',
        number: null,
      }
      await orderService.setOrderNumber(newData)

      newData.numberStr = newData.prefix + '-' + newData.number.toString().padStart(6, '0')

      await existOrder
        .update(newData)
        .then(async (updatedObject) => {
          const exchangeData = {
            objectId: updatedObject.id,
            objectName: 'order',
            objectDescription: getOrderPresentation(updatedObject),
            sent: false,
            changeType: 2,
          }

          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: updatedObject.id,
            objectName: 'order',
            description: newMarkedToDelete ? 'Zaznaczono do usunięcia' : 'Przewrócono',
          }

          await objectVersionsService.addChanges(changesData, req)

          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send({ message: err })
        })
    } else {
      res.status(400).send({ message: 'Zamówienie nie znaleziono' })
    }
  },

  async attachFiles(req, res) {
    let { data } = req.body

    if (req.files) {
      try {
        data = JSON.parse(data)

        for (let file of req.files) {
          await OrderFile.create({
            orderId: data.id,
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            destination: file.destination,
            size: file.size,
            type: file.mimetype,
          }).catch((err) => {
            throw err
          })
        }

        res.status(200).send({ message: 'OK' })
      } catch (error) {
        console.error(error)
        res.status(400).send({ message: error })
      }
    } else {
      res.status(400).send({ message: 'No files' })
    }
  },

  async getFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await OrderFile.findAll({ where: { orderId: objectId } })
        .then((result) => {
          for (let file of result) {
            file.size = (file.size / 1000).toFixed(1)
          }

          res.status(200).send(result)
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'No "orderId" param' })
    }
  },

  async getFile(req, res) {
    await OrderFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (error) => {
          if (error) console.error(error)
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async getSubordination(req, res) {
    let subordination = []

    let tasksData, currOrderData, parentTaskData, interactionData

    const currentOrder = await Order.findByPk(req.params.id, { attributes: ['id', 'numberStr', 'createdAt', 'markedToDelete'] })

    if (currentOrder) {
      const ordersTasks = await Task.findAll({ where: { ownerId: currentOrder.id, ownerType: 'Order' } })

      childrenTasks = []
      if (ordersTasks) {
        for (let task of ordersTasks) {
          childrenTasks.push({
            objectId: task.id,
            objectType: 'tasks',
            detailRoute: { name: 'task-detail' },
            text: `Zadanie nr ${task.number} od ${moment(task.createdAt).format('DD.MM.YYYY HH:mm:ss')}`,
            markedToDelete: task.markedToDelete,
            icon: task.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
            opened: true,
            disabled: false,
            children: [],
          })
        }
      }

      currOrderData = {
        objectId: currentOrder.id,
        objectType: 'orders',
        detailRoute: { name: 'SalesOrder', params: { id: currentOrder.id } },
        text: `Zamówienie nr ${currentOrder.numberStr} od ${moment(currentOrder.createdAt).format('DD.MM.YYYY HH:mm:ss')}`,
        markedToDelete: currentOrder.markedToDelete,
        icon: currentOrder.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
        opened: true,
        disabled: true,
        children: childrenTasks,
      }

      const taskOrder = await TaskOrders.findOne({ where: { orderId: req.params.id } })

      if (taskOrder) {
        const parentTask = await Task.findByPk(taskOrder.taskId, {
          attributes: ['id', 'date', 'number', 'createdAt', 'markedToDelete', 'ownerId', 'ownerType'],
        })

        if (parentTask) {
          parentTaskData = {
            objectId: parentTask.id,
            objectType: 'tasks',
            detailRoute: { name: 'task-detail' },
            text: `Zadanie nr ${parentTask.number} od ${moment(parentTask.date).format('DD.MM.YYYY HH:mm:ss')}`,
            markedToDelete: parentTask.markedToDelete,
            icon: currentOrder.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
            opened: true,
            disabled: false,
            children: [{ ...currOrderData }],
          }

          if (parentTask.ownerType === 'Interaction' && parentTask.ownerId !== null) {
            const interaction = await Interaction.findByPk(parentTask.ownerId, {
              attributes: ['id', 'numberStr', 'createdAt', 'markedToDelete'],
            })

            if (interaction) {
              interactionData = {
                objectId: interaction.id,
                objectType: 'interactions',
                detailRoute: { name: 'Interaction', params: { id: interaction.id } },
                text: `Interakcja nr ${interaction.numberStr} od ${moment(interaction.createdAt).format('DD.MM.YYYY HH:mm:ss')}`,
                markedToDelete: interaction.markedToDelete,
                icon: currentOrder.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
                opened: true,
                disabled: false,
                children: [{ ...parentTaskData }],
              }
            }
          }
        }
      }
    }

    if (interactionData) {
      subordination.push(interactionData)
    } else if (parentTaskData) {
      subordination.push(parentTaskData)
    } else if (currOrderData) {
      subordination.push(currOrderData)
    }

    res.status(200).send(subordination)
  },

  async deleteFile(req, res) {
    const existFile = await OrderFile.findByPk(req.params.id)

    if (existFile) {
      await fileService.removeFile(existFile.path)

      await OrderFile.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'File not exist!' })
    }
  },

  async checkDouble(req, res) {
    const params = { ...req.body.params }

    let filter = { reference: params.reference, customerId: params.customerId }

    if (params.orderId !== 0) {
      filter.id = { [Op.ne]: params.orderId }
    }

    await Order.findAll({ where: filter, attributes: ['id', 'prefix', 'number'], order: ['id'] })
      .then((result) => {
        if (result.length > 0) {
          result = JSON.stringify(result)
          const orders = JSON.parse(result)

          res.status(200).send({ double: true, orders: orders })
        } else {
          res.status(200).send({ double: false, orders: [] })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: err })
      })
  },

  async getDoubleData(req, res) {
    const params = { ...req.body.params }

    let filter = { id: { [Op.in]: params.id } }

    console.log('filter', filter)

    await Order.findAll({
      where: filter,
      attributes: ['id', 'prefix', 'number', 'createdAt', 'markedToDelete'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: SalesOrderStatus,
          as: 'status',
          attributes: ['id', 'name', 'color'],
        },
      ],
      order: ['id'],
    })
      .then((result) => {
        console.log(result)
        if (result.length > 0) {
          result = JSON.stringify(result)
          const orders = JSON.parse(result)

          res.status(200).send({ orders: orders })
        } else {
          res.status(200).send({ orders: [] })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: err })
      })
  },
}

async function addOrderToTask(orderId, taskId) {
  await TaskOrders.create({ taskId: taskId, orderId: orderId }).catch((err) => {
    console.error(err)
  })
}

function getOrderPresentation(orderData) {
  const orderNumber = orderData.prefix + '-' + orderData.number.toString().padStart(6, '0')
  const createdAt = moment(orderData.createdAt).format('DD MM YYYY HH:mm:ss')

  return `Zlecenie nr ${orderNumber} od ${createdAt}`
}

async function updateNewFields() {
  await Order.findAll({ where: { numberStr: { [Op.eq]: null } } })
    .then((result) => {
      for (let order of result) {
        order.update({ numberStr: order.prefix + '-' + order.number.toString().padStart(6, '0') })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
