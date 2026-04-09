# Eldes Gate App

PWA для управления шлагбаумами на базе устройств ELDES. Развёрнуто по адресу [gate.housekpr.ru](https://gate.housekpr.ru).

## Что умеет

- Авторизация / регистрация / сброс пароля
- Просмотр списка зон и устройств (шлагбаумов)
- Открытие шлагбаума немедленно или с задержкой 45 секунд
- Звонок на устройство через `tel:` (если у устройства задан номер телефона)
- Установка как PWA на телефон (offline-capable через Service Worker)

## Стек

| Слой | Технология |
|---|---|
| UI | React 19 + TypeScript, MUI v7, styled-components |
| Состояние | Redux Toolkit + redux-persist |
| HTTP | Axios (base URL — `REACT_APP_BACKEND_URL`) |
| Уведомления | notistack |
| PWA | Workbox (Create React App PWA template) |

## Быстрый старт

```bash
# установить зависимости
npm install --legacy-peer-deps

# запустить dev-сервер
REACT_APP_BACKEND_URL=https://api.example.com npm start
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `REACT_APP_BACKEND_URL` | да | Базовый URL бэкенда |

## Команды

```bash
npm start                        # Dev-сервер
npm run build                    # Production-сборка в ./build/
npm test                         # Тесты в watch-режиме
npm test -- --watchAll=false     # Тесты однократно
```

## Docker

Сборка и запуск локально:

```bash
docker build --build-arg ENV=PROD -t eldes-app .
docker run -p 8122:80 eldes-app
```

Через docker-compose (используется на сервере):

```bash
TAG=<git-sha> docker compose up -d
```

Nginx внутри контейнера слушает на порту 80, снаружи пробрасывается на 8122. Traefik роутит трафик с `gate.housekpr.ru` в контейнер.

## CI/CD

GitHub Actions (`.github/workflows/deploy-to-mr17dom1.yml`):

1. **Build** — собирает Docker-образ и пушит в DockerHub под тегом `<short-sha>`.
2. **Deploy** — копирует `docker-compose.yml` и `.env` на сервер по SSH, выполняет `docker compose pull && up`.

Триггер: push в ветку `master`.

### Secrets в GitHub

| Secret | Назначение |
|---|---|
| `DOCKER_USERNAME` / `DOCKER_PASSWORD` / `DOCKER_TOKEN` | DockerHub |
| `REACT_APP_BACKEND_URL` | URL бэкенда для production-сборки |
| `MR17_HOST_IP` / `MR17_HOST_USERNAME` / `MR17_HOST_KEY` | SSH-доступ к серверу |
| `MR17_HOST_PROJECT_PATH` | Путь к проекту на сервере |

## Структура src/

```
src/
├── backend/        # axios-клиент и типы API
├── components/     # переиспользуемые компоненты (layout, loading, кнопки)
├── hooks/          # кастомные хуки
├── services/       # сервисный слой
├── store/          # Redux-срез auth (auth/reducer.ts)
├── utils/          # константы (IS_DEBUG и др.)
└── views/          # страницы: auth/, eldes/, profile/
```

## Основные API-эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/v1/auth/login` | Вход |
| POST | `/api/v1/auth/registration` | Регистрация |
| POST | `/api/v1/auth/reset-password` | Сброс пароля |
| GET | `/api/private/devices` | Список зон и устройств |
| POST | `/api/private/devices/:id/open` | Открыть шлагбаум |
| POST | `/api/private/devices/:id/open-delayed?delay=45` | Открыть с задержкой |
| PATCH | `/api/private/users/:id/platform` | Обновить платформу пользователя |

401 / 403 ответы автоматически разлогинивают пользователя.
