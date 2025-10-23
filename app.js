// app.js — sayfa fade ve harici link koruması
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Sayfa geçişleri
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http')) return;
    a.addEventListener('click', e=>{
      e.preventDefault();
      document.body.classList.remove('loaded');
      setTimeout(()=>{ window.location.href = href; }, 250);
    });
  });
});
