import fs from 'fs';
import path from 'path';

import htmlParser from 'node-html-parser';

/* Project modules */

import {addArticle, getAuthorReplace} from './data.js';

/* Constants */

/* Export */

export function htmlToArticle(html, filename, authorReplace) {
  const root = htmlParser.parse(html);

  const titles = root.querySelectorAll('.zagolovok');

  if (titles.length != 1) {
    return;
  }
    
  const articleNode = root.querySelector('.article');

  const titleNode = articleNode.querySelector('.zagolovok');
  const authorNode = articleNode.querySelector('.author');
  const tagsNode = articleNode.querySelector('.tags');

  const title = prepareTitle(titleNode.text.trim());
  const tags = prepareTags(tagsNode.text.trim());

  const date = authorNode.querySelector('.date').text.trim();

  const authorRaw = authorNode.text.replace('Версия для печати', '').replace(date, '').trim();
  const authors = prepareAuthors(authorRaw, authorReplace);
        
  titleNode.remove();
  authorNode.remove();
  tagsNode.remove();

  prepareHr(articleNode);
  prepareLinks(articleNode, filename);
  prepareStrong(articleNode);
  prepareEm(articleNode);
  prepareLi(articleNode);
  
  const images = prepareImg(articleNode);
        
  const articleText = articleNode.text.trim().replaceAll('\n', '\n\n');
  const content = prepareContent(articleText);

  const newFilename = path.parse(filename).name + ".md";

  return {
    filename: newFilename,
    title,
    date,
    authorRaw,
    authors,
    content,
    tags,
    images
  };
}

