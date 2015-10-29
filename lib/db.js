var pgp = require('pg-promise')();
var fs = require('fs');

var db = module.exports;

var instance;

db.init = function (host, port, database, user, password) {
	instance = pgp({
		host: host,
		port: port,
		database: database,
		user: user,
		password: password
	});

	var sql = fs.readFileSync('./schema.sql').toString();

	return db.query(sql);
}

db.query = function (sql) {
	return instance.query(sql);
};