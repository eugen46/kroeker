/* v17 — Move search bar from inside .preview-header to a new container under it.
 * Idempotent: если уже перенесён — ничего не делает.
 * Срабатывает на DOMContentLoaded чтобы существующий script.js успел навесить
 * свои обработчики до перемещения (event-делегация это переживёт).
 */
(function moveSearchOutOfHeader(){
  function go(){
    var header = document.querySelector('.preview-header');
    if (!header) return;
    if (document.querySelector('.search-bar-outside')) return; // уже перенесли

    var search = header.querySelector('.header-search');
    if (!search) return;

    // Создаём контейнер
    var bar = document.createElement('div');
    bar.className = 'search-bar-outside';
    bar.appendChild(search);

    // Вставляем сразу после шапки
    if (header.nextSibling){
      header.parentNode.insertBefore(bar, header.nextSibling);
    } else {
      header.parentNode.appendChild(bar);
    }

    // Метка чтобы CSS убрал место под старый .header-search в шапке
    document.body.classList.add('search-moved');
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', go);
  } else {
    go();
  }
})();
