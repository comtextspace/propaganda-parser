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
export function addArticle({filename, title, date, author, content, tags}) {
    const stmt = db.prepare(DB_INSERT_ARTICLE);
    stmt.run({
        filename: filename,
        title: title,
        date: date,
        author: author,
        content: content,
        tags: tags
      });    
}

export function getArticles() {
    const stmt = db.prepare(DB_SELECT_ARTICLE);
    return stmt.all();
}

export function getArticleIndex() {
    const stmt = db.prepare(DB_SELECT_ARTICLE_INDEX);
    return stmt.all();
}


const DB_SCHEMA =
`
drop table if exists article;

create table article (
    id integer primary key autoincrement not null,
    filename text not null,
    title text not null,
    date test not null,
    author text not null,
    content text not null,
    tags text not null
    );
`;

const DB_INSERT_ARTICLE = `
insert into article (filename, title, date, author, content, tags) 
values(:filename, :title, :date, :author, :content, :tags);
`

const DB_SELECT_ARTICLE = `
select * from article;
`

const DB_SELECT_ARTICLE_INDEX = `
select 
  strftime('%Y-%m', date) as shortdate, 
  filename, 
  date, 
  title, 
  author
from 
  article a 
order by 
  date desc, 
  title;
`