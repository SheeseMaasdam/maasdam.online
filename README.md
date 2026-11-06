# Сайт

Статический сайт в папке `site/`. Деплой — через GitHub Actions на Cloudflare Pages
(работает с приватным репозиторием, бесплатно).

## Настройка деплоя (один раз)
1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (Direct Upload).
   Назовите проект так же, как `PROJECT_NAME` в `.github/workflows/deploy.yml`, загрузите любой файл (например, пустой `index.html`).
2. Cloudflare → **My Profile → API Tokens → Create Token** → шаблон «Edit Cloudflare Workers» либо свой токен
   с правом **Account → Cloudflare Pages → Edit**. Скопируйте токен.
3. Account ID — в Cloudflare справа на главной странице аккаунта (или в Workers & Pages).
4. GitHub → репозиторий → **Settings → Secrets and variables → Actions → New repository secret**:
   - `CLOUDFLARE_API_TOKEN` — токен из п. 2
   - `CLOUDFLARE_ACCOUNT_ID` — ID из п. 3
5. Push в `main` (или Actions → Deploy to Cloudflare Pages → Run workflow). Сайт появится на `PROJECT_NAME.pages.dev`.
6. Свой домен: проект Pages → **Custom domains**.

## Структура
```
.github/workflows/deploy.yml   автодеплой
.gitignore
README.md
site/                          сайт (index.html, style.css, scripts/, assets/)
```
