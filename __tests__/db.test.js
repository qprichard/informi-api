const expect = require('chai').expect;
const db = require('../db');

describe('Test db connection', () => {
  it('should have been instancied with test values', () => {
    expect(db).to.be.instanceof(Object);
  })
})
