import Fuse from 'fuse.js';
import { postCardHTML } from './_templates';

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
const token = params.get('token') || '';
const categories = params.get('categories') || '';
const industries = params.get('industries') || '';

const fuseOptions = {
  keys: ['title', 'categories', 'industries'],
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 3,
  threshold: 0.3,
};

const result = data.then((json) => {
  const fuse = new Fuse(json, fuseOptions);
  const searchPattern = { $or: [{ title: token }, { categories }, { industries }] };
  return fuse.search(searchPattern);
});

document.addEventListener('DOMContentLoaded', () => {
  const searchField = document.querySelector('.filters__search');
  const categoryField = document.getElementById('categories');
  const industryField = document.getElementById('industries');
  const searchResults = document.querySelector('#searchResults');

  searchField.value = token;
  categoryField.value = categories;
  industryField.value = industries;

  result.then((collection) => {
    const itemList = collection.map(({ item }) => postCardHTML(item)).join('');

    if (itemList.length > 0) {
      const postFeed = document.createElement('div');
      postFeed.className = 'postFeed';
      postFeed.innerHTML = itemList;
      searchResults.insertAdjacentElement('afterbegin', postFeed);
    } else {
      searchResults.innerHTML = `<h1>No results matched your search</h1>`;
    }
  });
});
