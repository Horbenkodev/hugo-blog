function burgerToggle() {
  let isActive = false;

  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.header__mobileDrawer');
  const shadow = document.querySelector('.header__shadow');

  function activate() {
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', isActive);
    drawer.classList.add('active');
    shadow.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function deactivate() {
    document.body.style.overflow = '';
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', isActive);
    drawer.classList.remove('active');
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

function mobileTabsClick() {
  const tabs = document.querySelectorAll('.mobileDrawer__tab');
  const panels = document.querySelectorAll('.mobileDrawer__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      const isActive = tab.classList.contains('active');

      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      if (!isActive) {
        tab.classList.add('active');
        document.getElementById('mobile-' + target)?.classList.add('active');
      }
    });
  });
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

document.addEventListener(
  'DOMContentLoaded',
  () => {
    mobileTabsClick();
    menuHover();
    burgerToggle();
  },
  { once: true },
);
