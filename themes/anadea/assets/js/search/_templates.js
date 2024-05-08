import { toKebabCase } from '../_utils';

const categoriesHTML = (collection) =>
  collection.map((category) => `<a href="/categories/${toKebabCase(category)}" class="tag">${category}</a>`).join('');

const industriesHTML = (collection) =>
  collection.map((industry) => `<a href="/industries/${toKebabCase(industry)}" class="tag">${industry}</a>`).join('');

const authorsHTML = (collection) =>
  collection
    .map(
      (author) =>
        `<a class="postInfo__link" href="/authors/${toKebabCase(author)}">${author}</a><div class="postInfo__bullet"></div>`,
    )
    .join('');

export const postCardHTML = (item) => {
  const categories = categoriesHTML(item.categories || []);
  const industries = industriesHTML(item.industries || []);
  const authors = authorsHTML((item.authors && [item.authors[0]]) || []);

  const formattedDate = new Date(item.publishdate).toLocaleDateString('en-EN', {
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
