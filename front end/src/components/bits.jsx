import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Eyebrow() {
  // Eyebrow labels removed per design request.
  return null;
}

// Renders a heading; words wrapped in *asterisks* become italic gold serif
export function DisplayHeading({ text, className = "", color = "#0A1E3C" }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <h2 className={`font-display leading-[1.1] ${className}`} style={{ color }}>
      {parts.map((p, i) =>
        p.startsWith("*") ? (
          <span key={i} className="text-gold">{p.slice(1, -1)}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </h2>
  );
}

export function PrimaryButton({ to, href, children, className = "" }) {
  const cls = `group inline-flex items-center gap-3 bg-navy text-white text-[12px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-full hover:bg-navy-800 transition-colors ${className}`;
  const inner = (
    <>
      {children}
      <span className="w-6 h-6 rounded-full bg-gold flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
        <ArrowRight className="w-3.5 h-3.5 text-navy" />
      </span>
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <Link to={to} className={cls}>{inner}</Link>;
}

export function OutlineButton({ to, href, children, className = "" }) {
  const cls = `inline-flex items-center gap-2 border border-navy/25 text-navy text-[12px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-full hover:border-gold hover:text-gold transition-colors ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <Link to={to} className={cls}>{children}</Link>;
}

export function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #C6A15B 0, transparent 40%), radial-gradient(circle at 80% 60%, #C6A15B 0, transparent 45%)" }} />
      <div className="max-w-[1280px] mx-auto px-6 py-24 md:py-32 relative">
        {eyebrow && <Reveal><div className="mb-6"><span className="text-gold text-[12px] tracking-eyebrow uppercase">{eyebrow}</span></div></Reveal>}
        <Reveal delay={80}>
          <DisplayHeading text={title} className="text-4xl md:text-6xl max-w-4xl" color="#ffffff" />
        </Reveal>
        {subtitle && (
          <Reveal delay={160}>
            <p className="mt-6 text-white/70 max-w-2xl text-lg leading-relaxed">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
