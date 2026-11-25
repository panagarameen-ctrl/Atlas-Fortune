import React, { useState } from "react";
import axios from "axios";
import { MapPin, Clock3, ArrowUpRight, Briefcase, ChevronDown } from "lucide-react";
import { Eyebrow, DisplayHeading, Reveal, PageHero } from "../components/bits";
import { careerWhy, jobs, company } from "../mock/mock";
import { useToast } from "../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Career() {
  const { toast } = useToast();
  const [openJob, setOpenJob] = useState(0);
  const [applyJob, setApplyJob] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [submitting, setSubmitting] = useState(false);

  const openApply = (title) => {
    setApplyJob(title);
    setForm({ name: "", email: "", phone: "", note: "" });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/applications`, { ...form, job_title: applyJob });
      toast({ title: "Application received", description: `Thanks for applying to the ${applyJob} role. Our team will be in touch.` });
      setApplyJob(null);
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold transition-colors";

  return (
    <div>
      <PageHero
        eyebrow="Careers"
        title="Craft careers, *not just jobs.*"
        subtitle="Join a small team obsessed with quiet excellence, deep client care, and long-term thinking."
      />

      {/* Intro */}
      <section className="bg-cream">
        <div className="max-w-[900px] mx-auto px-6 py-24 text-center">
          <div className="flex justify-center"><Eyebrow>Careers</Eyebrow></div>
          <DisplayHeading text="Build Your Career With *Atlas Fortune*" className="mt-4 text-3xl md:text-4xl" />
          <p className="mt-6 text-navy/70 leading-relaxed">A career at Atlas Fortune offers the opportunity to work in a professional, innovative, and growth-oriented environment where creativity, excellence, and client success are at the core of everything we do. We are always looking for talented individuals who are passionate about making a meaningful impact.</p>
        </div>
      </section>

      {/* Why work with us */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <Eyebrow>Why Atlas Fortune</Eyebrow>
            <DisplayHeading text="Why *Work With Us?*" className="mt-4 text-4xl md:text-5xl" />
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerWhy.map((c, i) => (
              <Reveal key={c.num} delay={(i % 3) * 60}>
                <div className="bg-cream rounded-2xl p-8 h-full card-lift">
                  <span className="font-display text-4xl text-gold/40">{c.num}</span>
                  <h4 className="mt-3 font-display text-xl text-navy">{c.title}</h4>
                  <p className="mt-3 text-sm text-navy/60 leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="bg-cream">
        <div className="max-w-[1000px] mx-auto px-6 py-24">
          <div className="text-center">
            <div className="flex justify-center"><Eyebrow>Openings</Eyebrow></div>
            <DisplayHeading text="Current *Openings*" className="mt-4 text-4xl md:text-5xl" />
            <p className="mt-5 text-navy/70 max-w-xl mx-auto">Join a firm that values craft, care and long-term impact. Explore active roles below and apply directly.</p>
          </div>

          <div className="mt-12 space-y-5">
            {jobs.map((job, i) => (
              <div key={job.title} className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                <button onClick={() => setOpenJob(openJob === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-7 text-left">
                  <div>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-gold">{job.dept}</div>
                    <h3 className="mt-1 font-display text-2xl text-navy">{job.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-navy/60">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gold" /> {job.type}</span>
                      <span className="flex items-center gap-1.5"><Clock3 className="w-4 h-4 text-gold" /> {job.salary}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-navy shrink-0 transition-transform ${openJob === i ? "rotate-180" : ""}`} />
                </button>
                {openJob === i && (
                  <div className="px-7 pb-7 border-t border-black/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-display text-lg text-navy mb-3">Job Responsibilities</h4>
                      <ul className="space-y-2 text-sm text-navy/65">
                        {job.responsibilities.map((r) => <li key={r} className="flex gap-2"><span className="text-gold mt-1">•</span> {r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-navy mb-3">Requirements</h4>
                      <ul className="space-y-2 text-sm text-navy/65">
                        {job.requirements.map((r) => <li key={r} className="flex gap-2"><span className="text-gold mt-1">•</span> {r}</li>)}
                      </ul>
                      <button onClick={() => openApply(job.title)} className="mt-6 inline-flex items-center gap-2 bg-navy text-white text-[12px] tracking-[0.14em] uppercase px-5 py-3 rounded-full hover:bg-navy-800 transition-colors">
                        Apply Now <ArrowUpRight className="w-4 h-4 text-gold" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open application */}
      <section className="bg-navy text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <div className="flex justify-center"><span className="text-gold text-[12px] tracking-eyebrow uppercase">Don’t see your role?</span></div>
          <DisplayHeading text="We’re always meeting *exceptional talent.*" className="mt-4 text-3xl md:text-4xl" color="#ffffff" />
          <p className="mt-5 text-white/60 max-w-2xl mx-auto">Send your CV and a note about the kind of work you love. When a role that fits opens up, we’ll be in touch.</p>
          <a href={`mailto:${company.careersEmail}`} className="mt-8 inline-flex items-center gap-2 bg-gold text-navy text-[12px] tracking-[0.16em] uppercase px-6 py-3.5 rounded-full hover:bg-white transition-colors">
            Apply for Job <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Application dialog */}
      <Dialog open={!!applyJob} onOpenChange={(v) => !v && setApplyJob(null)}>
        <DialogContent className="bg-cream border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-navy">Apply for {applyJob}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitApplication} className="mt-2 space-y-5">
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
              <label className="text-xs tracking-[0.12em] uppercase text-navy/60">Note</label>
              <textarea name="note" value={form.note} onChange={handleChange} rows={3} className={inputCls + " resize-none"} placeholder="Tell us a little about yourself" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-3.5 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
