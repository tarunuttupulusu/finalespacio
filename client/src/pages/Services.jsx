import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, MessageSquare, Compass, Layers, Palette, Settings } from 'lucide-react';
import SEO from '../components/common/SEO';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const services = [
  {
    num: '01',
    title: 'Full Home Interiors',
    tag: 'End-to-End',
    desc: 'Complete interior design and execution for apartments, villas, and luxury homes. From structural layout to finishing touches — one team, one timeline.',
    includes: ['Living & Dining Design', 'Bedroom & Wardrobe Systems', 'Modular Kitchen', 'Foyer & Utility', 'False Ceilings & Lighting', 'Complete Handover'],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  },
  {
    num: '02',
    title: 'Modular Kitchen Design',
    tag: 'Precision-Engineered',
    desc: 'Kitchen systems designed around your workflow. We use premium hardware, soft-close mechanisms, and direct-sourced shutters for cabinets that last decades.',
    includes: ['Layout & Workflow Planning', 'Premium Hardware (Hettich/Hafele)', 'Countertop in Granite / Quartz', 'Chimney & Appliance Integration', 'Backsplash Tiling', '10-Year Warranty'],
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
  },
  {
    num: '03',
    title: 'Commercial Spaces',
    tag: 'Impact-First',
    desc: 'Offices, showrooms, clinics, and hospitality spaces designed to communicate brand identity while maximising workflow and employee experience.',
    includes: ['Space Planning & Zoning', 'Brand Integration Design', 'Workstation & Cabin Systems', 'Reception & Lobby', 'Lighting Design', 'Compliance-Ready Build'],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
  },
  {
    num: '04',
    title: 'Renovation & Refurbishment',
    tag: 'Transform',
    desc: 'Breathe new life into an existing space without full demolition. Strategic renovation with minimal disruption and maximum transformation.',
    includes: ['Structural Assessment', 'Selective Demolition & Rebuild', 'Surface Treatments & Finishes', 'New Furniture & Fixtures', 'Electrical & Plumbing Updates', 'Zero-Dust Commitment'],
    img: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=900&q=80',
  },
];

const processSteps = [
  { step: '01', name: 'Free Consultation', desc: 'We understand your vision, lifestyle, and budget constraints — no pressure, no pitch.' },
  { step: '02', name: 'Site Visit & Measurement', desc: 'Our team surveys site dimensions, structural constraints, and wiring channels.' },
  { step: '03', name: '3D Concept Design', desc: 'Photorealistic 3D renders of your space before a single nail goes in.' },
  { step: '04', name: 'Material Selection', desc: 'Walk through our material library. Touch, see, and confirm every finish.' },
  { step: '05', name: 'Production & Execution', desc: 'On-time, on-spec execution with regular progress photo updates.' },
  { step: '06', name: 'Quality Handover', desc: 'Final punch-list inspection, clean-up, and keys handover on your timeline.' },
];

const getStepIcon = (step) => {
  switch (step) {
    case '01': return MessageSquare;
    case '02': return Compass;
    case '03': return Layers;
    case '04': return Palette;
    case '05': return Settings;
    case '06': return CheckCircle2;
    default: return CheckCircle2;
  }
};

const heroImages = [
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1920&q=90',
];

const Services = () => {
  const heroRef = useRef(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll-driven parallax — same as Home
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO title="Services — ESPACIO Interiors" description="Full home interiors, modular kitchens, commercial spaces, and renovations. Engineering-first luxury design executed by ESPACIO." url="/services" />

      {/* ── ROUNDED CARD HERO (Resentii style) ── */}
      {/* Outer wrapper: responsive height, small gap from all edges */}
      <section
        ref={heroRef}
        className="relative h-[80vh] lg:h-[95vh] px-5 pt-5 pb-[10px] lg:px-12"
      >
        {/* The rounded card container — fills the padded area */}
        <div
          className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px]"
        >
          {/* Parallax background image layer */}
          <motion.div
            style={{ scale: bgScale, y: bgY }}
            className="absolute inset-0 will-change-transform overflow-hidden"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIdx}
                src={heroImages[currentImageIdx]}
                alt="ESPACIO Services"
                initial={{ x: '15%', opacity: 0 }}
                animate={{ x: 0,     opacity: 1 }}
                exit={{ x: '-15%',   opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </motion.div>

          {/* Gradient overlays — dark at top (behind navbar) + dark at bottom (for text) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />

          {/* Text block — pinned to bottom-left of the card */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="absolute inset-0 z-20 flex flex-col justify-end"
          >
            <div className="w-full px-8 md:px-12 pb-10 md:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-4"
              >
                {/* Pill label */}
                <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Services</span>
                </div>

                {/* Main heading */}
                <h1 className="font-display font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(48px, 8vw, 108px)' }}>
                  Our Services
                </h1>

                <p className="font-sans text-[14px] md:text-[15px] text-white/60 max-w-[420px] leading-relaxed">
                  Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.
                </p>

                {/* Image indicator dots */}
                <div className="flex items-center gap-2 mt-1">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIdx(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === currentImageIdx
                          ? 'w-6 h-1.5 bg-gold'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* ── SERVICES LIST ── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto divide-y divide-ink-border">
          {services.map((s, i) => (
            <div key={s.num} className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Reveal delay={0.05} className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="aspect-[4/3] rounded-card overflow-hidden bg-bg-card">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </Reveal>
              <Reveal delay={0.15} className={`space-y-6 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-[11px] font-semibold text-gold">{s.num}</span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-ink-muted bg-bg-card px-3 py-1 rounded-pill">{s.tag}</span>
                </div>
                <h2 className="font-display text-[clamp(28px,3vw,42px)] font-bold tracking-tight text-ink leading-tight">{s.title}</h2>
                <p className="font-sans text-[15px] text-ink-soft leading-relaxed">{s.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-sans text-[13px] text-ink-soft">
                      <CheckCircle2 size={14} className="text-gold shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-primary w-fit">
                  Enquire About This <ArrowUpRight size={13} />
                </Link>
              </Reveal>
            </div>
          ))}
        </div>
      </section>


      {/* ── PROCESS ── */}
      <section className="py-24 px-6 md:px-10 bg-bg-card border-t border-ink-border">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-3">How We Work</p>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] font-bold tracking-tight text-ink mb-14">Our Process</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {processSteps.map((p, i) => {
              const Icon = getStepIcon(p.step);
              return (
                <Reveal key={p.step} delay={i * 0.07} className="h-full">
                  <div className="group relative bg-bg border border-ink-border/50 rounded-card p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,16,20,0.04)] transition-all duration-500 flex flex-col justify-between h-full overflow-hidden">
                    {/* Interactive top gold line */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    
                    <div className="space-y-6">
                      {/* Top bar with Icon and Step number */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-pill bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg transition-all duration-500">
                          <Icon size={20} className="stroke-[1.5]" />
                        </div>
                        <span className="font-display text-[44px] font-bold text-ink-muted/15 group-hover:text-gold/25 transition-colors duration-500 select-none">
                          {p.step}
                        </span>
                      </div>

                      {/* Header and description */}
                      <div className="space-y-3">
                        <h3 className="font-display text-[19px] font-bold text-ink group-hover:text-gold transition-colors duration-300">
                          {p.name}
                        </h3>
                        <p className="font-sans text-[13.5px] text-ink-soft leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-bg-dark py-24 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-bold tracking-tight text-bg leading-tight max-w-[500px]">
              Let's design your space together.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/contact" className="btn-gold shrink-0">
              Book Free Consultation <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Services;
