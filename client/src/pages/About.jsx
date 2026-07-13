import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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

const About = () => {
  const values = [
    { num: '01', title: 'Engineering First', desc: 'Every design decision is backed by structural integrity. We build to last — not to look good in photos.' },
    { num: '02', title: 'Material Honesty', desc: 'We source directly, warehouse ourselves, and never compromise on material quality for project margin.' },
    { num: '03', title: 'Turnkey Execution', desc: 'Design, procurement, build. One team. No hand-offs, no blame-shifting, no delays.' },
    { num: '04', title: '40-Year Legacy', desc: 'Four generations of construction trust in Hyderabad — from Mantana & Mastana to ESPACIO.' },
  ];

  const team = [
    { name: 'Rohit Uttupulusu', role: 'Principal Designer & Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Priya Sharma', role: 'Senior Interior Designer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kiran Rao', role: 'Project Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="bg-bg">
      <SEO title="About — ESPACIO Interiors" description="ESPACIO is Hyderabad's engineering-first interior design studio, backed by 40 years of family construction legacy." url="/about" />

      {/* ── HERO ── */}
      <section className="bg-bg-dark pt-40 pb-24 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-6">
            About ESPACIO
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(42px,6vw,80px)] font-bold leading-[1.05] tracking-tight text-bg max-w-[800px]">
            Where engineering meets elegance.
          </motion.h1>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 px-6 md:px-10 border-b border-ink-border">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div className="aspect-[4/3] rounded-card overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
                alt="ESPACIO Studio" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="space-y-6 pt-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Our Story</p>
            <p className="font-sans text-[15px] text-ink-soft leading-relaxed">
              ESPACIO was born from four generations of construction mastery. Our family — under the legacy of <strong className="text-ink font-semibold">Mantana & Mastana</strong> — has been building structures in Hyderabad since 1985.
            </p>
            <p className="font-sans text-[15px] text-ink-soft leading-relaxed">
              In 2025, we formalized our interior design practice under the ESPACIO brand, combining that deep construction knowledge with a refined design sensibility. The result: spaces that don't just look beautiful — they're built to last.
            </p>
            <p className="font-sans text-[15px] text-ink-soft leading-relaxed">
              We warehouse premium materials — WPC, PVC, acrylic, polygranite, and stone — directly, cutting out middlemen and ensuring every project gets the best materials at the right specification.
            </p>
            <Link to="/contact" className="btn-primary w-fit">
              Work With Us <ArrowUpRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 md:px-10 border-b border-ink-border">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-12">Our Principles</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-border">
            {values.map((v, i) => (
              <Reveal key={v.num} delay={i * 0.07}>
                <div className="bg-bg p-10 space-y-4">
                  <span className="font-sans text-[11px] font-semibold text-gold">{v.num}</span>
                  <h3 className="font-display text-[22px] font-bold text-ink">{v.title}</h3>
                  <p className="font-sans text-[14px] text-ink-soft leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-3">The People</p>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] font-bold tracking-tight text-ink mb-12">Meet the team.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="group">
                  <div className="aspect-[3/4] rounded-card overflow-hidden mb-5 bg-bg-card">
                    <img src={member.img} alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="font-display text-[18px] font-bold text-ink">{member.name}</h3>
                  <p className="font-sans text-[13px] text-ink-muted mt-1">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-bg-dark py-24 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-bold tracking-tight text-bg leading-tight">
              Ready to start your project?
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

export default About;
