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

console.log('start parsing');

let count = 0;

inputFiles.forEach(filename => {
    const ext = path.extname(filename)
    if (ext === '.html') {
        const fileContent = fs.readFileSync(path.join(BASE_FOLDER, filename));
        
        try {
            const article = htmlToArticle(fileContent, filename);

            if (article) {
                addArticle(article);
            }
        } catch(err) {
            console.log(filename);
            console.log(err);
        }
    }
    count += 1;
    if (count % 1000 == 0) {
        console.log(`Finished parsing ${count} files`);
    }
  });

console.log('finish parsing');

makeFiles(OUT_FOLDER);
makeIndex(OUT_FOLDER);

closeDb();