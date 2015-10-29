var server = require('./lib/server');

var function_map = {
	'GET': {
		'/': server.serve_file,
		'/main.js': server.serve_file,
		'/cookies.js': server.serve_file,
	}
};

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

server.init(3000, request_handler);