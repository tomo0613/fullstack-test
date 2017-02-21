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
                if (!rows) {
                    reject('Rejected! No user found.');
                } else {
                    resolve(rows);
                }
            }).catch(error => {
                console.error(error)
            });
        });
    }

    /**
     * @param userObj (object): {name: '', email: '', ...}
     * @param propsToCheck (array): ['name', ...]
     * @return (array)
     */
    checkExistence(userObj, propsToCheck = ['name', 'email']) {
        if (!userObj) {
            throw Error('missing user object');
        }
        const checkProps = propsToCheck.map((prop) => {
            if (userObj[prop]) {
                return this.findUser(userObj[prop], prop);
            } else {
                return Promise.resolve([]);
            }
        });
        return Promise.all(checkProps).then(results => {
            let existingProps = [];
            results.forEach((result, index) => {
                if (result.length) {
                    existingProps.push(propsToCheck[index]);
                }
            });
            return Promise.resolve(existingProps);
        }).catch(error => console.error(error));
    }

    /**
     * @param userObj (object): {name: '', email: '', ...}
     * @return (string)
     */
    addUser(userObj) {
        const sql = {
            query: `INSERT INTO users SET ?`,
            values: userObj
        };
        return this.checkExistence(userObj).then(response => {
            if (response.length) {
                return Promise.reject(`User exists with the given: ${response}`);
            } else {
                //TODO regDate + uuid
                return this.performQuery(sql).then(rows => {
                    return Promise.resolve((rows.affectedRows ? 'User successfully created' : 'No result'));
                }).catch(error => {
                    console.error(error);
                });
            }
        }).catch(error => {
            console.error(error);
        });
    }

    /**
     * @param userData (object): {name: '', email: '', ...}
     * @param userId (number)
     * @return (string)
     */
    updateUser(userData, userId) {
        const sql = {
            query: 'UPDATE users SET ? WHERE id = ?',
            values: [userData, userId]
        };
        return this.checkExistence(userData).then(response => {
            if (response.length) {
                return Promise.reject(`existing props: ${response}`);
            } else {
                return this.performQuery(sql).then(rows => {
                    return Promise.resolve((rows.changedRows ? 'User successfully updated' : 'No result'));
                }).catch(error => {
                    console.error(error)
                });
            }
        }).catch(error => {
            console.error(error);
        });
    }

    /**
     * TODO
     */
    deleteUser(userId) {
        const sql = {
            query: 'DELETE FROM `users` WHERE id = ?',
            values: userId // TODO 'UUID'
        };
        return new Promise((resolve, reject) => {
            this.performQuery(sql).then(rows => {
                if (rows) {
                    resolve((rows.affectedRows ? 'User successfully deleted' : 'No result'));
                } else {
                    reject();
                }
            }).catch(error => {
                console.error(error)
            });
        });
    }
}

module.exports = new userManager();
