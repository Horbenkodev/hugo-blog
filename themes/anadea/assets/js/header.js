function burgerToggler () {
  const controls = document.querySelectorAll('.header__burger')
  let isActive = false

  const inner = document.querySelector('.header__inner')
  const menu = document.querySelector('.header__menu')
  const shadow = document.querySelector('.header__shadow')

  function activate () {
    inner.classList.add('active')
    menu.classList.add('active')
    shadow.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function deactivate () {
    document.body.style.overflow = ''
    inner.classList.remove('active')
    menu.classList.remove('active')
    shadow.classList.remove('active')
  }

  controls.forEach((element) => {
    element.addEventListener('click', () => {
      isActive = !isActive

      if (isActive) {
        activate()
      } else {
        deactivate()
      }
    })
  })

  window.addEventListener('resize', deactivate)
}

document.addEventListener('DOMContentLoaded', burgerToggler)