export function readFiles(basePath, inputFilenames, showBadFiles) {

  let count = 0;

  inputFilenames.forEach(filename => {
    const ext = path.extname(filename);
    if (ext === '.html') {
      const fileContent = fs.readFileSync(path.join(basePath, filename));
            
      try {
        const article = htmlToArticle(fileContent, filename, getAuthorReplace());
    
        if (article && article.content) {
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

function prepareAuthors(text, authorReplace) {
  if (!authorReplace) {
    return;
  }

  if (authorReplace.has(text)) {
    return authorReplace.get(text).split(', ');
  } else {
    return text.split(', ');
  }
}

function prepareTags(text) {
  if (text == '') {
    return [];
  }
  
  return text.split(' ').sort();
}

function prepareTitle(text) {
  if (text.length == 0) {
    return 'Заголовок отсутствует';
  }

  return text;
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
  
  // Удаление лидирующих пробелов в строке
  preparedText = preparedText.replaceAll(/\n +([\wа-яА-Я\[])/gi, '\n$1');

  // Удаление пробелов в конце строки
  preparedText = preparedText.replaceAll(/([\wа-яА-Я\)\.\?\!]) +\n/gi, '$1\n');

  return preparedText;
}

function prepareStrong(element) {
  const strongNodes = element.querySelectorAll('strong');

  for (const strongNode of strongNodes) {
    if (strongNode.textContent.trim() == '') {
      continue;
    }

    const text = strongNode.textContent;

    const leftSpace = text.startsWith(' ') ? ' ' : '';
    const rightSpace = text.endsWith(' ') ? ' ' : '';

    strongNode.textContent = `${leftSpace}**${text.trim()}**${rightSpace}`;
  }
}

function prepareEm(element) {
  const emNodes = element.querySelectorAll('em');

  for (const emNode of emNodes) {
    if (emNode.textContent.trim() == '') {
      continue;
    }

    const text = emNode.textContent;

    const leftSpace = text.startsWith(' ') ? ' ' : '';
    const rightSpace = text.endsWith(' ') ? ' ' : '';

    emNode.textContent = `${leftSpace}*${text.trim()}*${rightSpace}`;
  }
}

function prepareLinks(element, pageFilename) {
  const DUMMY_URL = 'http://test345245657.ru';

  const links = element.querySelectorAll('a');

  for (const link of links) {

    let url;
            
    try {
      url = new URL(link.attributes['href'], DUMMY_URL);
    } catch (err) {
      continue;
    }

    if (isFootnoteLink(url, pageFilename)) {
      
      const linkHash = url.hash;
      const footnoteNumber = link.textContent;
      const preparedFootnoteNumber = footnoteNumber.replace('[', '').replace(']', '');

      const footnoteMark = linkHash.endsWith('anc') 
      || linkHash.startsWith('#_ftnref') 
      || linkHash.startsWith('#_ednref') 
        ? ': ' : '';
      
      const footnoteLink = `[^${preparedFootnoteNumber}]` + footnoteMark;
      
      link.textContent = footnoteLink;

      // TODO нет обработки многострочных примечаний.
      // Вероятно, для их добавления проще парсить готовый MD 
      // и добавлять их между примечаниями (примечания всегда в конце списком)

    } else {

      if (link.textContent.length == 0) {
        continue;
      }

      const originUrl = url.toString();

      if (originUrl.startsWith(DUMMY_URL)) {
        const shortUrl = originUrl.replace(DUMMY_URL, '');

        const preparedUrl = !shortUrl.match(/\/\d+\.html?/) ? shortUrl :
          shortUrl        
          .replaceAll('.html', '.md')
          .replaceAll('.htm', '.md');

      // TODO Полезно, добавить обработку особых ссылок 
      // library.php.html
      // /index.html

        link.textContent = `[${link.textContent}](${preparedUrl})`;
        continue;
      }

      const preparedUrl = prepareUrlFromLink(originUrl);
      link.textContent = `[${link.textContent}](${preparedUrl})`;
    }

  }
}

function prepareUrlFromLink(url) {
  const match = url.match(/^https?:\/\/propaganda-journal.net\/\d+.html?$/);

  if (!match) {
    return url;
  }

  const preparedUrl = url
    .replaceAll('https://propaganda-journal.net', '')
    .replaceAll('http://propaganda-journal.net', '')
    .replace(/\.htm$/, '.md')
    .replace(/\.html$/, '.md');

  return preparedUrl;
}

function isFootnoteLink(url, pageFilename) {

  if ((url.pathname != '/' + pageFilename)
      && (url.protocol != 'file:')
  ) {
    return false;
  }

  return (url.hash.endsWith('anc')
    || url.hash.endsWith('sym')
    || url.hash.startsWith('#_ftn') // обратная ссылка #_ftnref
    || url.hash.startsWith('#_edn') // обратная ссылка #_ednref
  );
} 

function prepareHr(element) {
  const pElements = element.querySelectorAll('p');

  for (const p of pElements) {
    if (p.textContent.trim() != '***') {
      continue;
    }

    p.innerHTML = '***';
  }
}

function prepareLi(element) {
  const liElements = element.querySelectorAll('li');

  for (const li of liElements) {
    const mark = li.parentNode.rawTagName == 'ol' ? '1. ' : '* ';
    li.innerHTML = mark + li.textContent.replace('\n', '');
  }
}

function prepareImg(element) {
  const localImages = [];

  const imgElements = element.querySelectorAll('img');

  for (const img of imgElements) {
    const src = img.attributes['src']?.trim();
    const alt = img.attributes['alt']?.trim();

    const preparedAlt = alt?.replaceAll('[', '').replaceAll(']', '');

    if (!isLocalImage(src)) {
      img.innerHTML = `![${preparedAlt}](${src})\n\n`;
      continue;
    }
  
    const preparedSrc = prepareSrc(src);
    localImages.push(preparedSrc);

    img.innerHTML = `![${preparedAlt}](${preparedSrc.toLowerCase()})\n\n`;
  }

  return localImages;
}

function prepareSrc(src) {
  return 'images/' + path.parse(src).base;
}

function isLocalImage(src) {
  const DUMMY_URL = 'http://test345245657.ru';
            
  try {
    const url = new URL(src, DUMMY_URL);
    return url.toString().startsWith(DUMMY_URL);
  } catch (err) {
    return false;
  }
}