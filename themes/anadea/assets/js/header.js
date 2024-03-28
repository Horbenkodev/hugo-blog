function burgerToggler () {
  let isActive = false

  const burger = document.querySelector('.burger')
  const menu = document.querySelector('.header__menu')
  const shadow = document.querySelector('.header__shadow')

  function activate () {
    burger.classList.add('active')
    burger.setAttribute('aria-expanded', isActive)
    menu.classList.add('active')
    shadow.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function deactivate () {
    document.body.style.overflow = ''
    burger.classList.remove('active')
    burger.setAttribute('aria-expanded', isActive)
    menu.classList.remove('active')
    shadow.classList.remove('active')
  }

  burger.addEventListener('click', () => {
    isActive = !isActive

    if (isActive) {
      activate()
    } else {
      deactivate()
    }
  })

  window.addEventListener('resize', deactivate)
}

document.addEventListener('DOMContentLoaded', burgerToggler)
