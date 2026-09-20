# JS REACT — учебные задания

Один репозиторий, отдельная папка для каждого задания.

| Задание                                 | Код             | Работающий сайт                                                     |
| --------------------------------------- | --------------- | ------------------------------------------------------------------- |
| Task 1 — Async Café, vanilla JavaScript | [task1](task1/) | [Открыть](https://asslanito.github.io/aslan-react-portfolio/task1/) |
| Task 2 — личная страница на React       | [task2](task2/) | [Открыть](https://asslanito.github.io/aslan-react-portfolio/task2/) |

## Структура

```text
JS REACT/
  task1/
    src/
    tests/
    index.html
    package.json
    DEFENSE-RU.md
  task2/
    src/
    public/
    docs/screenshot.png
    index.html
    package.json
    DEFENSE-RU.md
  scripts/build.mjs
  .github/workflows/deploy.yml
  package.json
  SUBMISSION.md
```

Открывай папку `JS REACT` в VS Code. Для следующего задания можно создать рядом `task3`.

## Установка

Нужен Node.js 24 LTS. Выполни в корне репозитория:

```sh
npm ci
npm run setup
```

У каждого задания свои зависимости и lock-файл. Внутри task1 и task2 нет отдельных Git-репозиториев.

## Запуск

```sh
npm run dev:task1
```

Первое задание откроется по адресу http://127.0.0.1:5174.

Во втором терминале:

```sh
npm run dev:task2
```

Второе задание откроется по адресу http://127.0.0.1:5175. Команда `npm run dev` также запускает второе задание.

## Проверки и сборка

```sh
npm run check
npm run build
npm run preview
```

`check` проверяет форматирование, тесты JavaScript и ESLint для React. Сборка публикует task1 и task2 на одном GitHub Pages-сайте. Корневой адрес сайта также показывает React-страницу, чтобы существующая ссылка продолжала работать.

## Подготовка к защите и сдача

- [Объяснение первого задания](task1/DEFENSE-RU.md)
- [Объяснение второго задания](task2/DEFENSE-RU.md)
- [Скриншот React-приложения](task2/docs/screenshot.png)
- [Все ссылки для сдачи](SUBMISSION.md)

Дополнительное вложение к первому заданию в чате не было предоставлено. Проект покрывает темы из присланного текста задания.
