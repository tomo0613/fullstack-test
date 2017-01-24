const mysql = require('mysql');
const dbConfig = require('../.dbConfig');

let sql;

dbConfig.database = 'node_test';
dbConfig.connectionLimit = 10;

var dummyUser = {
    name: 'usr1',
    password: 'pw',
    email: 'usr@mail'
};

class userManager {
	constructor() {
		console.log('userManager Class instantiated');
    this.connectionPool = mysql.createPool(dbConfig);
	}

  performQuery(sql, sqlPlaceholder = null, callback) {
		console.log(arguments);

    this.connectionPool.getConnection(function(err, connection) {
      if (err) return console.error('Connecting error: ' + err.stack);
			// Use the connection
			connection.query(sql, sqlPlaceholder, function(error, results, fields) {
         callback(error, results)
				 // done with the connection.
			   connection.release();
			   if (error) throw error;
		    }
			);
		});
  }

	add(user) {
		this.findUser(user, null, (error, foundUser) => {
			if (error) {
				console.error('Error: ', error);
			} else if (foundUser.length > 0) {
				console.log(`User with this (name: ${user.name} or email: ${user.email}) already exists`);
			} else {
				user.registration_date = new Date();

				sql = 'INSERT INTO users SET ?';
				this.performQuery(sql, user, (err, result) => {
					if (err) return console.error(`There was a/n ${err}`);
					console.log(result);
					console.log(`User successfully inserted`);
				});
			}
		});
	}

	update() {}

	delete() {}

	findUser(user, findBy = 'name', callback) {
		sql = 'SELECT * FROM users WHERE ' + findBy + '=' + mysql.escape(user[findBy]);
    this.performQuery(sql, null, (err, result) => {
      callback(err, result);
    });
	}
}

const usrMngr = new userManager();

// usrMngr.add(dummyUser)

usrMngr.findUser(dummyUser, 'email', (err, result) => {
	if (err) return console.error(`There was a/n ${err}`);
	console.log(result);
});

module.exports = userManager;
