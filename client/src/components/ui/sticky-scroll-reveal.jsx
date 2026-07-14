import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform, motion, AnimatePresence } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "./scroll-stack";

export const StickyScroll = ({ content, className }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  
  // Track scroll of the outer track relative to the window scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );
    if (idx >= 0 && idx !== activeCard) {
      setActiveCard(idx);
    }
  });

  const springConfig = { stiffness: 180, damping: 25, bounce: 0 };

  const textTranslateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -(cardLength - 1) * 224]),
    springConfig
  );

  return (
    <>
      {/* Desktop Sticky Scroll (lg and above) - Window Scroll Driven */}
      <div
        ref={ref}
        className={`hidden lg:block relative w-full h-[300vh] ${className || ""}`}
      >
        {/* Sticky box locked in viewport */}
        <div className="sticky top-[120px] w-full h-[26rem] flex justify-between gap-8 rounded-[24px] p-5 md:p-7 bg-bg-card/40 border border-ink-border/30 backdrop-blur-sm items-center">
          
          {/* Left: interactive scrolling text column */}
          <div className="relative w-[38%] shrink-0 h-full overflow-hidden pt-[96px] px-2 md:px-4">
            {/* Top/Bottom gradient mask overlays for text fade */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-bg/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg/95 to-transparent z-10 pointer-events-none" />

            <motion.div 
              style={{ y: textTranslateY }}
              className="w-full relative"
            >
              {content.map((item, index) => (
                <motion.div
                  key={item.title + index}
                  className="h-[224px] flex flex-col justify-center text-left"
                  animate={{
                    opacity: activeCard === index ? 1 : 0.15,
                    scale: activeCard === index ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h3 className="font-display text-xl md:text-2xl font-medium text-ink leading-snug">
                    {item.title}
                  </h3>
                  <div className="mt-4 font-sans text-sm text-ink-soft leading-relaxed">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: animated image panel */}
          <div className="w-[55%] shrink-0 h-[22rem] rounded-[18px] bg-bg-card overflow-hidden border border-ink-border/40 shadow-xl relative">
            <AnimatePresence mode="sync">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full"
              >
                {content[activeCard]?.content ?? null}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Mobile/Tablet list view (below lg) with stacked card scroll stack animation */}
      <div className="lg:hidden w-full px-1 sm:px-2">
        <ScrollStack useWindowScroll={true} itemDistance={25} className="w-full !h-auto !overflow-visible">
          {content.map((item, index) => (
            <ScrollStackItem 
              key={item.title + index} 
              itemClassName="bg-bg border border-ink-border/25 flex flex-col gap-5 shadow-xl p-3 sm:p-4 rounded-[28px]"
            >
              {/* Project Image Card */}
              <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden border border-ink-border/30 shadow-md">
                {item.content}
              </div>
              {/* Description */}
              <div className="px-2 text-left">
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{item.title}</h3>
                {item.description}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </>
  );
};
