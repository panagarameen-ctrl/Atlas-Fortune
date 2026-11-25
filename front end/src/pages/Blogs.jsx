import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero, Reveal, Eyebrow } from "../components/bits";
import { publicApi } from "../lib/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    publicApi.get("/blogs").then((res) => setBlogs(res.data)).catch(() => setBlogs([]));
  }, []);

  const featured = blogs.find((b) => b.featured) || blogs[0];
  const rest = featured ? blogs.filter((b) => b.slug !== featured.slug) : [];

  return (
    <div>
      <PageHero
        eyebrow="Journal"
        title="Notes, essays & *market thinking.*"
        subtitle="Long-form perspectives from the Atlas Fortune advisory desk — practical, plain-spoken, and built to make wealth decisions clearer."
      />

      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          {/* Featured */}
          <Eyebrow>Featured Article</Eyebrow>
          {featured && (
          <Reveal>
            <Link to={`/blogs/${featured.slug}`} className="group mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl overflow-hidden border border-black/5 card-lift">
              <div className="aspect-[16/11] lg:aspect-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-9 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs">
                  <span className="bg-gold/12 text-gold px-3 py-1 rounded-full tracking-[0.1em] uppercase">{featured.category}</span>
                  <span className="text-navy/50">{featured.date}</span>
                  <span className="flex items-center gap-1 text-navy/50"><Clock className="w-3.5 h-3.5" /> {featured.read}</span>
                </div>
                <h2 className="mt-5 font-display text-3xl text-navy group-hover:text-gold transition-colors">{featured.title}</h2>
                <p className="mt-4 text-navy/65 leading-relaxed">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-navy text-[12px] tracking-[0.14em] uppercase group-hover:text-gold transition-colors">Read Article <ArrowUpRight className="w-4 h-4" /></span>
              </div>
            </Link>
          </Reveal>
          )}

          {/* Rest */}
          <div className="mt-16">
            <Eyebrow>More Articles</Eyebrow>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {rest.map((b, i) => (
                <Reveal key={b.slug} delay={i * 80}>
                  <Link to={`/blogs/${b.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-black/5 card-lift h-full">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-7">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="bg-gold/12 text-gold px-3 py-1 rounded-full tracking-[0.1em] uppercase">{b.category}</span>
                        <span className="text-navy/50">{b.date}</span>
                        <span className="flex items-center gap-1 text-navy/50"><Clock className="w-3.5 h-3.5" /> {b.read}</span>
                      </div>
                      <h3 className="mt-4 font-display text-xl text-navy group-hover:text-gold transition-colors">{b.title}</h3>
                      <p className="mt-3 text-sm text-navy/60 leading-relaxed">{b.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-navy text-[12px] tracking-[0.14em] uppercase group-hover:text-gold transition-colors">Read More <ArrowUpRight className="w-4 h-4" /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
