document.getElementById('ghostify-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  // Simulated EmailJS (To be replaced with real integration)
  document.getElementById('response-message').textContent = `${email} için silme işlemi başlatıldı.`;
});