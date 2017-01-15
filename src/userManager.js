const mysql = require('mysql');
const dbConfig = require('./dbConfig');
const connection = mysql.createConnection(dbConfig);
let query;

console.log(connection);

connection.connect(function (err) {
    if (err) return console.error('Error connecting: ' + err.stack);
    console.log('Connected successfully. threadId: ' + connection.threadId);
});

console.log(connection);

function addUser(user) {
    checkUsers(user, function(error, existingUser) {
        if (error) {
            console.error('Error: ', error);
        } else if (existingUser > 0) {
            console.log(`User with this (name: ${user.name} or email: ${user.email}) already exists`);
        } else {
            user.registration_date = new Date();
            query = 'INSERT INTO users SET ?';
            connection.query(query, user, function (err, result) {
                if (err) throw err;
                console.log(`User: ${user.name} successfully inserted`);
                connection.end();
            });
        }
    });
}

function modifyUser(user) {
    query = 'UPDATE users SET ' +''+ ' WHERE name=' + mysql.escape(user.name);

}

function deleteUser(user) {

}

function checkUsers(user, callback) {
    query = 'SELECT * FROM users WHERE name=' + mysql.escape(user.name) + 'OR email=' + mysql.escape(user.email);
    connection.query(query, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.length);
        }
    });
}

var user = {
    name: 'usr1',
    password: 'pw',
    email: 'usr@mail'
};

addUser(user);
