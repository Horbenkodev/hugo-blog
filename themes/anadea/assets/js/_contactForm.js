import { parseCookie } from './utils/parseCookie';
import { truncateText } from './utils/truncateText';

function processContactForm() {
  const contactForm = document.getElementById('contact_form');

  // add guid field
  var guid = parseCookie(document.cookie)._ga;
  var guidField = document.createElement('input');
  guidField.setAttribute('type', 'hidden');
  guidField.setAttribute('name', 'guid');
  guidField.setAttribute('value', guid);
  contactForm.appendChild(guidField);

  // change attachment file name
  const fileField = contactForm.querySelector('#file');
  const label = contactForm.querySelector('.contacts__label');
  const fileLabel = contactForm.querySelector('#file-label');

  fileField.addEventListener('change', function (event) {
    if (event.target.files.length > 0) {
      label.textContent = `${event.target.files[0].name}`;
    } else {
      label.textContent = 'Attach file';
    }

    const fileName = event.target.files[0].name;
    fileLabel.textContent = truncateText(fileName, 20);
  });

  // add remote IP field
  fetch('https://api.ipify.org?format=json')
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      var remoteIPField = document.createElement('input');
      remoteIPField.setAttribute('type', 'hidden');
      remoteIPField.setAttribute('name', 'remote_ip');
      remoteIPField.setAttribute('value', json.ip);
      document.getElementById('contact_form').appendChild(remoteIPField);
    })
    .catch(function (err) {
      console.error('Error getting IP Address: '.concat(err));
    });

  // init GTM listener
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
          var gclidField = document.createElement('input');
          gclidField.setAttribute('type', 'hidden');
          gclidField.setAttribute('name', 'gclid');
          gclidField.setAttribute('value', client_id);
          contactForm.appendChild(gclidField);
        }
      }
    };
  }

  // add referrer url field
  var referrerField = document.createElement('input');
  referrerField.setAttribute('type', 'hidden');
  referrerField.setAttribute('name', 'referer_url');
  referrerField.setAttribute('value', document.referrer);
  contactForm.appendChild(referrerField);

  if (!('first-url' in localStorage)) {
    localStorage.setItem('first-url', window.location.href);
  }

  // submit form
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);

    if (document.getElementsByName('first_url').length == 0) {
      var firstUrlField = document.createElement('input');
      firstUrlField.setAttribute('type', 'hidden');
      firstUrlField.setAttribute('name', 'first_url');
      firstUrlField.setAttribute('value', localStorage.getItem('first-url'));
      document.getElementById('contact_form').appendChild(firstUrlField);
      localStorage.removeItem('first-url');
    }

    fetch('https://anadea.info/webhooks/blog_contacts/some_cool_token', {
      body: formData,
      method: 'POST',
    }).then((response) => {
      console.log(response);
    });
  }

  contactForm.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', processContactForm);
