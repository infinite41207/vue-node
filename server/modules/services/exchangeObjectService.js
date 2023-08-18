const ExchangeObject = require('@registers/exchangeObjects/models')
const Order = require('@documents/salesOrders/models/order')
const OrderItem = require('@documents/salesOrders/models/orderItem')
const OrderPrice = require('@documents/salesOrders/models/orderPrice')
const Customer = require('@catalogs/counterparties/models')
const Product = require('@catalogs/products/models')
const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models')
const Currency = require('@catalogs/currencies/models')
const TermOfPayment = require('@catalogs/termsOfPayment/models')
const Parameter = require('@catalogs/constructor/models/parameter')
const ParameterValue = require('@catalogs/constructor/models/parameterValue')
const ValueProperty = require('@catalogs/constructor/models/valueProperty')
const ParameterProperty = require('@catalogs/constructor/models/parameterProperty')
const Pricelist = require('@documents/pricelists/models/pricelist')
const Discount = require('@documents/discounts/models')
const Disposition = require('@documents/dispositions/models')
const DeliveryNote = require('@documents/deliveryNotes/models')

const Reclamation = require('@documents/reclamations/models/reclamation');
const ReclamationItem = require('@documents/reclamations/models/reclamationItem');

const ReclamationType = require('@catalogs/reclamationTypes/models')
const ReclamationStatus = require('@catalogs/reclamationStatuses/models')
const ReclamationExecutionType = require('@catalogs/reclamationExecutionTypes/models')
const ReclamationDecision = require('@catalogs/reclamationDecisions/models')

const User = require('@catalogs/users/models')
const ExecutorRole = require('@catalogs/executorRoles/models/executorRole')
const TaskExecutor = require('@catalogs/executorRoles/models/taskExecutor')

const TaskTemplate = require('@catalogs/taskTemplates/models')

const Task = require('@documents/tasks/models/task')
const TaskOrder = require('@documents/tasks/models/taskOrder')
const Interaction = require('@documents/interactions/models')
const TaskFile = require('@documents/tasks/models/taskFile')
const fs = require('fs')

const moment = require('moment')
const { Op } = require('sequelize')

module.exports = {
  async registerToExchange(objectData) {
    if (objectData.changeType === 1) {
      //check previous updates
      const exchangeObject = await ExchangeObject.findOne({
        where: { objectId: objectData.objectId, objectName: objectData.objectName, changeType: { [Op.in]: [0, 1] }, sent: false },
      }).catch((err) => {
        console.error(err)
      })

      if (exchangeObject) {
        return //nothing to do
      }
    }

    if (objectData.changeType === 2) {
      //check previous marks
      const exchangeObject = await ExchangeObject.findOne({
        where: { objectId: objectData.objectId, objectName: objectData.objectName, changeType: 2, sent: false },
      }).catch((err) => {
        console.error(err)
      })

      if (exchangeObject) {
        //delete previous mark
        await ExchangeObject.destroy({ where: { id: exchangeObject.id } }).catch((err) => {
          console.error(err)
        })

        return
      }
    }

    await ExchangeObject.create(objectData).catch((err) => {
      console.error(err)
    })
  },

  async prepareDataForSend(exchangeObjects) {
    let sendData = {}

    //prepare orders to send
    sendData.orders = await prepareOrderDataForSend(exchangeObjects);

    //prepare reclamations to send
    sendData.reclamations = await prepareReclamationDataForSend(exchangeObjects);

    //prepare other objects

    return sendData
  },

  async markAsExchanged(exchangeData) {
    if (exchangeData.objectName === 'order') {
      const existSalesOrder = await Order.findByPk(exchangeData.objectId)

      if (existSalesOrder) {
        await existSalesOrder.update({ exchangeComplete: true })
      }
    }
  },

  async loadObjects(exchangeData) {
    if (exchangeData.executors) {
      await loadExecutors(exchangeData.executors)
    }

    if (exchangeData.executorRoles) {
      await loadExecutorRoles(exchangeData.executorRoles)
    }

    if (exchangeData.taskTemplates) {
      await loadTaskTemplates(exchangeData.taskTemplates)
    }

    if (exchangeData.tasks) {
      await loadTasks(exchangeData.tasks)
    }
  },
}

