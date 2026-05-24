'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

 useEffect(() => {
  const handleScroll = () => {
    console.log('scroll y:', window.scrollY)
    setScrolled(window.scrollY > 50)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-sm border-white/10' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Robb on Tour
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm uppercase tracking-widest transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.href === pathname ? link.label : link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}