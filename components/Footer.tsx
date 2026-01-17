export default function Footer() {
  return (
    <footer className="relative bg-[#1a1a1a] text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif tracking-[0.3em] gold-gradient-text">AARAISH</h3>
            <div className="w-16 h-px bg-gradient-to-r from-[var(--gold)] to-transparent" />
            <p className="text-gray-400 leading-relaxed text-sm">
              Exquisite handcrafted jewelry that tells your unique story. Each
              piece is a testament to timeless elegance and superior
              craftsmanship, designed for those who appreciate the finer things in life.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.instagram.com/aaraishbyanza?igsh=MTdmbzR3NWxwN2g0Mw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[var(--gold)]/30 flex items-center justify-center hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 group"
                aria-label="Follow us on Instagram"
              >
                <svg
                  className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
              Quick Links
            </h4>
            <div className="w-8 h-px bg-[var(--gold)]/50" />
            <ul className="space-y-4">
              {['Collections', 'About Us', 'Contact'].map((item, index) => (
                <li key={item}>
                  <a
                    href={item === 'Collections' ? '/' : `/#${item.toLowerCase().replace(' ', '')}`}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <span className="w-0 h-px bg-[var(--gold)] group-hover:w-4 transition-all duration-300" />
                    <span className="tracking-wide">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
              Get In Touch
            </h4>
            <div className="w-8 h-px bg-[var(--gold)]/50" />
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <span className="text-[var(--gold)]">✦</span>
                <span>WhatsApp Available</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--gold)]">✦</span>
                <span>Mon - Sat: 10:00 - 18:00</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--gold)]">✦</span>
                <span>Premium Quality Assured</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="relative mt-16 pt-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p className="tracking-wide">
              &copy; {new Date().getFullYear()} <span className="text-[var(--gold)]">Aaraish</span>. All rights reserved.
            </p>
            <p className="tracking-wider text-xs">
              Crafted with <span className="text-[var(--gold)]">♦</span> Excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
