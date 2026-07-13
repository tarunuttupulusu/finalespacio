import React from 'react';
import { motion } from 'framer-motion';

/* ─── colour tokens ──────────────────────────────────────────────── */
const CREAM  = '#F3EEE3';
const INK    = '#171512';
const GOLD   = '#A98A54';
const BULB   = '#FFC46B';

/* ═══════════════════════════════════════════════════════════════════
   LARGE  – disc logo (preloader / hero), 420×420 viewBox
═══════════════════════════════════════════════════════════════════ */
const LargeLogo = ({ onComplete }) => (
  <svg
    width="320"
    height="320"
    viewBox="0 0 420 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ userSelect: 'none' }}
  >
    <defs>
      <radialGradient id="glowGradLarge" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={BULB} stopOpacity="0.9" />
        <stop offset="100%" stopColor={BULB} stopOpacity="0"   />
      </radialGradient>
    </defs>

    {/* cream disc */}
    <motion.circle
      cx="210" cy="210" r="205"
      fill={CREAM}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1,    opacity: 1 }}
      style={{ transformOrigin: '210px 210px' }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
    />

    {/* bulb glow (behind cone) */}
    <motion.circle
      cx="185" cy="175" r="32"
      fill="url(#glowGradLarge)"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0.15, 0.7, 0.3, 0.6, 0.55] }}
      transition={{ delay: 1.5, duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* T-bar */}
    <motion.path
      d="M155 108 H215"
      fill="none" stroke={INK} strokeWidth="6" strokeLinecap="square"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.35, duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    />
    {/* T-stem */}
    <motion.path
      d="M185 108 V150"
      fill="none" stroke={INK} strokeWidth="6" strokeLinecap="square"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.55, duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
    />

    {/* lamp cone */}
    <motion.path
      d="M185 150 L165 178 H205 Z"
      fill={INK}
      style={{ transformOrigin: '185px 150px' }}
      initial={{ opacity: 0, y: -14, scaleY: 0.6 }}
      animate={{ opacity: 1,  y: 0,   scaleY: 1   }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.2, 0.9, 0.3, 1.2] }}
    />

    {/* bulb core */}
    <motion.circle
      cx="185" cy="182" r="6"
      fill={BULB}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.3, 1, 0.5, 1] }}
      transition={{ delay: 1.5, duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* right bracket */}
    <motion.path
      d="M225 108 H290 V255"
      fill="none" stroke={INK} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    />
    {/* L-shape left + bottom */}
    <motion.path
      d="M155 178 V255 H290"
      fill="none" stroke={INK} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.75, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    />

    {/* E glyph (right side) */}
    <motion.path
      d="M240 168 H278 M240 168 V210 M240 190 H270 M240 210 H278"
      fill="none" stroke={INK} strokeWidth="6" strokeLinecap="square"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.05, duration: 0.6, ease: 'easeOut' }}
    />

    {/* wordmark ESPACIO – each letter rises individually */}
    {['E','S','P','A','C','I','O'].map((ch, i) => (
      <motion.text
        key={i}
        fontSize="50"
        fontFamily="'Cinzel', serif"
        fontWeight="700"
        fill={INK}
        textAnchor="middle"
        x={210 - 3 * 31 + i * 31}
        y="308"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65 + i * 0.07, duration: 0.55, ease: 'easeOut' }}
      >
        {ch}
      </motion.text>
    ))}

    {/* gold divider – left arm */}
    <motion.line
      x1="90" y1="335" x2="170" y2="335"
      stroke={GOLD} strokeWidth="2"
      style={{ transformOrigin: '170px 335px' }}
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ delay: 2.35, duration: 0.5, ease: 'easeOut' }}
    />
    {/* diamond dot */}
    <motion.rect
      x="206" y="331" width="8" height="8"
      fill={GOLD}
      style={{ transformOrigin: '210px 335px' }}
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.55, duration: 0.4, ease: [0, 0, 0.4, 1.4] }}
    />
    {/* gold divider – right arm */}
    <motion.line
      x1="250" y1="335" x2="330" y2="335"
      stroke={GOLD} strokeWidth="2"
      style={{ transformOrigin: '250px 335px' }}
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ delay: 2.35, duration: 0.5, ease: 'easeOut' }}
    />

    {/* subtitle */}
    <motion.text
      fontSize="13"
      fontFamily="'Helvetica Neue', Arial, sans-serif"
      letterSpacing="5"
      fill={INK}
      textAnchor="middle"
      x="210" y="362"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.7, duration: 0.7, ease: 'easeOut' }}
      onAnimationComplete={() => onComplete && onComplete()}
    >
      INTERIORS AND MODULAR
    </motion.text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   EMBLEM – reusable compact icon with glowing/flickering bulb
   and inner 'E' glyph. Used in both headers and bottom menus.
   ═══════════════════════════════════════════════════════════════════ */
