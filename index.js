import fs from 'fs';
import path from 'path';

import htmlParser from 'node-html-parser';

import {openDb, closeDb, createSchema, addArticle} from './source/data.js';
import {makeFiles, makeIndex} from './source/export.js';
import {htmlToArticle} from './source/import.js';

const BASE_FOLDER = './site/';
const OUT_FOLDER = './site_out/';


const FILES = './files.txt';

const inputFiles = fs.readdirSync(BASE_FOLDER);

console.log('Input files: ' + inputFiles.length)

let indexPageContent = `# Архив сайта журнала Пропаганда (propaganda-journal.net)

`;

openDb();
createSchema();

inputFiles.slice(0, 200).forEach(filename => {
    const ext = path.extname(filename)
    if (ext === '.html') {
        const fileContent = fs.readFileSync(path.join(BASE_FOLDER, filename));

        const article = htmlToArticle(fileContent, filename);

        if (article) {
            addArticle(article);
        }        
    }
  });

makeFiles(OUT_FOLDER);
makeIndex(OUT_FOLDER);

closeDb();