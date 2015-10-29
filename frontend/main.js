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

function handle_token() {
	var token = docCookies.getItem('token');

	if (!token) {
		history.replaceState(undefined, 'Login', '#/login.html');
	}

	else {
		history.replaceState(undefined, 'Dashboard', '#/dashboard.html');
	}

	window.dispatchEvent(new Event('popstate'));
}

document.addEventListener('DOMContentLoaded', function (event) {
	window.addEventListener('popstate', handle_popstate);

	container = document.getElementById('container');

	handle_token();
});