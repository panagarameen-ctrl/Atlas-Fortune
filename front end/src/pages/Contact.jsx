import React, { useState } from "react";
import axios from "axios";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Eyebrow, DisplayHeading, PageHero } from "../components/bits";
import { company } from "../mock/mock";
import { useToast } from "../hooks/use-toast";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, { ...form, source: "contact_page" });
      toast({ title: "Request received", description: "A senior advisor will contact you shortly." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };
  const inputCls = "w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold transition-colors";

  const info = [
    { icon: MapPin, label: "Office", value: company.address },
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phoneTel}` },
    { icon: Clock, label: "Hours", value: company.hours },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Let’s begin a *conversation.*"
        subtitle="A confidential, no-obligation consultation with a senior advisor — usually within 24 hours of your request."
      />

      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Eyebrow>Reach us</Eyebrow>
            <DisplayHeading text="Reach the *Atlas team.*" className="mt-4 text-4xl md:text-5xl" />
            <p className="mt-5 text-navy/70 leading-relaxed max-w-md">Whether you’re just beginning to plan, or seeking a second opinion on an existing portfolio, we’d be honoured to speak with you.</p>
            <div className="mt-10 space-y-6">
              {info.map((it) => (
                <div key={it.label} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0"><it.icon className="w-5 h-5 text-gold" /></span>
                  <div>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-navy/50">{it.label}</div>
                    {it.href ? <a href={it.href} className="text-navy hover:text-gold transition-colors">{it.value}</a> : <div className="text-navy">{it.value}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl overflow-hidden border border-black/5 aspect-[16/9]">
              <iframe title="Atlas Fortune Office" src="https://maps.google.com/maps?q=Aarya%27s%20Landmark%2C%20Sevasi%20Canal%20Road%2C%20Vadodara%2C%20391101&z=15&output=embed" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_30px_70px_-40px_rgba(10,30,60,0.4)] p-8 md:p-10 h-fit">
            <h3 className="font-display text-2xl text-navy">Request a Consultation</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Name *</label>
                <input required name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Email *</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Phone *</label>
                <input required name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="Your phone" />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Message *</label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows={4} className={inputCls + " resize-none"} placeholder="Tell us a little about your goals" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-4 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
