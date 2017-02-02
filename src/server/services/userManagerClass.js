const mysql = require('promise-mysql');
const dbConfig = require('../.dbConfig');

class userManager {
    constructor() {
        dbConfig.database = 'node_test';
        // dbConfig.connectionLimit = 10;
        this.connectionPool = mysql.createPool(dbConfig);
    }

    /**
      * @param sql (object): { query: 'string', values: (object) || (null) }
      * @return (array): [rows]
      */
    performQuery(sql) {
        return this.connectionPool.getConnection().then(connection => {
            return connection.query(sql.query, sql.values).then(rows => {
                //TODO print query string
                this.connectionPool.releaseConnection(connection);
                return rows;
            }).catch(error => {
                console.error(error);
            });
        }).catch(error => {
            error.sql = sql;
            console.error(error);
        });
    }

    /**
      * @param userData (string)
      * @param findBy (string)
      * @return (array): [rows]
      */
    findUser(userData = 0, findBy = 'name') {

        const sql = {
            query: `SELECT * FROM users WHERE ${findBy} = ?`,
            values: userData
        };
        return new Promise((resolve, reject) => {
            this.performQuery(sql).then(rows => {
                if (rows) {
                    resolve(rows);
                } else {
                    reject(`Rejected! No user found.`);
                }
            }).catch(error => {
                console.error(error)
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
            //TODO use UUID
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

    update() {
        const sql = {
            query: 'UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?',
            values: [] // ['a', 'b', 'c', userId]
        };
    }

    delete() {
        const sql = {
            query: 'DELETE FROM `users` WHERE id = ?',
            values: '' // 'UUID'
        };
    }
}

module.exports = new userManager();
