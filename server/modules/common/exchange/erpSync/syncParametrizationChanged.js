const ProductModel = require('@catalogs/products/models');
const ParamModel = require('@catalogs/constructor/models/parameter');
const ParamPropModel = require('@catalogs/constructor/models/parameterProperty');
const PropValueModel = require('@catalogs/constructor/models/propertyValue');
const ParamValueModel = require('@catalogs/constructor/models/parameterValue');
const ParamValuePropsModel = require('@catalogs/constructor/models/valueProperty');
const ExpressionVariableModel = require('@catalogs/constructor/models/expressionVariable');
const DependedPropValueModel = require('@catalogs/constructor/models/dependedPropertyValue');
const DependedPropDimensionModel = require('@catalogs/constructor/models/dependedPropertyDimension');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');
const moment = require('moment');

module.exports = async () => {
  await exchangeERP.getProducts(true).then(async (queryResult) => {
    for (let productItem of queryResult.data) {
      await updateProduct(productItem)
        .then(async (currentProduct) => {
          if (currentProduct) {
            if (currentProduct.status === 'Active') {
              console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Sync parameters for product', currentProduct.name);

              //++update expression variables
              await updateExpressionVariables(currentProduct);
              //--update expression variables

              //++update parameters
              await updateProductParameters(currentProduct);
              //--update parameters
            }

            console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete parametrizations registration for product ', currentProduct.name);
            await exchangeERP.deleteObjectRegistration({ object_type: 'param', object_uuid: currentProduct.uuid }).catch((err) => {
              console.log(err);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

async function updateProduct(productItem) {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import product', productItem.name, '-->');

  let currentProduct = await ProductModel.findOne({
    where: { uuid: productItem.uuid },
  });

  const { translations, ...productData } = productItem;

  if (currentProduct) {
    await ProductModel.update({ productData }, { where: { id: currentProduct.id } }).catch((err) => {
      throw err;
    });
  } else {
    currentProduct = await ProductModel.create(productData).catch((err) => {
      throw err;
    });
  }

  await syncTranslations.deleteTranslations('product', productData.uuid);

  currentProduct = JSON.stringify(currentProduct);
  currentProduct = JSON.parse(currentProduct);

  if (currentProduct) {
    let catalogInfo = {
      type: 'product',
      id: currentProduct.id,
      uuid: productData.uuid,
    };
    await syncTranslations.createTranslations(catalogInfo, translations);
  }

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import product', productItem.name, '.');

  return currentProduct;
}

async function updateExpressionVariables(product, paramData) {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import expression variables -->');

  await exchangeERP
    .getProductExpressionVariables(product.uuid)
    .then(async (prodVariables) => {
      if (!prodVariables.data) {
        return;
      }

      for (let prodVariable of prodVariables.data) {
        prodVariable.productUuid = product.uuid;
        prodVariable.productId = product.id;
        prodVariable.value = JSON.stringify(prodVariable.value);

        let currentVariable = await ExpressionVariableModel.findOne({
          where: {
            productId: prodVariable.productId,
            name: prodVariable.name,
          },
        });

        if (currentVariable) {
          await ExpressionVariableModel.update(prodVariable, {
            where: { id: currentVariable.id },
          }).catch((err) => {
            console.error(err);
          });
        } else {
          await ExpressionVariableModel.create(prodVariable).catch((err) => {
            console.error(err);
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import expression variables.');
}

async function updateProductParameters(product, paramData) {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import parameters -->');

  await exchangeERP
    .getProductParameters(product.uuid)
    .then(async (prodParams) => {
      if (!prodParams.data) {
        return;
      }

      for (let prodParamData of prodParams.data) {
        const { translations, ...prodParam } = prodParamData;

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import parameter ', prodParam.name, '-->');

        prodParam.productUuid = product.uuid;
        prodParam.productId = product.id;
        prodParam.filterDefault = JSON.stringify(prodParam.filterDefault);
        prodParam.filter = JSON.stringify(prodParam.filter);

        let currentParam = await ParamModel.findOne({
          where: { uuid: prodParam.uuid },
        });

        if (currentParam) {
          await ParamModel.update(prodParam, {
            where: { id: currentParam.id },
          }).catch((err) => {
            console.error(err);
          });
        } else {
          currentParam = await ParamModel.create(prodParam).catch((err) => {
            console.error(err);
          });
        }

        await syncTranslations.deleteTranslations('parameter', prodParam.uuid);

        if (currentParam) {
          //++update parameter translations
          let catalogInfo = {
            type: 'parameter',
            id: currentParam.id,
            uuid: prodParam.uuid,
          };
          await syncTranslations.createTranslations(catalogInfo, translations);
          //++update parameter translations

          //++update parameter properties
          await updateParameterProperties(product, currentParam);
          //--update parameter properties

          //++update parameter values
          await updateParameterValues(product, currentParam);
          //--update parameter values
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import parameter', prodParam.name, '.');
      }
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import parameters.');
}

async function updateParameterProperties(currentProduct, currentParam) {
  await exchangeERP
    .getParameterProperties(currentProduct.uuid, currentParam.uuid)
    .then(async (paramProps) => {
      for (let paramPropData of paramProps.data) {
        const { translations, ...paramProp } = paramPropData;

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import property ', paramProp.name, '-->');

        paramProp.paramId = currentParam.id;
        paramProp.productUuid = currentProduct.uuid;

        let currentProp = await ParamPropModel.findOne({
          where: { uuid: paramProp.uuid },
        });

        if (currentProp) {
          await ParamPropModel.update(paramProp, {
            where: { id: currentProp.id },
          }).catch((err) => {
            console.log(err);
          });
        } else {
          currentProp = await ParamPropModel.create(paramProp).catch((err) => {
            console.log(err);
          });
        }

        await syncTranslations.deleteTranslations('property', paramProp.uuid);

        if (currentProp) {
          //++update property translations
          let catalogInfo = {
            type: 'property',
            id: currentProp.id,
            uuid: paramProp.uuid,
          };
          await syncTranslations.createTranslations(catalogInfo, translations);
          //++update property translations

          if (currentProp.depended) {
            //++update depended values
            await updatePropertyDependedValues(currentProp);
            //++update depended values
          }

          //++update property values
          await updatePropertyValues(currentProp);
          //--update property values
        }

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import property', paramProp.name, '.');
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updatePropertyValues(currentProp) {
  await exchangeERP
    .getPropertyValues(currentProp.uuid)
    .then(async (propValues) => {
      if (!propValues.data) {
        return;
      }

      for (let propValueData of propValues.data) {
        const { translations, ...propValue } = propValueData;

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import property value ', propValue.name, '-->');

        propValue.propId = currentProp.id;
        let currentPropValue = await PropValueModel.findOne({
          where: { uuid: propValue.uuid },
        });
        if (currentPropValue) {
          await PropValueModel.update(propValue, {
            where: { id: currentPropValue.id },
          }).catch((err) => {
            console.log(err);
          });
        } else {
          currentPropValue = await PropValueModel.create(propValue).catch((err) => {
            console.log(err);
          });
        }

        await syncTranslations.deleteTranslations('property_value', propValue.uuid);

        if (currentPropValue) {
          //++update property value translations
          let catalogInfo = {
            type: 'property_value',
            id: currentPropValue.id,
            uuid: propValue.uuid,
          };
          await syncTranslations.createTranslations(catalogInfo, translations);
          //++update property value translations
        }

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import property value', propValue.name, '.');
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateParameterValues(currentProduct, currentParam) {
  await exchangeERP
    .getParameterValues(currentProduct.uuid, currentParam.uuid)
    .then(async (paramValues) => {
      if (!paramValues.data) {
        return;
      }

      for (let paramValueData of paramValues.data) {
        const { translations, ...paramValue } = paramValueData;

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import parameter value  ', paramValue.name, '-->');

        paramValue.paramId = currentParam.id;
        paramValue.filter = JSON.stringify(paramValue.filter);
        paramValue.filterDefault = JSON.stringify(paramValue.filterDefault);

        let currentParamValue = await ParamValueModel.findOne({
          where: { uuid: paramValue.uuid },
        });

        if (currentParamValue) {
          await ParamValueModel.update(paramValue, {
            where: { id: currentParamValue.id },
          }).catch((err) => {
            console.log(err);
          });
        } else {
          currentParamValue = await ParamValueModel.create(paramValue).catch((err) => {
            console.log(err);
          });
        }

        await syncTranslations.deleteTranslations('parameter_value', paramValue.uuid);

        if (currentParamValue) {
          //++update parameter value translations
          let catalogInfo = {
            type: 'parameter_value',
            id: currentParamValue.id,
            uuid: paramValue.uuid,
          };
          await syncTranslations.createTranslations(catalogInfo, translations);
          //++update parameter value translations

          if (paramValue.properties) {
            await updateValueProperties(currentParamValue, paramValue.properties);
          }
        }

        // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import parameter value', paramValue.name, '.');
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateValueProperties(curParamValue, valueProperties) {
  for (let valueProperty of valueProperties) {
    // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import value property ', curParamValue.name, valueProperty.propUuid, '-->');

    const curValueProperty = await ParamValuePropsModel.findOne({
      where: {
        valueUuid: valueProperty.valueUuid,
        propUuid: valueProperty.propUuid,
      },
    });

    const curProperty = await ParamPropModel.findOne({
      where: { uuid: valueProperty.propUuid },
    });

    if (curProperty) {
      valueProperty.valueId = curParamValue.id;
      valueProperty.propId = curProperty.id;

      if (curValueProperty) {
        await ParamValuePropsModel.update(valueProperty, {
          where: { valueId: curParamValue.id, propId: curProperty.id },
        }).catch((err) => {
          console.log(err);
        });
      } else {
        await ParamValuePropsModel.create(valueProperty).catch((err) => {
          console.log(err);
        });
      }
    }

    // console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End import value property ', curParamValue.name, valueProperty.propUuid, '.');
  }
}

async function updatePropertyDependedValues(currentProp) {
  await exchangeERP
    .getDependedPropertyValues(currentProp.uuid)
    .then(async (dependValues) => {
      if (!dependValues.data) {
        return;
      }

      //update dimensions data
      await DependedPropDimensionModel.destroy({
        where: { propId: currentProp.id },
      });

      await DependedPropValueModel.destroy({
        where: { propId: currentProp.id },
      });

      for (let propData of dependValues.data) {
        for (let dimensionValue of propData.dimensions) {
          dimensionValue.propUuid = currentProp.uuid;
          dimensionValue.propId = currentProp.id;

          await DependedPropDimensionModel.create(dimensionValue).catch((err) => {
            console.log(err);
          });
        }

        //update prop values data
        for (let dependValue of propData.propValues) {
          dependValue.propUuid = currentProp.uuid;
          dependValue.propId = currentProp.id;

          await DependedPropValueModel.create(dependValue).catch((err) => {
            console.log(err);
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
