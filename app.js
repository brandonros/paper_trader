var server = require('./server');

var function_map = {
	'GET': {
		'/': serve_root
	}
};

function serve_root(headers, body) {
	return server.read_file('index.html')
		.then(function (res) {
			return {
				status: 200,
				headers: {
					'Content-Type': 'text/html',
					'Content-Length': Buffer.byteLength(res)
				},
				body: res
			};
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
	return (function_map[method][url] || not_found)(headers, body);
}

server.init(3000, request_handler);