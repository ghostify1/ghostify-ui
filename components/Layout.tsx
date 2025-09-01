import React from 'react';
import Link from 'next/link';

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="min-h-screen bg-matrix">
      <header className="border-b border-white/10 sticky top-0 z-20 backdrop-blur bg-black/20">
        <div className="container flex items-center gap-3 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/ghostify-logo.png" className="w-7 h-7" alt="Ghostify"/>
            <span className="font-bold tracking-wide group-hover:text-brand transition">GHOSTIFY</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link href="/scan" className="link">Taramayı Başlat</Link>
            <Link href="/dashboard" className="link">Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t border-white/10 mt-12">
        <div className="container py-6 text-sm text-white/60">
          © {new Date().getFullYear()} Ghostify
        </div>
      </footer>
    </div>
  )
}
