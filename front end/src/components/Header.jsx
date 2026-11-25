import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, ChevronDown, ArrowRight, Menu } from "lucide-react";
import { SocialIcons, WhatsAppIcon } from "./Social";
import { company, services } from "../mock/mock";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import logoMark from "../assets/atlas-logo-mark.jpg";

const navItems = [
  { label: "HOME", to: "/" },
  { label: "ABOUT US", to: "/about" },
  { label: "OFFERINGS", to: "/services", dropdown: true },
  { label: "TEAM", to: "/team" },
  { label: "BLOGS", to: "/blogs" },
  { label: "CAREER", to: "/career" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img src={logoMark} alt="Atlas Fortune" className="h-11 w-auto mix-blend-multiply" />
      <span className="font-display text-xl tracking-[0.18em] text-navy">ATLAS FORTUNE</span>
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOffer, setMobileOffer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-navy text-white/85 text-[13px] hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{company.address}</span>
          </div>
          <div className="flex items-center gap-7">
            <a href={`mailto:${company.email}`} data-testid="topbar-email-link" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-gold" /> {company.email}
            </a>
            <a href={`tel:${company.phoneTel}`} data-testid="topbar-phone-link" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-gold" /> {company.phone}
            </a>
            <a href={company.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" data-testid="topbar-whatsapp-link" className="flex items-center hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-[18px] h-[18px] text-[#25D366]" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`transition-all duration-300 ${scrolled ? "bg-cream/95 backdrop-blur shadow-[0_8px_30px_-18px_rgba(10,30,60,0.35)]" : "bg-cream"}`}>
        <div className="max-w-[1280px] mx-auto px-6 h-[70px] flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="relative group">
                  <button className={`flex items-center gap-1 text-[13px] tracking-[0.15em] font-500 transition-colors ${isActive(item.to) ? "text-gold" : "text-navy hover:text-gold"}`} onClick={() => navigate(item.to)}>
                    {item.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-64 bg-white rounded-md shadow-xl border border-black/5 py-2">
                      {services.map((s) => (
                        <Link key={s.slug} to={`/services/${s.slug}`} className="block px-5 py-2 text-[13px] text-navy/80 hover:text-gold hover:bg-cream transition-colors">
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={item.label} to={item.to} className={`text-[13px] tracking-[0.15em] transition-colors ${isActive(item.to) ? "text-gold" : "text-navy hover:text-gold"}`}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-3 text-navy">
              <SocialIcons prefix="header" linkClassName="hover:text-gold transition-colors" />
            </div>
            <Link to="/contact" className="group inline-flex items-center gap-2 bg-navy text-white text-[12px] tracking-[0.15em] px-5 py-3 rounded-full hover:bg-navy-800 transition-colors">
              CONTACT US
              <span className="w-6 h-6 rounded-full bg-gold flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-navy" />
              </span>
            </Link>
          </div>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-navy" aria-label="Menu"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream w-[300px] p-0">
              <div className="flex items-center justify-between px-5 h-[70px] border-b border-black/5">
                <Logo />
              </div>
              <nav className="flex flex-col p-5 gap-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button onClick={() => setMobileOffer((v) => !v)} className="w-full flex items-center justify-between py-3 text-[14px] tracking-[0.12em] text-navy">
                          {item.label} <ChevronDown className={`w-4 h-4 transition-transform ${mobileOffer ? "rotate-180" : ""}`} />
                        </button>
                        {mobileOffer && (
                          <div className="pl-3 pb-2 flex flex-col">
                            {services.map((s) => (
                              <Link key={s.slug} to={`/services/${s.slug}`} onClick={() => setOpen(false)} className="py-2 text-[13px] text-navy/70 hover:text-gold">{s.title}</Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link to={item.to} onClick={() => setOpen(false)} className="block py-3 text-[14px] tracking-[0.12em] text-navy hover:text-gold">{item.label}</Link>
                    )}
                  </div>
                ))}
                <Link to="/contact" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center justify-center gap-2 bg-navy text-white text-[12px] tracking-[0.15em] px-5 py-3 rounded-full">
                  CONTACT US <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
