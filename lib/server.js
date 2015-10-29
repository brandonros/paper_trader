var http = require('http');
var URL = require('url');
var fs = require('fs');
var mime = require('mime');

var server = module.exports;

server.root = 'frontend/';

server.init = function (port, handler) {
	var srv = http.createServer();

	srv.on('request', function (req, resp) {
		var url = req['url'];
		var method = req['method'];
		var headers = req['headers'];

		Promise.resolve()
		.then(function () {
			if (method === 'GET') {
				var parsed_url = URL.parse(url, true);

				return parsed_url['query'];
			}

			return server.read_body(req);
		})
		.then(function (body) {
			return handler(method, url, headers, body)
		})
		.then(function (res) {
			server.send_response(resp, res['status'], res['headers'], res['body'])
		})
		.catch(function (err) {
			server.send_error(resp, err);
		});
	});

	srv.listen(port);
};

server.send_response = function (resp, status, headers, body) {
	resp.writeHeader(status, headers);

	resp.write(body);

	resp.end();
};

server.send_error = function (resp, err) {
	var stringified_body = JSON.stringify({
		error: err['stack']
	});

	var headers = {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(stringified_body)
	};

	server.send_response(resp, 500, headers, stringified_body);
};

server.generate_response = function (body) {
	var stringified_body = JSON.stringify(body);

	return Promise.resolve({
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(stringified_body)
		},
		body: stringified_body
	});
};

server.serve_file = function (method, url, headers, body) {
	if (url === '/') {
		url = '/index.html';
	}

	var filename = server.root + url;

	return server.read_file(filename) /* nice and insecure */
		.then(function (res) {
			return {
				status: 200,
				headers: {
					'Content-Type': mime.lookup(filename),
					'Content-Length': Buffer.byteLength(res)
				},
				body: res
			};
		});
};

server.read_file = function (filename) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filename, function (err, res) {
			if (err) {
				return reject(err);
			}

			return resolve(res.toString());
		});
	});
};

server.read_body = function (req) {
	return new Promise(function (resolve, reject) {
		var buf = '';

		req.on('data', function (chunk) {
			buf += chunk;
		});

		req.on('end', function () {
			try {
				resolve(JSON.parse(buf));
			}

			catch (err) {
				reject(err);
			}
		});
		
		req.on('error', function (err) {
			reject(err);
		});
	});
};