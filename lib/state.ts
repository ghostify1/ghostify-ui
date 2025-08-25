import { create } from 'zustand';
export type Category='email'|'social'|'dark';
export interface BreachItem{ name:string; domain?:string; date?:string; affected?:string; password?:boolean; source?:string; category?:Category; }
export interface ScanData{ email:string; mode:'demo'|'live'; source:'hibp'|'leakcheck'|'combined'|'mock'; breaches:BreachItem[]; score:number; counts:{email:number;social:number;dark:number}; }
type Store={ data?:ScanData; saveScan:(r:ScanData)=>void; reset:()=>void };
export const useScanStore=create<Store>((set)=>({data:undefined,saveScan:(r)=>set({data:r}),reset:()=>set({data:undefined})}));
