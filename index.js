import fs from 'fs';
import path from 'path';

import htmlParser from 'node-html-parser';

import {openDb, closeDb, createSchema, addArticle} from './source/data.js';
import {makeFiles, makeIndex} from './source/export.js';

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
        const file = fs.readFileSync(path.join(BASE_FOLDER, filename));
        const root = htmlParser.parse(file);

        const authors = root.querySelectorAll('.author');

        if (authors.length < 10) {
            const article_node = root.querySelector('.article');

            const title_node = article_node.querySelector('.zagolovok')
            const author_node = article_node.querySelector('.author')
            const tags_node = article_node.querySelector('.tags')

            const title = title_node.text;
            const tags = tags_node.text;

            const date = author_node.querySelector('.date').text;
            const author  = author_node.text.replace('Версия для печати', '').replace(date, '').trim();
            
            title_node.remove();
            author_node.remove();
            tags_node.remove();

            const footnotesVisited = new Set();

            const links = article_node.querySelectorAll('a');
            for (const link of links) {
                
                const url = new URL(link.attributes['href'], 'http://test.ru');
                const linkPath = url.pathname;
                const linkHash = url.hash;

                const footnoteNumber = link.textContent;
                const footnoteMark = linkHash.endsWith('anc') ? ': ' : '';
                const footnoteLink = `[^${footnoteNumber}]` + footnoteMark;

                footnotesVisited.add(footnoteNumber);

                if (linkPath == '/' + filename) {
                    link.textContent = footnoteLink;
                }
            }
            
            const text = article_node.text.trim().replaceAll('\n', '\n\n');

            const newFilename = path.parse(filename).name + ".md";
            addArticle(newFilename, title, date, author, text, tags);
        }
    }
  });

makeFiles(OUT_FOLDER);
makeIndex(OUT_FOLDER);

closeDb();