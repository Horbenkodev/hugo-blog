function copyToClipboard() {
  const shareButton = document.getElementById('shareButton');
  const copyIcon = document.getElementById('copyIcon');
  const doneIcon = document.getElementById('doneIcon');

  shareButton.addEventListener('click', function () {
    var postURL = window.location.href;
    navigator.clipboard.writeText(postURL).then(function () {
      doneIcon.style.display = 'block';
      copyIcon.style.display = 'none';
      setTimeout(() => {
        doneIcon.style.display = 'none';
        copyIcon.style.display = 'block';
      }, 2000);
    });
  });
}

document.addEventListener('DOMContentLoaded', copyToClipboard, { once: true });
