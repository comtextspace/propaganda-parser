import fs from 'fs';
import path from 'path';

/* Project modules */

import {getArticles, getArticleIndex, getTagIndex, getAuthorIndex, getImages} from './data.js';

/* Constants */

const INDEX_FILENAME = 'index.md';
const TAG_FILENAME = 'tags.md';
const AUTHOR_FILENAME = 'authors.md';

const INDEX_HEADER = `# Архив сайта журнала «Пропаганда»

Старый адрес журнала: [propaganda-journal.net](https://propaganda-journal.net)

* [Об архиве](/static/about.md)
* [Список авторов](${AUTHOR_FILENAME})
* [Список тегов](${TAG_FILENAME})`;

const TAG_HEADER = `# Теги\n\nНекоторые статьи содержат несколько тегов, поэтому они дублируются на страницах разных тегов\n\n`;

const AUTHOR_HEADER = `# Авторы\n\n[[toc]]`;

/* Export */

export function makeFiles(outPath) {
  getArticles().forEach(article => {
    const fileContent = makeArticle(article);

    const fullArticleFilename = path.join(outPath + article.filename);
    fs.writeFileSync(fullArticleFilename, fileContent);
  });
}

export function makeIndex(outPath) {
  let indexPageContent = INDEX_HEADER;
  let lastShortdate = '';

  const articles = getArticleIndex();

  indexPageContent += `\n\nВсего страниц: ${articles.length}`;

  articles.forEach(({shortdate, filename, title, date}) => {
    if (lastShortdate != shortdate) {
      lastShortdate = shortdate;
      indexPageContent += `\n\n## ${shortdate}\n`;
    }

    indexPageContent += `
* [${title}](${filename}) (${date})`;
  });

  const fullIndexFilename = path.join(outPath, INDEX_FILENAME);
  fs.writeFileSync(fullIndexFilename, indexPageContent);
}

export function makeAuthorIndex(outPath) {
  let indexContent = AUTHOR_HEADER;
  let lastAuthor = '';

  const authors = getAuthorIndex();

  authors.forEach(({author, title, filename, date, cnt}) => {
    if (lastAuthor != author) {
      lastAuthor = author;
      indexContent += `\n\n## ${author} (${cnt})\n`;
    }

    indexContent += `\n* [${title}](${filename}) (${date})`;});

  const fullIndexFilename = path.join(outPath, AUTHOR_FILENAME);
  fs.writeFileSync(fullIndexFilename, indexContent);
}

export function makeTagIndex(outPath) {
  const tagLinks = new Map();
  const tagCount = new Map();

  getTagIndex().forEach(({tag, title, filename, date, cnt}) => {
    const tagFilename = tagToFilename(tag);
    
    if (!tagLinks.has(tagFilename)) {
      tagLinks.set(tagFilename, []);
      tagCount.set(tagFilename, cnt);
    }

    const link = `* [${title}](${filename}) (${date})`;
    tagLinks.get(tagFilename).push(link);
  });

  const tagPageBody = [... tagLinks.keys()]
    .map(tag => `* [${tag}](${tag}.md) (${tagCount.get(tag)})`);
  
  const tagPageContent = TAG_HEADER + tagPageBody.join('\n');

  const fullTagFilename = path.join(outPath, TAG_FILENAME);
  fs.writeFileSync(fullTagFilename, tagPageContent);

  for (const tagFilename of tagLinks.keys()) {

    const tagBody = tagLinks.get(tagFilename).join('\n');
    const tagPageContent = `# ${tagFilename}\n\n` + tagBody;
  
    const fullFilename = path.join(outPath, tagFilename + '.md');
    fs.writeFileSync(fullFilename, tagPageContent);
  }
}

export function moveImages(sourcePath, destPath) {
  const images = getImages();

  for (const {src} of images) {
    const sourceName = path.join(sourcePath, path.parse(src).base);
    const destName = path.join(destPath, src);
    
    fs.copyFileSync(sourceName, destName.toLowerCase());
  }
}

/* Inner functions */

function tagToFilename(tag) {
  return tag.replace(/\+/gi, '_').replace(/\s/gi, '_').toLowerCase();
}

function makeArticle({title, date, authorRaw, authors, content}) {
  const article = makeYAML(title, date, authors) 
    + '\n\n'
    + makeHeader(title, date, authorRaw, authors)
    + '\n\n'
    + escapeContentForVuepress(content);

  return article;
}

// TODO форматирование author в YAML нужно переделать в список

function makeYAML(title, date, authors) {
  return '' +
`---
title: "${escapeYamlFiled(title)}"
date: "${escapeYamlFiled(date)}"
author: "${escapeYamlFiled(prepareAuthorRaw(authors))}"
---`;
}

function makeHeader(title, date, authorRaw, authors) {
  const preparedAuthors = authors && authors != authorRaw 
    ? ` (${authors})` : '';

  return '' +
`# ${title}

**${date}** ${prepareAuthorRaw(authorRaw)}${preparedAuthors}`;
}

function prepareAuthorRaw(text) {
  if (text == null) {
    return 'Автор неизвестен';
  }

  return text;
}

function escapeYamlFiled(text) {
  return text.replaceAll('"', '\\"');
}

function escapeContentForVuepress(text) {
  return text.replaceAll('{', '\\{').replaceAll('}', '\\}');
}