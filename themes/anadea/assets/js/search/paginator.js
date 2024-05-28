import { button, prevButton, nextButton, placeholder } from './_paginationTemplates';

export function renderPagination(items, paginate) {
  const totalPages = Math.ceil(items / paginate);
  const pagination = document.getElementById('pagination');
  let start = 1;
  let end = totalPages / paginate;
  const SLOTS = 3;

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page')) || 1;

  function buildURL(page) {
    urlParams.set('page', page);
    return `${window.location.pathname}?${urlParams.toString()}`;
  }

  if (totalPages === 1 || !items) {
    pagination.parentElement.remove();
  }

  if (totalPages > 1) {
    if (totalPages > 5) {
      start = Math.max(1, currentPage - Math.floor(SLOTS / 2));
      end = Math.min(totalPages, start + SLOTS - 1);
      if (end - start + 1 < SLOTS) {
        start = Math.max(1, end - SLOTS + 1);
      }
    }

    for (let k = start; k <= end; k++) {
      if (currentPage === k) {
        pagination.insertAdjacentHTML('beforeend', button({ page: k, current: true }));
      } else {
        pagination.insertAdjacentHTML('beforeend', button({ page: k, url: buildURL(k) }));
      }
    }

    if (totalPages > 5) {
      if (SLOTS < currentPage) {
        pagination.insertAdjacentHTML('afterbegin', placeholder());
      }

      if (currentPage > 2) {
        pagination.insertAdjacentHTML('afterbegin', button({ label: 'First Page', page: 1, url: buildURL(1) }));
      }

      if (currentPage < totalPages - 1) {
        if (totalPages - SLOTS >= currentPage) {
          pagination.insertAdjacentHTML('beforeend', placeholder());
        }
        pagination.insertAdjacentHTML('beforeend', button({ page: totalPages, url: buildURL(totalPages) }));
      }
    }

    if (currentPage === start) {
      pagination.insertAdjacentHTML('afterbegin', prevButton(''));
    } else {
      pagination.insertAdjacentHTML('afterbegin', prevButton(buildURL(currentPage - 1)));
    }

    if (currentPage === end) {
      pagination.insertAdjacentHTML('beforeend', nextButton(''));
    } else {
      pagination.insertAdjacentHTML('beforeend', nextButton(buildURL(currentPage + 1)));
    }
  }
}
