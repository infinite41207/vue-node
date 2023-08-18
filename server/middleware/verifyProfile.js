const User = require('@catalogs/users/models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const access_token = authorizationHeader.split('Bearer ')[1];
  const decoded = jwt.verify(access_token, process.env.PRIVATE_KEY_FOR_JWT);

  const user = await User.findByPk(decoded.id).catch((err) => {
    res.status(400).send({
      message: 'bad request from middleware',
    });
  });

  if (!user) {
    res.status(404).send({
      message: 'Profile not found',
    });
    return;
  }
  req.profile = user;
  req.isAuth = true;
  next();
};
