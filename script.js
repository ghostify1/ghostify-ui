const $ = (sel) => document.querySelector(sel);
const hero = $('#view-hero');
const results = $('#view-results');
const modeIndicator = $('#mode-indicator');
const scanAnim = $('#scan-anim');

function setMode(type){
  modeIndicator.textContent = type.toUpperCase();
  modeIndicator.className = 'mode ' + type;
}

async function startScanFlow(email){
  scanAnim.classList.remove('hidden');
  try{
    const res = await fetch(`/api/scan?email=${encodeURIComponent(email)}`);
    if(res.ok){
      const data = await res.json();
      setMode(data.mode || 'demo');
      fillResults(email, data);
    }else{
      setMode('demo');
      fillResults(email, demoData(email));
    }
  }catch(e){
    setMode('demo');
    fillResults(email, demoData(email));
  } finally {
    scanAnim.classList.add('hidden');
  }
}

function fillResults(email, data){
  hero.classList.remove('active');
  results.classList.add('active');
  $('#risk-score').textContent = data.risk_score ?? 0;
  $('#breach-count').textContent = (data.breaches || []).length;
  $('#source-label').textContent = (data.source || 'HIBP') + (data.mode === 'live' ? '' : ' (Demo)');
  $('#json-output').textContent = JSON.stringify({email, ...data}, null, 2);
  const names = (data.breaches || []).map(b=>b.Name || b.title || b).join(', ') || '—';
  $('#deletion-template').value = $('#deletion-template').value.replaceAll('{EMAIL}', email).replaceAll('{BREACHES}', names);
}

function copyDeletion(){
  const el = document.getElementById('deletion-template');
  el.select();
  document.execCommand('copy');
  alert('Silme talebi kopyalandı.');
}

function newScan(){
  results.classList.remove('active');
  hero.classList.add('active');
  $('#email-input').focus();
}

function downloadPDF(){
  const element = document.getElementById('view-results');
  const opt = { margin:10, filename:'ghostify-raporu.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} };
  html2pdf().set(opt).from(element).save();
}

function demoData(email){
  const catalog = [
    { Name:'LinkedIn', Domain:'linkedin.com', BreachDate:'2012-06-01', PwnCount:164000000 },
    { Name:'Dropbox', Domain:'dropbox.com', BreachDate:'2012-07-01', PwnCount:68000000 },
    { Name:'Adobe', Domain:'adobe.com', BreachDate:'2013-10-01', PwnCount:152000000 }
  ];
  const items = catalog.slice(0, Math.floor(Math.random()*3)+1);
  const score = Math.min(100, 20*items.length + Math.floor(Math.random()*30)+30);
  return { mode:'demo', source:'HIBP', breaches:items, risk_score:score };
}

document.addEventListener('DOMContentLoaded', () => {
  hero.classList.add('active');
  document.getElementById('scan-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if(!email) return;
    startScanFlow(email);
  });
});