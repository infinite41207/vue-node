const Product = require('@catalogs/products/models');
const exchangeOknoERP = require('./exchangeOknoERP');
//const logger = require('@logging/logger');

module.exports = async () => {
  console.log('Begin sync of products...');
  const productsLoadedList = [];

  const queryResult = await exchangeOknoERP
    .getItemsChanges()
    .then(async (queryResult) => {
      for (let item of queryResult) {

        const productData = {
          uuid: item.ItemRef,
          name: item.Item,
          code: item.ItemCode,
          article: item.ItemArticle,
          configProduct: false,
          unitOfMeasureStr: item.UM, 
          status: 'Active',
          description: item.Item,
          baseSupplierRef: item.BaseSupplierRef,
          baseSupplier: item.BaseSupplier,
          itemSupplierArticle: item.ItemSupplierArticle,
          lang: 'pl'
        }

        //console.log('Import product: ', productData.name, '-->');

        const product = await Product.findOne({
          where: { uuid: item.ItemRef },
        });
        if (product) {
          await Product.update(productData, { where: { id: product.id } })
          .then(async () => {
            console.log('Update product: ', productData.name, '-->');
            productsLoadedList.push({ uuid: productData.uuid });
          })
          .catch((err) => {
            console.log(err);
            //logger.error('Error in syncSalesOrdersChanges update Product', { meta: err });
          });
        } else {
          productData.status = 'Active';
          await Product.create(productData)
          .then(async () => {
            console.log('Create product: ', productData.name, '-->');
            productsLoadedList.push({ uuid: productData.uuid });
          })
          .catch((err) => {
            console.log(err);
            //logger.error('Error in syncSalesOrdersChanges create Product', { meta: err });
          });
        }
      }
    })
    .catch((err) => {
      console.error('Proplem synchronizacji produktów:', err);
    });

  await exchangeOknoERP.deleteItemsChanges({uuids: productsLoadedList}).catch((err) => {
    console.error('Problem z usunięciem z rejestracji produktów:', err);
  });

  console.log('End sync products.');
};
