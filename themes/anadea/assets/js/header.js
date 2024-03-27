function burgerToggler () {
  const controls = document.querySelectorAll('.headerMobile__burger')
  let isActive = false

  controls.forEach((element) => {
    element.addEventListener('click', () => {
      const inner = document.querySelector('.headerMobile__inner')
      const menu = document.querySelector('.headerMobile__menu')
      const shadow = document.querySelector('.headerMobile__shadow')
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
