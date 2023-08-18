const Product = require('@catalogs/products/models');
const ProductPrice = require('@registers/productPrices/models');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');

module.exports = async () => {
  console.log('Begin sync product prices...');

  const queryResult = await exchangeERP
    .getAddProductPrices()
    .then((queryResult) => {
      queryResult.data.forEach(async (priceData) => {
        const currentProduct = await Product.findOne({
          where: { uuid: priceData.productUuid },
        });

        if (currentProduct) {
          await ProductPrice.destroy({
            where: { productId: currentProduct.id },
          });

          for (let productPrice of priceData.prices) {
            productPrice.productId = currentProduct.id;
            console.log('create price for product', currentProduct.name, productPrice.price);
            await ProductPrice.create(productPrice).catch((err) => {
              console.log(err);
            });
          }
        }
      });
    })
    .catch((err) => {
      console.error('Proplem synchronizacji cen produktów:', err);
    });

  console.log('End sync product prices...');
};
