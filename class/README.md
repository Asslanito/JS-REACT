# Class

[Открыть приложение](https://asslanito.github.io/do-pary/)

До следующей пары 45 минут, но десять из них уйдут на дорогу. Что можно закончить за оставшиеся 35 минут, если под рукой только телефон? «Class» собирает из твоих дел выполнимый маршрут и показывает время выхода.

## Как пользоваться

1. Укажи продолжительность перерыва, время до аудитории и доступную технику.
2. Добавь свои дела в банк задач. Для каждого задай длительность, приоритет и необходимые устройства. При первом запуске банк содержит пять редактируемых примеров.
3. Посмотри предложенный маршрут. Алгоритм перебирает сочетания дел методом динамического программирования и максимизирует сумму минут с весом по приоритету в доступном времени.
4. Начни маршрут. Таймер позволяет завершить дело раньше или пропустить его. Когда пора выходить, приложение завершает учебную часть маршрута.
5. Выполненные дела хранятся во вкладке «Готовые». Банк, настройки и текущая сессия сохраняются в этом браузере.

Интерфейс работает на телефоне и компьютере. Сервер и регистрация не требуются. Таймер использует время на часах устройства, поэтому учитывает время, проведённое в другой вкладке.

## Exact project-generation prompt

The project-generation instruction supplied to the AI is quoted verbatim below.

```text
Generate completely new React application with AI.

Requirements: Project idea has to be original, fun and as non-basic as possible. The application must be fully functional, interactive, visually appealing, responsive and **deployed**.

Submission:

1. Deployed application link
2. Github link with
   1. your project code
   2. Readme file with your project idea description and your exact prompt
```

During iteration, the student asked for something practical. The AI designed a campus break planner, wrote the React components and scheduling algorithm, drew the route diagram in code, and prepared the deployment.

## Local development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

`npm test` checks scheduling constraints and task selection. `npm run build` creates the static site in `dist/`. For Vercel, select the Vite preset, set the root directory to `class`, and publish the `dist` output.

**Stack** · React, Vite, Lucide icons, locally bundled Manrope font and browser localStorage.

**Student** · Yermyrzayev Aslan

