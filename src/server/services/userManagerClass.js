const mysql = require('mysql');
const dbConfig = require('../.dbConfig');

class userManager {
    constructor() {
        dbConfig.database = 'node_test';
        // dbConfig.connectionLimit = 10;
        this.connectionPool = mysql.createPool(dbConfig);
    }

    /**
      * @param sql (object): { query: 'string', values: (object) || (null) }
      * @return (object): { rows: [], fields: [], sql: {}}
      */
    performQuery(sql) {
        return new Promise((resolve, reject) => {
            this.connectionPool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(connection);
                }
            });
        }).then(connection => {
            const result = new Promise((resolve, reject) => {
                connection.query(sql.query, sql.values || null, (error, rows, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({rows: rows, fields: fields, sql: sql});
                    }
                });
            });
            return result.then(releaseConnection, releaseConnection);

            function releaseConnection() {
                connection.release();
                return result;
            }
        }).catch(error => {
            error.sql = sql;
            throw error;
        });
    }

    /**
      * @param userData (string)
      * @param findBy (string)
      * @return (array): [rows]
      */
    findUser(userData, findBy = 'name') {
        const sql = {
            query: `SELECT * FROM users WHERE ` + (userData ? `${findBy} = ${mysql.escape(userData)}` : 1)
        };
        return new Promise((resolve, reject) => {
            this.performQuery(sql).then(result => {
                if (result) {
                    resolve(result.rows);
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
      * @param userObj (object): {name: '', email: '', ...}
      * @return (string)
      */
    addUser(userObj) {
        const checkData = (key) => {
            return new Promise((resolve, reject) => {
                if (!userObj[key]) {
                    reject(`Rejected! Missing ${key}`);
                }
                this.findUser(userObj[key], key).then(result => {
                    if (!result) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        };
        return Promise.all([checkData('name'), checkData('email')]).then(results => {
            userObj.registration_date = new Date();
            const sql = {
                query: 'INSERT INTO users SET ?',
                values: userObj
            };
            return new Promise((resolve, reject) => {
                let message;
                if (!results) {
                    reject(error);
                } else if (results[0].length || results[1].length) {
                    message = 'Error';
                    if (results[0].length) {
                        message += ' existingUsername';
                    }
                    if (results[1].length) {
                        message += ' existingEmail';
                    }
                    resolve(message);
                } else {
                    this.performQuery(sql, userObj).then(result => {
                        message = 'User successfully added';
                        resolve(message);
                    });
                }
            });
        });
    }

    update() {}

    delete() {}
}

module.exports = new userManager();
