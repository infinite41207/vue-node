import _ from 'lodash'
import { uuid } from 'vue-uuid'

import Disposition from '@/dto/Disposition'

export const fillByDeliveryOrder = (view, deliveryOrder, isNew) => {
  if (!deliveryOrder) {
    view.$bvToast.toast('Wybierz zlecenie!', {
      title: view.$tc('common.msg'),
      variant: 'warning',
      solid: true,
      autoHideDelay: 2000,
    })
    return undefined
  }

  const { id, number, numberStr, createdAt, updateAt, date, quantity, comment, state, ...copyObject } = deliveryOrder

  let docDisposition = {}
  if (isNew === true) {
    docDisposition = _.cloneDeep(Disposition)
    docDisposition.id = uuid.v4()
    docDisposition.date = new Date()
    docDisposition.state = 'OnTheWay'
    docDisposition.carsQueueStatus = 'OnTheWay'
    docDisposition.order = copyObject.id
  } else {
    docDisposition = _.cloneDeep(view.object)
  }

  // console.log('copyObject = ', copyObject)

  Object.keys(copyObject).forEach((key) => {
    docDisposition[key] = copyObject[key]
  })

  if (copyObject.scale) docDisposition.scaleTwo = copyObject.scale

  if (docDisposition.productId) {
    view.$store
      .dispatch('products/findByPk', { noCommit: true, params: { id: docDisposition.productId } })
      .then((response) => {
        if (response.status === 200) {
          const product = response.data
          const notUsedProductCondition = product.notUsedProductCondition

          if (notUsedProductCondition === true) {
            docDisposition.productCondition = 'TOWAR WOLNY OD SALMONELI'
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  if (docDisposition.schemeOfCargoId) {
    view.$store
      .dispatch('schemesOfCargo/findByPk', { noCommit: true, params: { id: docDisposition.schemeOfCargoId } })
      .then((response) => {
        if (response.status === 200) {
          const schemeOfCargo = response.data

          if (!docDisposition.typeOfDocument) {
            docDisposition.typeOfDocument = schemeOfCargo.typeOfDocument
          }

          docDisposition.typeOfOperation = schemeOfCargo.typeOfOperation

          if (docDisposition.typeOfOperation === 'Receipt' || docDisposition.typeOfOperation === 'DirectVariantReceipt') {
            docDisposition.type = 'Unloading'
          } else {
            docDisposition.type = 'Loading'
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return docDisposition
}
