export default function Gauge({score}:{score:number}){
  const s=Math.max(0,Math.min(100,score));
  const color = s<40?'#22c55e':(s<70?'#f59e0b':'#ef4444');
  const bg = `conic-gradient(${color} ${s*3.6}deg, #1f2937 ${s*3.6}deg)`;
  return(<div className='w-56 h-56 rounded-full grid place-items-center' style={{background:bg}}>
    <div className='w-44 h-44 bg-[#0B1115] rounded-full grid place-items-center border border-white/10'>
      <div className='text-6xl font-extrabold text-cyan-300'>{s}</div>
      <div className='text-xs opacity-75 -mt-1'>RİSK SKORU</div>
    </div>
  </div>);
}
