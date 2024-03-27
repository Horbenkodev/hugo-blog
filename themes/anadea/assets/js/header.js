function burgerToggler () {
  const controls = document.querySelectorAll('.header__burger')
  let isActive = false

  controls.forEach((element) => {
    element.addEventListener('click', () => {
      const inner = document.querySelector('.header__inner')
      const menu = document.querySelector('.header__menu')
      const shadow = document.querySelector('.header__shadow')
      inner.classList.toggle('active')
      menu.classList.toggle('active')
      shadow.classList.toggle('active')

      isActive = !isActive

      if (isActive) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', burgerToggler)
