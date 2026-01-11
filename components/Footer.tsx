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
            <h3 className="text-3xl font-serif tracking-[0.3em] gold-gradient-text">ARAISH</h3>
            <div className="w-16 h-px bg-gradient-to-r from-[var(--gold)] to-transparent" />
            <p className="text-gray-400 leading-relaxed text-sm">
              Exquisite handcrafted jewelry that tells your unique story. Each
              piece is a testament to timeless elegance and superior
              craftsmanship, designed for those who appreciate the finer things in life.
            </p>
            {/* Social icons placeholder */}
            <div className="flex gap-4 pt-4">
              <div className="w-10 h-10 rounded-full border border-[var(--gold)]/30 flex items-center justify-center hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 cursor-pointer">
                <span className="text-[var(--gold)] text-sm">✦</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-[var(--gold)]/30 flex items-center justify-center hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 cursor-pointer">
                <span className="text-[var(--gold)] text-sm">✦</span>
              </div>
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
              &copy; {new Date().getFullYear()} <span className="text-[var(--gold)]">Araish</span>. All rights reserved.
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
