const emailEl  = document.getElementById('email');
const btn      = document.getElementById('scan');
const kRisk    = document.getElementById('risk');
const kHibp    = document.getElementById('hibp');
const kLeak    = document.getElementById('leakTotal');
const pretty   = document.getElementById('pretty');
const rawEl    = document.getElementById('raw');
const historyEl= document.getElementById('history');
const toast    = document.getElementById('toast');
const gaugeArc = document.getElementById('gaugeArc');

const HISTORY_KEY = 'ghostify_history_v1b';

function toastMsg(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2000);
}
function setGauge(score){
  // score 0..100 → yüzde yay
  const pct = Math.max(0, Math.min(100, score));
  gaugeArc.style.setProperty('--p', pct);
  kRisk.textContent = pct;
}
function calcRisk(hibpCount, leakTotal){
  // basit bir formül (MVP): ihlâl ve kayıt yoğunluğu
  const base = hibpCount*35 + Math.min(leakTotal, 10)*6;
  return Math.max(0, Math.min(100, Math.round(base)));
}
function addHistory(item){
  const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  arr.unshift(item); // en başa
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0,8)));
  renderHistory();
}
function renderHistory(){
  const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  historyEl.innerHTML = arr.map(x =>
    `<li><span class="email">${x.email}</span>
         <span class="risk">${x.risk}</span></li>`).join('');
}

async function scan(){
  const email = (emailEl.value || '').trim();
  if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    toastMsg('Geçerli bir e‑posta girin'); return;
  }
  btn.disabled = true; btn.textContent = 'Taranıyor…';

  try{
    const res = await fetch('/api/scan-email', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    const hibpCount  = (data.hibp && Array.isArray(data.hibp.breaches)) ? data.hibp.breaches.length : (data.hibp?.count||0);
    const leakTotal  = data.leakcheck?.total || 0;
    const risk = calcRisk(hibpCount, leakTotal);

    kHibp.textContent = hibpCount;
    kLeak.textContent = leakTotal;
    setGauge(risk);

    pretty.textContent = JSON.stringify({
      email, risk, hibp:{count:hibpCount}, leakcheck:{total:leakTotal},
      scannedAt: new Date().toISOString()
    }, null, 2);
    rawEl.textContent = JSON.stringify(data, null, 2);

    addHistory({ email, risk });
    toastMsg('Tarama tamamlandı');
  }catch(e){
    toastMsg('Hata: '+ e.message);
  }finally{
    btn.disabled = false; btn.textContent = 'TARA';
  }
}

document.getElementById('copyJson').onclick = ()=>{
  navigator.clipboard.writeText(pretty.textContent).then(()=>toastMsg('JSON kopyalandı'));
};
document.getElementById('pdf').onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('helvetica','bold'); doc.setFontSize(16);
  doc.text('Ghostify Tarama Raporu', 14, 16);
  doc.setFont('helvetica','normal'); doc.setFontSize(11);
  doc.text(pretty.textContent, 14, 26, { maxWidth: 180 });
  doc.save('ghostify-rapor.pdf');
};
btn.onclick = scan;
renderHistory();
