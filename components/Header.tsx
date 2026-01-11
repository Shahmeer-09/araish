'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on home page
  const isHomePage = pathname === '/';
  // Check if we're on admin or product page
  const isLightPage = pathname?.startsWith('/admin') || pathname?.startsWith('/product');

  // On home page: white text when not scrolled (dark hero), dark text when scrolled
  // On other pages: always dark text (light background)
  const baseTextColor = isHomePage 
    ? (scrolled ? 'text-gray-900' : 'text-white')
    : 'text-gray-900';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        // Home page: gradient on top, white when scrolled
        isHomePage 
          ? (scrolled
              ? 'bg-white/98 backdrop-blur-lg shadow-lg shadow-black/5'
              : 'bg-gradient-to-b from-black/50 to-transparent')
          // Other pages: always white/light background
          : 'bg-white/98 backdrop-blur-lg shadow-lg shadow-black/5'
      }`}
    >
      {/* Decorative gold line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== 'undefined') {
                scrollToTop();
              }
            }}
            className={`group flex items-center gap-3 transition-all duration-300 ${baseTextColor}`}
          >
            {/* Decorative element */}
            <span className={`text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${scrolled ? 'text-[var(--gold)]' : 'text-[var(--gold-light)]'}`}>✦</span>
            <span className="text-2xl font-serif tracking-[0.25em] group-hover:text-[var(--gold)] transition-colors duration-300">
              ARAISH
            </span>
            <span className={`text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${scrolled ? 'text-[var(--gold)]' : 'text-[var(--gold-light)]'}`}>✦</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {[
              { href: '/', label: 'Collections' },
              { href: '/#about', label: 'About' },
              { href: '/#contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative text-sm tracking-[0.15em] uppercase transition-colors duration-300 hover:text-[var(--gold)] ${baseTextColor}`}
              >
                <span>{item.label}</span>
                {/* Elegant underline animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-300 hover:text-[var(--gold)] ${baseTextColor}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-2">
            {[
              { href: '/', label: 'Collections' },
              { href: '/#about', label: 'About' },
              { href: '/#contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] border-l-2 border-transparent hover:border-[var(--gold)] ${baseTextColor}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
