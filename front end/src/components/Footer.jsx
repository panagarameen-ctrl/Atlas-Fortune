import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { SocialIcons } from "./Social";
import { company, services } from "../mock/mock";
import logoMark from "../assets/atlas-logo-mark.jpg";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Blogs", to: "/blogs" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <span className="bg-white rounded-lg p-1 flex items-center justify-center">
                <img src={logoMark} alt="" className="h-8 w-8 object-contain" />
              </span>
              <span className="font-display text-lg tracking-[0.18em] text-white">ATLAS FORTUNE</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              A boutique wealth advisory built on integrity, discretion and precision — guiding families across generations.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <SocialIcons prefix="footer" linkClassName="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-[0.16em] uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-[0.16em] uppercase mb-5">Offerings</h4>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="hover:text-gold transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-[0.16em] uppercase mb-5">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span>{company.address}</span></li>
              <li className="flex gap-3"><Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" /><a href={`mailto:${company.email}`} className="hover:text-gold">{company.email}</a></li>
              <li className="flex gap-3"><Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" /><a href={`tel:${company.phoneTel}`} className="hover:text-gold">{company.phone}</a></li>
            </ul>
            <Link to="/booking" className="group inline-flex items-center gap-1.5 mt-6 text-gold text-sm tracking-[0.12em] uppercase">
              Book a Consultation <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="flex items-center gap-5">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
