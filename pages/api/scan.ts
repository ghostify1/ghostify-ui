import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
type Resp = { ok:boolean; error?:string; email?:string; score?:number; counts?:any; breaches?:any[] };
async function ensureUser(email:string){
  const existing = await prisma.user.findUnique({where:{email}});
  if(existing) return existing;
  return prisma.user.create({data:{email}});
}
export default async function handler(req:NextApiRequest,res:NextApiResponse<Resp>){
  const email=(req.query.email||'').toString().trim().toLowerCase();
  if(!email || !email.includes('@')) return res.status(400).json({ok:false,error:'invalid_email'});
  // TODO: Replace with live LeakCheck/HIBP calls. For now mock realistic data:
  const breaches=[
    {name:'Adobe',domain:'adobe.com',date:'2013-10-04',source:'hibp',category:'email'},
    {name:'LinkedIn',domain:'linkedin.com',date:'2012-05-05',source:'hibp',category:'social'},
    {name:'Combo List',domain:'darkweb',date:'2019-01-01',source:'leakcheck',category:'dark'},
  ];
  const counts={ email:1, social:1, dark:1 }; const score=78;
  // Try DB write if schema exists
  try{
    const user = await ensureUser(email);
    const scan = await prisma.scan.create({data:{userId:user.id,email,score,countsJson:counts,breachesJson:breaches}});
  }catch(e){ /* no-op: if DB not migrated yet, don't block */ }
  return res.status(200).json({ok:true,email,score,counts,breaches});
}
