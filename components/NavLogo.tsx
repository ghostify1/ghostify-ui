import Link from 'next/link'; import Image from 'next/image';
export default function NavLogo(){ return(<div className='fixed left-4 top-4 z-10'>
  <Link href='/' aria-label='Ghostify Ana Sayfa'>
    <div className='w-12 h-12 relative rounded-xl border border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20 transition'>
      <Image src='/ghostify-logo.png' alt='Ghostify' fill sizes='48px' style={{objectFit:'contain'}}/>
    </div>
  </Link>
</div>); }
