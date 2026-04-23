"use client";
import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  INVEST_OBYEKTLAR, HOLAT_COLORS, HOLAT_LABELS,
  type InvestObyekt, type ObyektHolat,
} from "@/data/investObyektlar";
import { MOCK_MOMOLAR, STATUS_COLORS, STATUS_LABELS } from "@/data/mockMomolar";

const InvestMap = dynamic(() => import("@/components/map/InvestMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor:"rgba(59,130,246,0.2)", borderTopColor:"#3b82f6" }} />
        <p className="text-sm text-slate-400">Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

/* ─── Filter config ─── */
const TUR_FILTERS = [
  { key:"all",                    label:"Barchasi",        icon:"🏭" },
  { key:"Ishlab chiqarish",       label:"Ishlab chiqarish",icon:"🔩" },
  { key:"Qurilish materiallari",  label:"Qurilish",        icon:"🧱" },
  { key:"To'qimachilik",          label:"To'qimachilik",   icon:"🧵" },
  { key:"Kimyo sanoati",          label:"Kimyo",           icon:"🎨" },
  { key:"Energetika",             label:"Energetika",      icon:"💨" },
  { key:"Oziq-ovqat sanoati",     label:"Oziq-ovqat",      icon:"🥫" },
  { key:"Qishloq xo'jaligi",      label:"Qishloq xo'j.",   icon:"🌿" },
];
const HOLAT_FILTERS: { key:ObyektHolat|"all"; label:string; color:string }[] = [
  { key:"all",               label:"Hammasi",        color:"#64748b" },
  { key:"ishlamoqda",        label:"Ishlamoqda",     color:"#10b981" },
  { key:"qurilmoqda",        label:"Qurilmoqda",     color:"#f59e0b" },
  { key:"rejalashtirilgan",  label:"Rejalash.",       color:"#3b82f6" },
  { key:"toxtagan",          label:"To'xtatilgan",   color:"#ef4444" },
];

/* ─── Add modal ─── */
const TUMANLAR = [
  "Samarqand shahri","Paxtachi tumani","Kattaqo'rg'on tumani","Urgut tumani",
  "Bulung'ur tumani","Toyloq tumani","Jomboy tumani","Pastdarg'om tumani",
  "Narpay tumani","Oqdaryo tumani","Ishtixon tumani","Kattaqo'rg'on shahri",
];
const TUR_OPTIONS  = ["Ishlab chiqarish","Qurilish materiallari","To'qimachilik","Kimyo sanoati","Energetika","Oziq-ovqat sanoati","Qishloq xo'jaligi"];
const TUR_ICONS:  Record<string,string> = { "Ishlab chiqarish":"🔩","Qurilish materiallari":"🧱","To'qimachilik":"🧵","Kimyo sanoati":"🎨","Energetika":"💨","Oziq-ovqat sanoati":"🥫","Qishloq xo'jaligi":"🌿" };
const TUR_COLORS: Record<string,string> = { "Ishlab chiqarish":"#f59e0b","Qurilish materiallari":"#ef4444","To'qimachilik":"#8b5cf6","Kimyo sanoati":"#06b6d4","Energetika":"#10b981","Oziq-ovqat sanoati":"#f97316","Qishloq xo'jaligi":"#22c55e" };

interface NewForm {
  nomi:string; tur:string; tuman:string; manzil:string; quvvat:string;
  qiymat:string; xorijiy:string; maydon:string; ish_joylari:string;
  mahsulot:string; tavsif:string; holat:ObyektHolat; lat:string; lng:string;
}
const EMPTY: NewForm = {
  nomi:"",tur:"Ishlab chiqarish",tuman:"Samarqand shahri",manzil:"",
  quvvat:"",qiymat:"",xorijiy:"—",maydon:"",ish_joylari:"",
  mahsulot:"",tavsif:"",holat:"rejalashtirilgan",lat:"39.6542",lng:"66.9597",
};

/* ─── Holat report ─── */
interface HolatReport { id:string; sana:string; izoh:string; foiz:string; }

/* ─── Photo card with fallback ─── */
const PLACEHOLDER_COLORS = ["#1e3a5f","#1a3a2a","#2a1a3a","#2a2a1a","#1a2a3a"];
const PLACEHOLDER_ICONS  = ["🏭","🏗️","🌿","⚙️","📸"];

function PhotoCard({ src, alt, color, idx }: { src:string; alt:string; color:string; idx:number }) {
  const [failed, setFailed] = useState(false);
  const isPath = src.startsWith("/") || src.startsWith("http");

  if (!isPath || failed) {
    return (
      <div className="aspect-video rounded-xl flex flex-col items-center justify-center gap-1 overflow-hidden"
        style={{ background:`linear-gradient(135deg, ${PLACEHOLDER_COLORS[idx%5]}, ${PLACEHOLDER_COLORS[(idx+2)%5]})`, border:`1px solid ${color}30` }}>
        <span className="text-3xl">{PLACEHOLDER_ICONS[idx%5]}</span>
        <span className="text-[10px] text-white/50">Rasm {idx+1}</span>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden relative" style={{ border:`1px solid ${color}25` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} onError={() => setFailed(true)}
        className="w-full h-full object-cover" />
    </div>
  );
}

type TabKey = "pasport" | "holat" | "momolar";

export default function AdminDashboard() {
  const [objects,       setObjects]      = useState<InvestObyekt[]>(INVEST_OBYEKTLAR);
  const [turFilter,     setTurFilter]    = useState("all");
  const [holatFilter,   setHolatFilter]  = useState<ObyektHolat|"all">("all");
  const [selected,      setSelected]     = useState<InvestObyekt|null>(null);
  const [tab,           setTab]          = useState<TabKey>("pasport");
  /* holat reports per object */
  const [reports,       setReports]      = useState<Record<string,HolatReport[]>>({});
  const [repIzoh,       setRepIzoh]      = useState("");
  const [repFoiz,       setRepFoiz]      = useState("");
  const [repSaved,      setRepSaved]     = useState(false);
  /* add modal */
  const [addOpen,       setAddOpen]      = useState(false);
  const [form,          setForm]         = useState<NewForm>(EMPTY);
  const [errors,        setErrors]       = useState<Partial<NewForm>>({});
  const [addSaved,      setAddSaved]     = useState(false);

  const handleSelect = useCallback((obj: InvestObyekt) => {
    setSelected(obj); setTab("pasport");
  }, []);

  const filtered = useMemo(() => objects.filter(o => {
    const t = turFilter   === "all" || o.tur   === turFilter;
    const h = holatFilter === "all" || o.holat === holatFilter;
    return t && h;
  }), [objects, turFilter, holatFilter]);

  const vis = selected && filtered.find(o => o.id === selected.id) ? selected : null;

  const objMomolar = vis
    ? MOCK_MOMOLAR.filter(m =>
        m.manzil.toLowerCase().includes(vis.tuman.split(" ")[0].toLowerCase()) ||
        m.tashkilot.toLowerCase().includes(vis.tur.toLowerCase())
      )
    : [];

  /* stats */
  const stats = [
    { v:objects.filter(o=>o.holat==="ishlamoqda").length,       c:"#10b981", l:"Ishlamoqda" },
    { v:objects.filter(o=>o.holat==="qurilmoqda").length,        c:"#f59e0b", l:"Qurilmoqda" },
    { v:objects.filter(o=>o.holat==="rejalashtirilgan").length,  c:"#3b82f6", l:"Rejalas." },
  ];

  /* holat report submit */
  const submitReport = () => {
    if (!vis || !repIzoh.trim()) return;
    const r: HolatReport = {
      id:   `HR-${Date.now()}`,
      sana: new Date().toLocaleString("uz-UZ"),
      izoh: repIzoh,
      foiz: repFoiz,
    };
    setReports(p => ({ ...p, [vis.id]: [r, ...(p[vis.id] ?? [])] }));
    setRepIzoh(""); setRepFoiz("");
    setRepSaved(true);
    setTimeout(() => setRepSaved(false), 2000);
  };

  /* add form */
  const F = (k: keyof NewForm) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
      setForm(p => ({ ...p, [k]:e.target.value }));
      setErrors(p => ({ ...p, [k]:undefined }));
    };
  const validate = () => {
    const e: Partial<NewForm> = {};
    if (!form.nomi.trim())    e.nomi    = "Majburiy";
    if (!form.manzil.trim())  e.manzil  = "Majburiy";
    if (!form.quvvat.trim())  e.quvvat  = "Majburiy";
    if (!form.qiymat.trim())  e.qiymat  = "Majburiy";
    if (!form.maydon.trim())  e.maydon  = "Majburiy";
    if (!form.mahsulot.trim()) e.mahsulot = "Majburiy";
    setErrors(e); return !Object.keys(e).length;
  };
  const handleAdd = () => {
    if (!validate()) return;
    const newObj: InvestObyekt = {
      id:          `INV-${String(objects.length+1).padStart(3,"0")}`,
      nomi:        form.nomi, tur:form.tur,
      icon:        TUR_ICONS[form.tur]  || "🏭",
      color:       TUR_COLORS[form.tur] || "#64748b",
      lat:         parseFloat(form.lat) || 39.6542,
      lng:         parseFloat(form.lng) || 66.9597,
      tuman:       form.tuman, manzil:form.manzil,
      quvvat:      form.quvvat, qiymat:form.qiymat, xorijiy:form.xorijiy||"—",
      maydon:      form.maydon, holat:form.holat,
      ish_joylari: parseInt(form.ish_joylari)||0,
      mahsulot:    form.mahsulot, tavsif:form.tavsif,
      rasmlar:     [],
    };
    setObjects(p => [...p, newObj]);
    setAddSaved(true);
    setTimeout(() => { setAddSaved(false); setAddOpen(false); setForm(EMPTY); setErrors({}); }, 1300);
  };

  const inp  = "w-full px-3 py-2 rounded-xl text-sm border outline-none transition-all";
  const inpS = `${inp} bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100`;
  const inpE = `${inp} bg-red-50 border-red-300 text-slate-800 focus:border-red-400`;

  return (
    <div className="relative -m-6" style={{ height:"calc(100vh - 60px)" }}>

      {/* ══ MAP ══ */}
      <div className="absolute inset-0">
        <InvestMap objects={filtered} selected={vis?.id ?? null} onSelect={handleSelect} />
      </div>

      {/* ══ TOP FILTER BAR ══ */}
      <div className="absolute top-0 left-0 z-[1000] flex items-center gap-1 px-3 py-2 flex-wrap"
        style={{
          right: vis ? 500 : 0,
          background:"rgba(255,255,255,0.93)",
          backdropFilter:"blur(12px) saturate(160%)",
          borderBottom:"1px solid rgba(0,0,0,0.07)",
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
        }}>

        {TUR_FILTERS.map(f => (
          <button key={f.key} onClick={() => setTurFilter(f.key)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: turFilter===f.key ? "#2563eb" : "transparent",
              color:      turFilter===f.key ? "#fff"    : "#64748b",
              border:     turFilter===f.key ? "1px solid #2563eb" : "1px solid transparent",
            }}>
            {f.icon} {f.label}
          </button>
        ))}

        <div className="w-px h-5 bg-slate-200 mx-0.5 flex-shrink-0" />

        {HOLAT_FILTERS.map(f => (
          <button key={f.key} onClick={() => setHolatFilter(f.key as ObyektHolat|"all")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: holatFilter===f.key ? `${f.color}18` : "transparent",
              color:      holatFilter===f.key ? f.color          : "#64748b",
              border:     holatFilter===f.key ? `1px solid ${f.color}45` : "1px solid transparent",
            }}>
            {f.label}
            {f.key !== "all" && (
              <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                style={{ background:holatFilter===f.key ? `${f.color}25` : "#f1f5f9", color:holatFilter===f.key ? f.color : "#94a3b8" }}>
                {objects.filter(o=>o.holat===f.key).length}
              </span>
            )}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400">📍 {filtered.length} ta</span>
          <button onClick={() => { setAddOpen(true); setForm(EMPTY); setErrors({}); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
            style={{ background:"#2563eb", boxShadow:"0 2px 8px rgba(37,99,235,0.3)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#1d4ed8")}
            onMouseLeave={e=>(e.currentTarget.style.background="#2563eb")}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Qo'shish
          </button>
          <Link href="/admin/momolar"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#2563eb" }}>
            Momolar →
          </Link>
        </div>
      </div>

      {/* ══ Legend + stats (bottom-left) ══ */}
      <div className="absolute z-[999] p-3 rounded-2xl"
        style={{
          bottom:24, left:16,
          background:"rgba(255,255,255,0.95)",
          backdropFilter:"blur(10px)",
          border:"1px solid rgba(0,0,0,0.07)",
          boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
          minWidth:150,
        }}>
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
          🏭 {objects.length} ta obyekt
          <div className="w-px h-3.5 bg-slate-200" />
          {stats.map(s => (
            <span key={s.l} className="flex items-center gap-1 font-semibold" style={{ color:s.c }}>
              <span className="w-2 h-2 rounded-full" style={{ background:s.c }} />{s.v}
            </span>
          ))}
        </div>
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Holat</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2">
          {Object.entries(HOLAT_LABELS).map(([k,v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:HOLAT_COLORS[k as ObyektHolat] }} />
              <span className="text-[10px] text-slate-600">{v}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-slate-100 mb-1.5" />
        <div className="flex items-center gap-2">
          <span className="w-5 h-0.5 rounded flex-shrink-0 bg-green-600" />
          <span className="text-[10px] text-slate-600">Shahar chegarasi</span>
        </div>
      </div>

      {/* ══ Hint ══ */}
      {!vis && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2 rounded-2xl pointer-events-none"
          style={{ background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)", border:"1px solid rgba(0,0,0,0.08)", color:"#475569", fontSize:13, boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
          Marker ustiga bosib obyektni tanlang
        </div>
      )}

      {/* ══ DETAIL PANEL ══ */}
      <div
        className="absolute top-0 bottom-0 right-0 z-[900] overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out"
        style={{
          width:   vis ? 500 : 0,
          opacity: vis ? 1   : 0,
          background:"#fff",
          borderLeft:"1px solid #e2e8f0",
          boxShadow: vis ? "-4px 0 24px rgba(0,0,0,0.08)" : "none",
        }}>

        {vis && (
          <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-start gap-3 p-5 border-b border-slate-100 flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background:vis.color, boxShadow:`0 4px 16px ${vis.color}55` }}>
                {vis.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono text-slate-400 mb-0.5">#{vis.id}</p>
                <p className="text-base font-bold text-slate-800 leading-snug">{vis.nomi}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background:`${HOLAT_COLORS[vis.holat]}15`, color:HOLAT_COLORS[vis.holat], border:`1px solid ${HOLAT_COLORS[vis.holat]}35` }}>
                    {HOLAT_LABELS[vis.holat]}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    {vis.tur}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mx-5 mt-4 mb-2 p-1 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0">
              {([
                ["pasport", "📋 Pasport"],
                ["holat",   "📊 Hozirgi holat"],
                ["momolar", "⚠️ Momolar"],
              ] as [TabKey,string][]).map(([k,l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: tab===k ? "#fff" : "transparent",
                    color:      tab===k ? "#1d4ed8" : "#94a3b8",
                    boxShadow:  tab===k ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}>
                  {l}
                  {k==="momolar" && objMomolar.length>0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-500">{objMomolar.length}</span>
                  )}
                  {k==="holat" && (reports[vis.id]?.length ?? 0)>0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-600">{reports[vis.id].length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2 space-y-3">

              {/* ─── PASPORT ─── */}
              {tab === "pasport" && (<>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label:"Tuman",           val:vis.tuman,                   icon:"📍" },
                    { label:"Mahsulot",         val:vis.mahsulot,                icon:"📦" },
                    { label:"Quvvat",           val:vis.quvvat,                  icon:"⚙️" },
                    { label:"Loyiha qiymati",   val:vis.qiymat,                  icon:"💰" },
                    { label:"Xorijiy inv.",     val:vis.xorijiy,                 icon:"🌐" },
                    { label:"Yer maydoni",      val:vis.maydon,                  icon:"🗺️" },
                    { label:"Ish joylari",      val:`${vis.ish_joylari} kishi`,  icon:"👷" },
                    { label:"ID",               val:vis.id,                      icon:"🔖" },
                  ].map(r => (
                    <div key={r.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">{r.icon} {r.label}</p>
                      <p className="text-sm font-semibold text-slate-700 leading-snug">{r.val}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-bold text-blue-500 mb-1.5">ℹ️ Tavsif</p>
                  <p className="text-sm leading-relaxed text-slate-600">{vis.tavsif}</p>
                </div>

                {/* Photos */}
                {vis.rasmlar.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-2">📸 Loyiha rasmlari</p>
                    <div className="grid grid-cols-2 gap-2">
                      {vis.rasmlar.map((src, i) => (
                        <PhotoCard key={i} src={src} alt={`${vis.nomi} — rasm ${i+1}`} color={vis.color} idx={i} />
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => setTab("momolar")}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-500 hover:bg-red-100">
                  ⚠️ Ushbu hududdagi momolarni ko'rish
                  {objMomolar.length>0 && <span className="px-2 py-0.5 rounded bg-red-100">{objMomolar.length}</span>}
                </button>
              </>)}

              {/* ─── HOZIRGI HOLAT ─── */}
              {tab === "holat" && (<>
                {/* New report form */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-0.5">📊 Yangi holat hisoboti</p>
                    <p className="text-xs text-slate-400">Obyektning hozirgi qurilish yoki ish holati haqida ma'lumot kiriting</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Bajarilish foizi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={0} max={100} step={5}
                        value={repFoiz || "0"}
                        onChange={e => setRepFoiz(e.target.value)}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-sm font-bold text-blue-600 w-12 text-right">{repFoiz||0}%</span>
                    </div>
                    {repFoiz && (
                      <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ background:"#2563eb", width:`${repFoiz}%` }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Izoh / tavsif <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={repIzoh} onChange={e => setRepIzoh(e.target.value)} rows={4}
                      placeholder="Hozirgi holat haqida yozing: qurilish borayaptimi, muammolar bormi, rejalashtirilgan ishlar..."
                      className="w-full px-3 py-2.5 rounded-xl text-sm border border-slate-200 outline-none bg-white text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
                  </div>

                  <button
                    onClick={submitReport}
                    disabled={!repIzoh.trim()}
                    className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: repSaved ? "#10b981" : repIzoh.trim() ? "#2563eb" : "#e2e8f0",
                      color:      repSaved ? "#fff"    : repIzoh.trim() ? "#fff"    : "#94a3b8",
                      boxShadow:  repIzoh.trim() && !repSaved ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
                    }}>
                    {repSaved
                      ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Yuborildi!</>
                      : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Hisobotni yuborish</>
                    }
                  </button>
                </div>

                {/* History */}
                {(reports[vis.id]?.length ?? 0) > 0 ? (<>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-bold">OLDINGI HISOBOTLAR</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  {reports[vis.id].map((r, i) => (
                    <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[11px] font-bold">{i+1}</span>
                          Hisobot
                        </span>
                        <span className="text-xs text-slate-400">{r.sana}</span>
                      </div>
                      {r.foiz && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Bajarilish</span>
                            <span className="font-bold text-blue-600">{r.foiz}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500" style={{ width:`${r.foiz}%` }} />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100">{r.izoh}</p>
                    </div>
                  ))}
                </>) : (
                  <div className="py-6 rounded-2xl text-center"
                    style={{ background:"#f0fdf4", border:"1.5px dashed #86efac" }}>
                    <p className="text-3xl mb-2">📷</p>
                    <p className="text-sm font-semibold text-green-700 mb-1">Hozirgi holat surati yo'q</p>
                    <p className="text-xs text-green-600/70 leading-relaxed px-4">
                      Foydalanuvchilar mobil ilova orqali ushbu loyihaning hozirgi ko'rinishini rasmga tushirib yuborishi mumkin
                    </p>
                  </div>
                )}
              </>)}

              {/* ─── MOMOLAR ─── */}
              {tab === "momolar" && (<>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">{vis.tuman}</p>
                  <Link href="/admin/momolar" className="text-xs font-semibold text-blue-500 hover:underline">Barchasini ko'rish →</Link>
                </div>

                {objMomolar.length === 0 ? (
                  <div className="py-6 rounded-2xl text-center"
                    style={{ background:"#fff7ed", border:"1.5px dashed #fdba74" }}>
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-sm font-semibold text-orange-700 mb-1">Bu hududda momo yo'q</p>
                    <p className="text-xs text-orange-600/70 leading-relaxed px-4">
                      Fuqarolar ushbu hudud bo'yicha muammo yoki taklif bo'lsa, mobil ilova orqali momo yuborishi mumkin
                    </p>
                    <Link href="/admin/momolar"
                      className="inline-block mt-3 px-4 py-1.5 rounded-lg text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all">
                      Barcha momolarni ko'rish →
                    </Link>
                  </div>
                ) : objMomolar.map(m => {
                  const sc = STATUS_COLORS[m.holat];
                  return (
                    <Link key={m.id} href={`/admin/momolar/${m.id}`}
                      className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background:`${m.color}20`, border:`1px solid ${m.color}30` }}>
                          {m.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-slate-400">{m.id}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background:`${sc}15`, color:sc }}>{STATUS_LABELS[m.holat]}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-700 leading-snug mb-1">{m.tavsif}</p>
                          <p className="text-xs text-slate-400">📍 {m.manzil}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          background:sc,
                          width: m.holat==="yuborildi"?"25%":m.holat==="korib_chiqilmoqda"?"50%":m.holat==="bajarilmoqda"?"75%":"100%",
                        }} />
                      </div>
                    </Link>
                  );
                })}
              </>)}

            </div>
          </div>
        )}
      </div>

      {/* ══ ADD MODAL ══ */}
      {addOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">

            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Yangi investitsiya obyekti</h2>
                <p className="text-xs text-slate-400">Barcha * maydonlarni to'ldiring</p>
              </div>
              <button onClick={() => setAddOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Korxona nomi <span className="text-red-400">*</span></label>
                <input value={form.nomi} onChange={F("nomi")} placeholder="Masalan: Plastik buyumlar zavodi"
                  className={errors.nomi ? inpE : inpS} />
                {errors.nomi && <p className="text-[10px] text-red-400 mt-1">{errors.nomi}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tur *</label>
                  <select value={form.tur} onChange={F("tur")} className={`${inpS} cursor-pointer`}>
                    {TUR_OPTIONS.map(t => <option key={t}>{TUR_ICONS[t]} {t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Holat *</label>
                  <select value={form.holat} onChange={F("holat")} className={`${inpS} cursor-pointer`}>
                    <option value="rejalashtirilgan">📋 Rejalashtirilgan</option>
                    <option value="qurilmoqda">🏗️ Qurilmoqda</option>
                    <option value="ishlamoqda">✅ Ishlamoqda</option>
                    <option value="toxtagan">⛔ To'xtatilgan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tuman *</label>
                  <select value={form.tuman} onChange={F("tuman")} className={`${inpS} cursor-pointer`}>
                    {TUMANLAR.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Manzil *</label>
                  <input value={form.manzil} onChange={F("manzil")} placeholder="Ko'cha, mahalla..."
                    className={errors.manzil ? inpE : inpS} />
                  {errors.manzil && <p className="text-[10px] text-red-400 mt-1">{errors.manzil}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quvvat *</label>
                  <input value={form.quvvat} onChange={F("quvvat")} placeholder="50 000 dona/yil"
                    className={errors.quvvat ? inpE : inpS} />
                  {errors.quvvat && <p className="text-[10px] text-red-400 mt-1">{errors.quvvat}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Maydon *</label>
                  <input value={form.maydon} onChange={F("maydon")} placeholder="2 gektar"
                    className={errors.maydon ? inpE : inpS} />
                  {errors.maydon && <p className="text-[10px] text-red-400 mt-1">{errors.maydon}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loyiha qiymati *</label>
                  <input value={form.qiymat} onChange={F("qiymat")} placeholder="5 million USD"
                    className={errors.qiymat ? inpE : inpS} />
                  {errors.qiymat && <p className="text-[10px] text-red-400 mt-1">{errors.qiymat}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Xorijiy investitsiya</label>
                  <input value={form.xorijiy} onChange={F("xorijiy")} placeholder="2 million USD" className={inpS} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mahsulot *</label>
                  <input value={form.mahsulot} onChange={F("mahsulot")} placeholder="Ishlab chiqariladigan mahsulot"
                    className={errors.mahsulot ? inpE : inpS} />
                  {errors.mahsulot && <p className="text-[10px] text-red-400 mt-1">{errors.mahsulot}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ish joylari</label>
                  <input type="number" value={form.ish_joylari} onChange={F("ish_joylari")} placeholder="0" className={inpS} min={0} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">📍 Koordinatalar</label>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.lat} onChange={F("lat")} placeholder="Kenglik: 39.6542" className={inpS} />
                  <input value={form.lng} onChange={F("lng")} placeholder="Uzunlik: 66.9597" className={inpS} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Google Maps → o'ng tugma → "Bu yerning koordinatalari"</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tavsif</label>
                <textarea value={form.tavsif} onChange={F("tavsif")} rows={3}
                  placeholder="Loyiha haqida qisqacha ma'lumot..."
                  className={`${inpS} resize-none`} />
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button onClick={() => setAddOpen(false)}
                className="px-5 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-200 transition-all font-semibold">
                Bekor qilish
              </button>
              <button onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background:addSaved ? "#10b981":"#2563eb", boxShadow:addSaved ? "0 2px 8px rgba(16,185,129,0.4)":"0 2px 8px rgba(37,99,235,0.35)" }}>
                {addSaved
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saqlandi!</>
                  : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Qo'shish</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
