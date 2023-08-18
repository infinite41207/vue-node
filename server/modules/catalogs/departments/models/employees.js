const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Department = require('@catalogs/departments/models')
const User = require('@catalogs/users/models')

class DepartmentEmployees extends Model {}
DepartmentEmployees.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'DepartmentEmployees',
    tableName: 'department_employees',
  }
)

DepartmentEmployees.belongsTo(User, {
  foreignKey: 'employeeId',
  as: 'employee',
})

Department.hasMany(DepartmentEmployees, {
  foreignKey: 'parentId',
  as: 'employees',
  onDelete: 'CASCADE',
  hooks: true,
})

DepartmentEmployees.belongsTo(Department, {
  foreignKey: 'parentId',
  as: 'department',
  onDelete: 'CASCADE',
})

module.exports = DepartmentEmployees
