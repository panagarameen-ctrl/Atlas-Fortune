import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp } from "lucide-react";
import { Reveal, PageHero } from "../components/bits";
import { services } from "../mock/mock";

const iconMap = { LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp };

export default function Services() {
  return (
    <div>
      <PageHero
        eyebrow="Our Offerings"
        title="Comprehensive *Wealth Management* Services"
        subtitle="Our comprehensive wealth management solutions are designed to help individuals and businesses grow, protect, and manage their finances with confidence. Through a client-first approach, strategic planning, and disciplined execution, we deliver integrated financial solutions."
      />

      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || LineChart;
              return (
                <Reveal key={s.slug} delay={(i % 3) * 70}>
                  <Link to={`/services/${s.slug}`} className="group block bg-white rounded-2xl p-8 h-full border border-black/5 card-lift">
                    <span className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-gold" />
                    </span>
                    <h3 className="font-display text-xl text-navy group-hover:text-gold transition-colors">{s.title}</h3>
                    <p className="mt-3 text-sm text-navy/60 leading-relaxed">{s.short}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-gold text-[12px] tracking-[0.14em] uppercase">
                      Explore <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
