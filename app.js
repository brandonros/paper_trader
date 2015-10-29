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

function login(method, url, headers, body) {
	var query = squel.select()
		.from('account')
		.where('email = ?', body['email'])
		.toParam();

	return db.query(query['text'], query['values'])
		.then(function (res) {
			if (res.length === 0) {
				throw new Error('E-mail not found');
			}

			if (!bcrypt.compareSync(body['password'], res[0]['password'])) {
				throw new Error('Invalid password');
			}
			
			return server.generate_response(res);
		});
}

function register(method, url, headers, body) {
	var query = squel.insert()
		.into('account')
		.set('email', body['email'])
		.set('password', bcrypt.hashSync(body['password'], 8))
		.returning('id')
		.toParam();

	return db.query(query['text'], query['values'])
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