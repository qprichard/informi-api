const expect = require('chai').expect;
const TokenController = require('../controller');
const UserController = require('../../user/controller');
const database = require('../../db');

describe('Test TokenController class', () => {
  after(done => {
    database.query("DELETE FROM `users`;", () => {done(); });
  });

  afterEach(done => {
    database.query("DELETE FROM `token`;", () => {done(); });
  });

  const userController = new UserController();

  before((done) => {
    userController.create({
      login: 'test',
      password: 'test',
      lastname: 'test',
      firstname: 'test'
    }).then(() => { done()}).catch((err) => { done(); });
  })
  const controller = new TokenController();

  describe('Test create method', () => {
    it('should return a token', async () => {
      const value = await controller.create({ login: 'test' });
      expect(value).to.be.a('string');
      expect(value.length).to.equal(151);
    });

    it('should return an error', () => {
      const value = controller.create({ login: 'test2'}).catch((err) => {
        expect(err).to.be.instanceof(Error);
        expect(err.code).to.equal("ER_NO_REFERENCED_ROW_2");
      });
    });
  });

  describe('Test delete method', () => {
    it('should delete all token', (done) => {
      controller.create({ login: 'test' });
      controller.create({ login: 'test' });

      controller.delete({ login: 'test' }).then((value) => {
        expect(value).to.be.an('object');
        expect(value.affectedRows).to.equal(2);
        done();
      });
    });

    it('should delete one token',  async () => {
      const token = await controller.create({ login: 'test' });

      const value = await controller.delete({ token });

      expect(value).to.be.an('object');
      expect(value.affectedRows).to.equal(1);
    });
  });

  describe('Test get method', () => {

    it('should get selected Token', async () => {
      const token = await controller.create({ login: 'test' });

      const value = await controller.get({ token });

      expect(value).to.have.all.keys('data', 'exp', 'iat');
      expect(value.data).to.equal('test');

    });

    it('should get selected Token', (done) => {

      controller.get({ token: '1234' }).then((value) => value).catch((err) => {
        expect(err).to.be.instanceof(Error);
        expect(err.statusCode).to.equal(401);
        done();
      });
    });
  });
});
