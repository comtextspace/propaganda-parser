# Добавление изменений в конвертор

Изменения принимаются через pull request. Прежде чем фиксировать изменения проверьте форматирование через линтер

```
make lint
make lintfix
```

## Доработки импорта

Для проверки корректности импорта в проекте есть тесты. Тесты находятся в каталоге `tests`. Тесты проверяют что несколько исходных файлов html правильно конвертируются в Markdown. При любых доработках импорта измените тесты чтобы в них проверялись предлагаемые изменения. При необходимости, если в текущих файлах тестов нет проверки нужной ситуации, можно добавить ещё один файл.

Запуск тестов

```
make test
```

Если для проверки функционала понадобится новый тест, то pull request лучше разделять минимум на 2 коммита. В первом только добавления теста (файлы html, md и код теста в js), а во втором добавление нового кода парсера и изменение теста.