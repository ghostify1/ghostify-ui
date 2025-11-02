// ---------- SEKME GEÇİŞLERİ ----------
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const goToLogin = document.getElementById('goToLogin');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
});

if (goToLogin) {
  goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginTab.click();
  });
}

// ---------- FORM GİRİŞ (LOGIN) ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (!email || !password) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  try {
    // Backend bağlantı noktası (örnek)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Giriş başarılı! 🎉');
      // yönlendirme yapılacak sayfa:
      // window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Giriş başarısız.');
    }
  } catch (error) {
    console.error('Hata:', error);
    alert('Sunucuya bağlanılamadı.');
  }
});

// ---------- FORM KAYIT (REGISTER) ----------
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirm = document.getElementById('regConfirm').value.trim();

  if (!email || !password || !confirm) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  if (password !== confirm) {
    alert('Şifreler eşleşmiyor.');
    return;
  }

  try {
    // Backend bağlantı noktası (örnek)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Kayıt başarılı! 🔐');
      loginTab.click(); // kayıt sonrası giriş ekranına dön
    } else {
      alert(data.message || 'Kayıt başarısız.');
    }
  } catch (error) {
    console.error('Hata:', error);
    alert('Sunucuya bağlanılamadı.');
  }
});
