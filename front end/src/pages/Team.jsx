import React from "react";
import { Check } from "lucide-react";
import { Eyebrow, DisplayHeading, PrimaryButton, Reveal, PageHero } from "../components/bits";
import { team, teamTrust } from "../mock/mock";

export default function Team() {
  return (
    <div>
      <PageHero
        eyebrow="Our Team"
        title="The people behind *the craft.*"
        subtitle="Seasoned advisors, quietly obsessed with your outcomes."
      />

      {/* Intro */}
      <section className="bg-cream">
        <div className="max-w-[1000px] mx-auto px-6 py-24 text-center">
          <div className="flex justify-center"><Eyebrow>Our Team</Eyebrow></div>
          <DisplayHeading text="Financial Growth Starts With The *Right Guidance*" className="mt-4 text-3xl md:text-4xl" />
          <div className="mt-6 space-y-4 text-navy/70 leading-relaxed text-left">
            <p>Atlas Fortune believes wealth management is more than financial advice — it is about building lasting relationships based on trust, transparency, and personalised guidance. Our team is committed to helping individuals, families, NRIs, and businesses achieve financial clarity, long-term stability, and sustainable prosperity through a client-first approach.</p>
            <p>As a trusted wealth management firm, we provide comprehensive financial solutions including Managed Portfolios, Capital Market Services, Insurance, Fixed Income Investments, Loans, Financial Planning, and NRI Wealth Services. Every strategy is carefully designed to align with the unique goals, priorities, and future aspirations of our clients.</p>
            <p>What sets us apart is our commitment to personalised relationships and continuous support. In an increasingly digital world, we continue to believe in meaningful human connections, proactive communication, and long-term partnerships built on trust and accountability.</p>
          </div>
        </div>
      </section>

      {/* Leaders */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24 space-y-20">
          {team.map((m, i) => (
            <Reveal key={m.name}>
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 items-start ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                <div className="lg:[direction:ltr]">
                  <div className="bg-navy rounded-2xl p-8 text-center sticky top-28">
                    <div className="w-28 h-28 mx-auto rounded-full bg-gold/15 flex items-center justify-center">
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-white">{m.name}</h3>
                    <div className="mt-1 text-gold text-[12px] tracking-[0.16em] uppercase">{m.role}</div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="text-[11px] tracking-[0.16em] uppercase text-white/50">Experience</div>
                      <div className="font-display text-2xl text-white mt-1">{m.experience}</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 lg:[direction:ltr]">
                  <div className="text-[11px] tracking-[0.16em] uppercase text-gold">{m.role} · Atlas Fortune</div>
                  <h3 className="mt-2 font-display text-3xl text-navy">{m.name}</h3>
                  <div className="text-navy/50 mt-1">{m.roleFull}</div>
                  <div className="mt-6 space-y-4 text-navy/70 leading-relaxed">
                    {m.bio.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                  <blockquote className="mt-8 border-l-2 border-gold pl-6 py-2">
                    <p className="font-display text-xl text-navy italic">“{m.quote}”</p>
                    <footer className="mt-3 text-sm text-navy/50">— {m.name}, {m.role}</footer>
                  </blockquote>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <Eyebrow>Why Clients Trust Us</Eyebrow>
            <DisplayHeading text="Why Clients Trust *Our Team*" className="mt-4 text-4xl md:text-5xl" />
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamTrust.map((t, i) => (
              <Reveal key={t} delay={(i % 3) * 60}>
                <div className="bg-white rounded-xl p-6 flex items-center gap-4 border border-black/5 card-lift h-full">
                  <span className="font-display text-2xl text-gold w-10">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-navy font-500">{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <div className="flex justify-center"><span className="text-gold text-[12px] tracking-eyebrow uppercase">Partner With Us</span></div>
          <DisplayHeading text="Let’s Build *Financial Fortune* Together" className="mt-4 text-3xl md:text-4xl" color="#ffffff" />
          <p className="mt-5 text-white/60 max-w-2xl mx-auto">Whether your goal is wealth creation, financial protection, retirement planning, or legacy building, Atlas Fortune is committed to being your trusted long-term financial partner.</p>
          <div className="mt-8 flex justify-center"><PrimaryButton to="/contact">Contact Us</PrimaryButton></div>
        </div>
      </section>
    </div>
  );
}
