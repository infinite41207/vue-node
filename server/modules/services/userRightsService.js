const TaskExecutor = require('@catalogs/executorRoles/models/taskExecutor')
const UserCustomer = require('@catalogs/users/models/userCustomer')

const { Op } = require('sequelize')

module.exports = {
  async getUserExecutorRoles(executorId) {
    let executorRoles = await TaskExecutor.findAll({
      where: { executorId },
      attributes: ['executorRoleId'],
    }).catch((err) => {
      console.err(err)
      return []
    })

    if (executorRoles) {
      executorRoles = JSON.stringify(executorRoles)
      executorRoles = JSON.parse(executorRoles)

      return executorRoles
    } else {
      return []
    }
  },

  async getCustomerFilter(req) {
    let customers = []
    let fullAccess = false

    if (req.user) {
      fullAccess = req.user.useCustomerAccess !== true

      const userId = req.user.id

      const userCustomers = await UserCustomer.findAll({ where: { userId: userId } })

      if (userCustomers) {
        for (let customer of userCustomers) {
          customers.push(customer.customerId)
        }
      }
    }

    return {
      fullAccess,
      customers,
    }
  },
}
