import React from "react";

export default function ModeBadge({ mode = "demo" }: { mode?: "demo" | "live" }) {
  const isLive = mode === "live";
  const cls =
    "fixed right-4 top-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border " +
    (isLive
      ? "bg-emerald-300/30 border-emerald-400/60 text-emerald-100"
      : "bg-zinc-300/30 border-zinc-400/60 text-zinc-100");
  return <span className={cls}>{isLive ? "LIVE" : "DEMO"}</span>;
}

