import fs from 'fs';

import {htmlToArticle} from '../source/import.js';

test('htmlToArticle — 100.html', () => {
    const source = fs.readFileSync('./tests/fixtures/import/100.html', "utf8");
    const dest_content = fs.readFileSync('./tests/fixtures/import/100.md', "utf8");

    const article = htmlToArticle(source, '100.html');

    expect(article.title).toBe('День Независимости на Западной Украине праздновали без особого энтузиазма');
    expect(article.date).toBe('2008-08-25');
    expect(article.author).toBe('В. Дмитрук');
    expect(article.tags).toBe('события+комментарии');
    expect(article.filename).toBe('100.md');
    expect(article.content).toBe(dest_content);
});

test('htmlToArticle — 10080.html', () => {
    const source = fs.readFileSync('./tests/fixtures/import/10080.html', "utf8");
    const dest_content = fs.readFileSync('./tests/fixtures/import/10080.md', "utf8");

    const article = htmlToArticle(source, '10080.html');

    expect(article.title).toBe('Заметки на полях книги «Есть ли будущее у капитализма?». Часть 8. Так был ли мальчик?');
    expect(article.date).toBe('2017-06-06');
    expect(article.author).toBe('Василий Пихорович');
    expect(article.tags).toBe('теория');
    expect(article.filename).toBe('10080.md');
    expect(article.content).toBe(dest_content);
});