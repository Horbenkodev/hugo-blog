import { parseCookie } from './utils/parseCookie';
import { truncateText } from './utils/truncateText';

function createField(name, value, contactForm) {
  var field = document.createElement('input');
  field.setAttribute('type', 'hidden');
  field.setAttribute('name', name);
  field.setAttribute('value', value);
  contactForm.appendChild(field);
}

function addGuidField(contactForm) {
  const guid = parseCookie(document.cookie)._ga;
  createField('guid', guid, contactForm);
}

function addFileNameChangeListener(contactForm) {
  const fileField = contactForm.querySelector('#file');
  const label = contactForm.querySelector('.contacts__label');
  const fileLabel = contactForm.querySelector('#file-label');

  fileField.addEventListener('change', (event) => {
    const fileName = event.target.files.length > 0 ? event.target.files[0].name : 'Attach file';
    label.textContent = fileName;
    fileLabel.textContent = truncateText(fileName, 20);
  });
}

function initGtmListener(contactForm) {
  if (window.dataLayer) {
    var oldPush = window.dataLayer.push;
    window.dataLayer.push = function () {
      oldPush.apply(window.dataLayer, arguments);
      if (
        Object.hasOwn(arguments[0], 'h') &&
        Object.hasOwn(arguments[0]['h'], 'event') &&
        arguments[0]['h']['event'] === 'gtagApiGet'
      ) {
        var client_id = arguments[0]['h']['gtagApiResult']['client_id'];
        if (document.getElementsByName('gclid').length == 0) {
          createField('gclid', client_id, contactForm);
        }
      }
    };
  }
}

function addReferrerUrlField(contactForm) {
  createField('referer_url', document.referrer, contactForm);
}

function addFirstUrlField(contactForm) {
  if (!localStorage.getItem('first-url')) {
    localStorage.setItem('first-url', window.location.href);
  }

  const localStorageItem = localStorage.getItem('first-url');
  createField('first_url', localStorageItem, contactForm);
  localStorage.removeItem('first-url');
}

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('https://anadea.info/webhooks/blog_contacts/some_cool_token', {
    body: formData,
    method: 'POST',
  }).then((response) => {
    console.log(response);
  });
}

function processContactForm() {
  const contactForm = document.getElementById('contact_form');

  addGuidField(contactForm);
  addFileNameChangeListener(contactForm);
  initGtmListener(contactForm);
  addReferrerUrlField(contactForm);
  addFirstUrlField(contactForm);

  // add remote IP field
  fetch('https://api.ipify.org?format=json')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      createField('remote_ip', json.ip, contactForm);
    })
    .catch(function (err) {
      console.error('Error getting IP Address: '.concat(err));
    });

  contactForm.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', processContactForm);
