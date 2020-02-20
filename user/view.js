const UserController = require('./controller');
const { databaseHandler } = require('../utils/handlers');

class UserView {
  constructor(req, res) {
    this._controller =  new UserController();
    this.params = req.params;
    this.body = req.body;
    this.res = res;
  }

  list() { return this._controller.list(); }

  get() {
    const { login } = this.params;

    if(!login) { return null; }

    return this._controller.get(login);
  }

  create() {
    if(!this.body) { return null; }

    return this._controller.create(this.body);
  }

  authenticate() {
    if(!this.body) { return null; }

    return this._controller.authenticate(this.body)
  }
}

module.exports = UserView;
