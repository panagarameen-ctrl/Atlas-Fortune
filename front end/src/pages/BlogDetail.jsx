import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Reveal } from "../components/bits";
import { publicApi } from "../lib/api";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let active = true;
    publicApi.get("/blogs").then((res) => {
      if (!active) return;
      const all = res.data;
      const current = all.find((b) => b.slug === slug) || all[0];
      setBlog(current);
      setRelated(all.filter((b) => current && b.slug !== current.slug).slice(0, 2));
    }).catch(() => setBlog(null));
    return () => { active = false; };
  }, [slug]);

  if (!blog) {
    return (
      <div className="bg-cream min-h-[60vh] flex items-center justify-center">
        <p className="text-navy/50">Loading article…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-[860px] mx-auto px-6 py-20">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <div className="mt-8 flex items-center gap-4 text-xs">
            <span className="bg-gold/15 text-gold px-3 py-1 rounded-full tracking-[0.1em] uppercase">{blog.category}</span>
            <span className="flex items-center gap-1 text-white/60"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
            <span className="flex items-center gap-1 text-white/60"><Clock className="w-3.5 h-3.5" /> {blog.read}</span>
          </div>
          <h1 className="mt-5 font-display text-4xl md:text-5xl leading-[1.1]">{blog.title}</h1>
          <p className="mt-5 text-white/70 leading-relaxed text-lg">{blog.excerpt}</p>
        </div>
      </section>

      {/* Cover */}
      <div className="bg-navy">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[16/8] -mb-24 relative z-10">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Body */}
      <section className="bg-cream pt-40 pb-24">
        <div className="max-w-[760px] mx-auto px-6">
          <article className="space-y-6">
            {blog.content.map((p, i) => (
              <Reveal key={i} delay={i * 40}>
                {i === 0 ? (
                  <p className="text-navy text-xl leading-relaxed font-display first-letter:text-6xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">{p}</p>
                ) : (
                  <p className="text-navy/75 leading-relaxed text-lg">{p}</p>
                )}
              </Reveal>
            ))}
          </article>

          <div className="mt-12 border-t border-navy/10 pt-8 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-[0.14em] uppercase text-navy/50">Written by</div>
              <div className="font-display text-lg text-navy">Atlas Fortune Advisory Desk</div>
            </div>
            <Link to="/contact" className="group inline-flex items-center gap-1.5 text-gold text-[12px] tracking-[0.14em] uppercase">Book a Consultation <ArrowUpRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h3 className="font-display text-2xl text-navy mb-8">Continue reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {related.map((b) => (
              <Link key={b.slug} to={`/blogs/${b.slug}`} className="group block bg-cream rounded-2xl overflow-hidden card-lift">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7">
                  <div className="text-xs text-navy/50">{b.date}</div>
                  <h4 className="mt-2 font-display text-xl text-navy group-hover:text-gold transition-colors">{b.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
