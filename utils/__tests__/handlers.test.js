const expect = require('chai').expect;
const { databaseHandler } = require('../handlers');
const database = require('../../db');

describe('Test databaseHandler', () => {
  class BaseModel {
    constructor({ id }) {
      this.id = id;
    }

    toJson() {
      return ({
        id: this.id
      })
    }
  }
  const dbHandler = new databaseHandler(BaseModel);
  afterEach((done) => {
    database.query('DELETE FROM `test`;', (err, results) => {
      done();
    })
  });

  describe('fetchAll', () => {
    it('should get ER_NO_SUCH_TABLE', () => {
      dbHandler.fetchAll("SELECT * FROM test2;").catch(
        (err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.code).to.equal('ER_NO_SUCH_TABLE');
        });
    });

    it('should retrieve empty array', () => {
      dbHandler.fetchAll("SELECT * FROM users;").then(
        (values) => {
          expect(values).to.be.an('array').that.is.empty;
        }
      )
    });

    it('should retrieve array of BaseModel instance', (done) => {
      database.query('INSERT INTO `test` (id) VALUES (1);',() => {
        dbHandler.fetchAll("SELECT * FROM `test`;").then(
          (values) => {
            expect(values).to.be.an('array');
            expect(values.length).to.equal(1);
            values.forEach(value => expect(value).to.be.instanceof(BaseModel))
            done()
          }
        )
      });
    });
  });

  describe('fetchOne', () => {
    afterEach((done) => {
      database.query('DELETE FROM `test`;', (err, results) => {
        done();
      })
    });

    it('should get ER_NO_SUCH_TABLE', () => {
      dbHandler.fetchOne("SELECT * FROM test2;").catch(
        (err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.code).to.equal('ER_NO_SUCH_TABLE');
        });
    });

    it('should retrieve not found Error', () => {
      dbHandler.fetchOne("SELECT * FROM `test` WHERE id=2").catch(
        (err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal('Not Found');
          expect(err.statusCode).to.equal(404);
        })
    });

    it('should retrieve an instance', (done) => {
      database.query('INSERT INTO `test` (id) VALUES (1)',() => {
        dbHandler.fetchOne("SELECT * FROM `test`").then(
          (value) => {
            expect(value).to.be.instanceof(BaseModel);
            done();
          }
        )
      });
    });
  });

  describe('transaction', () => {
    it('should success the transaction', () => {
      dbHandler.transaction('INSERT INTO `test` (id) VALUES (3)').then(
        (value) => {
          expect(value).to.equal(true);
        }
      )
    });
  });
});
