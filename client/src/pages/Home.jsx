import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/common/SEO';
import Logo from '../components/common/Logo';
import DecryptedText from '../components/ui/DecryptedText';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const AutoScrollingInteriorBox = () => {
  const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80'
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-black/10">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt="ESPACIO Luxury Interior Style"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

const faqListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const faqItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const faqSectionRef = useRef(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const { scrollYProgress: faqScrollProgress } = useScroll({
    target: faqSectionRef,
    offset: ["start end", "end start"]
  });
  const imgY = useTransform(faqScrollProgress, [0, 1], ["-10%", "10%"]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('espacio_intro_played', 'true');
  };

  useEffect(() => {
    // Safety fallback timer if onComplete doesn't fire (e.g. background tab)
    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const faqData = [
    {
      q: "How long does a typical project take from start to finish?",
      a: "Typically, residential projects take about 2 to 3 months, depending on scope, detailing, and level of customization."
    },
    {
      q: "What does your design process look like?",
      a: "Our process has five key stages: Initial Consultation, Concept & 3D Visualization, Technical Detailing, Turnkey Execution, and Meticulous Handover."
    },
    {
      q: "What sets ESPACIO apart from other design firms?",
      a: "We blend 40+ years of structural construction heritage with modern design. We also source premium materials directly from our own warehouses, cutting down costs and delivery times."
    },
    {
      q: "Do you offer remote design consultations?",
      a: "Yes! We can coordinate remote layout discussions, design reviews, and 3D walkthroughs for clients who reside outside Hyderabad."
    },
    {
      q: "What geographic areas do you serve?",
      a: "Our principal design team and execution crews operate primarily across Hyderabad and surrounding regions."
    },
    {
      q: "What types of projects does ESPACIO specialise in?",
      a: "We specialize in premium apartments, luxury villas, modular kitchens, and high-impact commercial workspace interiors."
    }
  ];

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=90'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Page-level scroll for subtle parallax on the background image
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1.05, 0.97]);
  const bgY     = useTransform(scrollYProgress, [0, 0.2], ['0%', '6%']);

  useEffect(() => {
    axios.get('/projects?limit=6&featured=true')
      .then(r => { if (r.data.success) setProjects(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mockProjects = [
    { title: 'The Lakeside Sanctuary', location: 'Banjara Hills', category: 'Villa', heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', slug: 'lakeside-sanctuary' },
    { title: 'Modernist Penthouse', location: 'Jubilee Hills', category: 'Apartment', heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', slug: 'modernist-penthouse' },
    { title: 'Executive Office Hub', location: 'HITEC City', category: 'Commercial', heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80', slug: 'exec-office' },
    { title: 'The Lumen Apartment', location: 'Gachibowli', category: 'Apartment', heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80', slug: 'lumen-apartment' },
    { title: 'Slate Residence', location: 'Kondapur', category: 'Luxury Home', heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', slug: 'slate-residence' },
    { title: 'The Granite Villa', location: 'Shamshabad', category: 'Villa', heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80', slug: 'granite-villa' },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const services = [
    { title: 'Full Home Interior', desc: 'End-to-end design and execution for apartments, villas, and luxury homes.', href: '/services' },
    { title: 'Modular Kitchens', desc: 'Precision-engineered kitchen systems with premium hardware and finishes.', href: '/what-we-do/modular-kitchen' },
    { title: 'Commercial Spaces', desc: 'Offices, showrooms, and hospitality spaces designed for impact.', href: '/services' },
    { title: 'Material Supply', desc: 'Direct-sourced WPC, PVC, acrylic, and stone from our own warehouses.', href: '/products' },
  ];

  return (
    <div className="bg-bg overflow-x-clip">
      <SEO title="Premium Interior Design, Hyderabad" description="ESPACIO is Hyderabad's premier interior design studio. Full-home interiors, modular kitchens, commercial offices, and premium material supply." url="/" />

      {/* Premium Fullscreen Logo Intro Preloader */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              y: '-100%',
              transition: { duration: 2.2, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 bg-bg-dark z-[9999] flex flex-col items-center justify-center cursor-pointer select-none"
            onClick={() => setShowIntro(false)}
          >
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0,
                y: -180,
                scale: 0.8,
                transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1] }
              }}
              className="flex flex-col items-center"
            >
              <Logo scrolled={false} size="large" onComplete={handleIntroComplete} />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 2.3, duration: 1 }}
              className="absolute bottom-12 font-sans text-[10px] text-white uppercase tracking-[0.25em]"
            >
              Click to skip
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HERO (Rounded Card — matches Services) ── */}
      <section ref={heroRef} className="relative h-[90vh] lg:h-[95vh] min-h-[640px] lg:min-h-0 px-5 pt-5 pb-[10px] lg:px-12">
        {/* Rounded card — fills the section */}
        <div
          className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px]"
        >
          {/* Background Image Layer */}
          <motion.div 
            style={{ scale: bgScale, y: bgY }}
            className="absolute inset-0 will-change-transform overflow-hidden"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={showIntro ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIdx}
                src={heroImages[currentImageIdx]}
                alt="ESPACIO Luxury Background"
                initial={{ x: '15%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-15%', opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/5 z-10" />
          </motion.div>

          {/* ─── Foreground Glass Cards (pinned to bottom) ─── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
              <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pb-8 md:pb-14 lg:pb-0 pointer-events-auto">
              
              <motion.div 
                className="flex flex-col lg:flex-row items-end gap-4 lg:gap-6"
                initial="hidden"
                animate={showIntro ? "hidden" : "visible"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.22,
                      delayChildren: 0.15
                    }
                  }
                }}
              >

                {/* ─── LEFT: Craft Card ─── */}
                <motion.div
                  className="w-full lg:max-w-[380px]"
                >
                  <motion.div 
                    className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border border-white/[0.15] shadow-2xl"
                    style={{ 
                      background: 'rgba(12, 12, 16, 0.82)',
                      backdropFilter: 'blur(40px)',
                      WebkitBackdropFilter: 'blur(40px)',
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 35 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                    {/* Top glass highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    
                    <div className="p-5 md:p-7">
                      {/* Large interior thumbnail (hidden on mobile to save vertical space) */}
                      <div className="hidden sm:block w-full aspect-[16/9] rounded-[14px] overflow-hidden mb-5">
                        <img 
                          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" 
                          alt="Luxury interior showcase"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Headline */}
                      <h1 className="font-display text-[32px] sm:text-[44px] lg:text-[36px] font-bold leading-[1.05] tracking-tight text-white mb-5">
                        We Craft the<br />Future Dwelling
                      </h1>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[52px] h-[34px] md:w-[64px] md:h-[40px] rounded-lg overflow-hidden border border-white/10">
                            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="kitchen" />
                          </div>
                          <div className="w-[52px] h-[34px] md:w-[64px] md:h-[40px] rounded-lg overflow-hidden border border-white/10">
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="bedroom" />
                          </div>
                        </div>

                        <Link 
                          to="/projects"
                          className="inline-flex items-center gap-2 border border-white/25 bg-white/[0.12] hover:bg-white text-white hover:text-ink font-sans text-[11px] md:text-[12px] font-bold px-4 md:px-5 py-3 rounded-pill transition-all duration-300 group shrink-0"
                        >
                          <span>Our Projects</span>
                          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* ─── RIGHT: Stats + Description ─── */}
                <motion.div
                  className="w-full lg:flex-1"
                >
                  <motion.div
                    className="flex flex-col gap-6 md:gap-8 w-full"
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                  
                  {/* Stats Row */}
                  <div className="flex flex-row gap-4 md:gap-5 lg:justify-end">
                    {[
                      { val: '15+', label: 'Years Legacy' },
                      { val: '25+', label: 'Projects' },
                      { val: '98%', label: 'Satisfaction' },
                    ].map((s) => (
                      <div 
                        key={s.label} 
                        className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-[14px] md:rounded-[20px] border border-white/15 shadow-xl text-center"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                        }}
                      >
                        <p className="font-display text-[22px] sm:text-[26px] md:text-[30px] font-semibold text-white leading-none tracking-tight">
                          {s.val}
                        </p>
                        <p className="font-sans text-[7px] sm:text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.08em] mt-1 px-1.5 leading-tight">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Description (hidden on mobile and laptop to prevent overflow) */}
                  <div 
                    className="hidden sm:block lg:hidden lg:max-w-[400px] lg:ml-auto rounded-[20px] md:rounded-[24px] p-5 md:p-6 border border-white/[0.12]"
                    style={{ 
                      background: 'rgba(20, 20, 24, 0.55)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                    }}
                  >
                    <p className="font-sans text-[15px] md:text-[15.5px] text-white/90 leading-relaxed">
                      ESPACIO redefines interiors through precision, balance, and understated luxury. From concept to completion, we shape spaces that feel intentional, elevated, and distinctly yours.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        </div>
      </section>



      {/* ── 2. INTRO TEXT ───────────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        <Reveal>
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-10">
            Who We Are
          </p>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(42px,5vw,76px)] font-medium leading-[1.08] tracking-tight text-ink">
              From concept to handover — ESPACIO delivers complete interiors.
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="lg:pb-4">
            <p className="font-sans text-[16px] text-ink-soft leading-relaxed mb-10">
              We bring 40+ years of family construction heritage to luxury interior design. Every space we create is backed by structural thinking, premium materials sourced directly from our own warehouses, and meticulous execution.
            </p>
            <Link to="/about" className="hover-underline font-sans text-[14px] font-semibold text-ink flex items-center gap-2 w-fit">
              Our Story <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── 3. SERVICES GRID ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink-border">
        <Reveal>
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-14">
            What We Do
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-border">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <Link to={s.href} className="block bg-bg p-9 group hover:bg-bg-card transition-colors duration-300 h-full">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted group-hover:text-gold transition-colors">0{i + 1}</span>
                <h3 className="font-display text-[22px] font-medium text-ink mt-5 mb-4 group-hover:text-ink transition-colors leading-snug">{s.title}</h3>
                <p className="font-sans text-[14.5px] text-ink-soft leading-relaxed">{s.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-ink-muted group-hover:text-ink transition-colors">
                  <span className="font-sans text-[12px] uppercase tracking-widest">Explore</span>
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 4. PROJECTS GRID ────────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink-border">
        <div className="flex items-end justify-between mb-16">
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display text-[clamp(38px,4vw,64px)] font-medium tracking-tight text-ink">Our Projects</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/projects" className="hover-underline font-sans text-[14px] font-semibold text-ink-soft hover:text-ink flex items-center gap-2">
              All Projects <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug || i} delay={i * 0.07}>
              <Link to={`/projects/${p.slug}`} className="group block rounded-card overflow-hidden bg-bg-card card-lift">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.heroImage} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-expo-out" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold">{p.category}</span>
                    <span className="font-sans text-[12px] text-ink-muted">{p.location}</span>
                  </div>
                  <h3 className="font-display text-[20px] font-medium text-ink group-hover:text-ink-soft transition-colors">{p.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. MATERIAL STRIP ───────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink-border">
        <div className="flex items-end justify-between mb-14">
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Our Materials</p>
            <h2 className="font-display text-[clamp(34px,3.5vw,56px)] font-medium tracking-tight text-ink">Sourced from the World's Best</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/products" className="hover-underline font-sans text-[14px] font-semibold text-ink-soft hover:text-ink flex items-center gap-2">
              Material Library <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { name: 'WPC Panels', img: '/images/materials/wpc_panels.jpg' },
            { name: 'Fluted Panels', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80' },
            { name: 'Acrylic Sheets', img: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=400&q=80' },
            { name: 'Mosaic Tiles', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80' },
          ].map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <Link to="/products" className="group block rounded-card overflow-hidden relative aspect-square bg-bg-card">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/70 to-transparent" />
                <p className="absolute bottom-5 left-5 font-display text-[15px] font-medium text-bg">{m.name}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 7. TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-bg-card border-t border-ink-border">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Reveal>
            <p className="font-sans text-[15px] text-ink-soft text-left">
              Trusted by homeowners, architects, and builders across Hyderabad.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-6 md:gap-10">
            {['Engineering First', 'Turnkey Execution', '40+ Year Legacy', 'Direct Material Sourcing'].map((badge) => (
              <span key={badge} className="font-sans text-[12px] font-semibold uppercase tracking-widest text-ink-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                {badge}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── FAQ SECTION (Premium Resentii Animations) ── */}
      <motion.section
        ref={faqSectionRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-28 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink-border"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column Container (Stretches to allow sticky child) */}
          <div className="lg:col-span-5">
            {/* Sticky Content Wrapper */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-[120px] flex flex-col items-start"
            >
              <div className="inline-flex items-center gap-1.5 bg-ink text-bg px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                FAQ
              </div>

              <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.12] tracking-tight text-ink mb-5">
                <DecryptedText text="Got Questions?" animateOn="view" revealDirection="center" />
                <br />
                <DecryptedText text="We Have Answers." animateOn="view" revealDirection="center" />
              </h2>

              <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-2 max-w-[400px]">
                From first consultation to final installation, we know you want to understand exactly what to expect. Here's everything you need to know about working with ESPACIO.
              </p>

              {/* FAQ Portrait Image with Scale Entrance + Scroll Parallax */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[300px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg border border-ink-border/10 mt-2"
              >
                <motion.img
                  style={{ y: imgY }}
                  src="/images/faq_designer.jpg"
                  alt="ESPACIO Luxury Interior Designer"
                  className="absolute -top-[10%] -bottom-[10%] left-0 right-0 w-full h-[120%] object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: FAQ Accordion List (Staggered Entrance) */}
          <motion.div
            variants={faqListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 flex flex-col justify-start"
          >
            <div className="border-t border-ink-border/20">
              {faqData.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    variants={faqItemVariants}
                    whileHover={{
                      y: -2,
                      boxShadow: isOpen ? '0 12px 30px -10px rgba(0,0,0,0.1)' : '0 8px 24px -10px rgba(0,0,0,0.08)',
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    animate={{
                      backgroundColor: isOpen ? '#F8F8F8' : 'transparent',
                      borderRadius: isOpen ? '12px' : '0px',
                      boxShadow: isOpen ? '0 10px 25px -12px rgba(0, 0, 0, 0.08)' : '0 0px 0px rgba(0, 0, 0, 0)',
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="border-b border-ink-border/20 px-4 py-5"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-start gap-4 text-left group bg-transparent border-0 cursor-pointer py-1"
                    >
                      {/* Plus to Minus Interactive SVG */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="shrink-0 mt-0.5 text-ink-soft/75 group-hover:text-gold transition-colors duration-300"
                      >
                        <path
                          d="M3.75 9H14.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <motion.path
                          d="M9 3.75V14.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{
                            rotate: isOpen ? 90 : 0,
                            scale: isOpen ? 0 : 1,
                            opacity: isOpen ? 0 : 1
                          }}
                          style={{ originX: "9px", originY: "9px" }}
                          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                        />
                      </svg>
                      <span className="font-sans text-[15px] md:text-[16px] font-medium text-ink group-hover:text-gold transition-colors duration-300">
                        {faq.q}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pl-8 pr-4 pb-3 pt-2 font-sans text-[13.5px] text-ink-soft leading-relaxed">
                            <DecryptedText
                              text={faq.a}
                              animateOn="mount"
                              sequential={true}
                              speed={18}
                            />
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
