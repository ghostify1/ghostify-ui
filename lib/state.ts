import { create } from 'zustand';
export type Category='email'|'social'|'dark';
export interface BreachItem{ name:string; domain?:string; date?:string; affected?:string; password?:boolean; source?:string; category?:Category; }
export interface ScanData{ email:string; mode:'demo'|'live'; source:'hibp'|'leakcheck'|'combined'|'mock'; breaches:BreachItem[]; score:number; counts:{email:number;social:number;dark:number}; }
type Store={ data?:ScanData; saveScan:(r:ScanData)=>void; reset:()=>void };
export const useScanStore=create<Store>((set)=>({data:undefined,saveScan:(r)=>set({data:r}),reset:()=>set({data:undefined})}));
export function makeDemoData(email:string):ScanData{
  const breaches:BreachItem[]=[
    {name:'Adobe',domain:'adobe.com',date:'2013-10-04',affected:'email, password',password:true,source:'hibp',category:'email'},
    {name:'LinkedIn',domain:'linkedin.com',date:'2012-05-05',affected:'email, password',password:true,source:'hibp',category:'social'},
    {name:'Twitter',domain:'x.com',date:'2018-06-01',affected:'email, username',password:false,source:'hibp',category:'social'},
    {name:'Combo List',domain:'darkweb',date:'2019-01-01',affected:'email, password',password:true,source:'leakcheck',category:'dark'},
  ];
  const counts={email:breaches.filter(b=>b.category==='email').length,social:breaches.filter(b=>b.category==='social').length,dark:breaches.filter(b=>b.category==='dark').length};
  return{email,mode:'demo',source:'mock',breaches,counts,score:78};
}
