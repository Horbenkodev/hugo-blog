export function createField(name, value, contactForm) {
  var field = document.createElement('input');
  field.setAttribute('type', 'hidden');
  field.setAttribute('name', name);
  field.setAttribute('value', value);
  contactForm.appendChild(field);
}
