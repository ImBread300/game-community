// Выбор читается до подключения CSS, чтобы при переходах не мигала другая тема.
(() => {
  const root = document.documentElement;
  const storageKey = 'game-community-theme';
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(storageKey); } catch { /* Тема работает и без хранилища. */ }
  root.dataset.bsTheme = savedTheme === 'light' ? 'light' : 'dark';

  const initializeToggle = () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button || button.dataset.themeBound === 'true') return;
    button.dataset.themeBound = 'true';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateButton = () => {
      const light = root.dataset.bsTheme === 'light';
      button.setAttribute('aria-pressed', String(light));
      button.setAttribute('aria-label', light ? 'Включить тёмную тему' : 'Включить светлую тему');
      button.querySelector('[data-theme-label]').textContent = light ? 'Тёмная тема' : 'Светлая тема';
      button.querySelector('[data-theme-sun]').toggleAttribute('hidden', light);
      button.querySelector('[data-theme-moon]').toggleAttribute('hidden', !light);
    };
    const applyTheme = (theme) => {
      root.dataset.bsTheme = theme;
      updateButton();
    };
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.bsTheme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(storageKey, nextTheme); } catch { /* Выбор остаётся на текущей странице. */ }
      if (!reducedMotion.matches && document.startViewTransition) {
        button.disabled = true;
        const transition = document.startViewTransition(() => applyTheme(nextTheme));
        transition.finished.finally(() => { button.disabled = false; });
      } else {
        if (!reducedMotion.matches) root.classList.add('theme-transition');
        applyTheme(nextTheme);
        window.setTimeout(() => root.classList.remove('theme-transition'), 400);
      }
    });
    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) applyTheme(event.newValue === 'light' ? 'light' : 'dark');
    });
    updateButton();
  };
  document.addEventListener('DOMContentLoaded', initializeToggle);
  document.addEventListener('layoutready', initializeToggle);
  if (document.readyState !== 'loading') initializeToggle();
})();
