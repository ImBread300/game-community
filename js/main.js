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

// Проверка полей и подтверждение заполнения заявки.
const forms = document.querySelectorAll('[data-application-form]');
forms.forEach((form) => {
  const result = form.querySelector('[data-form-result]');
  const clearState = () => {
    form.classList.remove('was-validated');
    result.hidden = true;
    form.querySelectorAll('[data-trim]').forEach((field) => field.setCustomValidity(''));
  };
  form.addEventListener('reset', clearState);
  form.addEventListener('input', (event) => {
    result.hidden = true;
    if (event.target.matches('[data-trim]')) event.target.setCustomValidity('');
  });
  form.addEventListener('change', () => { result.hidden = true; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.hidden = true;
    form.querySelectorAll('input[type="text"], input[type="email"]').forEach((field) => {
      field.value = field.value.trim();
    });
    form.querySelectorAll('[data-trim]').forEach((field) => {
      field.setCustomValidity(field.value.length < field.minLength ? 'Введите не менее двух символов.' : '');
    });
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return;
    }
    const name = form.elements.namedItem('name').value;
    const game = form.elements.namedItem('game');
    const title = game.selectedOptions[0].textContent.trim();
    // textContent не интерпретирует пользовательские строки как HTML.
    result.textContent = `${name}, заявка в сообщество «${title}» подготовлена.`;
    result.hidden = false;
    result.focus();
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
  });
  joinModal.addEventListener('shown.bs.modal', () => {
    joinModal.querySelector('input')?.focus();
  });
}
