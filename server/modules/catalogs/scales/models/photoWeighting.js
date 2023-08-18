const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const DeliveryNote = require('@documents/deliveryNotes/models/index')

class PhotosWeighting extends Model { }

PhotosWeighting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PhotosWeighting',
    tableName: 'photos_weighting',
  }
)


PhotosWeighting.belongsTo(DeliveryNote, {
  foreignKey: 'deliveryNoteId',
  as: 'deliveryNote',
})


DeliveryNote.hasMany(PhotosWeighting, {
  foreignKey: 'deliveryNoteId',
  as: 'photosWeightings',
})




module.exports = PhotosWeighting
