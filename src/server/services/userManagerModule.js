const mysql = require('promise-mysql');
const dbConfig = require('../.dbConfig');
const bcrypt = require('bcrypt-nodejs');

/**
 * @param {object} connectionPool
 * @param {object} sql - { query: 'string', values: (object) | (null) }
 * @return {array} - result of query
 */
function performQuery(connectionPool, sql) {
    return connectionPool.getConnection().then((connection) => {
        return connection.query(sql.query, sql.values).then((rows) => {
            connectionPool.releaseConnection(connection);
            return Promise.resolve(rows);
        }).catch((error) => Promise.reject(error));
    }).catch((error) =>{
        error.sql = sql;
        return Promise.reject(error);
    });
}

class userManager {
    constructor() {
        this.tableName = 'users2';
        dbConfig.database = 'node_test';
        // dbConfig.connectionLimit = 10;
        this.pool = mysql.createPool(dbConfig);
    }
    //TODO store uuid as binary
    //TODO store hash efficently: https://github.com/ademarre/binary-mcf
    create(qId) {
        const queries = {
            table: `
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INT NOT NULL AUTO_INCREMENT,
                uuid CHAR(36) NOT NULL,
                name VARCHAR(60),
                email VARCHAR(60),
                passwd CHAR(60),
                role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user',
                last_login DATETIME,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(id)
            )`,
            trigger: `
                CREATE TRIGGER insert_uuid
                BEFORE INSERT ON ${this.tableName}
                FOR EACH ROW
                SET NEW.id = UUID()
            `
        };
        return performQuery(this.pool, {query: queries[qId], values: null}).then((result) => Promise.resolve(result));
    }

    /**
     * @param {string} userData - value to search for
     * @param {string} findBy - database column
     * @return {object} - data as array of found rows
     */
    findUser(userData, findBy = 'name') {
        if (userData !== undefined) {
            userData += '';
        }
        const query = `SELECT * FROM ${this.tableName}`;
        const sql = {
            query: !userData ? query : query + ` WHERE ${findBy} = ? LIMIT 1`,
            values: userData || null
        };
        return performQuery(this.pool, sql).then((rows) => {
            return Promise.resolve({data: rows});
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param {object} userData - {name: '', email: '', ...}
     * @param {array} keysToCheck - database columns
     * @return {array} - keys of existing values
     */
    checkExistence(userData, keysToCheck = ['name', 'email']) {
        if (!userData) {
            throw Error('missing user object');
        }
        const checkKeys = keysToCheck.map((prop) => {
            if (userData[prop]) {
                return this.findUser(userData[prop], prop);
            } else {
                return Promise.resolve([]);
            }
        });
        return Promise.all(checkKeys).then((results) => {
            let existingProps = [];
            results.forEach((result, index) => {
                if (result.data && result.data.length) {
                    existingProps.push(keysToCheck[index]);
                }
            });
            return Promise.resolve(existingProps);
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param {object} userData - {name: '', email: '', ...}
     * @return {object} - msg
     */
    addUser(userData) {
        const missingProps = ['name', 'email', 'passwd'].filter((reqiredProp) => !userData[reqiredProp]);
        if (missingProps.length) {
            return Promise.reject({message: 'failure@create.user.missingProps: ' + missingProps});
        }
        //TODO verify email
        userData.passwd = bcrypt.hashSync(userData.passwd);

        const sql = {
            query: `INSERT INTO ${this.tableName} SET ?`,
            values: userData
        };
        return this.checkExistence(userData).then((response) => {
            if (response.length) {
                return Promise.reject({message: 'warning@create.user.existingProps: ' + response});
            } else {
                return performQuery(this.pool, sql).then((rows) => {
                    if (rows.affectedRows) {
                        return Promise.resolve({message: 'success@create.user'});
                    } else {
                        return Promise.reject({message: 'failure@create.user'});
                    }
                }).catch((error) => Promise.reject(error));
            }
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param  {object} credentials - required data for authentication {passwd: ''...}
     * @param  {string} userName
     * @return {object} - msg & auth data
     */
    authenticateUser(credentials, userName) {
        if (!credentials.passwd || !userName) {
            return Promise.reject(`failure@authenticate.user.missingPasswdOrUserName`);
        }
        const sql = {
            query:  `SELECT passwd FROM ${this.tableName} WHERE name = ? LIMIT 1`,
            values: userName
        };
        return performQuery(this.pool, sql).then((row) => {
            if (!row || !row.length) {
                return Promise.reject({message: 'failure@authenticate.user.wrongUser'});
            }
            if (bcrypt.compareSync(credentials.passwd, row[0].passwd)) {
                //TODO update last_login
                sql.query = `SELECT role FROM ${this.tableName} WHERE name = ? LIMIT 1`;
                return performQuery(this.pool, sql).then((row) => {
                    if (!row && !row.length) {
                        return Promise.reject({message: 'failure@authenticate.user.dataError'});
                    }
                    return Promise.resolve({
                        data: {username: userName, role: row[0].role},
                        message: 'success@authenticateUser'
                    });
                }).catch((error) => Promise.reject(error));
            } else {
                //TODO handle attempts
                return Promise.reject({message: 'failure@authenticate.user.wrongPasswd'});
            }
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param {object} userData - {name: '', email: '', ...}
     * @param {string} userId (TODO)
     * @return {object} - msg
     */
    updateUser(userData, userId) {
        const providedProps = Object.keys(userData);
        if (!userId || !providedProps.length) {
            return Promise.reject(`failure@cannot.update.noPropProvided`);
        }
        providedProps.forEach((providedProp) => {
            if (['name', 'email', 'passwd'].indexOf(providedProp) === -1) {
                return Promise.reject(`failure@cannot.update.wrongPropProvided`);
            }
        });
        if (userData.passwd) {
            userData.passwd = bcrypt.hashSync(userData.passwd);
        }

        const sql = {
            query: `UPDATE ${this.tableName} SET ? WHERE id = ?`,
            values: [userData, userId]
        };
        return this.checkExistence(userData).then((response) => {
            if (response.length) {
                return Promise.reject(`warning@cannot.update.existingProps: ${response}`);
            } else {
                return performQuery(this.pool, sql).then((rows) => {
                    if (rows.changedRows) {
                        return Promise.resolve({message: 'success@update.user'});
                    } else {
                        return Promise.reject({message: 'failure@update.user'});
                    }
                }).catch((error) => Promise.reject(error));
            }
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param {string} userId (TODO)
     * @return {object} - msg
     */
    deleteUser(userId) {
        userId += '';//TODO ??
        const sql = {
            query: `DELETE FROM ${this.tableName} WHERE id = ?`,
            values: userId
        };
        return performQuery(this.pool, sql).then((rows) => {
            if (rows.affectedRows) {
                return Promise.resolve({message: 'success@delete.user'});
            } else {
                return Promise.reject({message: 'failure@delete.user'});
            }
        }).catch((error) => Promise.reject(error));
    }
}

module.exports = new userManager();
