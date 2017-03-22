const mysql = require('promise-mysql');
const dbConfig = require('../.dbConfig');
const bcrypt = require('bcrypt-nodejs');

/**
 * @param sql (object): { query: 'string', values: (object) || (null) }
 * @return (array): [rows]
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
        this.tableName = 'users2';  //const tableName = Symbol('tableName');
        dbConfig.database = 'node_test';
        // dbConfig.connectionLimit = 10;
        this.pool = mysql.createPool(dbConfig);
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
        //TODO
        // CREATE TRIGGER insert_uuid BEFORE INSERT ON ${this.tableName}
        // FOR EACH ROW SET id = UUID();
        return performQuery(this.pool, {query: query, values: null}).then((result) => Promise.resolve(result));
    }

    /**
     * @param userData (string)
     * @param findBy (string)
     * @return (array): [rows]
     */
    findUser(userData, findBy = 'id') {
        if (userData !== undefined) {
            userData += '';
        }
        const query = `SELECT * FROM ${this.tableName}`;
        const sql = {
            query: !userData ? query : query + ` WHERE ${findBy} = ? LIMIT 1`,
            values: userData || null
        };
        return performQuery(this.pool, sql).then((rows) => {
            return Promise.resolve(rows);
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param userData (object): {name: '', email: '', ...}
     * @param propsToCheck (array): ['name', ...]
     * @return (array)
     */
    checkExistence(userData, propsToCheck = ['name', 'email']) {
        if (!userData) {
            throw Error('missing user object');
        }
        const checkProps = propsToCheck.map((prop) => {
            if (userData[prop]) {
                return this.findUser(userData[prop], prop);
            } else {
                return Promise.resolve([]);
            }
        });
        return Promise.all(checkProps).then((results) => {
            let existingProps = [];
            results.forEach((result, index) => {
                if (result.length) {
                    existingProps.push(propsToCheck[index]);
                }
            });
            return Promise.resolve(existingProps);
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param userData (object): {name: '', email: '', ...}
     * @return (string)
     */
    addUser(userData) {
        const missingProps = ['name', 'email', 'passwd'].filter((reqiredProp) => !userData[reqiredProp]);
        if (missingProps.length) {
            return Promise.reject(`failure@cannot.create.missingProps: ${missingProps}`);
        }
        userData.passwd = bcrypt.hashSync(userData.passwd);

        const sql = {
            query: `INSERT INTO ${this.tableName} SET ?`,
            values: userData
        };
        return this.checkExistence(userData).then((response) => {
            if (response.length) {
                return Promise.reject(`warning@cannot.create.existingProps: ${response}`);
            } else {
                return performQuery(this.pool, sql).then((rows) => {
                    if (rows.affectedRows) {
                        return Promise.resolve('success@create.user');
                    } else {
                        return Promise.reject('failure@create.user');
                    }
                }).catch((error) => Promise.reject(error));
            }
        }).catch((error) => Promise.reject(error));
    }

    /**
     * TODO
     */
    authenticateUser(credentials, userName) {
        console.log('\n------------\n', credentials, userName);
        //toStr ??
        const sql = {
            query:  `SELECT passwd FROM ${this.tableName} WHERE name = ? LIMIT 1`,
            values: userName
        };
        return performQuery(this.pool, sql).then((row) => {
            if (row && row.length) {
                // if ( bcrypt.compareSync(credentials.passwd, row[0].passwd) ) {
                //
                // }
                console.log(row[0].passwd);
                // return Promise.resolve('success@authenticate.user');
            } else {
                console.log('fail hibás felhasználó');
                // return Promise.reject('failure@authenticate.user');
            }
        }).catch((error) => Promise.reject(error));
    }

    /**
     * @param userData (object): {name: '', email: '', ...}
     * @param userId (TODO)
     * @return (string)
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
                        return Promise.resolve('success@update.user');
                    } else {
                        return Promise.reject('failure@update.user');
                    }
                }).catch((error) => Promise.reject(error));
            }
        }).catch((error) => Promise.reject(error));
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
        return performQuery(this.pool, sql).then((rows) => {
            if (rows.affectedRows) {
                return Promise.resolve('success@delete.user');
            } else {
                return Promise.reject('failure@delete.user');
            }
        }).catch((error) => Promise.reject(error));
    }
}

module.exports = new userManager();
