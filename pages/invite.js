import { useState } from 'react';

export default function InvitePage() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/invite/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.ok) window.location.href = '/login';
    else setMsg(data.error || 'Geçersiz kod.');
  };

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      height: '100vh',
      background: '#000',
      color: '#0ff'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, width: 250 }}>
        <h2>Ghostify Daveti</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Davet kodu girin"
          style={{ padding: '8px', borderRadius: 4 }}
        />
        <button type="submit" style={{ background: '#0ff', border: 'none', padding: '8px' }}>
          Devam Et
        </button>
        {msg && <p style={{ color: 'red', fontSize: 12 }}>{msg}</p>}
      </form>
    </div>
  );
}
