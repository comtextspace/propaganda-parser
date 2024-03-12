import fs from 'fs';
import path from 'path';

/* Project modules */

import {getArticles, getArticleIndex, getTagIndex} from './data.js';

/* Constants */

const INDEX_FILENAME = 'index.md';
const TAG_FILENAME = 'tag.md';

const INDEX_HEADER = `# Архив сайта журнала Пропаганда (propaganda-journal.net)

* [Список тегов](${TAG_FILENAME})`;

const TAG_HEADER = `# Теги\n\n`;
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

  getArticleIndex().forEach(({shortdate, filename, title, date}) => {
    if (lastShortdate != shortdate) {
      lastShortdate = shortdate;
      indexPageContent += `\n\n# ${shortdate}\n`;
    }

    indexPageContent += `
* [${title}](${filename}) (${date})`;
  });

  const fullIndexFilename = path.join(outPath, INDEX_FILENAME);
  fs.writeFileSync(fullIndexFilename, indexPageContent);
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
    .map(tag => `* [${tag}](${tag}.md) (${tagCount.get(tag)})`);;
  
    const tagPageContent = TAG_HEADER + tagPageBody.join('\n');

  const fullTagFilename = path.join(outPath, TAG_FILENAME);
  fs.writeFileSync(fullTagFilename, tagPageContent);

  for (const tagFilename of tagLinks.keys()) {

    const tagBody = tagLinks.get(tagFilename).join('\n')
    const tagPageContent = `# ${tagFilename}\n\n` + tagBody;
  
    const fullFilename = path.join(outPath, tagFilename + '.md');
    fs.writeFileSync(fullFilename, tagPageContent);
  }
}

/* Inner functions */

function tagToFilename(tag) {
  return tag.replace(/\+/gi, '_').replace(/\s/gi, '_').toLowerCase();
}

function makeArticle({title, date, author, content}) {
  const article = makeYAML(title, date, author) 
    + '\n\n'
    + makeHeader(title, date, author)
    + '\n\n'
    + escapeContentForVuepress(content);

  return article;
}

function makeYAML(title, date, author) {
  return '' +
`---
title: "${escapeYamlFiled(title)}"
date: "${escapeYamlFiled(date)}"
author: "${escapeYamlFiled(prepareAuthor(author))}"
---`;
}

function makeHeader(title, date, author) {
  return '' +
`# ${title}

**${date}** ${author}`;
}

function prepareAuthor(text) {
  if (text == null) {
    return 'Автор отсутствует';
  }

  return text;
}

function escapeYamlFiled(text) {
  return text.replaceAll('"', '\\"');
}

function escapeContentForVuepress(text) {
  return text.replaceAll('{', '\\{').replaceAll('}', '\\}');
}