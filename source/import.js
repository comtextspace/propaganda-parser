import fs from 'fs'
import path from 'path';

import htmlParser from 'node-html-parser';

/* Project modules */

import {addArticle} from './data.js';

/* Constants */

/* Export */

export function htmlToArticle(html, filename) {
    const root = htmlParser.parse(html);

    const titles = root.querySelectorAll('.zagolovok');

    if (titles.length != 1) {
        return
    }
    
        const article_node = root.querySelector('.article');

        const title_node = article_node.querySelector('.zagolovok')
        const author_node = article_node.querySelector('.author')
        const tags_node = article_node.querySelector('.tags')

        const title = title_node.text.trim();
        const tags = tags_node.text.trim();

        const date = author_node.querySelector('.date').text;
        const author  = author_node.text.replace('Версия для печати', '').replace(date, '').trim();
        
        title_node.remove();
        author_node.remove();
        tags_node.remove();

        const footnotesVisited = new Set();

        const links = article_node.querySelectorAll('a');
        for (const link of links) {

            let url;
            
            try {
                url = new URL(link.attributes['href'], 'http://test.ru');
            } catch (err) {
                continue;
            }

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

        return {
            filename: newFilename,
            title,
            date,
            author,
            content: text,
            tags
        };
}

export function readFiles(basePath, inputFilenames, showBadFiles) {

    let count = 0;

    inputFilenames.forEach(filename => {
        const ext = path.extname(filename)
        if (ext === '.html') {
            const fileContent = fs.readFileSync(path.join(basePath, filename));
            
            try {
                const article = htmlToArticle(fileContent, filename);
    
                if (article) {
                    addArticle(article);
                } else {
                    if (showBadFiles) {
                        console.log(filename);
                    }
                }
            } catch(err) {
                console.log(filename);
                console.log(err);
            }
        } else {
            if (showBadFiles) {
                console.log(filename);
            }
        }
        count += 1;
        if (count % 1000 == 0) {
            console.log(`Finished parsing ${count} files`);
        }
      });
}