import React from 'react';
export default function RiskGauge({score=72}:{score?:number}){
  const angle = Math.min(270*(score/100), 270);
  return (
    <svg viewBox="0 0 120 70" className="w-full">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff7a00"/><stop offset="50%" stopColor="#ffd400"/><stop offset="100%" stopColor="#16E2F5"/>
        </linearGradient>
      </defs>
      <path d="M10,60 A50,50 0 1,1 110,60" fill="none" stroke="#1f2a33" strokeWidth="10" strokeLinecap="round"/>
      <path d="M10,60 A50,50 0 1,1 110,60" fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${angle} 300`} pathLength="270"/>
      <text x="60" y="50" textAnchor="middle" fontSize="20" fill="white">{score}</text>
      <text x="60" y="65" textAnchor="middle" fontSize="8" fill="#9cc">RİSK SKORU</text>
    </svg>
  )
}
