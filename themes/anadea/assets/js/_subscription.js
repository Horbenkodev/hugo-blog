document.addEventListener('DOMContentLoaded', function () {
  const subscriptionForm = document.getElementById('subscription_form');

  subscriptionForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
      const ipifyResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipifyResponse.json();

      const formData = new FormData(subscriptionForm);
      formData.append('remote_ip', ip);

      const subscriptionResponse = await fetch('https://anadea.info/webhooks/subscriptions/c3Vic2NyaX', {
        body: formData,
        method: 'POST',
      });

      if (subscriptionResponse.ok) {
        alert('Subscription successful!');
      } else {
        alert('Something went wrong! Try again later.');
      }
    } catch (error) {
      alert('Network error! Please try again later.');
    }
  });
});
