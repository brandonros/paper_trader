var http = require('http');
var URL = require('url');

var server = module.exports;

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

			return server.read_request(req);
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
	var stringified_body = JSON.stringify(body);

	headers = Object.assign({}, headers, {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(stringified_body)
	});

	resp.writeHeader(status, headers);

	resp.write(stringified_body);

	resp.end();
};

server.send_error = function (resp, err) {
	server.send_response(500, {}, { error: err['stack'] } );
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