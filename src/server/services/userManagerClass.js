const mysql = require('promise-mysql');
const dbConfig = require('../.dbConfig');

class userManager {
    constructor() {
        this.tableName = 'users2';
        dbConfig.database = 'node_test';
        // dbConfig.connectionLimit = 10;
        this.connectionPool = mysql.createPool(dbConfig);
    }

    createTable() {
        const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(60),
            email VARCHAR(60),
            passwd VARCHAR(60),
            status VARCHAR(60),
            last_login DATETIME,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        )`;
        return this.performQuery({query: query, values: null}).then(result => {
            return Promise.resolve(results);
        });
    }

    /**
     * @param sql (object): { query: 'string', values: (object) || (null) }
     * @return (array): [rows]
     */
    performQuery(sql) {
        return this.connectionPool.getConnection().then(connection => {
            return connection.query(sql.query, sql.values).then(rows => {
                this.connectionPool.releaseConnection(connection);
                return Promise.resolve(rows);
            }).catch(error => Promise.reject(error));
        }).catch(error => {
            error.sql = sql;
            return Promise.reject(error);
        });
    }

    /**
     * @param userData (string)
     * @param findBy (string)
     * @return (array): [rows]
     */
    findUser(userData, findBy = 'name') {
        if (userData !== undefined) {
            userData += '';
        }
        const sql = {
            query: userData ? `SELECT * FROM ${this.tableName} WHERE ${findBy} = ?` : `SELECT * FROM ${this.tableName}`,
            values: userData || null
        };
        console.log(sql);
        return this.performQuery(sql).then(rows => {
            return Promise.resolve(rows);
        }).catch(error => Promise.reject(error));
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
     * TODO
     */
    authenticateUser() {

    }

    /**
     * @param userObj (object): {name: '', email: '', ...}
     * @return (string)
     */
    addUser(userObj) {
        const sql = {
            query: `INSERT INTO ${this.tableName} SET ?`,
            values: userObj
        };
        return this.checkExistence(userObj).then(response => {
            if (response.length) {
                return Promise.reject(`User exists with the given: ${response}`);
            } else {
                return this.performQuery(sql).then(rows => {
                    if (rows.affectedRows) {
                        return Promise.resolve('User successfully created');
                    } else {
                        return Promise.reject('User creation failed');
                    }
                }).catch(error => Promise.reject(error));
            }
        }).catch(error => Promise.reject(error));
    }

    /**
     * @param userData (object): {name: '', email: '', ...}
     * @param userId (TODO)
     * @return (string)
     */
    updateUser(userData, userId) {
        const sql = {
            query: `UPDATE ${this.tableName} SET ? WHERE id = ?`,
            values: [userData, userId]
        };
        return this.checkExistence(userData).then(response => {
            if (response.length) {
                return Promise.reject(`existing props: ${response}`);
            } else {
                return this.performQuery(sql).then(rows => {
                    if (rows.changedRows) {
                        return Promise.resolve('User successfully updated');
                    } else {
                        return Promise.reject('User update failed');
                    }
                }).catch(error => Promise.reject(error));
            }
        }).catch(error => Promise.reject(error));
    }

    /**
     * @param userId (TODO)
     * @return (string)
     */
    deleteUser(userId) {
        userId += '';
        const sql = {
            query: `DELETE FROM ${this.tableName} WHERE id = ?`,
            values: userId
        };
        return this.performQuery(sql).then(rows => {
            if (rows.affectedRows) {
                return Promise.resolve('User successfully deleted');
            } else {
                return Promise.reject('Delete failed');
            }
        }).catch(error => Promise.reject(error));
    }
}

module.exports = new userManager();
