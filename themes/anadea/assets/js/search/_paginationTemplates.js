export function prevButton(prev) {
  const hasPrev = Boolean(prev);
  const href = hasPrev ? `href="${prev}"` : '';
  const disabled = hasPrev ? '' : `aria-disabled="true"`;
  return `
    <li class="pagination__item ${hasPrev ? '' : 'disabled'}">
      <a ${href} ${disabled} aria-label="Previous" class="pagination__link pagination__link--prev" role="button" ${hasPrev ? '' : 'tabindex="-1"'}>
        <span aria-hidden="true"><&nbsp;Prev</span>
      </a>
    </li>
  `;
}

export function nextButton(next) {
  const hasNext = Boolean(next);
  const href = hasNext ? `href="${next}"` : '';
  const disabled = hasNext ? '' : `aria-disabled="true"`;
  return `
    <li class="pagination__item ${hasNext ? '' : 'disabled'}">
      <a ${href} ${disabled} aria-label="Next" class="pagination__link pagination__link--next" role="button" ${hasNext ? '' : 'tabindex="-1"'}>
        <span aria-hidden="true">Next&nbsp;></span>
      </a>
    </li>
  `;
}

export function button({ page, url, label = '', current }) {
  const ariaLabel = label ? label : `Page ${page}`;
  return `
    <li class="pagination__item ${current ? 'active' : ''}">
      <a ${url ? `href="${url}"` : ''} aria-label="${ariaLabel}" class="pagination__link" role="button">${page}</a>
    </li>
  `;
}

export function placeholder() {
  return `<li class="pagination__item"><span class="pagination__ellipsis">...</span></li>`;
}
