const expect = require('chai').expect;
const User = require('../model');

describe('Test User Model', () => {
  it('should retrieve all data in json', () => {
    const user = new User({
      login: 'test',
      password: 'test',
      lastname: 'test',
      firstname: 'test'
    });

    expect(user.toJson()).to.deep.equal({
      login: 'test',
      lastname: 'test',
      firstname: 'test'
    })
  });
});
