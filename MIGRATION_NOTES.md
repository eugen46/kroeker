# MIGRATION NOTES

## Отчёт обследования

- Стек: статический HTML/CSS/JS, без Jekyll/Hugo/Eleventy/Vite/Gulp.
- Деплой: GitHub Pages, репозиторий `kroeker-family/kroeker`, ветка `main`, стандартный workflow `pages-build-deployment`.
- Переводы: объект `T` в `script.js`, дополнительные SEO/контактные строки там же.
- Шаблонов не было: шапка, меню и футер были продублированы в HTML. Добавлен `build-site.mjs` как лёгкий статический генератор.

## Что изменено

- Созданы статические языковые версии `/de/`, `/ru/`, `/en/` для основных страниц.
- Основной контент теперь находится в HTML до запуска JavaScript.
- Добавлены `hreflang`, canonical, уникальные title/description, расширенные keywords.
- Добавлены `sitemap.xml`, `robots.txt`, `impressum.html`, `datenschutz.html`.
- Cookie consent оставлен до загрузки Google Analytics / Google Ads.
- Точные даты рождения живых людей и отчества убраны из HTML. GEDmatch Kit ID не публикуется в открытом HTML.
- Добавлены шаблоны `stories`, `places`, `documents`.
- Добавлен словарь внутренней перелинковки `link-dictionary.json`.

## Требуется решение

- Заменить `EUGEN_ADDRESS_PLACEHOLDER` и `EUGEN_EMAIL_PLACEHOLDER` в Impressum на реальные данные или согласованный юридический вариант.
- Получить письменное согласие у Любови К. на публикацию имени и года рождения, иначе оставить инициалы.
- Проверить текст Datenschutz у немецкого юриста или через сервис генерации Datenschutz/Impressum.
- Зарегистрировать сайт в Google Search Console и отправить новый `sitemap.xml`.
- GitHub Pages не даёт настоящие 301-редиректы без дополнительного сервера; старые URL сделаны через meta/JS redirect.
- Внешние валидаторы W3C/schema.org и Lighthouse нужно запускать после публикации, потому что они проверяют публичный URL.
