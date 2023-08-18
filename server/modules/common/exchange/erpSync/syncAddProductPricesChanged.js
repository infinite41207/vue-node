const Product = require('@catalogs/products/models');
const ProductPrice = require('@registers/productPrices/models');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync product prices.');

  const queryResult = await exchangeERP
    .getAddProductPricesToExchange()
    .then(async (queryResult) => {
      if (queryResult.data) {
        for (let docData of queryResult.data) {
          console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Sync prices for document ', docData.number);

          await ProductPrice.destroy({
            where: { uuid: docData.uuid },
          });

          if (docData.products) {
            for (let priceData of docData.products) {
              const currentProduct = await Product.findOne({
                where: { uuid: priceData.productUuid },
              });

              if (currentProduct) {
                for (let productPrice of priceData.prices) {
                  productPrice.productId = currentProduct.id;
                  productPrice.uuid = docData.uuid;
                  await ProductPrice.create(productPrice).catch((err) => {
                    console.log(err);
                    throw err;
                  });
                }
              }
            }
          }

          console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for price document ', docData.number);
          await exchangeERP.deleteObjectRegistration({ object_type: 'docprice', object_uuid: docData.uuid }).catch((err) => {
            console.log(err);
          });
        }
      }

      queryResult.data.forEach(async (priceData) => {});
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Proplem synchronizacji cen produktów:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync product prices.');
};
