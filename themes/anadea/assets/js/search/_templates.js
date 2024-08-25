const categoriesHTML = (collection) =>
  collection.map((category) => `<a href="${category.url}" class="tag">${category.title}</a>`).join('');

const industriesHTML = (collection) =>
  collection.map((industry) => `<a href="${industry.url}" class="tag">${industry.title}</a>`).join('');

const authorsHTML = (collection) =>
  collection
    .map(
      (author) =>
        `<a class="postInfo__link" href="${author.url}">${author.title}</a><div class="postInfo__bullet"></div>`,
    )
    .join('');

export const postCardHTML = (item) => {
  const categories = categoriesHTML(item.categoriesData || []);
  const industries = industriesHTML(item.industriesData || []);
  const authors = authorsHTML((item.authors && item.authors[0] && [item.authors[0]]) || []);

  const formattedDate = new Date(item.publishDate).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `<article class="postCard">
  <div class="postCard__content">
    <div class="postCard__head">
      <img class="postCard__image"
        src="${item.permalink}${item.image}"
        srcset="${item.srcset}"
        width="360"
        height="280"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
      />
    </div>
    <div class="postCard__caption">
      <div class="postInfo">
          ${authors}
        <time class="postInfo__date">${formattedDate}</time>
      </div>

      <h2 class="postCard__title">
        <a href="${item.permalink}" class="postCard__link">
          ${item.title}
        </a>
      </h2>
      <p class="postCard__description">${item.description}</p>
      <div class="postCard__tags">
        ${categories}
        ${industries}
      </div>
    </div>
  </div>
  </article>`;
};

export const noResultHTML = () => {
  return `
    <div class="emptyState">
      <h2 class="emptyState__title">Oops, we didn't find what you were looking for</h2>
      <p class="emptyState__text">Try different keywords or make sure all words are spelled correctly</p>
      <img class="emptyState__img" src="/blog/img/no-result-image.svg" alt=""></img>
    </div>
  `;
};

export const resetHTML = () => {
  return `
  <div class="emptyState">
    <h2 class="emptyState__title">Your search is clear</h2>
    <p class="emptyState__text">What hidden gems will you discover next?</p>
    <a class="emptyState__button" href="/blog/">Go back to Blog<a/>
    <img class="emptyState__img" src="/blog/img/search-reset-image.svg" alt=""></img>
  </div>
  `;
};