const LogoEmblem = ({ scrolled, size = 52 }) => {
  const ink = scrolled ? INK : '#ffffff';

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`glowGradEmblem-${scrolled ? 'light' : 'dark'}`} cx="42%" cy="45%" r="40%">
          <stop offset="0%"   stopColor={BULB} stopOpacity="0.85" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* frame */}
      <motion.path
        d="M32 55 V95 H95 V30 H50"
        stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      />
      {/* T-bar */}
      <motion.path
        d="M32 30 H57"
        stroke={ink} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.35, ease: 'easeInOut' }}
      />
      {/* bulb glow (pulses infinitely) */}
      <motion.circle cx="43" cy="53" r="16" fill={`url(#glowGradEmblem-${scrolled ? 'light' : 'dark'})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.2, 0.9, 0.3, 0.8] }}
        transition={{ delay: 0.9, duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* swinging lamp body */}
      <motion.g
        style={{ transformOrigin: '44.5px 30px' }}
        initial={{ rotate: 0, opacity: 0, scaleY: 0.6 }}
        animate={{ rotate: [0, 10, -7, 4, -2, 0], opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.55, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <path d="M44.5 30 V44" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="44.5,44 36,54 53,54" fill={ink} />
        {/* filament/light line (flashes infinitely) */}
        <motion.line x1="39" y1="56" x2="50" y2="56"
          stroke={BULB} strokeWidth="2.5" strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 1, 0.3, 1, 0.4, 1] }}
          transition={{ delay: 1.2, duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      {/* E glyph */}
      <motion.g stroke={ink} strokeWidth="4" strokeLinecap="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <line x1="70" y1="54" x2="70" y2="86" />
        <line x1="70" y1="54" x2="88" y2="54" />
        <line x1="70" y1="70" x2="85" y2="70" />
        <line x1="70" y1="86" x2="88" y2="86" />
      </motion.g>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SMALL  – compact navbar logo  (no disc, adaptive to bg)
   ═══════════════════════════════════════════════════════════════════ */
const SmallLogo = ({ scrolled }) => {
  const ink  = scrolled ? INK     : '#ffffff';
  const gold = scrolled ? GOLD    : '#d4aa7d';
  const sub  = scrolled ? '#3d3d47' : 'rgba(255,255,255,0.6)';

  return (
    <div className="flex flex-row items-center gap-3.5 select-none">
      {/* compact emblem */}
      <LogoEmblem scrolled={scrolled} size={52} />

      {/* text block */}
      <motion.div
        className="flex flex-col justify-center"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.45, ease: 'easeOut' }}
      >
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '22px',
          letterSpacing: '0.25em',
          fontWeight: 700,
          color: ink,
          lineHeight: 1,
          transition: 'color 0.3s',
        }}>
          ESPACIO
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '3px 0' }}>
          <span style={{ height: '1px', width: '36px', background: gold, display: 'block', transition: 'background 0.3s' }} />
          <span style={{ width: '4px', height: '4px', background: gold, transform: 'rotate(45deg)', display: 'block', transition: 'background 0.3s' }} />
          <span style={{ height: '1px', width: '36px', background: gold, display: 'block', transition: 'background 0.3s' }} />
        </div>
        <span style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: '7.5px',
          letterSpacing: '0.28em',
          fontWeight: 700,
          color: sub,
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>
          INTERIORS AND MODULAR
        </span>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC export – routes to large or small based on `size` prop
   ═══════════════════════════════════════════════════════════════════ */
const Logo = ({ className = '', showText = true, scrolled = false, size = 'small', onComplete }) => {
  if (size === 'large') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <LargeLogo onComplete={onComplete} />
      </div>
    );
  }

  return (
    <div className={className}>
      {showText
        ? <SmallLogo scrolled={scrolled} />
        : <LogoEmblem scrolled={scrolled} size={44} />
      }
    </div>
  );
};

export default Logo;
