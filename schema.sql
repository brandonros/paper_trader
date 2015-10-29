CREATE TABLE IF NOT EXISTS account(
	id serial PRIMARY KEY,
	email text UNIQUE,
	password text,
	balance numeric,
	created timestamp
);

CREATE TABLE IF NOT EXISTS deposit(
	id serial PRIMARY KEY,
	account_id int REFERENCES account(id),
	amount numeric,
	created timestamp
);

CREATE INDEX deposit_account_index ON deposit(account_id);

CREATE TABLE IF NOT EXISTS withdrawl(
	id serial PRIMARY KEY,
	account_id int REFERENCES account(id),
	amount numeric,
	created timestamp
);

CREATE INDEX withdrawl_account_index ON withdrawl(account_id);

CREATE TABLE IF NOT EXISTS transaction(
	id serial PRIMARY KEY,
	account_id int REFERENCES account(id),
	type int,
	ticker text,
	quantity int,
	price numeric,
	fees numeric,
	total numeric,
	created timestamp
);

CREATE INDEX transaction_account_index ON transaction(account_id);

CREATE TABLE IF NOT EXISTS dividend(
	id serial PRIMARY KEY,
	account_id int REFERENCES account(id),
	ticker text,
	quantity int,
	amount numeric,
	total numeric,
	created timestamp
);

CREATE INDEX dividend_account_index ON dividend(account_id);