import fs from 'fs';
import path from 'path';

import { Command } from 'commander';

import {openDb, closeDb, createSchema} from './source/data.js';
import {makeFiles, makeIndex, makeTagIndex, makeAuthorIndex, moveImages} from './source/export.js';
import {readFiles} from './source/import.js';

const INPUT_PATH = './site/';
const OUTPUT_PATH = './site_out/';

const program = new Command();

program
  .name('Propaganda-parser')
  .description('Программа для конвертации сайта журнала Пропаганда в Markdown')
  .version('0.1.0');

program.command('import')
  .description('Загрузка страниц в БД sqlite')
  .option('--showBadFiles', 'Выводит в консоль неподходящие для конвертации файлы')
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    importInDb(options.source, options.showBadFiles);
  });

program.command('export')
  .description('Экспорт страниц из БД sqlite в Markdown-файлы')
  .option('-dest, --dest <string>', 'Каталог куда сохранять файлы', OUTPUT_PATH)
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    exportFromDb(options.source, options.dest);
  });

program.parse();

function importInDb(sourcePath, showBadFiles) {
  openDb();
  createSchema();

  console.log(`start parsing from path ${sourcePath}`);

  const inputFiles = fs.readdirSync(sourcePath);
  console.log('Input files: ' + inputFiles.length);

  readFiles(sourcePath, inputFiles, showBadFiles);

  console.log('finish parsing');
  closeDb();
}

function exportFromDb(sourcePath, destPath) {
  openDb();

  console.log(`start export from path ${sourcePath}`);
  console.log(`start export in path ${destPath}`);

  makeFiles(destPath);
  makeIndex(destPath);
  makeTagIndex(destPath);
  makeAuthorIndex(destPath);
  moveImages(sourcePath, destPath);
    
  console.log('finish export');
  closeDb();
}