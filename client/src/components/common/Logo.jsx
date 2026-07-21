import React from 'react';
import { motion } from 'framer-motion';

/* ─── colour tokens ──────────────────────────────────────────────── */
const CREAM  = '#F3EEE3';
const INK    = '#171512';
const GOLD   = '#A98A54';
const BULB   = '#FFC46B';

/* ═══════════════════════════════════════════════════════════════════
   EMBLEM – reusable compact icon with glowing/flickering bulb
   and inner 'E' glyph. Used in both headers and bottom menus.
   ═══════════════════════════════════════════════════════════════════ */
const LogoEmblem = ({ scrolled, size = 52, tightViewBox = false }) => {
  const ink = scrolled ? INK : '#ffffff';
  const viewBoxAttr = tightViewBox ? "28 26 72 72" : "0 0 120 120";

  return (
    <svg width={size} height={size} viewBox={viewBoxAttr} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`glowGradEmblem-${scrolled ? 'light' : 'dark'}`} cx="42%" cy="45%" r="40%">
          <stop offset="0%"   stopColor={BULB} stopOpacity="0.85" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0"    />
        </radialGradient>
        <linearGradient id={`spotlightGlowEmblem-${scrolled ? 'light' : 'dark'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BULB} stopOpacity="0.4" />
          <stop offset="40%" stopColor={BULB} stopOpacity="0.18" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0" />
        </linearGradient>
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
      {/* spotlight cone of light */}
      <motion.path
        d="M 40 54 L 24 95 H 65 L 49 54 Z"
        fill={`url(#spotlightGlowEmblem-${scrolled ? 'light' : 'dark'})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.65, 0.8, 0.7, 0.9, 0.75, 0.8] }}
        transition={{ delay: 1.2, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ pointerEvents: 'none' }}
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
   LARGE – split logo intro animation ([E] S P A from left, C I O . from right)
═══════════════════════════════════════════════════════════════════ */
const LargeLogo = ({ scrolled = false, onComplete }) => {
  const ink  = scrolled ? INK     : '#ffffff';
  const gold = scrolled ? GOLD    : '#d4aa7d';

  return (
    <div className="flex flex-col items-center justify-center select-none py-6 w-full max-w-[90vw]">
      {/* Main Wordmark Container */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-visible py-4 px-2">
        {/* LEFT GROUP: [E] Emblem + S + P + A (Animates FROM LEFT) */}
        <motion.div
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-end gap-1.5 sm:gap-2 md:gap-3"
        >
          {/* Logo Emblem Box [E] (Aligned with bottom line of S P A C I O) */}
          <div className="shrink-0 relative flex items-end justify-center -translate-y-2 sm:-translate-y-2.5">
            <LogoEmblem scrolled={scrolled} size={102} tightViewBox={true} />
          </div>

          {/* S P A Letters (Montserrat, matching size format) */}
          <div className="flex items-end gap-1 sm:gap-2 md:gap-3">
            {['S', 'P', 'A'].map((letter, i) => (
              <motion.span
                key={letter}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(42px, 7.5vw, 82px)',
                  fontWeight: 300,
                  color: ink,
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT GROUP: C + I + O + . (Animates FROM RIGHT) */}
        <motion.div
          initial={{ x: 220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-end gap-1 sm:gap-2 md:gap-3"
        >
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {['C', 'I', 'O'].map((letter, i) => (
              <motion.span
                key={letter}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.08, ease: 'easeOut' }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(42px, 7.5vw, 82px)',
                  fontWeight: 300,
                  color: ink,
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Small full stop dot '.' coming with CIO */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.25, ease: 'easeOut' }}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(18px, 3vw, 36px)',
              fontWeight: 400,
              color: ink,
              lineHeight: 1,
              marginBottom: '0.08em',
              marginLeft: '-0.15em'
            }}
          >
            .
          </motion.span>
        </motion.div>
      </div>

      {/* Gold Divider Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 my-4 w-full max-w-[320px] sm:max-w-[440px] justify-center"
      >
        <span className="h-[1px] flex-1" style={{ background: gold }} />
        <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: gold }} />
        <span className="h-[1px] flex-1" style={{ background: gold }} />
      </motion.div>

      {/* Subtitle: INTERIORS AND MODULAR */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.7, ease: 'easeOut' }}
        onAnimationComplete={() => onComplete && onComplete()}
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'clamp(10px, 1.5vw, 13.5px)',
          letterSpacing: '0.38em',
          fontWeight: 500,
          color: scrolled ? '#3d3d47' : 'rgba(255,255,255,0.75)',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        INTERIORS AND MODULAR
      </motion.p>
    </div>
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
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '22px',
          letterSpacing: '0.25em',
          fontWeight: 300,
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
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '7.5px',
          letterSpacing: '0.38em',
          fontWeight: 500,
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
        <LargeLogo scrolled={scrolled} onComplete={onComplete} />
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

export { LogoEmblem };
export default Logo;
