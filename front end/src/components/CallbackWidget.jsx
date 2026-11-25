import React, { useState } from "react";
import { PhoneCall } from "lucide-react";
import { publicApi } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const TIMES = ["Morning", "Afternoon", "Evening"];
const empty = { name: "", phone: "", preferred_time: "Morning" };
const inputCls = "w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold transition-colors";

export const CallbackWidget = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await publicApi.post("/callbacks", form);
      toast({ title: "Request received", description: "We'll call you back at your preferred time." });
      setForm(empty);
      setOpen(false);
    } catch {
      toast({ title: "Something went wrong", description: "Please check your number and try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Request a call back" data-testid="callback-float-button" className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(10,30,60,0.6)] hover:scale-110 transition-transform">
        <PhoneCall className="w-6 h-6" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white max-w-md" data-testid="callback-dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-navy">Request a call back</DialogTitle>
            <DialogDescription>Leave your number and an advisor will call you.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} data-testid="callback-name-input" />
            <input required type="tel" minLength={7} maxLength={20} pattern="[0-9+\s\-]{7,20}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className={inputCls} data-testid="callback-phone-input" />
            <div>
              <p className="text-xs tracking-[0.12em] uppercase text-navy/60 mb-2">Preferred time</p>
              <div className="flex gap-2">
                {TIMES.map((t) => (
                  <button type="button" key={t} onClick={() => setForm({ ...form, preferred_time: t })} data-testid={`callback-time-${t.toLowerCase()}`} className={`flex-1 py-2 rounded-full text-sm border transition-colors ${form.preferred_time === t ? "bg-navy text-white border-navy" : "border-navy/20 text-navy hover:border-gold"}`}>{t}</button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={sending} data-testid="callback-submit-button" className="w-full bg-navy text-white text-[12px] tracking-[0.15em] py-3.5 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">
              {sending ? "SENDING..." : "CALL ME BACK"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
