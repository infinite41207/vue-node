const ExpressionVariable = require('../models/expressionVariable');

module.exports = {
  async findAll(req, res, next) {
    const productId = req.body.productId;

    const expressionVariables = await ExpressionVariable.findAll({ where: { productId: productId } });

    if (expressionVariables) {
      res.status(200).send(expressionVariables);
    } else {
      console.error({ message: 'Formula not found!' });
      res.status(400).send({
        message: 'Bad request',
      });
    }
  },
};
