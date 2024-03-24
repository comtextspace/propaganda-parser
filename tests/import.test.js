import fs from 'fs';

import {htmlToArticle} from '../source/import.js';

const authorReplace = new Map();

test('htmlToArticle — 100.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/100.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/100.md', "utf8");

  const article = htmlToArticle(source, '100.html', authorReplace);

  expect(article.title).toBe('День Независимости на Западной Украине праздновали без особого энтузиазма');
  expect(article.date).toBe('2008-08-25');
  expect(article.authorRaw).toBe('В. Дмитрук');
  expect(article.authors).toEqual(['В. Дмитрук']);
  expect(article.tags).toEqual(['события+комментарии']);
  expect(article.filename).toBe('100.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10080.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10080.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10080.md', "utf8");

  const article = htmlToArticle(source, '10080.html', authorReplace);

  expect(article.title).toBe('Заметки на полях книги «Есть ли будущее у капитализма?». Часть 8. Так был ли мальчик?');
  expect(article.date).toBe('2017-06-06');
  expect(article.authorRaw).toBe('Василий Пихорович');
  expect(article.authors).toEqual(['Василий Пихорович']);
  expect(article.tags).toEqual(['теория']);
  expect(article.filename).toBe('10080.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 8860.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/8860.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/8860.md', "utf8");

  const article = htmlToArticle(source, '8860.html', authorReplace);

  expect(article.title).toBe('О наследии Чернышевского. Часть первая');
  expect(article.date).toBe('2014-07-07');
  expect(article.authorRaw).toBe('Mikołaj Zagorski');
  expect(article.authors).toEqual(['Mikołaj Zagorski']);
  expect(article.tags).toEqual(['история', 'культура', 'политика']);
  expect(article.filename).toBe('8860.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10029.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10029.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10029.md', "utf8");

  const article = htmlToArticle(source, '10029.html', authorReplace);

  expect(article.title).toBe('О значении театра в преобразовании истории');
  expect(article.date).toBe('2017-04-01');
  expect(article.authorRaw).toBe('Ярослав Вареник');
  expect(article.authors).toEqual(['Ярослав Вареник']);
  expect(article.tags).toEqual(['культура']);
  expect(article.filename).toBe('10029.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10036.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10036.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10036.md', "utf8");

  const article = htmlToArticle(source, '10036.html', authorReplace);

  expect(article.title).toBe('Мир иллюзий. Реакция под видом революции');
  expect(article.date).toBe('2017-04-10');
  expect(article.authorRaw).toBe('Павел Богдан');
  expect(article.authors).toEqual(['Павел Богдан']);
  expect(article.tags).toEqual(['дискуссия', 'культура']);
  expect(article.filename).toBe('10036.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 1298.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/1298.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/1298.md', "utf8");

  const article = htmlToArticle(source, '1298.html', authorReplace);

  expect(article.title).toBe('Маразм крепчает');
  expect(article.date).toBe('2009-08-06');
  expect(article.authorRaw).toBe('К. Дымов');
  expect(article.authors).toEqual(['К. Дымов']);
  expect(article.tags).toEqual(['история', 'культура', 'общество']);
  expect(article.filename).toBe('1298.md');
  expect(article.images).toEqual(['images/St090724.jpg']);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 10145.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/10145.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/10145.md', "utf8");

  const article = htmlToArticle(source, '10145.html', authorReplace);

  expect(article.title).toBe('О «Новой эстетической теории» Ивана Смеха. Часть 1 из 3');
  expect(article.date).toBe('2017-09-15');
  expect(article.authorRaw).toBe('Максим Кондрашев, Данила Меридин');
  expect(article.authors).toEqual(['Максим Кондрашев', 'Данила Меридин']);
  expect(article.tags).toEqual(['культура', 'теория']);
  expect(article.filename).toBe('10145.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});


test('htmlToArticle — 9455.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/9455.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/9455.md', "utf8");

  const article = htmlToArticle(source, '9455.html', authorReplace);

  expect(article.title).toBe('Чтобы свои не стреляли в своих (ответ рецензентам)');
  expect(article.date).toBe('2015-02-19');
  expect(article.authorRaw).toBe('Włodzimierz Podlipski');
  expect(article.authors).toEqual(['Włodzimierz Podlipski']);
  expect(article.tags).toEqual(['политика']);
  expect(article.filename).toBe('9455.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});

test('htmlToArticle — 9689.html', () => {
  const source = fs.readFileSync('./tests/fixtures/import/9689.html', "utf8");
  const destContent = fs.readFileSync('./tests/fixtures/import/9689.md', "utf8");

  const article = htmlToArticle(source, '9689.html', authorReplace);

  expect(article.title).toBe('Несчастная любовь и современный мир. Часть 2.');
  expect(article.date).toBe('2015-08-14');
  expect(article.authorRaw).toBe('Александр Гавва');
  expect(article.authors).toEqual(['Александр Гавва']);
  expect(article.tags).toEqual(['общество', 'теория']);
  expect(article.filename).toBe('9689.md');
  expect(article.images).toEqual([]);
  expect(article.content).toBe(destContent);
});