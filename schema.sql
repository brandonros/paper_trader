CREATE TABLE account(
	id serial primary key,
	email text,
	password text,
	balance numeric,
	created timestamp
);

CREATE TABLE deposit(
	id serial primary key,
	account_id int,
	amount numeric,
	created timestamp
);

CREATE TABLE withdrawl(
	id serial primary key,
	account_id int,
	amount numeric,
	created timestamp
);

CREATE TABLE transaction(
	id serial primary key,
	account_id int,
	type int,
	ticker text,
	quantity int,
	price numeric,
	fees numeric,
	total numeric,
	created timestamp
);

CREATE TABLE dividend(
	id serial primary key,
	account_id int,
	ticker text,
	quantity int,
	amount numeric,
	total numeric,
	created timestamp
);