async function prepareOrderDataForSend(exchangeObjects) {
  let ordersId = []

  const registeredOrders = exchangeObjects.filter((el) => el.objectName === 'order')

  ordersId = registeredOrders.map((el) => el.objectId)

  return await Order.findAll({
    where: { id: { [Op.in]: ordersId } },
    attributes: { exclude: ['customerId', 'authorId'] },
    include: [
      {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'uuid'],
      },
      {
        model: Currency,
        attributes: ['id', 'name', 'uuid'],
        as: 'currency',
      },
      {
        model: User,
        attributes: ['id'],
        as: 'author',
      },
      {
        model: SalesOrderStatus,
        as: 'status',
        attributes: ['id', 'name', 'uuid'],
      },
      {
        model: OrderItem,
        as: 'products',
        include: [
          { model: Product, as: 'product', attributes: ['uuid'] },
          {
            model: OrderPrice,
            as: 'prices',
            attributes: { exclude: ['pricelistId', 'discountId'] },
            include: [
              { model: Pricelist, as: 'pricelist', attributes: ['id', 'uuid'] },
              { model: Discount, as: 'discount', attributes: ['id', 'uuid'] },
            ],
          },
        ],
      },
    ],
    order: ['id'],
  }).then(async (ordersToExchange) => {
    if (ordersToExchange) {
      ordersToExchange = JSON.stringify(ordersToExchange)
      ordersToExchange = JSON.parse(ordersToExchange)

      let exchangeData = []
      for (let order of ordersToExchange) {
        const exData = registeredOrders.find((el) => el.objectId === order.id)

        if (exData.changeType === 0 || exData.changeType === 1) {
          //on create or update
          if (order.author) {
            await User.findOne({ where: { userId: order.author.id } })
              .then((executor) => {
                if (executor) {
                  order.author = executor.uuid
                } else {
                  delete order.author
                }
              })
              .catch((error) => {
                delete order.author
              })
          }

          order.createdAt = moment(order.createdAt).format('YYYY.MM.DD HH:mm:ss')
          order.updatedAt = moment(order.updatedAt).format('YYYY.MM.DD HH:mm:ss')
          if (order.deliveryDate) {
            order.deliveryDate = moment(order.deliveryDate).format('YYYY.MM.DD')
          } else {
            order.deliveryDate = ''
          }

          if (order.shipmentDate) {
            order.shipmentDate = moment(order.shipmentDate).format('YYYY.MM.DD')
          } else {
            order.shipmentDate = ''
          }

          order.ownerPresentation = ''
          if (order.ownerType && order.ownerType === 'Interaction' && order.ownerId !== null) {
            await Interaction.findByPk(order.ownerId, { attributes: ['numberStr', 'createdAt'] })
              .then((parentInteraction) => {
                if (parentInteraction) {
                  order.ownerPresentation = `Interakcja nr ${parentInteraction.numberStr} od ${moment(parentInteraction.createdAt).format('DD.MM.YYYY HH:mm:ss')}`
                }
              })
              .catch((error) => {
                console.error(error)
              })
          }

          for (let productRow of order.products) {
            const choosenParameters = JSON.parse(productRow.choosenParameters)
            const productParameters = await getProductParameters(productRow.productId)

            let valuesId = []
            for (let choosenParameter of choosenParameters) {
              const paramData = productParameters.find((el) => el.id === choosenParameter.param.id)

              if (paramData) {
                choosenParameter.param.uuid = paramData.uuid
              }

              if (choosenParameter.paramValue !== undefined && choosenParameter.paramValue.hasOwnProperty('id')) {
                valuesId.push(choosenParameter.paramValue.id)
              }
            }

            const selectedValues = await getSelectedVlues(valuesId)

            if (selectedValues.length) {
              for (let choosenParameter of choosenParameters) {
                if (choosenParameter.paramValue !== undefined && choosenParameter.paramValue.hasOwnProperty('id')) {
                  const valueData = selectedValues.find((el) => el.id === choosenParameter.paramValue.id)

                  if (valueData) {
                    choosenParameter.paramValue.uuid = valueData.uuid

                    for (let valProperty of choosenParameter.paramValue.properties) {
                      const propData = valueData.properties.find((el) => el.propId === valProperty.propId)
                      if (propData) {
                        valProperty.uuid = propData.property.uuid
                        valProperty.name = propData.property.name
                      }
                    }
                  }
                }
              }
            }

            productRow.choosenParameters = choosenParameters
          }

          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, ...order })
        } else if (exData.changeType === 2) {
          // on change deletion mark

          exchangeData.push({
            changeId: exData.id,
            changeType: exData.changeType,
            id: exData.objectId,
            markedToDelete: order.markedToDelete,
            prefix: order.prefix,
            numberStr: order.numberStr,
          })
        } else if (exData.changeType === 3) {
          // on remove
          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, id: exData.objectId })
        }
      }

      return exchangeData
    }
  })
}

