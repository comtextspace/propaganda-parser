import fs from 'fs';
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
    return;
  }
    
  const articleNode = root.querySelector('.article');

  const titleNode = articleNode.querySelector('.zagolovok');
  const authorNode = articleNode.querySelector('.author');
  const tagsNode = articleNode.querySelector('.tags');

  const title = titleNode.text.trim();
  const tags = tagsNode.text.trim();

  const date = authorNode.querySelector('.date').text;
  const author = authorNode.text.replace('Версия для печати', '').replace(date, '').trim();
        
  titleNode.remove();
  authorNode.remove();
  tagsNode.remove();

  const footnotesVisited = new Set();

  const links = articleNode.querySelectorAll('a');
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
        
  const articleText = articleNode.text.trim().replaceAll('\n', '\n\n');
  const content = prepareContent(articleText);

  const newFilename = path.parse(filename).name + ".md";

  return {
    filename: newFilename,
    title,
    date,
    author,
    content,
    tags
  };
}

export function readFiles(basePath, inputFilenames, showBadFiles) {

  let count = 0;

  inputFilenames.forEach(filename => {
    const ext = path.extname(filename);
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
      } catch (err) {
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

function prepareContent(text) {
  let preparedText = text;
  
  // Табы преобразуются в пробелы
  preparedText = preparedText.replaceAll('\t', ' ');
  
  // Неразрывные пробелы заменяются на пробелы (https://symbl.cc/en/00A0/)
  preparedText = preparedText.replaceAll('\u00A0', ' ');

  // Два и более пробела заменяются на один
  preparedText = preparedText.replaceAll(/  +/gi, ' ');

  // Удаление строк состоящих из одних пробелов и лишних переводов строк
  while (true) {
    const newText = preparedText.replaceAll('\n \n', '\n\n');
    if (newText == preparedText) {
      break;
    }
    preparedText = newText;
  } 
  preparedText = preparedText.replaceAll(/\n\n(\n)+/gi, '\n\n');

  preparedText = preparedText.replaceAll(/\n +([\wа-яА-Я])/gi, '\n$1');

  return preparedText;
}