const emailInput = document.getElementById('emailInput');
const scanBtn    = document.getElementById('scanBtn');
const kpiRisk    = document.getElementById('kpiRisk');
const kpiHibp    = document.getElementById('kpiHibp');
const kpiLeak    = document.getElementById('kpiLeak');
const rawJson    = document.getElementById('rawJson');
const breachList = document.getElementById('breachList');
const copyJson   = document.getElementById('copyJson');
const downloadPdf= document.getElementById('downloadPdf');
const scannedAt  = document.getElementById('scannedAt');

function calcRiskScore(result){
  const hibpCount  = Array.isArray(result?.hibp?.breaches) ? result.hibp.breaches.length : (result?.hibp?.count||0);
  const leakTotal  = result?.leakcheck?.total || 0;
  // Basit ve anlaşılır bir formül:
  let score = hibpCount * 22 + (leakTotal>0 ? 14 : 0);
  if (score>100) score = 100;
  return score;
}

function renderBreaches(result){
  breachList.innerHTML = '';
  const breaches = result?.hibp?.breaches || [];
  if(!breaches.length){
    breachList.innerHTML = '<li>İhlal kaydı bulunamadı.</li>';
    return;
  }
  breaches.forEach(b=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${b.name||'Breach'}</strong> — <span class="muted">${b.domain||''} ${b.breachDate?('· '+b.breachDate):''}</span>`;
    breachList.appendChild(li);
  });
}

async function scan(){
  const email = (emailInput.value||'').trim();
  if(!email){ alert('Lütfen e‑posta adresi girin.'); return; }

  scanBtn.disabled = true; scanBtn.innerText = 'Taranıyor…';

  try{
    const r = await fetch('/api/scan-email', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await r.json();

    // KPI’lar
    const hibpCount = Array.isArray(data?.hibp?.breaches) ? data.hibp.breaches.length : (data?.hibp?.count||0);
    const leakTotal = data?.leakcheck?.total || 0;

    kpiHibp.textContent = hibpCount;
    kpiLeak.textContent = leakTotal;
    kpiRisk.textContent = calcRiskScore(data);

    // Detaylar
    rawJson.textContent = JSON.stringify(data, null, 2);
    scannedAt.textContent = data?.scannedAt ? new Date(data.scannedAt).toLocaleString() : '';
    renderBreaches(data);

  }catch(e){
    alert('Tarama sırasında bir hata oluştu.');
    console.error(e);
  }finally{
    scanBtn.disabled = false; scanBtn.innerText = 'TARA';
  }
}

scanBtn.addEventListener('click', scan);
emailInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') scan(); });

copyJson.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText(rawJson.textContent);
    copyJson.textContent = 'Kopyalandı ✓';
    setTimeout(()=> copyJson.textContent = 'JSON’u Kopyala', 1200);
  }catch{}
});

// Basit PDF: print diyaloğu (MVP)
downloadPdf.addEventListener('click', ()=>{
  window.print();
});
