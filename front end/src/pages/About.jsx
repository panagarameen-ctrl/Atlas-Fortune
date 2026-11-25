import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Target, Eye, ArrowRight, TrendingUp, Layers, Landmark, ShieldCheck, Compass, Wallet, GitMerge } from "lucide-react";
import { Eyebrow, DisplayHeading, PrimaryButton, Reveal, PageHero } from "../components/bits";
import { aboutWhyTabs, ecosystem, capitalAdvisory } from "../mock/mock";

const ecoIcons = [TrendingUp, Layers, Landmark, ShieldCheck];
const capIcons = [Compass, Wallet, GitMerge];

export default function About() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <PageHero
        eyebrow="About Atlas Fortune"
        title="The craft of *enduring wealth.*"
        subtitle="Atlas Fortune is a boutique wealth advisory serving discerning families, professionals and NRIs."
      />

      {/* Mission & Vision */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center"><Eyebrow>Our Commitment</Eyebrow></div>
            <DisplayHeading text="The Atlas Fortune *Commitment*" className="mt-4 text-4xl md:text-5xl" />
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Target, tag: "Purpose", title: "Our Mission", desc: "To handcraft personalised financial journeys for every client we serve. We are dedicated to placing your best interests at the forefront of every decision, uniting artisan care with deep market expertise to safeguard, optimise, and grow your lifelong wealth." },
              { icon: Eye, tag: "Aspiration", title: "Our Vision", desc: "To serve as the most trusted architectural partner in wealth management — a firm where success isn’t defined by arbitrary market benchmarks, but by the peace of mind, confidence, and generational freedom we empower our clients to achieve." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-9 h-full border border-black/5 card-lift">
                  <span className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center mb-6"><c.icon className="w-5 h-5 text-gold" /></span>
                  <div className="text-[11px] tracking-[0.16em] uppercase text-gold">{c.tag}</div>
                  <h3 className="mt-2 font-display text-2xl text-navy">{c.title}</h3>
                  <p className="mt-4 text-navy/65 leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose - tabs */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <Eyebrow>Our Advantage</Eyebrow>
            <DisplayHeading text="Why Choose *Atlas Fortune*" className="mt-4 text-4xl md:text-5xl" />
            <p className="mt-5 text-navy/70 leading-relaxed">Choosing the right financial partner is an important decision. We simplify complex financial matters into clear, practical strategies that help you manage risk and build long-term financial confidence.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="flex flex-col gap-1">
              {aboutWhyTabs.map((t, i) => (
                <button key={t.key} onClick={() => setActive(i)} className={`text-left px-5 py-4 rounded-lg border-l-2 transition-all ${active === i ? "border-gold bg-cream text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}>
                  <span className="font-display text-lg">{t.title}</span>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 bg-cream rounded-2xl p-10 flex flex-col justify-center">
              <div className="text-[11px] tracking-[0.16em] uppercase text-gold">{aboutWhyTabs[active].eyebrow}</div>
              <h3 className="mt-3 font-display text-3xl text-navy">{aboutWhyTabs[active].title}</h3>
              <p className="mt-5 text-navy/70 leading-relaxed text-lg">{aboutWhyTabs[active].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <Eyebrow>Ecosystem</Eyebrow>
            <DisplayHeading text="Comprehensive Wealth Management & *Strategic Partner Ecosystem*" className="mt-4 text-3xl md:text-4xl" />
            <p className="mt-5 text-navy/70 leading-relaxed">We believe that extraordinary wealth management begins with active listening. At Atlas Fortune, our advisory approach centres on creating enduring value and long-term capital resilience through a carefully curated suite of investment avenues.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((e, i) => {
              const Icon = ecoIcons[i];
              return (
                <Reveal key={e.title} delay={i * 60}>
                  <div className="bg-white rounded-2xl p-7 h-full border border-black/5 card-lift">
                    <span className="w-11 h-11 rounded-full bg-navy flex items-center justify-center mb-5"><Icon className="w-5 h-5 text-gold" /></span>
                    <h4 className="font-display text-lg text-navy">{e.title}</h4>
                    <p className="mt-3 text-sm text-navy/60 leading-relaxed">{e.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capital Advisory */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <Eyebrow>Capital Advisory</Eyebrow>
            <DisplayHeading text="Strategic Wealth Planning & *Capital Advisory*" className="mt-4 text-3xl md:text-4xl" />
            <p className="mt-5 text-navy/70 leading-relaxed">As a premier financial consulting practice, Atlas Fortune integrates every facet of your balance sheet into a single, synchronised wealth architecture.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {capitalAdvisory.map((c, i) => {
              const Icon = capIcons[i];
              return (
                <Reveal key={c.title} delay={i * 70}>
                  <div className="bg-cream rounded-2xl p-8 h-full card-lift">
                    <span className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center mb-5"><Icon className="w-5 h-5 text-gold" /></span>
                    <h4 className="font-display text-lg text-navy">{c.title}</h4>
                    <p className="mt-3 text-sm text-navy/60 leading-relaxed">{c.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-10 text-navy/70 leading-relaxed max-w-3xl">By anchoring our solutions to a philosophy of client empowerment and enduring partnership, Atlas Fortune provides the structure, insight, and composure required to navigate your financial future with complete confidence.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <div className="flex justify-center"><span className="text-gold text-[12px] tracking-eyebrow uppercase">Begin</span></div>
          <DisplayHeading text="Ready to begin your *Atlas Fortune* journey?" className="mt-4 text-3xl md:text-4xl" color="#ffffff" />
          <p className="mt-5 text-white/60 max-w-xl mx-auto">Speak with one of our senior advisors for a complimentary, no-obligation consultation.</p>
          <div className="mt-8 flex justify-center">
            <Link to="/contact" className="group inline-flex items-center gap-3 bg-gold text-navy text-[12px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-full hover:bg-white transition-colors">
              Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
