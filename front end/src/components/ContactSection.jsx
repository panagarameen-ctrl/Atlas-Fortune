import React, { useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { Eyebrow, DisplayHeading } from "./bits";
import { useToast } from "../hooks/use-toast";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const benefits = [
  "Complimentary 30-minute discovery call",
  "Personalised portfolio review",
  "Absolute privacy, no product push",
];

export default function ContactSection() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, { ...form, source: "contact_section" });
      toast({ title: "Thank you — request received", description: "A senior advisor will reach out within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold transition-colors";

  return (
    <section className="bg-cream-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <Eyebrow>Get in Touch</Eyebrow>
          <DisplayHeading text="Plan Your *Financial* Future Now" className="mt-5 text-4xl md:text-5xl" />
          <p className="mt-5 text-navy/70 leading-relaxed max-w-md">
            Fill the form and one of our senior advisors will reach out for a complimentary Investment Consultation.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-navy/80">
                <span className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-gold" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_30px_70px_-40px_rgba(10,30,60,0.4)] p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Name *</label>
                <input required name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Phone *</label>
                <input required name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="Your phone" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Email *</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Message *</label>
              <textarea required name="message" value={form.message} onChange={handleChange} rows={3} className={inputCls + " resize-none"} placeholder="How can we help?" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-4 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
