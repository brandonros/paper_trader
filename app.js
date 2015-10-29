var squel = require('squel').useFlavour('postgres');

var bcrypt = require('bcrypt');

var server = require('./lib/server');
var db = require('./lib/db');

var function_map = {
	'GET': {
		'/': server.serve_file,
		'/login.html': server.serve_file,
		'/register.html': server.serve_file,
		'/main.js': server.serve_file,
		'/cookies.js': server.serve_file,
	},
	'POST': {
		'/login': login,
		'/register': register
	}
};

function login() {
	var sql = squel.select()
		.from('account')
		.toString();

	return db.query(sql)
		.then(function (res) {
			return server.generate_response(res);
		});
}

function register(method, url, headers, body) {
	var sql = squel.insert()
		.into('account')
		.set('email', body['email'])
		.set('password', bcrypt.hashSync(body['password'], 8))
		.returning('id')
		.toString();

	return db.query(sql)
		.then(function (res) {
			return server.generate_response(res);
		});
}


function not_found() {
	var resp_body = 'Not found';

	return Promise.resolve({
		status: 404,
		headers: {
			'Content-Type': 'text/plain',
			'Content-Length': Buffer.byteLength(resp_body)
		},
		body: resp_body
	});
}

function request_handler(method, url, headers, body) {
	return (function_map[method][url] || not_found)(method, url, headers, body);
}

db.init('localhost', 5432, 'paper_trader', 'brandonros1', '');
server.init(3000, request_handler);