# Деплой: Vercel (фронт) + Render (бэк) + Neon (PostGIS) — всё бесплатно

Архитектура прода повторяет дев-схему: браузер ходит только на домен Vercel,
а Next.js через `rewrites` проксирует `/api/*` и `/auth/*` на бэкенд.
Благодаря этому куки (`session`, `oauth_state`) живут на одном домене — никакой
кросс-доменной настройки не нужно.

```
Браузер ──► Vercel (Next.js) ──rewrites──► Render (Go) ──► Neon (PostGIS)
```

Порядок важен: сначала база и бэкенд, потом фронт, потом связать их переменными.

> Ограничение бесплатного Render: сервис засыпает после ~15 минут без трафика,
> первый запрос после сна отвечает до минуты. Альтернатива без засыпания —
> Render Starter ($7/мес) или Railway Hobby ($5/мес).

---

## 1. База данных (Neon)

1. [neon.tech](https://neon.tech) → регистрация через GitHub → **Create project**
   (Postgres 16+, регион поближе, например `eu-central-1`).
2. Скопируйте **connection string** из дашборда — вида:
   ```
   postgresql://<user>:<password>@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
   База по умолчанию называется `neondb` — можно оставить её.
3. Накатите схему и данные с локальной машины (psql есть внутри Docker,
   ставить ничего не надо):
   ```powershell
   cd backend/db
   $DB = "postgresql://<user>:<password>@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/schema.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/seed.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/territories.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/cities_arrows.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/migrate_era_hy.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/migrate_events_hy.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/migrate_kings_hy.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/migrate_era_description_hy.sql
   docker run --rm -v ${PWD}:/db postgres:16 psql $DB -f /db/migrate_bookmark_notes.sql
   ```
   `schema.sql` сам включает PostGIS (`CREATE EXTENSION IF NOT EXISTS postgis`) —
   на Neon это расширение доступно на бесплатном тарифе.
   Все `migrate_*` идемпотентны — повторный запуск безопасен.

---

## 2. Бэкенд (Render)

1. [render.com](https://render.com) → **New → Web Service** → подключите GitHub
   и выберите этот репозиторий.
2. Настройки:
   - **Root Directory**: `backend` (Render сам увидит Dockerfile, Language: Docker)
   - **Instance Type**: Free
   - **Health Check Path**: `/health`
3. Environment Variables:
   ```
   DATABASE_URL=<connection string из Neon, с ?sslmode=require>
   JWT_SECRET=<сгенерируйте: openssl rand -hex 32 — НЕ тот, что был в деве>
   GOOGLE_CLIENT_ID=<из Google Cloud Console>
   GOOGLE_CLIENT_SECRET=<из Google Cloud Console>
   FRONTEND_URL=https://ПОКА-ЗАГЛУШКА.vercel.app
   GOOGLE_REDIRECT_URL=https://ПОКА-ЗАГЛУШКА.vercel.app/auth/google/callback
   APP_ENV=production
   ```
   `PORT` задавать не нужно — Render подставляет его сам, сервер его читает.
4. **Create Web Service** → после сборки получите
   `https://<backend>.onrender.com`. Проверка: `/health` должен отдать `ok`,
   `/api/eras` — JSON с эпохами.

---

## 3. Фронтенд (Vercel)

1. [vercel.com](https://vercel.com) → **Add New → Project** → импорт этого репозитория.
2. **Root Directory**: `frontend` (фреймворк Next.js определится сам).
3. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://<backend>.onrender.com
   ```
4. **Deploy** → получите домен `https://<app>.vercel.app`.

> `NEXT_PUBLIC_API_URL` используется в `next.config.mjs` (rewrites) и
> зашивается при сборке: после изменения переменной нужен redeploy.

---

## 4. Связать всё

1. Вернитесь в Render и замените заглушки реальным доменом Vercel:
   ```
   FRONTEND_URL=https://<app>.vercel.app
   GOOGLE_REDIRECT_URL=https://<app>.vercel.app/auth/google/callback
   ```
   Redirect ведёт на домен **фронта** (не Render!) — колбэк проходит через
   прокси Vercel, чтобы кука сессии установилась на домене фронта.
2. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
   ваш OAuth 2.0 Client:
   - **Authorized JavaScript origins**: `https://<app>.vercel.app`
   - **Authorized redirect URIs**: `https://<app>.vercel.app/auth/google/callback`
3. Render перезапустит сервис после смены переменных автоматически.

---

## 5. Проверка

- `https://<app>.vercel.app` — открывается карта, есть данные эпох/городов
  (значит rewrites → Render → Neon работают).
- Логин через Google → после колбэка вы залогинены, `/api/me` отдаёт профиль.
- Закладки создаются и переживают перезагрузку страницы.

## Дальнейшие деплои

- `git push` в ветку продакшена → Vercel и Render пересобирают автоматически.
- Новые SQL-миграции накатываются вручную тем же `docker run … psql` (раздел 1).
