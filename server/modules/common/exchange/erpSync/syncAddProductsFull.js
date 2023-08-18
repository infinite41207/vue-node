const Product = require('@catalogs/products/models');
const exchangeERP = require('./exchangeERP');
const syncTranslations = require('./syncTranslations');

module.exports = async () => {
  console.log('Sync add products...');
  const queryResult = await exchangeERP
    .getAddProducts()
    .then((queryResult) => {
      queryResult.data.forEach(async (element) => {
        console.log('Import add product: ', element.name, '-->');

        let currentProduct = await Product.findOne({
          where: { uuid: element.uuid },
        });

        const { translations, ...productData } = element;

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
      });
    })
    .catch((err) => {
      console.error('Proplem synchronizacji produktów:', err);
    });
};
