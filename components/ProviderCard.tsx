import React from 'react';import clsx from 'classnames';
export default function ProviderCard({name,status}:{name:string;status:'searching'|'secure'|'breach'|'active'}){
  const statusText={searching:'Hesap aranıyor',secure:'Güvenli',breach:'Sızıntı Tespit Edildi',active:'Hesap Aktif'}[status];
  const pill=clsx('badge',{
    'bg-sky-300/20 border-sky-400/50 text-sky-100':status==='searching',
    'bg-emerald-300/20 border-emerald-400/50 text-emerald-100':status==='secure'||status==='active',
    'bg-rose-400/20 border-rose-400/60 text-rose-100':status==='breach'
  });
  return(<div className='card'><div className='text-lg font-semibold'>{name}</div><div className='mt-3'><span className={pill}>{statusText}</span></div></div>);
}
