import Logo from "../ui/Logo";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <div className="ghostify-bg">
        <div className="matrix-layer">
{`0100101 001101 101010 001
101010 110010 101 001011
010111 001001 1101 001010
001101 010110 1001 011001
`}
        </div>
      </div>

      <header className="sticky top-0 z-20 backdrop-blur-xs bg-[var(--bg)]/60 border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90">
            <Logo size={40} />
          </Link>

          <nav className="hidden sm:flex items-center gap-3 text-[var(--muted)]">
            <Link href="/#plans" className="hover:text-primary">Planlar</Link>
            <Link href="/#help" className="hover:text-primary">Destek</Link>
            <a href="mailto:support@ghostify.app" className="btn-ghost">İletişim</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      <footer className="mt-16 border-t border-[var(--border)] text-[var(--muted)]">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm flex items-center justify-between">
          <span>© {new Date().getFullYear()} Ghostify</span>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="/privacy">Gizlilik</a>
            <a className="hover:text-primary" href="/terms">Şartlar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
