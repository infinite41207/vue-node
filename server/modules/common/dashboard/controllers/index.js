module.exports = {
  async findAll(req, res, next) {
    res.status(200).send({ result: [], message: 'OK' });
  },
};
