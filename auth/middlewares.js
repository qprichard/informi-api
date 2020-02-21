const createError = require('http-errors');
const TokenController = require('./controller');
const moment = require('moment');

const authMiddleware = (req, res, next) => {
    const { headers } = req;
    const token = headers ? headers['authorization'] : null;

    if(!token) {
      return res.send(createError(401));
    }

    const controller = new TokenController();

    return controller.get({ token }).then(
      (value) => {
        const { exp, data } = value;

        if(exp < moment().valueOf()) {
          controller.delete({ token });
          return res.send(createError(401, 'Token expired'));
        }

        req.user = data;
        next();
      }
    ).catch(err => res.send(err));
}

module.exports = {
  authMiddleware,
}
