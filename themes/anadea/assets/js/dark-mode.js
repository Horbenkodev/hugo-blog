updateTheme();

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const toggle = document.getElementById('dark-mode-toggle');
    toggle.addEventListener('click', () => {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        localStorage['theme-mode'] = 'light';
      } else {
        localStorage['theme-mode'] = 'dark';
      }
      updateTheme();
    });
  },
  { once: true },
);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  delete localStorage['theme-mode'];
  updateTheme();
});

window.addEventListener('storage', (event) => {
  if (event.key === 'theme-mode') {
    updateTheme();
  }
});

function updateTheme() {
  const userPreference = localStorage['theme-mode'];
  if (userPreference === 'dark' || userPreference === 'light') {
    setTheme(userPreference);
  } else {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
}
