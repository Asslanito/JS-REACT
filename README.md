# JS REACT

Учебные задания по JavaScript и React.

## Midterm — Study Atlas

React SPA: каталог мест для учёбы со 120 демонстрационными записями, симулированной API, поиском, фильтрами, сортировкой, пагинацией, избранным и формой добавления.

- [Приложение](https://asslanito.github.io/JS-REACT/midterm/)
- [Исходный код и описание](midterm/README.md)
- [Подготовка к защите](midterm/DEFENSE.md)

Запуск: `npm run dev:midterm`. Команда `npm run dev` также запускает midterm.

| Задание                                                                                  | Код             | Сайт                                                   |
| ---------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------ |
| Task 1 — Async Café: замыкания, стек вызовов, Promise, async/await, задачи и микрозадачи | [task1](task1/) | [Открыть](https://asslanito.github.io/JS-REACT/task1/) |
| Task 2 — личная страница на React                                                        | [task2](task2/) | [Открыть](https://asslanito.github.io/JS-REACT/task2/) |

## Запуск

Требуется Node.js 24. В корне проекта:

```sh
npm ci
npm run setup
```

Первое задание:

```sh
npm run dev:task1
```

Второе задание:

```sh
npm run dev:task2
```

## Проверка и сборка

```sh
npm run check
npm run build
```

Оба задания публикуются на GitHub Pages через `.github/workflows/deploy.yml`.

[Скриншот React-приложения](task2/docs/screenshot.png)
