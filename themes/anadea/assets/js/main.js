function questionToggler () {
  const controls = document.querySelectorAll('.questions__control')

  controls.forEach((element) => {
    element.addEventListener('click', () => {
      const id = element.dataset.id
      const indicator = document.querySelector(`[data-indicator="${id}"]`)
      const answer = document.querySelector(`[data-answer="${id}"]`)
      const isExpanded = element.getAttribute('aria-expanded') === 'false'

      element.setAttribute('aria-expanded', isExpanded)
      indicator.classList.toggle('indicator__active')
      answer.classList.toggle('questions__foldable--active')
    })
  })
}

document.addEventListener('DOMContentLoaded', questionToggler)
