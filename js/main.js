// Фильтры продолжают работать после перестановки избранных карточек.
const contentFilters = document.querySelectorAll('[data-content-filter]');
if (contentFilters.length) {
  const cards = document.querySelectorAll('[data-content-type]');
  const count = document.querySelector('#content-count');
  const empty = document.querySelector('#content-empty');
  const applyContentFilter = () => {
    const category = document.querySelector('[data-content-filter].active')?.dataset.contentFilter || 'all';
    let visible = 0;
    cards.forEach((card) => {
      const matches = category === 'all' || (category === 'favorites' ? card.dataset.favorite === 'true' : card.dataset.contentType === category);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = `Материалов: ${visible}`;
    empty.hidden = visible !== 0;
  };
  contentFilters.forEach((button) => button.addEventListener('click', () => {
    contentFilters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    applyContentFilter();
    document.querySelector('#game-feed')?.scrollIntoView({ block: 'start' });
  }));
  document.addEventListener('favoriteschange', applyContentFilter);
}

// Оригинальные диалоговые портреты загружаются локально, в том числе на страницах games/.
const nikoImageBase = new URL('../images/niko/', document.currentScript.src);
const nikoEmotions = {
  sad: { file: 'niko_sad.png', alt: 'Грустный Нико', variant: 'alert-danger' },
  filling: { file: 'niko5.png', alt: 'Улыбающийся Нико', variant: 'alert-info' },
  happy: { file: 'niko_pancakes.png', alt: 'Радостный Нико', variant: 'alert-success' },
  neutral: { file: 'niko.png', alt: 'Нико', variant: 'alert-secondary' },
  surprised: { file: 'niko_pancakes.png', alt: 'Удивлённый Нико', variant: 'alert-info' },
};

function showNikoFeedback(form, emotion, title, message) {
  const result = form.querySelector('[data-form-result]');
  result.querySelectorAll('.niko-dialogue > a').forEach(link => link.remove());
  const state = nikoEmotions[emotion];
  const portrait = result.querySelector('[data-niko-portrait]');
  portrait.src = new URL(state.file, nikoImageBase).href;
  portrait.alt = state.alt;
  result.classList.remove('alert-success', 'alert-danger', 'alert-secondary', 'alert-info');
  result.classList.add(state.variant);
  result.dataset.emotion = emotion;
  result.querySelector('[data-niko-title]').textContent = title;
  // Пользовательское имя и название игры выводятся только как текст.
  result.querySelector('[data-niko-message]').textContent = message;
  result.hidden = false;
}

// Проверка полей и сохранение общего профиля.
const forms = document.querySelectorAll('[data-application-form]');
forms.forEach((form) => {
  const result = form.querySelector('[data-form-result]');
  result.classList.add('niko-feedback');
  result.setAttribute('aria-atomic', 'true');
  const portrait = document.createElement('img');
  portrait.className = 'niko-portrait';
  portrait.width = 96;
  portrait.height = 96;
  portrait.dataset.nikoPortrait = '';
  const dialogue = document.createElement('div');
  dialogue.className = 'niko-dialogue';
  const title = document.createElement('strong');
  title.dataset.nikoTitle = '';
  const message = document.createElement('p');
  message.className = 'mb-0 mt-1';
  message.dataset.nikoMessage = '';
  dialogue.append(title, message);
  result.replaceChildren(portrait, dialogue);
  if (!form.closest('.modal')) {
    showNikoFeedback(form, 'filling', 'Давайте знакомиться', 'Расскажите о себе и сохраните профиль.');
  }
  const clearState = () => {
    form.classList.remove('was-validated');
    result.hidden = true;
    form.querySelectorAll('[data-trim]').forEach((field) => field.setCustomValidity(''));
    showNikoFeedback(form, 'neutral', 'Начнём сначала', 'Форма очищена. Заполните данные профиля заново.');
  };
  form.addEventListener('reset', clearState);
  form.addEventListener('input', (event) => {
    if (event.target.matches('[data-trim]')) event.target.setCustomValidity('');
    // После ошибки сохраняем грустный портрет до следующей успешной проверки.
    if (result.dataset.emotion !== 'sad' && result.dataset.emotion !== 'filling') {
      showNikoFeedback(form, 'filling', 'Заполняем профиль', 'Продолжайте заполнение, а затем нажмите «Сохранить профиль».');
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.hidden = true;
    form.querySelectorAll('input[type="text"], input[type="email"]').forEach((field) => {
      field.value = field.value.trim();
    });
    form.querySelectorAll('[data-trim]').forEach((field) => {
      const tooShort = field.value.length < field.minLength && (field.required || field.value.length > 0);
      field.setCustomValidity(tooShort ? `Введите не менее ${field.minLength} символов.` : '');
    });
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      const invalidField = form.querySelector(':invalid');
      const label = form.querySelector(`label[for="${invalidField.id}"]`);
      const fieldName = label.textContent.replace('*', '').trim();
      showNikoFeedback(form, 'sad', 'Попробуем ещё раз', `Проверьте поле «${fieldName}» и остальные отмеченные поля. Давайте исправим данные вместе.`);
      invalidField.focus({ preventScroll: true });
      result.scrollIntoView({ block: 'nearest' });
      return;
    }
    const name = form.elements.namedItem('name').value;
    let previous = {};
    try { previous = JSON.parse(localStorage.getItem('game-community-profile')) || {}; } catch {}
    const profile = {
      name, email: form.elements.namedItem('email').value,
      nickname: form.elements.namedItem('nickname')?.value || (typeof previous.nickname === 'string' ? previous.nickname : ''),
      bio: form.elements.namedItem('comment')?.value.trim() ?? (typeof previous.bio === 'string' ? previous.bio : ''),
    };
    try { localStorage.setItem('game-community-profile', JSON.stringify(profile)); }
    catch { showNikoFeedback(form, 'sad', 'Не удалось сохранить', 'Браузер не разрешает сохранять данные. Проверьте настройки хранилища.'); return; }
    document.dispatchEvent(new Event('profilechange'));
    showNikoFeedback(form, 'happy', 'Получилось!', `${name}, профиль сохранён.`);
    const profileLink = document.createElement('a');
    profileLink.className = 'btn btn-outline-primary btn-sm mt-2';
    profileLink.href = new URL('../../profile.html', nikoImageBase).href;
    profileLink.textContent = 'Открыть профиль';
    result.querySelector('.niko-dialogue').append(profileLink);
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  });
});

// Короткая форма создаёт общий профиль независимо от страницы игры.
const joinModal = document.querySelector('#joinModal');
if (joinModal) {
  joinModal.addEventListener('show.bs.modal', (event) => {
    const form = joinModal.querySelector('form');
    form.reset();
    showNikoFeedback(form, 'filling', 'Давайте знакомиться', 'Укажите имя, e-mail и подтвердите согласие. Профиль общий для всех игр.');
  });
  joinModal.addEventListener('shown.bs.modal', () => {
    joinModal.querySelector('input')?.focus();
  });
}

// Рекомендации используют Bootstrap Carousel; управление паузой остаётся явным.
const recommendations = document.querySelector('#recommendedGames');
if (recommendations) {
  const carousel = new bootstrap.Carousel(recommendations, {
    interval: 6500, ride: false, pause: false, keyboard: true, touch: true,
  });
  const pauseButton = recommendations.querySelector('[data-carousel-pause]');
  const slides = recommendations.querySelector('.carousel-inner');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let hovered = false;
  let modalOpen = false;
  const updatePlayback = () => {
    const paused = userPaused || hovered || modalOpen || reducedMotion.matches || document.hidden || recommendations.contains(document.activeElement);
    if (paused) carousel.pause();
    else carousel.cycle();
    slides.setAttribute('aria-live', paused ? 'polite' : 'off');
    pauseButton.hidden = reducedMotion.matches;
    pauseButton.textContent = userPaused ? 'Включить смену' : 'Остановить смену';
    pauseButton.setAttribute('aria-pressed', String(userPaused));
  };
  pauseButton.addEventListener('click', () => { userPaused = !userPaused; updatePlayback(); });
  recommendations.addEventListener('mouseenter', () => { hovered = true; updatePlayback(); });
  recommendations.addEventListener('mouseleave', () => { hovered = false; updatePlayback(); });
  recommendations.addEventListener('focusin', updatePlayback);
  recommendations.addEventListener('focusout', () => setTimeout(updatePlayback, 0));
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
  joinModal?.addEventListener('show.bs.modal', () => { modalOpen = true; updatePlayback(); });
  joinModal?.addEventListener('hidden.bs.modal', () => { modalOpen = false; updatePlayback(); });
  updatePlayback();
}

// После создания профиля повторные приглашения ведут в существующий профиль.
(() => {
  const profileUrl = new URL('../../profile.html', nikoImageBase).href;
  const entries = new Map();
  const hasProfile = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('game-community-profile'));
      return Boolean(profile && typeof profile.name === 'string' && profile.name && typeof profile.email === 'string' && profile.email);
    } catch { return false; }
  };
  const updateEntries = () => {
    document.querySelectorAll('a, button').forEach(node => {
      if (node.textContent.trim() === 'Создать профиль' && !entries.has(node)) {
        entries.set(node, { text: node.textContent, href: node.getAttribute('href'), toggle: node.getAttribute('data-bs-toggle'), target: node.getAttribute('data-bs-target') });
        node.dataset.profileEntry = 'true';
      }
    });
    const created = hasProfile();
    entries.forEach((original, node) => {
      node.textContent = created ? 'В профиль' : original.text;
      for (const [attr, value] of [['href', created && node.tagName === 'A' ? profileUrl : original.href], ['data-bs-toggle', created ? null : original.toggle], ['data-bs-target', created ? null : original.target]]) {
        if (value === null) node.removeAttribute(attr);
        else node.setAttribute(attr, value);
      }
    });
  };
  document.addEventListener('click', event => {
    const entry = event.target.closest('[data-profile-entry]');
    if (!entry || !hasProfile()) return;
    // Обычные ссылки сохраняют открытие в новой вкладке; кнопки переходят сюда без модального окна.
    if (entry.tagName === 'A') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(profileUrl);
  }, true);
  document.addEventListener('profilechange', updateEntries);
  document.addEventListener('layoutready', updateEntries);
  window.addEventListener('storage', event => { if (event.key === 'game-community-profile' || event.key === null) updateEntries(); });
  updateEntries();
})();
