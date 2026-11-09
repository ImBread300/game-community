// Фильтры ленты не затрагивают описание и характеристики игры.
const contentFilters = document.querySelectorAll('[data-content-filter]');
if (contentFilters.length) {
  const cards = document.querySelectorAll('[data-content-type]');
  const count = document.querySelector('#content-count');
  const empty = document.querySelector('#content-empty');
  contentFilters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.contentFilter;
    contentFilters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.contentType !== category;
      if (!card.hidden) visible += 1;
    });
    count.textContent = `Материалов: ${visible}`;
    empty.hidden = visible !== 0;
  }));
}

// Выбор игры по ссылке из игрового центра. Допускаются только значения select.
const fullGameSelect = document.querySelector('#join-game');
if (fullGameSelect) {
  const requested = new URLSearchParams(window.location.search).get('game');
  if ([...fullGameSelect.options].some((option) => option.value === requested)) {
    fullGameSelect.value = requested;
  }
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

// Проверка полей и подтверждение заполнения заявки.
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
    showNikoFeedback(form, 'filling', 'Давайте знакомиться', 'Выберите сообщество и расскажите немного о себе.');
  }
  const clearState = () => {
    form.classList.remove('was-validated');
    result.hidden = true;
    form.querySelectorAll('[data-trim]').forEach((field) => field.setCustomValidity(''));
    showNikoFeedback(form, 'neutral', 'Начнём сначала', 'Форма очищена. Можно выбрать игру и заполнить заявку заново.');
  };
  form.addEventListener('reset', clearState);
  form.addEventListener('input', (event) => {
    if (event.target.matches('[data-trim]')) event.target.setCustomValidity('');
    // После ошибки сохраняем грустный портрет до следующей успешной проверки.
    if (result.dataset.emotion !== 'sad' && result.dataset.emotion !== 'filling') {
      showNikoFeedback(form, 'filling', 'Заполняем заявку', 'Продолжайте заполнение, а затем нажмите «Подготовить заявку».');
    }
  });
  form.elements.namedItem('game').addEventListener('change', (event) => {
    const game = event.target;
    if (!game.value || result.dataset.emotion === 'sad') return;
    showNikoFeedback(form, 'filling', 'Отличный выбор!', `Сообщество «${game.selectedOptions[0].textContent.trim()}». Расскажите немного о себе, чтобы присоединиться.`);
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
      showNikoFeedback(form, 'sad', 'Попробуем ещё раз', `Проверьте поле «${fieldName}» и остальные отмеченные поля. Давайте исправим заявку вместе.`);
      invalidField.focus({ preventScroll: true });
      result.scrollIntoView({ block: 'nearest' });
      return;
    }
    const name = form.elements.namedItem('name').value;
    const game = form.elements.namedItem('game');
    const title = game.selectedOptions[0].textContent.trim();
    showNikoFeedback(form, 'happy', 'Получилось!', `${name}, заявка в сообщество «${title}» подготовлена.`);
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest' });
  });
});

// Каждое открытие модального окна начинает новую заявку на выбранную игру.
const joinModal = document.querySelector('#joinModal');
if (joinModal) {
  joinModal.addEventListener('show.bs.modal', (event) => {
    const form = joinModal.querySelector('form');
    form.reset();
    const selected = event.relatedTarget?.dataset.game;
    const select = form.elements.namedItem('game');
    if ([...select.options].some((option) => option.value === selected)) select.value = selected;
    const gameTitle = select.value ? `Вы выбрали сообщество «${select.selectedOptions[0].textContent.trim()}». ` : '';
    showNikoFeedback(form, 'filling', 'Давайте знакомиться', `${gameTitle}Укажите имя, e-mail и подтвердите согласие.`);
  });
  joinModal.addEventListener('shown.bs.modal', () => {
    joinModal.querySelector('input')?.focus();
  });
}
