import sqlite3 from 'better-sqlite3';

const DB_FILENAME = './db.sqlite3'

let db;

export function openDb() {
    db = new sqlite3(DB_FILENAME);
}

export function closeDb() {
    db.close();
}

export function createSchema() {
    db.exec(DB_SCHEMA);

}

const DB_SCHEMA =
`

drop table if exists test;

create table test (
    id integer,
    name text
);

`;