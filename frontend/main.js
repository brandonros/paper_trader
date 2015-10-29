var container;

function handle_popstate() {
	var path = window.location.hash.substring(1);

	fetch(path)
	.then(function (res) {
		if (res['status'] !== 200) {
			throw new Error('Bad status');
		}

		return res.text();
	})
	.then(function (res) {
		container.innerHTML = res;

		parse_scripts();
	})
	.catch(function (err) {
		console.log(err);
	});
}

function parse_scripts() {
	var elements = document.querySelectorAll('#container script');

	for (var i = 0; i < elements.length; ++i) {
		eval(elements[i].innerHTML);
	}
}

function navigate(title, path) {
	history.replaceState(undefined, title, path);

	window.dispatchEvent(new Event('popstate'));
}

function handle_token() {
	var token = docCookies.getItem('token');

	if (!token) {
		navigate('Login', '#/login.html');
	}

	else {
		navigate('Dashboard', '#/dashboard.html');
	}	
}

function handle_link(el) {
	var ignorable = window.location.protocol + '//' + window.location.host + '/';
	var path = '#/' + el['href'].replace(ignorable, '');
	var title = el['data-title'];

	console.log(path);

	navigate(title, path);
}

function post_json(url, body) {
	return fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
	.then(function (res) {
		if (res['status'] !== 200) {
			throw new Error('Bad status');
		}
		
		return res.json();
	});
}

document.addEventListener('DOMContentLoaded', function (event) {
	window.addEventListener('popstate', handle_popstate);

	container = document.getElementById('container');

	handle_token();
});

document.body.addEventListener('click', function (event) {
	var el = event['target'];

	if (el.className === 'nav-link') {
		event.preventDefault();

		handle_link(el);
	}
});