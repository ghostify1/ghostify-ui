import React from 'react';
export type Mode='demo'|'live';
export default function ModeBadge({mode='demo'}:{mode?:Mode}){
  const live=mode==='live';
  const base='fixed right-4 top-4 badge font-semibold';
  const cls= live? base+' bg-emerald-300/30 border-emerald-400/60 text-emerald-100'
                 : base+' bg-zinc-300/30 border-zinc-400/60 text-zinc-100';
  return <span className={cls}>{live?'LIVE':'DEMO'}</span>;
}
