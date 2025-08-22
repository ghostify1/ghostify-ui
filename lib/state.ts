import { create } from 'zustand';
export type ScanMode='demo'|'live'; export type Source='hibp'|'leakcheck'|'combined'|'mock';
export interface BreachItem{ name:string; domain?:string; date?:string; source?:string; category?:'email'|'social'|'dark'; }
export interface ScanData{ email:string; mode:ScanMode; source:Source; breaches:BreachItem[]; score:number; counts:{email:number;social:number;dark:number}; }
type Store={ data?:ScanData; saveScan:(r:ScanData)=>void; reset:()=>void };
export const useScanStore=create<Store>((set)=>({data:undefined,saveScan:(r)=>set({data:r}),reset:()=>set({data:undefined})}));
export function makeDemoData(email:string):ScanData{
  const breaches:BreachItem[]=[
    {name:'Adobe (2013)',domain:'adobe.com',date:'2013-10-04',source:'hibp',category:'email'},
    {name:'LinkedIn (2012)',domain:'linkedin.com',date:'2012-05-05',source:'hibp',category:'social'},
    {name:'Twitter (2018)',domain:'x.com',date:'2018-06-01',source:'hibp',category:'social'},
    {name:'Combo List',domain:'darkweb',date:'2019-01-01',source:'leakcheck',category:'dark'},
    {name:'Spotify Combo',domain:'spotify.com',date:'2019-05-12',source:'leakcheck',category:'email'},
  ];
  const counts={email:breaches.filter(b=>b.category==='email').length,social:breaches.filter(b=>b.category==='social').length,dark:breaches.filter(b=>b.category==='dark').length};
  return{email,mode:'demo',source:'mock',breaches,counts,score:78};
}
