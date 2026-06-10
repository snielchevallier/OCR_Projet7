'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { getUserInitials } from '@/lib/utils'

export default function Header() {
  const { user } = useUser()
  const initials = getUserInitials(user?.name)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="w-full bg-white flex md:items-center justify-center">
      <div className="w-360 flex items-center justify-between px-6 h-20">

        {/* Logo */}
        <Link href="/">
          <Image src="/img/logo.png" alt="Abricot" width={147} height={18} className="mx-4" />
        </Link>

        {/* Nav desktop — centré */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-5 py-4 rounded-lg 
                text-sm font-medium transition-colors duration-400
                ${pathname.startsWith('/dashboard') ? 'bg-black text-white' : 'bg-white text-orange hover:text-orange hover:bg-orange/10'}`}
          >
            <Image src={`/img/ico-dash-${pathname.startsWith('/dashboard') ? 'white' : 'orange'}.png`} alt="" width={24} height={24} /> Tableau de bord
          </Link>
          <Link
            href="/projets"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-5 py-4 rounded-lg
                text-sm font-medium transition-colors duration-400
                ${pathname.startsWith('/projets') ? 'bg-black text-white' : 'bg-white text-orange hover:text-orange hover:bg-orange/10'}`}
          >
            <Image src={`/img/ico-projets-${pathname.startsWith('/projets') ? 'white' : 'orange'}.png`} alt="" width={24} height={24} /> Projets
          </Link>
        </nav>

        {/* Droite : avatar + burger */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Link
            href="/profil"
            onClick={() => setMenuOpen(false)}
            className={`hidden md:flex w-16 h-16 rounded-full transition-colors duration-300
            ${pathname === '/profil' ? 'bg-orange text-white' : 'bg-orange/20 text-orange hover:bg-orange hover:text-white'}
            items-center justify-center 
            text-sm font-semibold`}>
            {initials}
          </Link>

          {/* Burger — mobile uniquement */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <div className={`md:hidden transition-all duration-300 ${!menuOpen ? 'hidden opacity-0' : 'block opacity-100'}`}>
        <nav className="flex flex-col pr-4 py-4 gap-1">

          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-5 py-4 rounded-lg 
                text-sm font-medium transition-colors duration-400
                ${pathname.startsWith('/dashboard') ? 'bg-black text-white' : 'bg-white text-orange hover:text-orange hover:bg-orange/10'}
                `}
          >
            <Image src={`/img/ico-dash-${pathname.startsWith('/dashboard') ? 'white' : 'orange'}.png`} alt="" width={24} height={24} /> Tableau de bord
          </Link>
          <Link
            href="/projets"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-5 py-4 rounded-lg
                text-sm font-medium transition-colors duration-400
                ${pathname.startsWith('/projets') ? 'bg-black text-white' : 'bg-white text-orange hover:text-orange hover:bg-orange/10'}
                `}
          >
            <Image src={`/img/ico-projets-${pathname.startsWith('/projets') ? 'white' : 'orange'}.png`} alt="" width={24} height={24} /> Projets
          </Link>

          {/* Avatar mobile */}
          <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-gray-200">
            <Link href="/profil" onClick={() => setMenuOpen(false)} className="flex items-center justify-center text-xs font-semibold text-orange">
              <span className={`flex items-center justify-center 
              px-2 mr-2 w-12 h-10 rounded-full 
              ${pathname.startsWith('/profil') ? 'bg-orange text-white' : 'bg-orange/20 text-orange hover:bg-orange hover:text-white'}`}
              >{initials}</span> <span className="text-sm text-gray-600">Mon compte</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}