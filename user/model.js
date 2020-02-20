/* Model User */

class User {
  constructor({
    login,
    password,
    lastname,
    firstname,
  }) {
    this.login = login;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  toJson() {
    return ({
      login: this.login,
      firstname: this.firstname,
      lastname: this.lastname,
    })
  }
}

module.exports = User;
