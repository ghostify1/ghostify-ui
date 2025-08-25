import type { NextApiRequest, NextApiResponse } from 'next';
import { makeDemoData } from '@/lib/state';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const email=(req.query.email||'').toString().trim().toLowerCase();
  if(!email || !email.includes('@')) return res.status(400).json({error:'invalid_email'});
  // NOTE: This skeleton returns demo data; hook up live LeakCheck/HIBP in product branch.
  return res.status(200).json(makeDemoData(email));
}
