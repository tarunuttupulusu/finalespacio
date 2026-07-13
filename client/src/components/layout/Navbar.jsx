import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Briefcase, FolderKanban, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';
import GooeyNav from '../ui/GooeyNav';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Pages that start with a dark cinematic hero
  const hasDarkHero = ['/', '/about', '/services', '/projects', '/what-we-do', '/products'].some(path => 
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  );

  useEffect(() => {
    const handleScroll = () => {
      // On dark-hero pages: stay transparent until user scrolls past the full
      // viewport height (i.e. past where the sticky hero image lives).
      // On other pages: become solid immediately after a tiny scroll.
      const threshold = hasDarkHero ? window.innerHeight * 0.85 : 20;
      setScrolled(window.scrollY > threshold);
    };
    // Run once on mount in case page loads mid-scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDarkHero]);

  useEffect(() => {
    setMobileMenuOpen(false);
    // Reset scrolled state when navigating to a new page
    setScrolled(false);
  }, [location]);

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Services',  path: '/services' },
    { name: 'Projects',  path: '/projects' },
    { name: 'Spaces',    path: '/what-we-do' },
    { name: 'Materials', path: '/products' },
    { name: 'About',     path: '/about' },
    { name: 'FAQs',      path: '/faq' },
  ];



  // isNavLight = true means white bg + dark text (post-hero or non-hero pages)
  const isNavLight = scrolled || !hasDarkHero;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isNavLight
          ? 'bg-bg/95 backdrop-blur-md shadow-sm px-0 pt-0'
          : 'bg-transparent px-5 pt-7 lg:px-12 lg:pt-[18px]'
      }`}
      >
        <div className={`max-w-[1440px] mx-auto pl-6 pr-10 flex items-center justify-between transition-all duration-700 ${
          isNavLight ? 'py-5' : 'pt-[26px] pb-[12px]'
        }`}>

          {/* Logo */}
          <Link to="/" className={`hover:opacity-90 transition-opacity ${isNavLight ? '' : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]'}`}>
            <Logo scrolled={isNavLight} />
          </Link>

          {/* Desktop Nav & CTA Grouped on the right */}
          <div className="hidden lg:flex items-center gap-12 ml-auto">
            <GooeyNav 
              items={navLinks} 
              isNavLight={isNavLight}
            />

            {/* CTA Button */}
            <Link 
              to="/contact"
              className={`btn-nav-split ${isNavLight ? 'scrolled' : 'cinematic'}`}
            >
              <span>
                Contact us
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>


        </div>
      </nav>


      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-bg-dark z-[100] flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-16">
              <Link to="/" className="hover:opacity-90">
                <Logo scrolled={false} />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <X size={22} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link 
                    to={link.path}
                    className="block font-display text-3xl font-semibold text-white/85 hover:text-gold py-3 border-b border-white/10 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-gold text-ink font-sans text-[12px] font-bold uppercase tracking-widest px-6 py-4.5 rounded-pill w-full hover:bg-gold-hover transition-colors"
            >
              Contact us <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Tab Bar (D'LIFE inspired) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-45 bg-bg/95 backdrop-blur-md border-t border-ink-border/30 h-20 flex items-center justify-around px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] pb-safe">
        {/* Tab: Services */}
        <Link to="/services" className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2">
          <Briefcase size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Services</span>
        </Link>

        {/* Tab: Projects */}
        <Link to="/projects" className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2">
          <FolderKanban size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Projects</span>
        </Link>

        {/* Floating Circular Center Logo */}
        <div className="relative z-50 flex justify-center flex-1">
          <Link to="/" className="w-18 h-18 bg-bg border border-ink-border/50 rounded-full flex items-center justify-center shadow-[0_-4px_12px_rgba(0,0,0,0.12)] -translate-y-6 transition-transform duration-300 hover:scale-105 active:scale-95">
            <Logo showText={false} scrolled={true} className="scale-90" />
          </Link>
        </div>

        {/* Tab: Materials */}
        <Link to="/products" className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2">
          <Package size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Materials</span>
        </Link>

        {/* Tab: Menu Toggle */}
        <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2 bg-transparent border-0 cursor-pointer">
          <Menu size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Menu</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
