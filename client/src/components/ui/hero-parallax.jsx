import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

export const HeroParallax = ({ products }) => {
  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 16);
  const thirdRow = products.slice(16, 24);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 180, damping: 25, bounce: 0 };

  const translateXRow1 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 2500]),
    springConfig
  );
  const translateXRow2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1500]),
    springConfig
  );
  const translateXRow3 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [40, 0]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[120vh] lg:h-[180vh] pt-0 pb-12 md:pb-16 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-12 mb-8 md:mb-12">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXRow1}
              key={product.title}
              index={idx}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-8 md:space-x-12 mb-8 md:mb-12">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXRow2}
              key={product.title}
              index={idx + 8}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-12">
          {thirdRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXRow3}
              key={product.title}
              index={idx + 16}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="w-full relative pt-8 pb-16 md:pt-12 md:pb-24 px-6 md:px-12 left-0 top-0 z-20 bg-gradient-to-b from-bg via-bg/95 via-[35%] to-transparent backdrop-blur-[12px]">
      <div className="max-w-[1440px] mx-auto text-left">
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">Bespoke Design Services</span>
        <h1 className="font-display text-[clamp(30px,3.5vw,52px)] font-medium leading-[1.08] tracking-tight text-ink mt-4">
          We Sculpt <br />Inspiring Spaces
        </h1>
        <p className="max-w-xl font-sans text-[14px] text-ink font-medium mt-5 leading-relaxed">
          From conceptual 3D visualizations to master turnkey handovers, ESPACIO brings unmatched structural excellence and premium material sourcing to residential, commercial, and modular kitchen spaces.
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({ product, translate, index }) => {
  const isNarrow = [0, 3, 6, 9, 12, 15, 18, 21].includes(index);
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
      }}
      key={product.title}
      className={`group/product h-56 relative flex-shrink-0 rounded-[20px] overflow-hidden border border-ink-border/35 shadow-lg ${
        isNarrow ? "w-42 md:w-[16.5rem]" : "w-84 md:w-[33rem]"
      }`}
    >
      <Link
        to={product.link}
        className="block h-full w-full"
      >
        <img
          src={product.thumbnail}
          className="object-cover absolute h-full w-full inset-0 transition-transform duration-700 group-hover/product:scale-105"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-60 bg-black/45 transition-opacity duration-300 group-hover/product:opacity-75 pointer-events-none"></div>
      <div className="absolute bottom-5 left-6 right-6 text-white z-10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold mb-1.5">{product.category || 'Interior Service'}</p>
        <h2 className="font-display text-base md:text-lg font-medium text-white group-hover/product:text-gold transition-colors leading-tight">
          {product.title}
        </h2>
      </div>
    </motion.div>
  );
};
