const Product = require('@catalogs/products/models');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');

module.exports = async () => {
  console.log('\x1b[34m---- Begin sync products ----\x1b[0m');
  const queryResult = await exchangeERP
    .getProducts()
    .then(async (queryResult) => {
      for (let productItem of queryResult.data) {
        console.log('\x1b[32m> Begin\x1b[0m import product', productItem.name, '-->');

        let currentProduct = await Product.findOne({
          where: { uuid: productItem.uuid },
        });

        const { translations, ...productData } = productItem;

        if (currentProduct) {
          await Product.update({ productData }, { where: { id: currentProduct.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          productData.status = 'Active';
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

        console.log('\x1b[31m< End\x1b[0m import product', productItem.name, '.');
      }
    })
    .catch((err) => {
      console.error('Proplem synchronizacji produktów:', err);
    });

  console.log('\x1b[34m---- End sync products ----\x1b[0m');
};
