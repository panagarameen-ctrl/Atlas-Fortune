import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Lock, LogOut, Trash2, Check, Mail, Phone, Calendar, Briefcase, FileText, Plus, Pencil, X } from "lucide-react";
import { publicApi, adminApi, setToken, getToken } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import logoFull from "../assets/atlas-logo-full.jpg";
import logoMark from "../assets/atlas-logo-mark.jpg";

const emptyBlog = { slug: "", title: "", category: "", date: "", read: "5 min read", excerpt: "", image: "", content: "", featured: false };

function LoginScreen({ onLogin }) {
  const { toast } = useToast();
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await publicApi.post("/admin/login", { passcode });
      setToken(res.data.token);
      onLogin();
    } catch (err) {
      toast({ title: "Incorrect passcode", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center">
          <img src={logoFull} alt="Atlas Fortune" className="h-11 w-auto mix-blend-multiply" />
        </div>
        <div className="mt-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto"><Lock className="w-5 h-5 text-gold" /></div>
          <h1 className="mt-4 font-display text-2xl text-navy">Admin Access</h1>
          <p className="mt-1 text-sm text-navy/50">Enter the passcode to continue</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="w-full bg-transparent border-b border-navy/20 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold" />
          <button type="submit" disabled={loading} className="w-full bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-3.5 rounded-full hover:bg-navy-800 transition-colors disabled:opacity-60">{loading ? "Checking…" : "Enter Dashboard"}</button>
        </form>
      </div>
    </div>
  );
}

function HandledBadge({ handled, onToggle }) {
  return (
    <button onClick={onToggle} className={`inline-flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full transition-colors ${handled ? "bg-green-100 text-green-700" : "bg-gold/15 text-gold hover:bg-gold/25"}`}>
      <Check className="w-3.5 h-3.5" /> {handled ? "Handled" : "Mark handled"}
    </button>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(!!getToken());
  const [leads, setLeads] = useState([]);
  const [apps, setApps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null); // blog form state or null

  const loadAll = useCallback(async () => {
    try {
      const [l, a, b, bl, cb] = await Promise.all([
        adminApi.get("/leads"), adminApi.get("/applications"), adminApi.get("/bookings"), publicApi.get("/blogs"), adminApi.get("/callbacks"),
      ]);
      setLeads(l.data); setApps(a.data); setBookings(b.data); setBlogs(bl.data); setCallbacks(cb.data);
    } catch (err) {
      if (err?.response?.status === 401) { setToken(null); setAuthed(false); }
    }
  }, []);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  const logout = () => { setToken(null); setAuthed(false); };

  const toggle = async (kind, id, handled) => {
    const map = { leads: setLeads, applications: setApps, bookings: setBookings };
    await adminApi.patch(`/${kind}/${id}`, { handled: !handled });
    loadAll();
  };

  const remove = async (kind, id) => {
    await adminApi.delete(`/${kind}/${id}`);
    loadAll();
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    const payload = { ...editing, content: (editing.content || "").split("\n").map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing._isNew) await adminApi.post("/blogs", payload);
      else await adminApi.put(`/blogs/${editing._origSlug}`, payload);
      toast({ title: "Article saved" });
      setEditing(null); loadAll();
    } catch (err) {
      toast({ title: "Could not save", description: err?.response?.data?.detail || "Try again.", variant: "destructive" });
    }
  };

  const editBlog = (b) => setEditing({ ...b, content: (b.content || []).join("\n"), _origSlug: b.slug, _isNew: false });
  const newBlog = () => setEditing({ ...emptyBlog, _isNew: true });
  const deleteBlog = async (slug) => { await adminApi.delete(`/blogs/${slug}`); toast({ title: "Article deleted" }); loadAll(); };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const counts = {
    leads: leads.filter((x) => !x.handled).length,
    apps: apps.filter((x) => !x.handled).length,
    bookings: bookings.filter((x) => !x.handled).length,
    callbacks: callbacks.filter((x) => !x.handled).length,
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-white">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="bg-white rounded-md p-1 flex items-center justify-center">
              <img src={logoMark} alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="font-display tracking-[0.18em]">ATLAS FORTUNE · ADMIN</span>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Tabs defaultValue="leads">
          <TabsList className="bg-white border border-black/5 max-w-full overflow-x-auto justify-start">
            <TabsTrigger value="leads">Leads {counts.leads > 0 && <span className="ml-1.5 text-gold">({counts.leads})</span>}</TabsTrigger>
            <TabsTrigger value="applications">Applications {counts.apps > 0 && <span className="ml-1.5 text-gold">({counts.apps})</span>}</TabsTrigger>
            <TabsTrigger value="bookings">Bookings {counts.bookings > 0 && <span className="ml-1.5 text-gold">({counts.bookings})</span>}</TabsTrigger>
            <TabsTrigger value="callbacks" data-testid="admin-tab-callbacks">Call-backs {counts.callbacks > 0 && <span className="ml-1.5 text-gold">({counts.callbacks})</span>}</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          {/* CALLBACKS */}
          <TabsContent value="callbacks" className="mt-6 space-y-4">
            {callbacks.length === 0 && <p className="text-navy/50">No call-back requests yet.</p>}
            {callbacks.map((c) => (
              <div key={c.id} data-testid={`admin-callback-${c.id}`} className={`bg-white rounded-xl border p-6 flex flex-wrap items-start justify-between gap-3 ${c.handled ? "border-green-200" : "border-black/5"}`}>
                <div>
                  <h3 className="font-display text-lg text-navy">{c.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-navy/60">
                    <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-gold"><Phone className="w-4 h-4 text-gold" /> {c.phone}</a>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {c.preferred_time}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-navy/40">{new Date(c.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <HandledBadge handled={c.handled} onToggle={() => toggle("callbacks", c.id, c.handled)} />
                  <button onClick={() => remove("callbacks", c.id)} className="text-navy/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* LEADS */}
          <TabsContent value="leads" className="mt-6 space-y-4">
            {leads.length === 0 && <p className="text-navy/50">No consultation leads yet.</p>}
            {leads.map((l) => (
              <div key={l.id} className={`bg-white rounded-xl border p-6 ${l.handled ? "border-green-200" : "border-black/5"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg text-navy">{l.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-navy/60">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gold" /> {l.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gold" /> {l.phone}</span>
                      <span className="text-navy/40">{l.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HandledBadge handled={l.handled} onToggle={() => toggle("leads", l.id, l.handled)} />
                    <button onClick={() => remove("leads", l.id)} className="text-navy/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-navy/70 bg-cream rounded-lg p-3">{l.message}</p>
                <div className="mt-2 text-[11px] text-navy/40">{new Date(l.created_at).toLocaleString()}</div>
              </div>
            ))}
          </TabsContent>

          {/* APPLICATIONS */}
          <TabsContent value="applications" className="mt-6 space-y-4">
            {apps.length === 0 && <p className="text-navy/50">No job applications yet.</p>}
            {apps.map((a) => (
              <div key={a.id} className={`bg-white rounded-xl border p-6 ${a.handled ? "border-green-200" : "border-black/5"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] tracking-[0.14em] uppercase text-gold flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {a.job_title}</div>
                    <h3 className="mt-1 font-display text-lg text-navy">{a.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-navy/60">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gold" /> {a.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gold" /> {a.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HandledBadge handled={a.handled} onToggle={() => toggle("applications", a.id, a.handled)} />
                    <button onClick={() => remove("applications", a.id)} className="text-navy/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {a.note && <p className="mt-3 text-sm text-navy/70 bg-cream rounded-lg p-3">{a.note}</p>}
                <div className="mt-2 text-[11px] text-navy/40">{new Date(a.created_at).toLocaleString()}</div>
              </div>
            ))}
          </TabsContent>

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="mt-6 space-y-4">
            {bookings.length === 0 && <p className="text-navy/50">No bookings yet.</p>}
            {bookings.map((b) => (
              <div key={b.id} className={`bg-white rounded-xl border p-6 ${b.handled ? "border-green-200" : "border-black/5"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] tracking-[0.14em] uppercase text-gold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {b.date} · {b.slot} IST</div>
                    <h3 className="mt-1 font-display text-lg text-navy">{b.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-navy/60">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gold" /> {b.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gold" /> {b.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HandledBadge handled={b.handled} onToggle={() => toggle("bookings", b.id, b.handled)} />
                    <button onClick={() => remove("bookings", b.id)} className="text-navy/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-navy/40">Booked {new Date(b.created_at).toLocaleString()}</div>
              </div>
            ))}
          </TabsContent>

          {/* ARTICLES */}
          <TabsContent value="articles" className="mt-6">
            <div className="flex justify-end mb-4">
              <button onClick={newBlog} className="inline-flex items-center gap-2 bg-navy text-white text-[12px] tracking-[0.14em] uppercase px-5 py-3 rounded-full hover:bg-navy-800 transition-colors"><Plus className="w-4 h-4 text-gold" /> New Article</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((b) => (
                <div key={b.slug} className="bg-white rounded-xl border border-black/5 overflow-hidden flex">
                  <img src={b.image} alt={b.title} className="w-28 h-full object-cover" />
                  <div className="p-4 flex-1">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-gold">{b.category} {b.featured && "· Featured"}</div>
                    <h3 className="mt-1 font-display text-navy leading-tight">{b.title}</h3>
                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => editBlog(b)} className="inline-flex items-center gap-1 text-xs text-navy/60 hover:text-gold"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => deleteBlog(b.slug)} className="inline-flex items-center gap-1 text-xs text-navy/60 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Blog editor dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="bg-cream border-none max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl text-navy">{editing?._isNew ? "New Article" : "Edit Article"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={saveBlog} className="space-y-4">
              {[
                { k: "title", label: "Title" },
                { k: "slug", label: "Slug (url)" },
                { k: "category", label: "Category" },
                { k: "date", label: "Date (e.g. May 4, 2025)" },
                { k: "read", label: "Read time" },
                { k: "image", label: "Cover image URL" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-xs tracking-[0.1em] uppercase text-navy/60">{f.label}</label>
                  <input required={f.k !== "read"} value={editing[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-navy focus:outline-none focus:border-gold" />
                </div>
              ))}
              <div>
                <label className="text-xs tracking-[0.1em] uppercase text-navy/60">Excerpt</label>
                <textarea required value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-navy focus:outline-none focus:border-gold resize-none" />
              </div>
              <div>
                <label className="text-xs tracking-[0.1em] uppercase text-navy/60">Body (one paragraph per line)</label>
                <textarea required value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={6} className="w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-navy focus:outline-none focus:border-gold resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-navy/70">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured article
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-navy text-white text-[12px] tracking-[0.16em] uppercase py-3 rounded-full hover:bg-navy-800">Save</button>
                <button type="button" onClick={() => setEditing(null)} className="px-5 border border-navy/20 rounded-full text-navy text-sm hover:border-gold"><X className="w-4 h-4" /></button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
