updateTheme();

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const toggle = document.getElementById('dark-mode-toggle');
    toggle.addEventListener('click', () => {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        localStorage['dark-mode-storage'] = 'light';
      } else {
        localStorage['dark-mode-storage'] = 'dark';
      }
      updateTheme();
    });
  },
  { once: true },
);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  delete localStorage['dark-mode-storage'];
  updateTheme();
});

window.addEventListener('storage', (event) => {
  if (event.key === 'dark-mode-storage') {
    updateTheme();
  }
});

function updateTheme() {
  const userPreference = localStorage['dark-mode-storage'];
  if (userPreference === 'dark' || userPreference === 'light') {
    setTheme(userPreference);
  } else {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
}