async function prepareReclamationDataForSend(exchangeObjects) {
  let ordersId = [];

  const registeredOrders = exchangeObjects.filter((el) => el.objectName === "reclamation");

  ordersId = registeredOrders.map((el) => el.objectId)

  return await Reclamation.findAll({
    where: { id: { [Op.in]: ordersId } },
    attributes: { exclude: ['customerId', 'authorId'] },
    include: [
      {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'uuid'],
      },
      {
        model: ReclamationType,
        attributes: ["id", "name", "uuid"],
        as: "docType",
      },
      {
        model: User,
        attributes: ['id'],
        as: 'author',
      },
      {
        model: ReclamationStatus,
        as: "_status",
        attributes: ["id", "name", "uuid"],
      },
      {
        model: ReclamationExecutionType,
        as: "_execution_type",
        attributes: ["id", "description"],
      },
      {
        model: ReclamationItem,
        as: "reclamation_items",
        include: [
          {
            model: Reclamation,
            as: "reclamationId",
            attributes: ["id", "agreementMaxWh"],
          },
          {
            model: ReclamationSubject,
            as: "_reclamationSubject",
            attributes: ["id", "description"],
          },
          {
            model: ReclamationExecutionType,
            as: "_reclamationExecutionType",
            attributes: ["id", "description"],
          },
          {
            model: ReclamationDecision,
            as: "_reclamationDecision",
            attributes: ["id", "description"],
          },
        ],
      },
    ],
    order: ["id"],
  }).then(async (ordersToExchange) => {
    if (ordersToExchange) {
      ordersToExchange = JSON.stringify(ordersToExchange);
      ordersToExchange = JSON.parse(ordersToExchange);

      let exchangeData = [];
      for (let order of ordersToExchange) {
        const exData = registeredOrders.find((el) => el.objectId === order.id);

        if (exData.changeType === 0 || exData.changeType === 1) {
          //on create or update
          if (order.author) {
            await User.findOne({ where: { userId: order.author.id } })
              .then((executor) => {
                if (executor) {
                  order.author = executor.uuid;
                } else {
                  delete order.author;
                }
              })
              .catch((error) => {
                delete order.author;
              });
          }

          order.createdAt = moment(order.createdAt).format("YYYY.MM.DD HH:mm:ss");
          order.updatedAt = moment(order.updatedAt).format("YYYY.MM.DD HH:mm:ss");
          if (order.deliveryDate) {
            order.deliveryDate = moment(order.deliveryDate).format("YYYY.MM.DD");
          } else {
            order.deliveryDate = "";
          }

          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, ...order });
        } else if (exData.changeType === 2) {
          // on change deletion mark

          exchangeData.push({
            changeId: exData.id,
            changeType: exData.changeType,
            id: exData.objectId,
            markedToDelete: order.markedToDelete,
          });
        } else if (exData.changeType === 3) {
          // on remove
          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, id: exData.objectId });
        }
      }

      return exchangeData;
    }
  })
}

