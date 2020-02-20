const db = require('../db');
const createError = require('http-errors');

/**
 * Database handle to match response with model
**/
class databaseHandler {
  constructor(Model) {
    this._Model = Model;
  }

  /**
   * Get a list of values
   * @param {Object} params - the mysql.connection.query params
   * @returns {Promise}
  **/
  fetchAll(...params) {
    return new Promise((resolve, reject) => {
      db.query(...params, (error, results) => {
        if(error) {
          return reject(error);
        }
        return resolve(results.map(result => new this._Model(result)));
      });
    });
  }

  /**
   * Get a single instance of Model
   * @param {Object} params - the mysql.connection.query params
   * @returns {Promise}
  **/
  fetchOne(...params) {
    return new Promise((resolve, reject) => {
      db.query(...params, (error, results) => {
        if(error) {
          return reject(error);
        }

        if(results && results.length) {
          return resolve(new this._Model(results[0]));
        }
        
        return reject(createError(404));
      });
    });
  }

  /**
   * Create an SQL Transaction
   * @param {Object} params - mysql.connection.query params
   * @returns {Promise}
  **/
  transaction(...params) {
    return new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if(err) { return reject(err); }
        db.query(...params, (error, results) => {
          if(error) { return db.rollback(() => reject(error)); }
          db.commit((err) => {
            if(err) { return reject(err); }

            return resolve(true);
          });
          return resolve(true);
        });
      });
    });
  }
}


module.exports = {
  databaseHandler,
}
