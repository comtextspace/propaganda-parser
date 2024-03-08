import fs from 'fs';
import path from 'path';

/* Project modules */

import {getArticles, getArticleIndex} from './data.js';

/* Constants */

const INDEX_FILENAME = 'index.md';

const INDEX_HEADER = `# Архив сайта журнала Пропаганда (propaganda-journal.net)`;

/* Export */

export function makeFiles(outPath) {
    getArticles().forEach(article => {
        const fileContent = makeArticle(article);

        const fullArticleFilename = path.join(outPath + article.filename);
        fs.writeFileSync(fullArticleFilename, fileContent)
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
title: "${title}"
date: "${date}"
author: "${author}"
---`
}

function makeHeader(title, date, author) {
    return '' +
`# ${title}

**${date}** ${author}`
}
