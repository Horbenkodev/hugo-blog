function observe() {
  const authorConnect = document.querySelector('#author-connect');
  const tocDesktopNode = document.querySelector('#toc');

  function setAuthorConnectHeight() {
    const authorConnectHeight = authorConnect.getBoundingClientRect().height;
    authorConnect.style = `top: calc(100vh - ${authorConnectHeight}px)`;
  }

  window.addEventListener('resize', setAuthorConnectHeight);

  // ToC observer
  function tocCallback(entries) {
    if (entries[0].isIntersecting) {
      authorConnect.classList.remove('visible');
      authorConnect.classList.add('hidden');
    } else {
      authorConnect.classList.remove('hidden');
      authorConnect.classList.add('visible');
    }
  }

  const tocObserver = new IntersectionObserver(tocCallback);
  tocObserver.observe(tocDesktopNode);

  // Read Next node observer
  const readNextNode = document.querySelector('#read-next');

  function readNextCallback(entries) {
    if (entries[0].isIntersecting) {
      authorConnect.classList.remove('sticky');
      authorConnect.style = `margin-top: auto;`;
    } else {
      setAuthorConnectHeight();
      authorConnect.classList.add('sticky');
    }
  }

  const readNextNodeObserver = new IntersectionObserver(readNextCallback);
  readNextNodeObserver.observe(readNextNode);
}

document.addEventListener('DOMContentLoaded', observe, { once: true });