async function prepareReclamationDataForSend(exchangeObjects) {
  let ordersId = [];

  const registeredOrders = exchangeObjects.filter((el) => el.objectName === "reclamation");

  ordersId = registeredOrders.map((el) => el.objectId);

  return await Reclamation.findAll({
    where: { id: { [Op.in]: ordersId } },
    attributes: { exclude: ["customerId", "authorId"] },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "uuid"],
      },
      {
        model: ReclamationType,
        attributes: ["id", "name", "uuid"],
        as: "docType",
      },
      {
        model: User,
        attributes: ["id"],
        as: "author",
      },
      {
        model: ReclamationStatus,
        as: "_status",
        attributes: ["id", "name", "uuid"],
      },
      {
        model: ReclamationExecutionType,
        as: "_execution_type",
        attributes: ["id", "description"],
      },
      {
        model: ReclamationItem,
        as: "reclamation_items",
        include: [
          {
            model: Reclamation,
            as: "reclamationId",
            attributes: ["id", "agreementMaxWh"],
          },
          {
            model: ReclamationSubject,
            as: "_reclamationSubject",
            attributes: ["id", "description"],
          },
          {
            model: ReclamationExecutionType,
            as: "_reclamationExecutionType",
            attributes: ["id", "description"],
          },
          {
            model: ReclamationDecision,
            as: "_reclamationDecision",
            attributes: ["id", "description"],
          },
        ],
      },
    ],
    order: ["id"],
  }).then(async (ordersToExchange) => {
    if (ordersToExchange) {
      ordersToExchange = JSON.stringify(ordersToExchange);
      ordersToExchange = JSON.parse(ordersToExchange);

      let exchangeData = [];
      for (let order of ordersToExchange) {
        const exData = registeredOrders.find((el) => el.objectId === order.id);

        if (exData.changeType === 0 || exData.changeType === 1) {
          //on create or update
          if (order.author) {
            await User.findOne({ where: { userId: order.author.id } })
              .then((executor) => {
                if (executor) {
                  order.author = executor.uuid;
                } else {
                  delete order.author;
                }
              })
              .catch((error) => {
                delete order.author;
              });
          }

          order.createdAt = moment(order.createdAt).format("YYYY.MM.DD HH:mm:ss");
          order.updatedAt = moment(order.updatedAt).format("YYYY.MM.DD HH:mm:ss");
          if (order.deliveryDate) {
            order.deliveryDate = moment(order.deliveryDate).format("YYYY.MM.DD");
          } else {
            order.deliveryDate = "";
          }

          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, ...order });
        } else if (exData.changeType === 2) {
          // on change deletion mark

          exchangeData.push({
            changeId: exData.id,
            changeType: exData.changeType,
            id: exData.objectId,
            markedToDelete: order.markedToDelete,
          });
        } else if (exData.changeType === 3) {
          // on remove
          exchangeData.push({ changeId: exData.id, changeType: exData.changeType, id: exData.objectId });
        }
      }

      return exchangeData;
    }
  });
}

async function getProductParameters(productId) {
  return await Parameter.findAll({
    where: { productId },
    attributes: ['id', 'name', 'uuid'],
  })
    .then((result) => {
      result = JSON.stringify(result)
      result = JSON.parse(result)
      return result
    })
    .catch((err) => {
      console.log(err)
      return []
    })
}

async function getSelectedVlues(valuesId) {
  let paramValues = await ParameterValue.findAll({
    where: { id: { [Op.in]: valuesId } },
    attributes: ['id', 'name', 'uuid'],
    include: [
      {
        model: ValueProperty,
        as: 'properties',
        attributes: ['propId'],
        include: [
          {
            model: ParameterProperty,
            as: 'property',
            attributes: ['name', 'uuid'],
          },
        ],
      },
    ],
  })

  if (paramValues) {
    paramValues = JSON.stringify(paramValues)
    paramValues = JSON.parse(paramValues)

    return paramValues
  } else {
    return []
  }
}

async function loadExecutors(executors) {
  for (let executor of executors) {
    let existExecutor = await User.findOne({
      where: { uuid: executor.uuid },
    })

    if (existExecutor) {
      await existExecutor.update(executor).catch((err) => {
        console.error(err)
      })
    } else {
      await User.create(executor).catch((err) => {
        console.error(err)
      })
    }
  }
}

