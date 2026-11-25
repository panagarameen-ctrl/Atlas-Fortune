import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp } from "lucide-react";
import { Eyebrow, DisplayHeading, PrimaryButton, Reveal } from "../components/bits";
import { services } from "../mock/mock";

const iconMap = { LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp };

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug) || services[0];
  const Icon = iconMap[service.icon] || LineChart;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Offerings
          </Link>
          <div className="mt-8 flex items-start gap-5">
            <span className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center shrink-0"><Icon className="w-6 h-6 text-gold" /></span>
            <div>
              <h1 className="font-display text-4xl md:text-5xl">{service.title}</h1>
              <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">{service.intro}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <div>
            <Eyebrow>What you get</Eyebrow>
            <DisplayHeading text={`A disciplined approach to *${service.title}*`} className="mt-4 text-3xl md:text-4xl" />
            <ul className="mt-8 space-y-4">
              {service.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-navy/75">
                  <span className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-gold" /></span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10"><PrimaryButton to="/contact">{service.slug === "channel-partner-program" ? "Click on this tab if you are interested" : "Speak to an Advisor"}</PrimaryButton></div>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h3 className="font-display text-2xl text-navy mb-8">Explore other offerings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.map((s) => {
              const OIcon = iconMap[s.icon] || LineChart;
              return (
                <Link key={s.slug} to={`/services/${s.slug}`} className="group block bg-cream rounded-2xl p-6 card-lift">
                  <span className="w-10 h-10 rounded-full bg-gold/12 flex items-center justify-center mb-4"><OIcon className="w-4.5 h-4.5 text-gold" /></span>
                  <h4 className="font-display text-lg text-navy group-hover:text-gold transition-colors">{s.title}</h4>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
