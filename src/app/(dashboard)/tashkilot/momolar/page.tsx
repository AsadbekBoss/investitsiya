"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_MOMOLAR, STATUS_COLORS, STATUS_LABELS, NEXT_STATUS, NEXT_BTN } from "@/data/mockMomolar";
import { MomoStatus } from "@/types/momo.types";
import type { Momo } from "@/data/mockMomolar";

const TABS: { key: MomoStatus | "barchasi"; label: string }[] = [
  { key:"barchasi",          label:"Barchasi" },
  { key:"yuborildi",         label:"Yangi" },
  { key:"korib_chiqilmoqda", label:"Ko'rilmoqda" },
  { key:"bajarilmoqda",      label:"Jarayonda" },
  { key:"bajarildi",         label:"Bajarildi" },
];

export default function TashkilotMomolarPage() {
  const [tab,     setTab]     = useState<MomoStatus | "barchasi">("barchasi");
  const [search,  setSearch]  = useState("");
  const [momolar, setMomolar] = useState<Momo[]>(MOCK_MOMOLAR);
  // Track izoh inputs per momo
  const [izohMap, setIzohMap] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return momolar.filter(m => {
      const matchTab = tab === "barchasi" || m.holat === tab;
      const q = search.toLowerCase();
      const matchSearch = !q || m.id.toLowerCase().includes(q) ||
        m.tavsif.toLowerCase().includes(q) || m.manzil.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [momolar, tab, search]);

  const counts: Record<string, number> = { barchasi: momolar.length };
  momolar.forEach(m => { counts[m.holat] = (counts[m.holat] || 0) + 1; });

  const advance = (id: string) => {
    const momo = momolar.find(m => m.id === id);
    if (!momo) return;
    const next = NEXT_STATUS[momo.holat];
    if (!next) return;
    const izoh = izohMap[id] || undefined;
    setMomolar(prev => prev.map(m => {
      if (m.id !== id) return m;
      return {
        ...m,
        holat: next,
        tarix: [...m.tarix, { holat: next, vaqt: new Date().toLocaleString("uz-UZ"), izoh }],
      };
    }));
    setIzohMap(prev => { const n = {...prev}; delete n[id]; return n; });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
          Kelgan momolar
        </h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Sizga yo'naltirilgan momolarni kuzating va boshqaring
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami",      val: momolar.length,                                              color:"#60a5fa" },
          { label:"Yangi",     val: counts["yuborildi"]          || 0,                           color:"#64748b" },
          { label:"Jarayonda", val: (counts["korib_chiqilmoqda"]||0)+(counts["bajarilmoqda"]||0), color:"#f59e0b" },
          { label:"Bajarildi", val: counts["bajarildi"]          || 0,                           color:"#10b981" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:"rgba(100,130,200,0.4)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ID, tavsif yoki manzil..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.35)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.boxShadow="none";}}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)}
              className="text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5"
              style={{
                background: tab===t.key ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${tab===t.key ? "rgba(59,130,246,0.38)" : "rgba(255,255,255,0.07)"}`,
                color: tab===t.key ? "#60a5fa" : "rgba(130,160,210,0.65)",
              }}>
              {t.label}
              {(counts[t.key]||0) > 0 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{ background:"rgba(255,255,255,0.08)", color:"inherit" }}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3">🔧</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Momolar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Bu toifada momolar yo'q"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const sc      = STATUS_COLORS[m.holat];
            const nextBtn = NEXT_BTN[m.holat];
            const done    = !nextBtn;
            return (
              <div key={m.id} className="rounded-2xl overflow-hidden"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>

                {/* Card header */}
                <div className="flex items-start gap-4 p-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background:`${m.color}18`, border:`1.5px solid ${m.color}35` }}>
                    {m.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-lg"
                        style={{ background:"rgba(255,255,255,0.06)", color:"rgba(100,130,200,0.7)" }}>
                        {m.id}
                      </span>
                      {m.shoshilinch && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
                          style={{ background:"rgba(244,63,94,0.15)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
                          🔴 Shoshilinch
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold mb-1.5 line-clamp-2"
                      style={{ color:"rgba(200,220,255,0.9)" }}>{m.tavsif}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap"
                      style={{ color:"rgba(100,130,200,0.55)" }}>
                      <span>📍 {m.manzil}</span>
                      <span>👤 {m.yuboruvchi}</span>
                      <span>🕐 {m.sana}</span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:`${sc}18`, color:sc, border:`1px solid ${sc}30` }}>
                      {STATUS_LABELS[m.holat]}
                    </span>
                    <Link href={`/tashkilot/momolar/${m.id}`}
                      className="text-xs font-medium transition-colors"
                      style={{ color:"rgba(96,165,250,0.7)" }}
                      onMouseEnter={(e:any) => e.currentTarget.style.color="#60a5fa"}
                      onMouseLeave={(e:any) => e.currentTarget.style.color="rgba(96,165,250,0.7)"}>
                      Batafsil →
                    </Link>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mx-4 h-1 rounded-full overflow-hidden mb-3"
                  style={{ background:"rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      background: sc,
                      width: m.holat==="yuborildi"?"25%": m.holat==="korib_chiqilmoqda"?"50%": m.holat==="bajarilmoqda"?"75%":"100%",
                      boxShadow:`0 0 8px ${sc}60`,
                    }} />
                </div>

                {/* Action area */}
                {!done ? (
                  <div className="px-4 pb-4 pt-1 border-t"
                    style={{ borderColor:"rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.01)" }}>
                    <div className="flex gap-3 items-end mt-3">
                      <textarea
                        value={izohMap[m.id] || ""}
                        onChange={e=>setIzohMap(prev=>({...prev,[m.id]:e.target.value}))}
                        placeholder="Izoh qoldiring (ixtiyoriy)..."
                        rows={1}
                        className="flex-1 text-sm px-3 py-2 rounded-xl outline-none resize-none"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
                        onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.3)";}}
                        onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
                      />
                      <button onClick={()=>advance(m.id)}
                        className="text-sm font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0"
                        style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#34d399" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(16,185,129,0.25)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(16,185,129,0.15)")}>
                        ✓ {nextBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color:"#34d399" }}>✓ Muvaffaqiyatli yakunlangan</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
