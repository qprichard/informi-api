const User = require('./model');
const createError = require('http-errors');
const { databaseHandler } = require('../utils/handlers')
const { config } = require('../utils/helpers');

const { SALT } = config;

class UserController {
  constructor() {
    this.db = new databaseHandler(User);
  }

  list() {
      return this.db.fetchAll('SELECT * FROM `users`;').then(
        (values) => values.map(value => value.toJson())
      ).catch((err) => err );
  }

  get(login) {
    return this.db.fetchOne(
      'SELECT * FROM `users` WHERE login=?',
      [login]).then((value) => value.toJson()).catch((err) => err);
  }

  create(data) {
    const { lastname, firstname, login, password } = data;

    return this.db.transaction(
      'INSERT INTO `users` (login, password, firstname, lastname) VALUES (?, aes_encrypt(?, ?), ?, ?)',
      [login, password, SALT, firstname, lastname]
    ).then((value) => value).catch((err) => err)
  }

  authenticate(data= {}) {
    const { login, password } = data;

    if(!login || !password) {
      return createError(404);
    }

    return this.db.fetchOne(
      'SELECT * FROM `users` WHERE login=? AND password=aes_encrypt(?,?)',
      [login, password, SALT]
    ).then((value) => value.toJson()).catch(err => err)
  }
}

module.exports = UserController;
