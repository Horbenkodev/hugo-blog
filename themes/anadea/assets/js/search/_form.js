import { toKebabCase } from '../_utils';

function initForm() {
  const search = document.getElementById('search');

  search.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new URLSearchParams(new FormData(search));
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
