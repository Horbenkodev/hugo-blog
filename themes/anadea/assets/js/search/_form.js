import { toKebabCase } from '../_utils';

function initForm() {
  const search = document.getElementById('search');

  search.addEventListener('reset', () => {
    const pattern = new URL(document.location);

    if (pattern.pathname === '/search/') {
      window.location = '/search/';
    }
  });

  search.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(search);
    const filteredFormData = new FormData();

    for (const [key, value] of formData) {
      if (value) filteredFormData.set(key, value);
    }

    const data = new URLSearchParams(filteredFormData);
    const token = data.get('token');
    const categories = data.get('categories');
    const industries = data.get('industries');

    if (!token && !categories && !industries) {
      return;
    }

    if (token || (categories && industries)) {
      window.location = `/search/?${data.toString()}`;
      return;
    }

    const path = categories ? `/categories/${toKebabCase(categories)}` : `/industries/${toKebabCase(industries)}`;
    window.location = path;
  });
}

document.addEventListener('DOMContentLoaded', initForm);

// const pattern = new URLPattern({ hash: '/(collections)/(posts)/*' });
// if (pattern.test(document.location)) {
//   if (!shortcodes) {
//     document.querySelector('body').insertAdjacentHTML('beforeend', linkContainer);
//   }
//   return;
// }
