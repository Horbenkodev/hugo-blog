function burgerToggle() {
  let isActive = false;

  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.header__mobileDrawer');
  const shadow = document.querySelector('.header__shadow');

  function activate() {
    burger.classList.add('active');
    drawer.classList.add('active');
    shadow.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function deactivate() {
    document.body.style.overflow = '';
    burger.classList.remove('active');
    drawer.classList.remove('active');
    shadow.classList.remove('active');
  }

  function handleClick() {
    isActive = !isActive;
    burger.setAttribute('aria-expanded', isActive);
    isActive ? activate() : deactivate();
  }

  function handleResize() {
    if (isActive) {
      isActive = false;
      burger.setAttribute('aria-expanded', false);
      deactivate();
    }
  }

  burger.addEventListener('click', handleClick);
  shadow.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);
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

function hideAllSubMenuItems() {
  document.querySelectorAll('.header__submenuItem').forEach((block) => {
    block.style.display = 'none';
  });
  document.querySelectorAll('.menu__item .menu__link').forEach((link) => {
    link.classList.remove('active');
  });
}

function menuHover() {
  const submenuItems = document.querySelectorAll('.header__submenuItem');
  const menuItems = document.querySelectorAll('.menu__item');

  function showSubMenuItem(item) {
    const target = item.getAttribute('data-submenu-item');
    const submenuItem = document.getElementById(target);
    const link = item.querySelector('.menu__link');

    setTimeout(() => {
      if (!submenuItem) return;

      if (submenuItem.style.display === 'block') {
        submenuItem.style.display = 'none';
        link.classList.remove('active');
      } else {
        hideAllSubMenuItems();
        submenuItem.style.display = 'block';
        link.classList.add('active');
      }
    }, 200);
  }

  menuItems.forEach((item) => {
    item.addEventListener('mouseenter', () => showSubMenuItem(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') showSubMenuItem(item);
    });

    item.addEventListener('focusout', () => {
      const target = item.getAttribute('data-submenu-item');
      const submenuItem = document.getElementById(target);

      setTimeout(() => {
        const focus = document.activeElement;
        if (submenuItem && !submenuItem.contains(focus) && !item.contains(focus)) {
          submenuItem.style.display = 'none';
          item.querySelector('.menu__link').classList.remove('active');
        }
      }, 0);
    });
  });

  submenuItems.forEach((container) => {
    container.addEventListener('mouseleave', hideAllSubMenuItems);

    container.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!container.contains(document.activeElement)) hideAllSubMenuItems();
      }, 0);
    });
  });
}

function headerScrollBehavior() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  function handleScroll() {
    const scrollTop = window.scrollY;

    if (scrollTop <= 0) {
      header.classList.remove('hidden');
      lastScrollTop = 0;
      return;
    }

    if (scrollTop > lastScrollTop) {
      header.classList.add('hidden');
      hideAllSubMenuItems();
    } else {
      header.classList.remove('hidden');
    }

    lastScrollTop = scrollTop;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    mobileTabsClick();
    menuHover();
    burgerToggle();
    headerScrollBehavior();
  },
  { once: true },
);
