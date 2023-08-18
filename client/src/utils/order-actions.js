export default {
  convertProducts(order) {
    let incompliteParams = false
    for (const productRow of order.products) {
      if (productRow.product) {
        if (!productRow.productId) {
          productRow.productId = productRow.product.id
        }

        delete productRow.product
      }

      const choosenParameters = []
      for (const choosenParameter of productRow.choosenParameters) {
        const param = {
          id: choosenParameter.param.id,
        }

        let paramValue
        if (choosenParameter.paramValue) {
          if (choosenParameter.paramValue.id) {
            paramValue = {
              id: choosenParameter.paramValue.id,
              default: choosenParameter.paramValue.default,
              properties: [],
            }

            for (const propertyRow of choosenParameter.paramValue.properties) {
              paramValue.properties.push({
                calculated: propertyRow.calculated,
                id: propertyRow.id,
                propId: propertyRow.propId,
                propValue: propertyRow.propValue,
                propValueUuid: propertyRow.propValueUuid,
              })
            }
          } else {
            paramValue = choosenParameter.paramValue
          }
        }

        const paramData = {
          param: param,
          paramValue: paramValue,
          valueLabel: choosenParameter.valueLabel,
          addDescription: choosenParameter.addDescription,
          errorValue: choosenParameter.errorValue,
        }

        choosenParameters.push(paramData)
      }

      productRow.choosenParameters = choosenParameters

      if (productRow.incompliteParams === true) {
        incompliteParams = productRow.incompliteParams
      }
    }

    order.incompliteParams = incompliteParams
  },

  calcTotalSum(order) {
    if (order.products.length === 0) {
      order.sumNetto = '0.00'
      order.sumBrutto = '0.00'
      order.sumVat = '0.00'
      return
    }

    const sumNetto = order.products.reduce((totalSum, a) => totalSum + Number(a.sumNetto), 0)
    const sumBrutto = order.products.reduce((totalSum, a) => totalSum + Number(a.sumBrutto), 0)
    const sumVat = order.products.reduce((totalSum, a) => totalSum + Number(a.vat), 0)

    order.sumNetto = sumNetto.toFixed(2)
    order.sumBrutto = sumBrutto.toFixed(2)
    order.sumVat = sumVat.toFixed(2)
  },
}
