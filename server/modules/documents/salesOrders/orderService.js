const Order = require('./models/order');

module.exports = {
  async setOrderNumber(orderData) {
    if (!orderData.prefix) {
      orderData.prefix = 'O';
    }

    await Order.findOne({ where: { prefix: orderData.prefix }, attributes: ['number'], order: [['number', 'DESC']] })
      .then((orderNumber) => {
        if (orderNumber) {
          orderNumber = JSON.stringify(orderNumber);
          orderNumber = JSON.parse(orderNumber);
          orderData.number = ++orderNumber.number;
        } else {
          orderData.number = 1;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
