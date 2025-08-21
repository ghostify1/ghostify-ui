export default function ModeBadge({ mode }:{mode:"demo"|"live"}){
  return <span className={`badge fixed right-4 top-4 ${mode==="live"?"text-black bg-emerald-300 border-emerald-400":"text-black bg-zinc-300 border-zinc-400"}`}>{mode.toUpperCase()}</span>
}
