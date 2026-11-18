// Общие шаблоны шапки и подвала. Изменения здесь применяются ко всем страницам.
(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  const gameMenuItems = `
<li><a class="dropdown-item" href="games/cs2.html">Counter-Strike 2</a></li>
                  <li><a class="dropdown-item" href="games/stardew-valley.html">Stardew Valley</a></li>
                  <li><a class="dropdown-item" href="games/oneshot.html">OneShot</a></li>
                  <li><a class="dropdown-item" href="games/barotrauma.html">Barotrauma</a></li>
                  <li><a class="dropdown-item" href="games/nine-sols.html">Nine Sols</a></li>
                  <li><a class="dropdown-item" href="games/celeste.html">Celeste</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="product.html">В центре внимания: CS2</a></li>
`;
  const navTemplate = `
<nav class="navbar navbar-expand-lg py-3" aria-label="Основная навигация">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center gap-3" href="index.html">
            <img class="brand-mark" src="images/preview.jpg" width="45" height="45" alt="">
            <span class="brand-name">GAME COMMUNITY</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Открыть или закрыть меню"><span class="navbar-toggler-icon"></span></button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-lg-3 gap-lg-1 mt-3 mt-lg-0">
              <li class="nav-item"><a class="nav-link" href="index.html">Сообщества</a></li>
              <li class="nav-item"><a class="nav-link" href="catalog.html">Игры</a></li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Игровые центры</a>
                <ul class="dropdown-menu">
                  ${gameMenuItems}
                </ul>
              </li>
              <li class="nav-item"><a class="nav-link" href="about.html">О сайте</a></li>
            </ul>
            <div class="header-actions d-flex flex-wrap align-items-center gap-2 ms-lg-auto mt-3 mt-lg-0">
              <button class="btn btn-outline-secondary theme-toggle d-inline-flex align-items-center gap-2" type="button" data-theme-toggle aria-label="Включить светлую тему" aria-pressed="false"><svg data-theme-sun width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></svg><svg data-theme-moon width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" hidden><path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/></svg><span data-theme-label>Светлая тема</span></button>
              <a class="btn btn-primary site-join-button" href="profile.html">Профиль</a>
            </div>
          </div>
        </div>
      </nav>
`;
  const footerTemplate = `
<div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-12 col-lg-4">
            <a class="footer-logo d-inline-flex align-items-center gap-3" href="index.html">
              <img class="footer-preview" src="images/preview.jpg" width="64" height="64" alt="" loading="lazy">
              <span class="footer-name">GAME COMMUNITY</span>
            </a>
            <p class="footer-slogan small text-body-secondary mt-3 mb-0">Миры, истории и люди, которые любят играть.</p>
          </div>
          <div class="col-12 col-md-6 col-lg-4 text-lg-center">
            <nav class="footer-nav d-flex flex-wrap gap-2 justify-content-lg-center" aria-label="Навигация в подвале">
              <a class="btn btn-outline-secondary btn-sm" href="index.html">Сообщества</a>
              <a class="btn btn-outline-secondary btn-sm" href="catalog.html">Игры</a>
              <a class="btn btn-outline-secondary btn-sm" href="about.html">О сайте</a>
              <div class="dropup">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="footerGameCenters" data-bs-toggle="dropdown" aria-expanded="false">Игровые центры</button>
                <ul class="dropdown-menu" aria-labelledby="footerGameCenters">
                  ${gameMenuItems}
                </ul>
              </div>
            </nav>
          </div>
          <div class="col-12 col-md-6 col-lg-4 footer-contact-column">
            <address class="footer-contacts d-flex flex-column align-items-start gap-3 mb-0">
              <span class="footer-contact"><svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg><span>game-community@mail.ru</span></span>
              <span class="footer-contact"><svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="m21 3-4 18-6-6-4 3 1-7L21 3ZM8 11l9-5-6 9M3 9l18-6-13 8-5-2Z"/></svg><span>Наш Telegram-канал</span></span>
              <span class="footer-contact"><svg class="contact-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor"/><path d="m5 8 3 8h2l2-8M14 8v8m5-8-5 4 5 4" stroke="#171326" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Наше сообщество ВК</span></span>
            </address>
            <div class="mt-4"><a class="btn btn-primary footer-join" href="profile.html">Профиль</a></div>
          </div>
        </div>
        <p class="footer-copyright small text-body-secondary text-center">&copy; 2026 Game Community Все права защищены.</p>
      </div>
`;

  const mount = (selector, markup) => {
    const host = document.querySelector(selector);
    if (!host) return;
    const template = document.createElement('template');
    // Разметка статична и принадлежит проекту; пользовательские данные сюда не попадают.
    template.innerHTML = markup;
    template.content.querySelectorAll('[href], [src]').forEach(node => {
      ['href', 'src'].forEach(attribute => {
        const value = node.getAttribute(attribute);
        if (!value || value.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return;
        node.setAttribute(attribute, new URL(value, siteRoot).href);
      });
    });
    host.replaceChildren(template.content);
  };
  mount('[data-site-header]', navTemplate);
  mount('[data-site-footer]', footerTemplate);

  const normalize = (url) => {
    const parsed = new URL(url, siteRoot);
    if (parsed.pathname.endsWith('/')) parsed.pathname += 'index.html';
    return parsed.origin + parsed.pathname;
  };
  const currentPage = normalize(location.href);
  document.querySelectorAll('[data-site-header] a, [data-site-footer] a').forEach(link => {
    if (!link.matches('.nav-link, .dropdown-item, .site-join-button, .footer-nav a')) return;
    if (!link.hasAttribute('href') || link.getAttribute('href').startsWith('#')) return;
    const active = !new URL(link.href).hash && normalize(link.href) === currentPage;
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    if (link.matches('.nav-link, .dropdown-item')) link.classList.toggle('active', active);
  });
  const activeGame = document.querySelector('[data-site-header] .dropdown-item[aria-current="page"]');
  document.querySelector('[data-site-header] .dropdown-toggle')?.classList.toggle('active', Boolean(activeGame));
  document.dispatchEvent(new Event('layoutready'));
})();
