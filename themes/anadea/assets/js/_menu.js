function burgerToggle() {
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
  const submenuItems = document.querySelectorAll('.header__submenuItem');
  const menuItems = document.querySelectorAll('.menu__item');

  function hideAllSubMenuItems() {
    submenuItems.forEach((block) => {
      block.style.display = 'none';
    });

    menuItems.forEach((item) => {
      item.querySelector('.menu__link').classList.remove('active');
    });
  }

  function handleMenuItemMouseEvent(item) {
    const target = item.getAttribute('data-submenu-item');
    const submenuItem = document.getElementById(target);
    const link = item.querySelector('.menu__link');

    setTimeout(() => {
      if (submenuItem) {
        if (submenuItem.style.display === 'block') {
          submenuItem.style.display = 'none';
          link.classList.remove('active');
        } else {
          hideAllSubMenuItems();
          submenuItem.style.display = 'block';
          link.classList.add('active');
        }
      }
    }, 200);
  }

  menuItems.forEach((item) => {
    item.addEventListener('mouseenter', (event) => {
      handleMenuItemMouseEvent(event.currentTarget);
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleMenuItemMouseEvent(event.currentTarget);
      }
    });
  });

  submenuItems.forEach((container) => {
    container.addEventListener('mouseleave', hideAllSubMenuItems);
  });
}

function mobileMenuToggle() {
  const menuItems = document.querySelectorAll('.mobileMenu__item');
  const subMenus = document.querySelectorAll('.mobileMenu__subMenu');

  menuItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      const currentItem = event.currentTarget;
      const subMenu = currentItem.nextElementSibling;

      const isActive = currentItem.classList.contains('mobileMenu__item--isActive');

      subMenus.forEach((menu) => menu.classList.remove('mobileMenu__subMenu--isActive'));
      menuItems.forEach((button) => button.classList.remove('mobileMenu__item--isActive'));

      if (!isActive && subMenu && subMenu.classList.contains('mobileMenu__subMenu')) {
        subMenu.classList.add('mobileMenu__subMenu--isActive');
        currentItem.classList.add('mobileMenu__item--isActive');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', mobileMenuToggle, { once: true });
document.addEventListener('DOMContentLoaded', menuHover, { once: true });
document.addEventListener('DOMContentLoaded', burgerToggle, { once: true });
