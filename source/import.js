import path from 'path';

import htmlParser from 'node-html-parser';

/* Project modules */

/* Constants */

/* Export */

export function htmlToArticle(html, filename) {
    const root = htmlParser.parse(html);

    const authors = root.querySelectorAll('.author');

    if (authors.length == 10) {
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

        return {
            filename: newFilename,
            title,
            date,
            author,
            content: text,
            tags
        };
}