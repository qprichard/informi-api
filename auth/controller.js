const Token = require('./model');
const createError = require('http-errors');
const { databaseHandler } = require('../utils/handlers');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { config } = require('../utils/helpers');

const { JWT_SECRET } = config;

class TokenController {
  constructor() {
    this.db = new databaseHandler(Token);
  }

  create(data) {
    const { login } = data;
    const expires = moment().add(10, 'minutes').valueOf();

    const token = jwt.sign({
      data: login,
      exp: expires
    }, JWT_SECRET);

    return new Promise((resolve, reject) => {
      this.db.transaction(
        'INSERT INTO `token` (login, token) VALUES (?, ?);',
        [login, token]
      ).then(() => resolve(token)).catch((err) => reject(err))
    });
  }

  delete(data) {
    const { token, login } = data;
    if(login) {
      return new Promise((resolve, reject) => {
        this.db.transaction(
          'DELETE FROM `token` WHERE login=?;',
          [login]
        ).then(value => resolve(value)).catch(err => reject(err))
      });
    }

    if(token) {
      return new Promise((resolve, reject) => {
        this.db.transaction(
          'DELETE FROM `token` WHERE token=?;',
          [token]
        ).then(value => resolve(value)).catch(err => reject(err))
      });
    }
  }

  get(data) {
    const { token } = data;
    return new Promise((resolve, reject) => {
      this.db.fetchOne(
        'SELECT * FROM `token` WHERE token=?',
        [token]
      ).then(
        (value) => {
          value = value.toJson();
          const decoded = jwt.decode(value.token, JWT_SECRET);

          return resolve(decoded);
        }
      ).catch((err) => reject(createError(401)))
    });
  }
}

module.exports = TokenController
