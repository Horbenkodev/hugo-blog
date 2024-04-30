import Fuse from 'fuse.js';

const data = fetch('/index.json', { cache: 'force-cache' })
  .then((response) => response.json())
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

const queryString = window.location.search;

const params = new URLSearchParams(queryString);
const token = params.get('token');
const categories = params.get('categories');
const industries = params.get('industries');

const fuseOptions = {
  keys: ['title', 'categories', 'industries'],
};

const result = data.then((json) => {
  const fuse = new Fuse(json, fuseOptions);
  const searchPattern = token || (categories && industries) || (token && categories) || (token && industries);
  return fuse.search(searchPattern);
});

document.addEventListener('DOMContentLoaded', () => {
  const searchField = document.querySelector('.filters__search');
  const categoryField = document.getElementById('categories');
  const industryField = document.getElementById('industries');
  searchField.value = token;
  categoryField.value = categories;
  industryField.value = industries;

  const searchResults = document.querySelector('#searchResults');
  result.then((collection) => {
    if (collection.length > 0) {
      let itemList = '';
      for (let i = 0; i < collection.length; i++) {
        const item = collection[i].item;

        const categories = item.categories || [];
        const industries = item.industries || [];

        let categoriesHTML = '';
        let industriesHTML = '';

        categories.forEach((category) => {
          categoriesHTML += `<a href="#" class="tag">${category}</a>`;
        });

        industries.forEach((industry) => {
          industriesHTML += `<a href="#" class="tag">${industry}</a>`;
        });
        itemList += `<article class="postCard">
        <div class="postCard__content">
          <div class="postCard__caption">
            <img class="postCard__image" src="${item.permalink}${item.image}" />
            <div class="postInfo">
                <span class="postInfo__link">Author Name</span>
                <div class="postInfo__bullet"></div>
              <time class="postInfo__date" datetime="${item.PublishDate}">Mar 01 1999</time>
            </div>

            <h2 class="postCard__title">
              <a href="${item.permalink}" class="postCard__link">
                ${item.title}
              </a>
            </h2>
            <p class="postCard__description">${item.description}</p>
            <div class="postCard__tags">
              ${categoriesHTML}
              ${industriesHTML}
            </div>
          </div>
        </div>
      </article>`;
      }
      searchResults.innerHTML = itemList;
    } else {
      searchResults.innerHTML = '';
    }
  });
});
