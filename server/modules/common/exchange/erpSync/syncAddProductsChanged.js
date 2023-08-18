const Product = require('@catalogs/products/models');
const UnitOfMeasure = require('@catalogs/unitsOfMeasure/models');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync add products.');

  const queryResult = await exchangeERP
    .getAddProductsToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import add product: ', element.name);

        const { translations, unitOfMeasure, ...productData } = element;

        let unitOfMeasureId = null;
        if (unitOfMeasure.uuid) {
          let existUnitOfMeasure = await UnitOfMeasure.findOne({ where: { uuid: unitOfMeasure.uuid } });

          unitOfMeasure.lang = JSON.stringify(unitOfMeasure.lang);

          if (existUnitOfMeasure) {
            unitOfMeasureId = existUnitOfMeasure.id;

            await existUnitOfMeasure.update({ ...unitOfMeasure }).catch((err) => {
              console.log(err);
            });
          } else {
            await UnitOfMeasure.create({ ...unitOfMeasure })
              .then((newUnitOfMeasure) => {
                unitOfMeasureId = newUnitOfMeasure.id;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }

        productData.unitOfMeasureId = unitOfMeasureId;
        delete productData.unitOfMeasure;

        console.log('productData', productData);

        let currentProduct = await Product.findOne({
          where: { uuid: element.uuid },
        });

        if (currentProduct) {
          await Product.update({ productData }, { where: { id: currentProduct.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          currentProduct = await Product.create(productData).catch((err) => {
            console.log(err);
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

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for product ', currentProduct.name);
        await exchangeERP.deleteObjectRegistration({ object_type: 'product', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji produktów:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync add products.');
};
