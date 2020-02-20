/**Model for Token table**/

class Token {
  constructor({
    login,
    token
  }) {
    this.login = login;
    this.token = token;
  }

  toJson() {
    return ({
      login: this.login,
      token: this.token
    })
  }
}

module.exports = Token;
