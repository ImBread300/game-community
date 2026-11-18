// Общие ключи синхронизируют избранное на главной, в каталоге и в игровых центрах.
(() => {
  const storageKey = 'game-community-favorites';
  const parse = (raw) => {
    try { const data = JSON.parse(raw); return new Set(Array.isArray(data) ? data.filter(key => typeof key === 'string') : []); }
    catch { return new Set(); }
  };
  let favorites;
  try { favorites = parse(localStorage.getItem(storageKey)); } catch { favorites = new Set(); }
  const buttons = [];
  const groups = new Map();
  const contentItems = [];
  const status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);
  const addGroupItem = (node, key) => {
    const parent = node.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    const items = groups.get(parent);
    items.push({ node, key, index: items.length });
  };
  const render = () => {
    buttons.forEach(({ button, key, label }) => {
      const selected = favorites.has(key);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? 'Убрать из избранного' : 'Добавить в избранное'}: ${label}`);
      button.classList.toggle('is-favorite', selected);
      button.querySelector('span').textContent = selected ? 'В избранном' : 'В избранное';
    });
    contentItems.forEach(({ node, key }) => { node.dataset.favorite = String(favorites.has(key)); });
    groups.forEach((items, parent) => {
      const sorted = [...items].sort((a, b) => Number(favorites.has(b.key)) - Number(favorites.has(a.key)) || a.index - b.index);
      // Меняем DOM-порядок только при необходимости: порядок клавиатурной навигации совпадает с экраном.
      const current = [...parent.children].filter(node => items.some(item => item.node === node));
      if (sorted.some((item, i) => item.node !== current[i])) sorted.forEach(item => parent.append(item.node));
    });
    document.dispatchEvent(new Event('favoriteschange'));
  };
  const addButton = (container, key, label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-secondary btn-sm favorite-toggle';
    button.dataset.favoriteKey = key;
    button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg><span></span>';
    button.addEventListener('click', () => {
      if (favorites.has(key)) favorites.delete(key);
      else favorites.add(key);
      let saved = true;
      try { localStorage.setItem(storageKey, JSON.stringify([...favorites])); } catch { saved = false; }
      render();
      if (button.closest('[hidden]')) document.querySelector('[data-content-filter].active')?.focus({ preventScroll: true });
      else button.focus({ preventScroll: true });
      status.textContent = `${label}: ${favorites.has(key) ? 'добавлено в избранное' : 'удалено из избранного'}.${saved ? '' : ' Выбор сохранён только до перезагрузки страницы.'}`;
    });
    container.append(button);
    buttons.push({ button, key, label });
  };
  document.querySelectorAll('.game-card, .recommendation-card').forEach(card => {
    const link = card.querySelector('a[href*="games/"]');
    const slug = link?.getAttribute('href').match(/games\/([^/]+)\.html/)?.[1];
    if (!slug) return;
    const label = card.querySelector('.card-title').textContent.trim();
    const container = card.querySelector('.card-body .d-flex.flex-wrap') || card.querySelector('.card-body');
    addButton(container, `game:${slug}`, label);
    if (card.classList.contains('game-card')) addGroupItem(card.parentElement, `game:${slug}`);
  });
  const overview = document.querySelector('.game-overview');
  if (overview) {
    const slug = document.body.className.match(/game-page-([a-z0-9-]+)/)?.[1];
    if (slug) addButton(overview.querySelector('.card-body .d-flex.flex-wrap'), `game:${slug}`, document.querySelector('h1').textContent.trim());
  }
  const game = document.body.className.match(/game-page-([a-z0-9-]+)/)?.[1];
  document.querySelectorAll('#content-grid > [data-content-type]').forEach(node => {
    const label = node.querySelector('h3').textContent.trim();
    const key = `content:${game}:${node.dataset.contentType}:${label}`;
    const card = node.querySelector('article.card');
    const tools = document.createElement('div');
    tools.className = 'card-header favorite-content-tools';
    addButton(tools, key, label);
    card.prepend(tools);
    contentItems.push({ node, key });
    addGroupItem(node, key);
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    favorites = parse(event.newValue);
    render();
  });
  render();
})();
