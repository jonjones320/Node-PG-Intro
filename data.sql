DROP DATABASE IF EXISTS biztimedb;

CREATE DATABASE biztimedb;

\c biztimedb

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS fields;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text NOT NULL UNIQUE
);

CREATE TABLE fields (
  comp_code TEXT NOT NULL REFERENCES companies,
  indust_code TEXT NOT NULL REFERENCES industries,
  PRIMARY KEY(comp_code, indust_code)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('wellfarg', 'Wells Fargo', 'National bank.'),
         ('turbtax', 'Turbo Tax', 'Do your own taxes fast.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries
  VALUES ('acct', 'Accounting'), 
         ('code', 'Coding'), 
         ('fin', 'Finance');

INSERT INTO fields
  VALUES ('apple', 'code'),
         ('ibm', 'code'),
         ('wellfarg', 'fin'),
         ('turbtax', 'acct');