async function loadExecutorRoles(executorRoles) {
  for (let executorRole of executorRoles) {
    let { executors, ...roleData } = executorRole

    let existExecutorRole = await ExecutorRole.findOne({
      where: { uuid: executorRole.uuid },
    })

    if (existExecutorRole) {
      await existExecutorRole.update(roleData).catch((err) => {
        console.error(err)
      })
    } else {
      await ExecutorRole.create(roleData).catch((err) => {
        console.error(err)
      })
    }

    if (executors) {
      if (existExecutorRole) {
        TaskExecutor.destroy({
          where: { executorRoleId: existExecutorRole.id },
        })

        for (let executor of executors) {
          let existExecutor = await User.findOne({
            where: { uuid: executor.uuid },
          })

          if (existExecutor) {
            await TaskExecutor.create({ executorRoleId: existExecutorRole.id, executorId: existExecutor.id }).catch((err) => {
              console.error(err)
            })
          }

          console.log('task executor', executor)
        }
      }
    }
  }
}

async function loadTaskTemplates(taskTemplates) {
  for (let taskTemplate of taskTemplates) {
    let existTaskTemplate = await TaskTemplate.findOne({
      where: { uuid: taskTemplate.uuid },
    })

    let executorRoleId = null

    if (taskTemplate.executorRole && taskTemplate.executorRole !== '') {
      let existExecutorRole = await ExecutorRole.findOne({
        where: { uuid: taskTemplate.executorRole },
      })

      if (existExecutorRole) {
        executorRoleId = existExecutorRole.id
      }
    }

    let executorId = null

    if (taskTemplate.executor && taskTemplate.executor !== '') {
      let existExecutor = await User.findOne({
        where: { uuid: taskTemplate.executor },
      })

      if (existExecutor) {
        executorId = existExecutor.id
      }
    }

    let checkerId = null

    if (taskTemplate.checker && taskTemplate.checker !== '') {
      let existChecker = await User.findOne({
        where: { uuid: taskTemplate.checker },
      })

      if (existChecker) {
        checkerId = existChecker.id
      }
    }

    if (existTaskTemplate) {
      await existTaskTemplate.update({ ...taskTemplate, executorRoleId, executorId, checkerId }).catch((err) => {
        console.error(err)
      })
    } else {
      await TaskTemplate.create({ ...taskTemplate, executorRoleId, executorId }).catch((err) => {
        console.error(err)
      })
    }
  }
}

async function loadTasks(tasks) {
  for (let taskData of tasks) {
    if (taskData.customerUuid !== '') {
      const taskCustomer = await Customer.findOne({
        where: { uuid: taskData.customerUuid },
      })

      if (taskCustomer) {
        taskData.customerId = taskCustomer.id
      }
    }

    if (taskData.executorRole !== '') {
      const executorRole = await ExecutorRole.findOne({
        where: { uuid: taskData.executorRole },
      })

      if (executorRole) {
        taskData.executorRoleId = executorRole.id
      }
    }

    if (taskData.executor !== '') {
      const executor = await User.findOne({
        where: { uuid: taskData.executor },
      })

      if (executor) {
        taskData.executorId = executor.id
      }
    }

    let currentTask = await Task.findOne({
      where: { uuid: taskData.uuid },
    })

    if (currentTask) {
      await Task.update(taskData, {
        where: { id: currentTask.id },
      }).catch((err) => {
        console.error(err)
      })
    } else {
      taskData.fromErp = true
      currentTask = await Task.create(taskData).catch((err) => {
        console.error(err)
      })
    }

    if (currentTask && taskData.files) {
      const destination = 'public/files/tasks'

      await TaskFile.destroy({
        where: {
          taskId: currentTask.id,
        },
      })

      for (let file of taskData.files) {
        const fileName = `${file.originalName}-${Date.now()}.${file.type}`
        const filePath = `${destination}/${fileName}`

        let buffer = Buffer.from(file.fileData, 'base64')

        fs.writeFile(filePath, buffer, function (err) {
          console.log(err)
        })

        await TaskFile.create({
          taskId: currentTask.id,
          path: filePath,
          filename: fileName,
          originalname: `${file.originalName}.${file.type}`,
          destination: destination,
          size: file.size,
          type: file.type,
        }).catch((err) => {
          throw err
        })
      }
    }

    if (taskData.orders) {
      for (let taskOrder of taskData.orders) {
        // load files
      }
    }
  }
}
