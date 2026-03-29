# Владивосток — сайт‑путеводитель

Статический сайт (HTML/CSS/JS), идеально подходит для GitHub Pages.

## Локальный запуск

Откройте `index.html` двойным кликом, либо поднимите простой сервер (рекомендуется).

### Вариант 1: Python (если установлен)

```bash
python -m http.server 8080
```

Откройте `http://localhost:8080`.

### Вариант 2: Node.js (если установлен)

```bash
npx serve .
```

## Хостинг через GitHub Pages (самый простой способ)

### 1) Создайте репозиторий на GitHub

- Название: например `vladivostok-guide`
- Public (рекомендуется)

### 2) Залейте файлы в репозиторий

Откройте PowerShell в папке проекта и выполните:

```powershell
git init
git add .
git commit -m "Initial commit: Vladivostok guide site"
git branch -M main
git remote add origin https://github.com/<ваш_логин>/<имя_репо>.git
git push -u origin main
```

### 3) Включите Pages

На GitHub:

- Settings → Pages
- **Source**: `Deploy from a branch`
- **Branch**: `main` / `(root)`
- Save

Через минуту сайт будет доступен по адресу вида:
`https://<ваш_логин>.github.io/<имя_репо>/`

## SEO (индексация)

В репозитории уже добавлены:

- `robots.txt`
- `sitemap.xml`
- расширенные мета‑теги, `canonical`, Open Graph и JSON‑LD разметка в `index.html`

После публикации можно отправить сайт в поиск через панели вебмастера (по желанию):

- Google Search Console
- Яндекс.Вебмастер

## Структура

- `index.html` — разметка и контент
- `styles.css` — дизайн
- `script.js` — фильтры мест и генератор плана на день
- `robots.txt` — правила для поисковых роботов
- `sitemap.xml` — карта сайта
- `404.html` — страница “не найдено” для GitHub Pages

