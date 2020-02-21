const UserView = require('./view');
const { authMiddleware } = require('../auth/middlewares');

const urls = [
  {
    method: "GET",
    url: "/users",
    preHandler: [authMiddleware],
    handler: (...args) => new UserView(...args).list(),
  },
  {
    method: "POST",
    url: "/users/authenticate",
    handler: (...args) => new UserView(...args).authenticate(),
  },
  {
    method: "GET",
    url: "/users/:login",
    preHandler: [authMiddleware],
    handler: (...args) => new UserView(...args).get(),
  },
  {
    method: "POST",
    url: "/users",
    preHandler: [authMiddleware],
    handler: (...args) => new UserView(...args).create()
  }
]

module.exports = urls;
