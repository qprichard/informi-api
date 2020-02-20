const expect = require('chai').expect;
const UserController = require('../controller');
const database = require('../../db');

describe('Test the User controller', () => {
  afterEach(done => {
    database.query("DELETE FROM `users`;", () => {done(); });
  });

  afterEach(done => {
    database.query("DELETE FROM `token`;", () => {done(); });
  });

  const controller = new UserController();

  describe('Test list method', () => {
    it('should retrieve empty array', async () => {
      const values = await controller.list()
      expect(values).to.be.an('array').that.is.empty;
    });

    it('should retrieve a user in list', (done) => {
      database.query("INSERT INTO `users` (login, password, lastname, firstname) VALUES ('test', 'test', 'test', 'test')", async () => {
        const values = await controller.list();
        expect(values).to.be.an('array');
        expect(values.length).to.equal(1);
        expect(values[0]).to.deep.equal({
          login: "test",
          lastname:"test",
          firstname: "test"
        });
        done();
      });
    });
  });

  describe('Test get method', () => {
    it('should get a 404 Error', async () => {
      const value = await controller.get('test');
      expect(value).to.be.instanceof(Error);
      expect(value.statusCode).to.equal(404);
      expect(value.message).to.equal('Not Found');
    });

    it('should retrieve a user', (done) => {
      database.query("INSERT INTO `users` (login, password, lastname, firstname) VALUES ('test', 'test', 'test', 'test')", async () => {
        const value = await controller.get('test');
        expect(value).to.be.an('object');
        expect(value).to.deep.equal({
          login: "test",
          lastname:"test",
          firstname: "test"
        });
        done();
      });
    });
  });

  describe('Test create method', () => {
    it('should return true', async () => {
      const value = await controller.create({ lastname: 'test', firstname: 'test', login: 'test', password:'test'});
      expect(value).to.equal(true);
    });

    it('should return an Error', async () => {
      const value = await controller.create({ firstname: 'test', login: 'test', password:'test'});
      expect(value).to.be.instanceof(Error);
      expect(value.code).to.equal('ER_BAD_NULL_ERROR');
    });
  });

  describe('Test authenticate method', () => {
    it('should return a 401 Error after searching', async () => {
      const value = await controller.authenticate({ login: 'test', password: 'test'});

      expect(value).to.be.instanceof(Error);
      expect(value.statusCode).to.equal(401);
    });

    it('should return a 401 Error before searching', async () => {
      const value = await controller.authenticate();

      expect(value).to.be.instanceof(Error);
      expect(value.statusCode).to.equal(401);
    });

    it('should retrieve the authenticated user', async () => {
      await controller.create({ lastname: 'test', firstname: 'test', login: 'test', password:'test'});

      const user = await controller.authenticate({ login: 'test', password: 'test' });
      expect(user).to.be.an('object');
      expect(user).to.have.all.keys('login', 'lastname', 'firstname', 'token');
    });
  });
});
