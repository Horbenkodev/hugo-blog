function burgerToggler() {
  let isActive = false;

  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.header__mobileMenu');
  const shadow = document.querySelector('.header__shadow');

  function activate() {
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', isActive);
    menu.classList.add('active');
    shadow.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function deactivate() {
    document.body.style.overflow = '';
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', isActive);
    menu.classList.remove('active');
    shadow.classList.remove('active');
  }

  function handleClick() {
    isActive = !isActive;

    if (isActive) {
      activate();
    } else {
      deactivate();
    }
  }

  burger.addEventListener('click', handleClick);
  shadow.addEventListener('click', handleClick);
  window.addEventListener('resize', deactivate);
}

function menuHover() {
  function hideAllHoverBlocks() {
    document.querySelectorAll('.hover__block__container').forEach((block) => {
      block.style.display = 'none';
    });
  }

  document.querySelectorAll('.menu__item').forEach((item) => {
    item.addEventListener('mouseenter', (event) => {
      hideAllHoverBlocks();

      const blockType = event.currentTarget.getAttribute('data-hover-block');
      const targetBlock = document.getElementById(blockType);

      if (targetBlock) {
        targetBlock.style.display = 'block';
      }
    });
  });

  document.querySelectorAll('.hover__block__container').forEach((container) => {
    container.addEventListener('mouseleave', hideAllHoverBlocks);
  });
}

function mobileMenuToggle() {
  const menuItems = document.querySelectorAll('.mobileMenu__item');

  menuItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      const currentItem = event.currentTarget;
      const subMenu = currentItem.nextElementSibling;

      const isActive = currentItem.classList.contains('mobileMenu__item--isActive');

      document.querySelectorAll('.mobileMenu__subMenu').forEach((menu) => {
        menu.classList.remove('mobileMenu__subMenu--isActive');
      });

      menuItems.forEach((button) => button.classList.remove('mobileMenu__item--isActive'));

      if (!isActive) {
        if (subMenu && subMenu.classList.contains('mobileMenu__subMenu')) {
          subMenu.classList.add('mobileMenu__subMenu--isActive');
          currentItem.classList.add('mobileMenu__item--isActive');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', mobileMenuToggle, { once: true });
document.addEventListener('DOMContentLoaded', menuHover, { once: true });
document.addEventListener('DOMContentLoaded', burgerToggler, { once: true });
