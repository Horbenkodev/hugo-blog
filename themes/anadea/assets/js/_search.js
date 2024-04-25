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

const fuseOptions = {
  keys: ['title'],
};

const result = data.then((json) => {
  const fuse = new Fuse(json, fuseOptions);
  const searchPattern = token;
  return fuse.search(searchPattern);
});

document.addEventListener('DOMContentLoaded', () => {
  const searchField = document.querySelector('.filters__search');
  searchField.value = token;
  const searchResults = document.querySelector('#searchResults');
  result.then((collection) => {
    if (collection.length > 0) {
      let itemList = '';
      for (let i = 0; i < collection.length; i++) {
        itemList += `<div style="color:red">${collection[i].item.title}</div>
                     <div style="color:red">${collection[i].item.description}</div>`;
      }
      searchResults.innerHTML = itemList;
    } else {
      searchResults.innerHTML = '';
    }
  });
});
