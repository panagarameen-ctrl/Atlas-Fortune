import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Check, Clock, ArrowLeft } from "lucide-react";
import { Eyebrow, DisplayHeading, PageHero } from "../components/bits";
import { publicApi } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Calendar } from "../components/ui/calendar";

function fmtDate(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function prettyDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function Booking() {
  const { toast } = useToast();
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState({ all_slots: [], available: [], booked: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSlot(null);
    publicApi
      .get(`/bookings/availability`, { params: { date: fmtDate(date) } })
      .then((res) => setSlots(res.data))
      .catch(() => setSlots({ all_slots: [], available: [], booked: [] }))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicApi.post(`/bookings`, { ...form, date: fmtDate(date), slot });
      setDone({ date: prettyDate(date), slot });
      toast({ title: "Discovery call booked", description: `${prettyDate(date)} at ${slot} IST` });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Please try again in a moment.";
      toast({ title: "Could not book slot", description: msg, variant: "destructive" });
      // refresh availability in case slot was taken
      if (date) {
        const res = await publicApi.get(`/bookings/availability`, { params: { date: fmtDate(date) } });
        setSlots(res.data);
        setSlot(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold transition-colors";

  if (done) {
    return (
      <div>
        <PageHero eyebrow="Booking Confirmed" title="Your call is *scheduled.*" subtitle="A senior advisor will call you at the time you selected. A confirmation has been sent to our team." />
        <section className="bg-cream">
          <div className="max-w-[640px] mx-auto px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-gold" />
            </div>
            <h3 className="mt-6 font-display text-2xl text-navy">Discovery Call Confirmed</h3>
            <p className="mt-3 text-navy/70">{done.date}</p>
            <p className="text-navy/70">{done.slot} IST · 30 minutes</p>
            <a href="/" className="mt-8 inline-flex items-center gap-2 text-gold text-[12px] tracking-[0.16em] uppercase">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Book a Call"
        title="Reserve your *discovery call.*"
        subtitle="Pick a date and time that suits you. Your complimentary 30-minute consultation with a senior advisor — no obligation, absolute privacy."
      />

      <section className="bg-cream">
        <div className="max-w-[1100px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Left: calendar + slots */}
          <div>
            <Eyebrow>Step 1 — Choose a date</Eyebrow>
            <div className="mt-5 bg-white rounded-2xl border border-black/5 p-5 inline-block">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => {
                  const dd = new Date(d); dd.setHours(0, 0, 0, 0);
                  return dd < today || dd.getDay() === 0; // no past, no Sundays
                }}
              />
            </div>

            {date && (
              <div className="mt-8">
                <Eyebrow>Step 2 — Choose a time (IST)</Eyebrow>
                {loadingSlots ? (
                  <p className="mt-4 text-navy/50 text-sm">Loading available slots…</p>
                ) : (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {slots.all_slots.map((s) => {
                      const isBooked = !slots.available.includes(s);
                      const isActive = slot === s;
                      return (
                        <button
                          key={s}
                          disabled={isBooked}
                          onClick={() => setSlot(s)}
                          className={`py-2.5 rounded-lg text-sm border transition-colors ${
                            isActive
                              ? "bg-navy text-white border-navy"
                              : isBooked
                              ? "bg-black/[0.03] text-navy/30 border-transparent line-through cursor-not-allowed"
                              : "bg-white text-navy border-navy/15 hover:border-gold hover:text-gold"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: details form */}
          <div>
            <Eyebrow>Step 3 — Your details</Eyebrow>
            <div className="mt-5 bg-white rounded-2xl shadow-[0_30px_70px_-40px_rgba(10,30,60,0.4)] p-8">
              {!slot ? (
                <div className="text-center py-10">
                  <CalendarIcon className="w-10 h-10 text-gold/40 mx-auto" />
                  <p className="mt-4 text-navy/50 text-sm">Select a date and time to continue.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-navy bg-cream rounded-lg px-4 py-3 text-sm">
                    <Clock className="w-4 h-4 text-gold" />
                    {prettyDate(date)} · <span className="font-500">{slot} IST</span>
                  </div>
                  <form onSubmit={submit} className="mt-6 space-y-5">
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
                    <button type="submit" disabled={submitting} className="w-full bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-4 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">
                      {submitting ? "Booking…" : "Confirm Booking"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
