import fs from 'fs';
import path from 'path';

/* Project modules */

import {getArticles} from './data.js';

/* Constants */

const INDEX_FILENAME = 'index.md';

/* Export */

export function makeFiles(outPath) {
    getArticles().forEach(article => {
        const fileContent = makeArticle(article);

        const fullArticleFilename = path.join(outPath + article.filename);
        fs.writeFileSync(fullArticleFilename, fileContent)
    });
}

export function makeIndex(outPath) {
    let indexPageContent = '';

    getArticles().forEach(({filename, title, date}) => {
        indexPageContent += `
* [${title}](${filename}) (${date})`
    });

    const fullIndexFilename = path.join(outPath, INDEX_FILENAME);
    fs.writeFileSync(fullIndexFilename, indexPageContent);
}

/* Inner functions */



function makeArticle({title, date, author, content}) {
    const article = makeYAML(title, date, author) 
    + '\n\n'
    + makeHeader(title, date, author)
    + '\n\n'
    + content;

    return article;
}

function makeYAML(title, date, author) {
    return '' +
`---
title: ${title}
date: ${date}
author: ${author}
---`
}

function makeHeader(title, date, author) {
    return '' +
`# ${title}

**${date}** ${author}`
}
