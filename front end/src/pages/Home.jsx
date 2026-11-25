import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp, Check, Gem } from "lucide-react";
import { Eyebrow, DisplayHeading, PrimaryButton, OutlineButton, Reveal } from "../components/bits";
import { stats, services, whyChooseHome, financialSolutions, testimonials, marqueeItems } from "../mock/mock";
import { publicApi } from "../lib/api";

const iconMap = { LineChart, BarChart3, ShieldCheck, Landmark, ClipboardList, PiggyBank, Globe, Handshake, TrendingUp };

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    publicApi.get("/blogs").then((res) => setBlogs(res.data.slice(0, 3))).catch(() => setBlogs([]));
  }, []);
  return (
    <div>
      {/* HERO */}
      <section className="bg-cream relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal><Eyebrow>Atlas Fortune — Boutique Wealth Advisory</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-5xl md:text-[68px] leading-[1.05] text-navy">
                Growing <span className="text-gold">Wealth,</span><br />
                Building <span className="text-gold">Legacy.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-navy/70 leading-relaxed max-w-lg">
                A boutique wealth advisory built on integrity, discretion and precision. We guide families across generations — growing capital thoughtfully, protecting legacies quietly.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrimaryButton to="/contact">Contact Us</PrimaryButton>
                <OutlineButton to="/services">Our Offerings</OutlineButton>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-12 flex gap-16">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-4xl text-navy">{s.value}</div>
                    <div className="w-8 h-px bg-gold my-3" />
                    <div className="text-xs tracking-[0.14em] uppercase text-navy/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 z-10 bg-navy text-white rounded-xl px-6 py-4 shadow-xl">
                <div className="flex items-center gap-2 text-gold text-[11px] tracking-[0.16em] uppercase"><Gem className="w-4 h-4" /> Fiduciary</div>
                <div className="font-display text-xl mt-1">Client-First, Always.</div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md ml-auto">
                <img src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=900&q=80" alt="Wealth growing" className="w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Marquee */}
        <div className="border-y border-navy/10 py-4 overflow-hidden bg-cream">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {[...Array(2)].map((_, r) => (
              <div key={r} className="flex items-center">
                {marqueeItems.map((m) => (
                  <span key={m + r} className="flex items-center font-display text-2xl text-navy/80 mx-8">
                    {m} <span className="text-gold mx-8">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative flex items-center justify-center">
              <div className="relative w-[360px] h-[360px] md:w-[440px] md:h-[440px]">
                <div className="absolute inset-0 rounded-full overflow-hidden border-[6px] border-gold/30">
                  <img src="https://images.pexels.com/photos/8441812/pexels-photo-8441812.jpeg?w=1000" alt="Advisor with clients" className="w-full h-full object-cover grayscale" />
                </div>
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 440 440">
                  <defs>
                    <path id="circlePath" d="M 220,220 m -195,0 a 195,195 0 1,1 390,0 a 195,195 0 1,1 -390,0" />
                  </defs>
                  <text className="fill-navy/70" style={{ fontSize: "14px", letterSpacing: "5px", fontFamily: "Outfit", fontWeight: 600 }}>
                    <textPath href="#circlePath" startOffset="0%">GROWING WEALTH · BUILDING LEGACY · PROTECTING FAMILIES · </textPath>
                  </text>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-navy text-white flex flex-col items-center justify-center">
                  <span className="font-display text-3xl">10+</span>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-gold">Years</span>
                </div>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><Eyebrow>Atlas Fortune — Commitment to You</Eyebrow></Reveal>
            <Reveal delay={80}>
              <DisplayHeading text="Experts in Providing *Wealth Management* Services" className="mt-5 text-4xl md:text-5xl" />
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-6 space-y-4 text-navy/70 leading-relaxed">
                <p>At Atlas Fortune, the client always comes first — your goals shape every strategy we design.</p>
                <p>We offer personalised financial solutions built on trust, transparency, and long-term relationships.</p>
                <p>Our approach begins with understanding your needs, risk profile, and aspirations before recommending any investment.</p>
                <p>With disciplined research and ethical practices, we are committed to protecting and growing your wealth.</p>
              </div>
            </Reveal>
            <Reveal delay={200}><div className="mt-8"><PrimaryButton to="/about">More About Us</PrimaryButton></div></Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Reveal><Eyebrow>Services</Eyebrow></Reveal>
              <Reveal delay={80}><DisplayHeading text="What we *Offer*" className="mt-4 text-4xl md:text-5xl" /></Reveal>
              <Reveal delay={140}><p className="mt-5 text-navy/70 max-w-xl leading-relaxed">End-to-end wealth solutions curated for every life stage — from first investment to intergenerational legacy planning.</p></Reveal>
            </div>
            <Reveal delay={160}><OutlineButton to="/services">View All</OutlineButton></Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10 rounded-2xl overflow-hidden">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || LineChart;
              return (
                <Reveal key={s.slug} delay={(i % 4) * 60}>
                  <Link to={`/services/${s.slug}`} className="group block bg-white p-8 h-full hover:bg-cream transition-colors">
                    <span className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-gold" />
                    </span>
                    <h3 className="font-display text-xl text-navy">{s.title}</h3>
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

      {/* WHY CHOOSE */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <Reveal><Eyebrow>Our Advantage</Eyebrow></Reveal>
            <Reveal delay={80}><DisplayHeading text="Why Choose *Atlas Fortune?*" className="mt-4 text-4xl md:text-5xl" /></Reveal>
            <Reveal delay={140}><p className="mt-5 text-navy/70">Four compelling reasons discerning families choose our advisory:</p></Reveal>
            <div className="mt-10 space-y-8">
              {whyChooseHome.map((w, i) => (
                <Reveal key={w.num} delay={i * 60}>
                  <div className="flex gap-4">
                    <span className="w-7 h-7 rounded-full border border-gold flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5 text-gold" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-navy"><span className="text-gold">{w.num}</span> {w.title}</h3>
                      <p className="mt-2 text-sm text-navy/65 leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={120}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img src="https://images.pexels.com/photos/8068654/pexels-photo-8068654.jpeg?w=1200" alt="Advisors" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 right-12 bg-white rounded-xl shadow-xl p-6">
                <div className="text-[11px] tracking-[0.16em] uppercase text-gold">You’ll have</div>
                <div className="font-display text-xl text-navy mt-2">A clear path forward for every rupee, every decade.</div>
                <div className="mt-4 flex items-center gap-2 text-sm text-navy/60"><Gem className="w-4 h-4 text-gold" /> Curated portfolios · Quarterly reviews</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img src="https://images.pexels.com/photos/7693692/pexels-photo-7693692.jpeg?w=1200" alt="Advisory meeting" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <div>
            <Reveal><Eyebrow>Our Performance</Eyebrow></Reveal>
            <Reveal delay={80}><DisplayHeading text="Atlas *Advantages*" className="mt-4 text-4xl md:text-5xl" /></Reveal>
            <Reveal delay={140}><p className="mt-6 text-navy/70 leading-relaxed">Our wealth management services are built on a customer-first approach, focused on delivering consistent results through smart strategies and disciplined planning. We combine experience, transparency, and personalised guidance to create long-term financial value and stability.</p></Reveal>
            <Reveal delay={200}><div className="mt-8"><PrimaryButton to="/contact">Contact Us</PrimaryButton></div></Reveal>
          </div>
        </div>
      </section>

      {/* FINANCIAL SOLUTIONS */}
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <Reveal><div className="flex justify-center"><Eyebrow>Financial Solutions</Eyebrow></div></Reveal>
            <Reveal delay={80}><DisplayHeading text="Choose your account type and begin *investing* today." className="mt-4 text-3xl md:text-4xl" /></Reveal>
            <Reveal delay={140}><div className="mt-8 flex justify-center"><PrimaryButton to="/booking">Free Consultation</PrimaryButton></div></Reveal>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {financialSolutions.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="bg-white rounded-2xl overflow-hidden card-lift h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-xl text-navy">{f.title}</h3>
                    <p className="mt-3 text-sm text-navy/60 leading-relaxed">{f.desc}</p>
                    <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-gold text-[12px] tracking-[0.14em] uppercase">
                      Let’s Chat <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center"><Eyebrow>Reviews</Eyebrow></div>
            <DisplayHeading text="What our clients quietly *tell us.*" className="mt-4 text-3xl md:text-4xl" color="#ffffff" />
            <p className="mt-5 text-white/60">Long-term relationships are our real portfolio. Here’s what families across India and abroad have shared about working with us.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 h-full">
                  <div className="text-gold text-5xl font-display leading-none">“</div>
                  <p className="text-white/80 leading-relaxed -mt-3">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-500">{t.initials}</span>
                    <div>
                      <div className="text-white font-500">{t.name}</div>
                      <div className="text-xs text-white/50">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Eyebrow>Articles</Eyebrow>
              <DisplayHeading text="Our latest *insights.*" className="mt-4 text-4xl md:text-5xl" />
            </div>
            <OutlineButton to="/blogs">Read All</OutlineButton>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b, i) => (
              <Reveal key={b.slug} delay={i * 80}>
                <Link to={`/blogs/${b.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-black/5 card-lift h-full">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-7">
                    <div className="text-xs tracking-[0.12em] uppercase text-gold">{b.date}</div>
                    <h3 className="mt-3 font-display text-xl text-navy group-hover:text-gold transition-colors">{b.title}</h3>
                    <p className="mt-3 text-sm text-navy/60 leading-relaxed">{b.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-navy text-[12px] tracking-[0.14em] uppercase group-hover:text-gold transition-colors">
                      Read More <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
