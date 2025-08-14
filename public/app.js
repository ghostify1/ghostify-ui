const emailEl = document.getElementById('email');
const btn = document.getElementById('scan');
const pre = document.getElementById('json');
const kRisk = document.getElementById('risk');
const kHibp = document.getElementById('hibpCount');
const kLeak = document.getElementById('leakTotal');
const copyBtn = document.getElementById('copy');
const historyEl = document.getElementById('history');

const HISTORY_KEY = 'ghostify_history_v12b';

function addHistory(item){
  const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  arr.unshift(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0,5)));
  renderHistory();
}
function renderHistory(){
  const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  historyEl.innerHTML = arr.map(x => `<li><span>${x.email}</span><code>${x.risk}</code></li>`).join('');
}

async function scan(){
  const email = emailEl.value.trim();
  if(!email){ alert('E‑posta gir.'); return; }
  btn.disabled = true; btn.textContent = 'Taranıyor…';
  pre.textContent = '';
  try{
    const res = await fetch('/api/scan-email', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    pre.textContent = JSON.stringify(data, null, 2);
    kRisk.textContent = (data.risk ?? 0);
    kHibp.textContent = (data.hibp?.count ?? 0);
    kLeak.textContent = (data.leakcheck?.total ?? 0);
    addHistory({ email: data.email, risk: data.risk, t: data.scannedAt });
  }catch(e){
    pre.textContent = JSON.stringify({ error: String(e) }, null, 2);
  }finally{
    btn.disabled = false; btn.textContent = 'TARA';
  }
}

btn.addEventListener('click', scan);
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(pre.textContent || '{}');
});

renderHistory();