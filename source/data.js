import fs from 'fs';

import Sqlite3 from 'better-sqlite3';

/* Project modules */

/* Constants */

const DB_FILENAME = './db.sqlite3';

const AUTHOR_REPLACE_SQL_FILENAME = './data/author_replace.sql';

/* Export */

let db = null;
let authorReplace = null

export function openDb() {
  db = new Sqlite3(DB_FILENAME);
}

export function closeDb() {
  db.close();
}

export function createSchema() {
  db.exec(DB_SCHEMA);
  db.exec(DB_FILL_IGNORE_LIST);

  const sql = fs.readFileSync(AUTHOR_REPLACE_SQL_FILENAME, 'utf8');
  db.exec(sql);
}

export function getAuthorReplace() {
  if (authorReplace) {
    return authorReplace;
  }

  authorReplace = new Map();
  
  const stmt = db.prepare(DB_SELECT_AUTHOR_REPLACE);
  
  for (const repl of stmt.all()) {
    authorReplace.set(repl.author_raw, repl.author);
  }

  return authorReplace;
}

export function addArticle({filename, title, date, authorRaw, content, tags, authors}) {
  const articleStmt = db.prepare(DB_INSERT_ARTICLE);

  const preparedFilename = filename.length == 0 ? null : filename;
  const preparedTitle = title.length == 0 ? null : title;
  const preparedDate = date.length == 0 ? null : date;
  const preparedAuthorRaw = authorRaw.length == 0 ? null : authorRaw;
  const preparedContent = content.length == 0 ? null : content;

  articleStmt.run({
    filename: preparedFilename,
    title: preparedTitle,
    date: preparedDate,
    author_raw: preparedAuthorRaw,
    content: preparedContent
  });

  const tagStmt = db.prepare(DB_INSERT_TAG);

  for (const tag of tags) {
    const preparedTag = tag.length == 0 ? null : tag;

    tagStmt.run({
      filename: preparedFilename,
      tag: preparedTag
    });
  }

  const authorStmt = db.prepare(DB_INSERT_AUTHOR);

  for (const author of authors) {
    const preparedAuthor = author.length == 0 ? null : author;

    if (!author) {
      continue;
    }

    authorStmt.run({
      filename: preparedFilename,
      author: preparedAuthor
    });
  }

}

export function getArticles() {
  const stmt = db.prepare(DB_SELECT_ARTICLE);
  return stmt.all();
}

export function getArticleIndex() {
  const stmt = db.prepare(DB_SELECT_ARTICLE_INDEX);
  return stmt.all();
}

export function getTagIndex() {
  const stmt = db.prepare(DB_SELECT_TAG_INDEX);
  return stmt.all();
}

export function getAuthorIndex() {
  const stmt = db.prepare(DB_SELECT_AUTHOR_INDEX);
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
    author_raw text,
    content text not null
    );

drop table if exists ignore_files;

create table ignore_files (
  id integer primary key autoincrement not null,
  filename text not null
);

drop table if exists tag;

create table tag (
  filename text not null,
  tag text not null
);

drop table if exists author_replace;

create table author_replace (
  author_raw text primary key not null,
  author text not null
);

drop table if exists author;

create table author (
  filename text not null,
  author text not null
);
`;

const DB_INSERT_ARTICLE = `
insert into article (filename, title, date, author_raw, content) 
values(:filename, :title, :date, :author_raw, :content);
`;

const DB_INSERT_TAG = `
insert into tag (filename, tag) 
values(:filename, :tag);
`;

const DB_INSERT_AUTHOR = `
insert into author (filename, author) 
values(:filename, :author);
`;

const DB_SELECT_ARTICLE = `
select
  a.filename,
  a.title, 
  a.date, 
  a.author_raw, 
  a.content
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
  a.author_raw
from 
  article a left join ignore_files if on
    a.filename = if.filename
where
  if.filename is null
order by 
  a.date desc, 
  a.title;
`;

const DB_SELECT_AUTHOR_INDEX = `
select
  au.author,
  a.title,
  a.filename,
  a.date,
  count(*) over (partition by au.author) as cnt 
from 
  article a join author au
    on a.filename = au.filename
  left join ignore_files if on
    a.filename = if.filename
where
  if.filename is null
order BY 
  au.author;
`;

const DB_SELECT_TAG_INDEX = `
select
  coalesce(t.tag, 'Без тега') tag,
  a.title,
  a.filename,
  a.author_raw,
  a.date,
  count(*) over (partition by t.tag) as cnt 
from 
  article a left join tag t
    on a.filename = t.filename
  left join ignore_files if on
    a.filename = if.filename
where
  if.filename is null
order BY 
  t.tag;
`;

const DB_SELECT_AUTHOR_REPLACE = `
select 
  ar.author_raw,
  ar.author
from 
  author_replace ar;
`

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
('10571.md'),

-- Технические аспекты цифровой текстологии
('10603.md'),

-- Заметки по поводу эффективности самообразовательных сообществ
('10650.md');
`;