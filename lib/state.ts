export type Breach={Name?:string;Domain?:string;BreachDate?:string;IsSensitive?:boolean;Source?:string};
export type ScanData={mode:"demo"|"live";source:string;breaches:Breach[];risk_score:number;email:string};
export function saveScan(data:ScanData){ if(typeof window==="undefined")return; sessionStorage.setItem("ghostify_scan",JSON.stringify(data)); }
export function loadScan():ScanData|null{ if(typeof window==="undefined")return null; const raw=sessionStorage.getItem("ghostify_scan"); try{return raw?JSON.parse(raw):null}catch{return null} }
