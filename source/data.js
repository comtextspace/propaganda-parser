import Sqlite3 from 'better-sqlite3';

const DB_FILENAME = './db.sqlite3';

let db;

export function openDb() {
  db = new Sqlite3(DB_FILENAME);
}

export function closeDb() {
  db.close();
}

export function createSchema() {
  db.exec(DB_SCHEMA);
  db.exec(DB_FILL_IGNORE_LIST);

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

drop table if exists ignore_files;

create table ignore_files (
  id integer primary key autoincrement not null,
  filename text not null
);
`;

const DB_INSERT_ARTICLE = `
insert into article (filename, title, date, author, content, tags) 
values(:filename, :title, :date, :author, :content, :tags);
`;

const DB_SELECT_ARTICLE = `
select
  a.filename,
  a.title, 
  a.date, 
  a.author, 
  a.content, 
  a.tags
from
  article a left join ignore_files if on
    a.filename = if.filename
where
  if.filename is null
`;

const DB_SELECT_ARTICLE_INDEX = `
select 
  strftime('%Y-%m', a.date) as shortdate, 
  a.filename, 
  a.date, 
  a.title, 
  a.author
from 
  article a left join ignore_files if on
    a.filename = if.filename
where
  if.filename is null
order by 
  a.date desc, 
  a.title;
`;

const DB_FILL_IGNORE_LIST = `
insert into
  ignore_files (filename)
values 
-- De politica
('10086.md'),
('10093.md'),
('10123.md'),
('10131.md'),
('10274.md'),
('10332.md'),
('10336.md'),
('10396.md'),
('10399.md'),
('10422.md'),
('10424.md'),
('10431.md'),
('10436.md'),
('10468.md'),
('10470.md'),
('10476.md'),
('10481.md'),
('10484.md'),
('10491.md'),
('10502.md'),
('10510.md'),
('10532.md'),
('10549.md'),
('10555.md'),
('10560.md'),
('10583.md'),
('10588.md'),
('10590.md'),
('10594.md'),
('10602.md'),
('10604.md'),
('10606.md'),
('10607.md'),
('10613.md'),
('10615.md'),
('10622.md'),
('10634.md'),
('10638.md'),
('10639.md'),
('10642.md'),
('10643.md'),
('10646.md'),
('10647.md'),
('9708.md'),
('9710.md'),
('9712.md'),
('9716.md'),
('9720.md'),
('9724.md'),

-- Речи к представителям самообразовательных теоретических сообществ 
-- о воспитательном значении текстологической работы.
('10313.md'),
('10316.md'),
('10319.md'),

-- Что не так с текстологией и как исправить ситуацию?
('10390.md'),
('10394.md'),
('10402.md'),
('10412.md'),
('10421.md'),
('10571.md');
`