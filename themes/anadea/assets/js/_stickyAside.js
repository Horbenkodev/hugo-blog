function observe() {
  const authorConnect = document.querySelector('#author-connect');
  const tocDesktop = document.querySelector('#toc');
  const readNext = document.querySelector('#read-next');

  const readNextHeight = readNext.getBoundingClientRect().height + 60;
  readNext.style = `top: calc(100vh - ${readNextHeight}px)`;

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
  tocObserver.observe(tocDesktop);

  // Post node observer
  const postNodeSentinel = document.querySelector('#sentinel');
  const postNode = document.querySelector('.markdown');
  const postNodeRect = postNode.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const postTopOffset = postNodeRect.top - bodyRect.top;
  const marginTop = postTopOffset + postNodeRect.height * 0.8 - window.screen.height;

  const postObserverOptions = {
    root: null,
    rootMargin: `${marginTop}px`,
  };

  function postCallback(entries) {
    if (entries[0].isIntersecting) {
      readNext.classList.remove('visible');
      readNext.classList.add('hidden');
      authorConnect.style.display = 'block';

      setTimeout(() => {
        authorConnect.classList.add('sticky');
        authorConnect.classList.remove('hidden');
        authorConnect.classList.add('visible');
      }, 300);
    } else {
      authorConnect.classList.remove('sticky');
      authorConnect.classList.remove('visible');
      authorConnect.classList.add('hidden');

      setTimeout(() => {
        authorConnect.style.display = 'none';
        readNext.classList.remove('hidden');
        readNext.classList.add('visible');
      }, 300);
    }
  }

  const postObserver = new IntersectionObserver(postCallback, postObserverOptions);
  postObserver.observe(postNodeSentinel);
}

document.addEventListener('DOMContentLoaded', observe, { once: true });
