import fs from 'fs';

import {htmlToArticle} from '../source/import.js';

test('htmlToArticle — 100.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/100.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/100.md', "utf8");

  const article = htmlToArticle(source, '100.html');

  expect(article.title).toBe('День Независимости на Западной Украине праздновали без особого энтузиазма');
  expect(article.date).toBe('2008-08-25');
  expect(article.authorRaw).toBe('В. Дмитрук');
  expect(article.tags).toEqual(['события+комментарии']);
  expect(article.filename).toBe('100.md');
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10080.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10080.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10080.md', "utf8");

  const article = htmlToArticle(source, '10080.html');

  expect(article.title).toBe('Заметки на полях книги «Есть ли будущее у капитализма?». Часть 8. Так был ли мальчик?');
  expect(article.date).toBe('2017-06-06');
  expect(article.authorRaw).toBe('Василий Пихорович');
  expect(article.tags).toEqual(['теория']);
  expect(article.filename).toBe('10080.md');
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 8860.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/8860.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/8860.md', "utf8");

  const article = htmlToArticle(source, '8860.html');

  expect(article.title).toBe('О наследии Чернышевского. Часть первая');
  expect(article.date).toBe('2014-07-07');
  expect(article.authorRaw).toBe('Mikołaj Zagorski');
  expect(article.tags).toEqual(['история', 'культура', 'политика']);
  expect(article.filename).toBe('8860.md');
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10029.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10029.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10029.md', "utf8");

  const article = htmlToArticle(source, '10029.html');

  expect(article.title).toBe('О значении театра в преобразовании истории');
  expect(article.date).toBe('2017-04-01');
  expect(article.authorRaw).toBe('Ярослав Вареник');
  expect(article.tags).toEqual(['культура']);
  expect(article.filename).toBe('10029.md');
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10036.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10036.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10036.md', "utf8");

  const article = htmlToArticle(source, '10036.html');

  expect(article.title).toBe('Мир иллюзий. Реакция под видом революции');
  expect(article.date).toBe('2017-04-10');
  expect(article.authorRaw).toBe('Павел Богдан');
  expect(article.tags).toEqual(['дискуссия', 'культура']);
  expect(article.filename).toBe('10036.md');
  expect(article.content).toBe(destContent);
});