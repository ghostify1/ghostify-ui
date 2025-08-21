export default function Gauge({ value=0, size=160 }:{value?:number,size?:number}){
  const clamped=Math.max(0,Math.min(100,value));
  const r=(size/2)-12, C=2*Math.PI*r, off=C-(clamped/100)*C;
  const color=clamped<40?"#22c55e":clamped<70?"#f59e0b":"#ef4444";
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={size/2} cy={size/2} r={r} stroke="#0b1522" strokeWidth="14" fill="none"/>
    <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round"
      strokeDasharray={`${C} ${C}`} strokeDashoffset={off} style={{transition:"stroke-dashoffset 1s ease"}}/>
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="42" fontFamily="Orbitron" fill="#fff">{clamped}</text>
    <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#8aa9b8">RİSK SKORU</text>
  </svg>)
}
