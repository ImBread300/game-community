(() => {
  const read = () => { try { const p = JSON.parse(localStorage.getItem('game-community-profile')); return p && typeof p === 'object' ? p : {}; } catch { return {}; } };
  const renderProfile = () => {
    const p = read();
    const text = (selector, value) => { document.querySelector(selector).textContent = typeof value === 'string' ? value : ''; };
    text('[data-profile-name]', p.name || 'Ваш профиль');
    text('[data-profile-nickname]', p.nickname ? `@${p.nickname}` : 'Заполните данные профиля ниже.');
    text('[data-profile-bio]', p.bio); text('[data-profile-email]', p.email);
  };
  const p = read();
  for (const [field, key] of [['name','name'],['email','email'],['nickname','nickname'],['comment','bio']]) {
    const control = document.querySelector('form').elements.namedItem(field);
    if (control && typeof p[key] === 'string') control.value = p[key];
  }
  renderProfile();
  document.addEventListener('profilechange', renderProfile);
  const cards = [...document.querySelectorAll('#profile-games-grid > div')];
  const selected = card => card.querySelector('.favorite-toggle')?.getAttribute('aria-pressed') === 'true';
  let mode = cards.some(selected) ? 'favorites' : 'all';
  const renderGames = () => {
    let visible = 0;
    cards.forEach(card => { card.hidden = mode === 'favorites' && !selected(card); if (!card.hidden) visible++; });
    document.querySelectorAll('[data-profile-games]').forEach(button => {
      const active = button.dataset.profileGames === mode;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('[data-profile-game-count]').textContent = `Показано игр: ${visible} из ${cards.length}`;
    document.querySelector('[data-profile-empty]').hidden = visible !== 0;
  };
  document.querySelectorAll('[data-profile-games]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.profileGames; renderGames(); }));
  document.addEventListener('favoriteschange', renderGames);
  window.addEventListener('storage', event => { if (event.key === 'game-community-profile' || event.key === null) renderProfile(); });
  renderGames();
})();
