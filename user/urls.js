const UserView = require('./view');

const urls = [
  {
    method: "GET",
    url: "/users",
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
    handler: (...args) => new UserView(...args).get(),
  },
  {
    method: "POST",
    url: "/users",
    handler: (...args) => new UserView(...args).create()
  }
]

module.exports = urls;
