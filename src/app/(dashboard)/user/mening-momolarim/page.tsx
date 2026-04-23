"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_MOMOLAR, STATUS_COLORS, STATUS_LABELS } from "@/data/mockMomolar";
import { MomoStatus } from "@/types/momo.types";

const TABS: { key: MomoStatus | "barchasi"; label: string }[] = [
  { key:"barchasi",          label:"Barchasi" },
  { key:"yuborildi",         label:"Yangi" },
  { key:"korib_chiqilmoqda", label:"Ko'rilmoqda" },
  { key:"bajarilmoqda",      label:"Jarayonda" },
  { key:"bajarildi",         label:"Bajarildi" },
];

export default function MeningMomolarimPage() {
  const [tab, setTab]       = useState<MomoStatus | "barchasi">("barchasi");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_MOMOLAR.filter(m => {
      const matchTab = tab === "barchasi" || m.holat === tab;
      const q = search.toLowerCase();
      const matchSearch = !q || m.id.toLowerCase().includes(q) ||
        m.tavsif.toLowerCase().includes(q) || m.manzil.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [tab, search]);

  const counts: Record<string, number> = { barchasi: MOCK_MOMOLAR.length };
  MOCK_MOMOLAR.forEach(m => { counts[m.holat] = (counts[m.holat] || 0) + 1; });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
            Mening momolarim
          </h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
            Yuborgan momolaringiz tarixi va holati
          </p>
        </div>
        <Link href="/user/momo-yuborish"
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={(e:any) => e.currentTarget.style.background="rgba(59,130,246,0.25)"}
          onMouseLeave={(e:any) => e.currentTarget.style.background="rgba(59,130,246,0.15)"}>
          <span className="text-base">+</span> Yangi momo
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami",       val: MOCK_MOMOLAR.length,                                         color:"#60a5fa" },
          { label:"Yangi",      val: counts["yuborildi"]         || 0,                            color:"#64748b" },
          { label:"Jarayonda",  val: (counts["korib_chiqilmoqda"]||0)+(counts["bajarilmoqda"]||0), color:"#f59e0b" },
          { label:"Bajarildi",  val: counts["bajarildi"]         || 0,                            color:"#10b981" },
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
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
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
              {counts[t.key] > 0 && (
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
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Momolar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Hali momo yubormagansiz"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => {
            const sc = STATUS_COLORS[m.holat];
            return (
              <Link key={m.id} href={`/user/mening-momolarim/${m.id}`}
                className="block rounded-2xl p-4 transition-all group"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", animationDelay:`${i*40}ms` }}
                onMouseEnter={(e:any) => { e.currentTarget.style.background="rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={(e:any) => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform=""; }}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
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
                    <p className="text-sm font-semibold mb-1.5 line-clamp-1"
                      style={{ color:"rgba(200,220,255,0.9)" }}>{m.tavsif}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap"
                      style={{ color:"rgba(100,130,200,0.55)" }}>
                      <span>📍 {m.manzil}</span>
                      <span>🕐 {m.sana}</span>
                      {m.tashkilot && <span>🏢 {m.tashkilot}</span>}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:`${sc}18`, color:sc, border:`1px solid ${sc}30` }}>
                      {STATUS_LABELS[m.holat]}
                    </span>
                    {m.izoh && (
                      <span className="text-[10px] text-right max-w-[120px] line-clamp-1"
                        style={{ color:"rgba(100,130,200,0.45)" }}>
                        {m.izoh}
                      </span>
                    )}
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color:"#60a5fa" }}>
                      Ko'rish →
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1 rounded-full overflow-hidden"
                  style={{ background:"rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      background: sc,
                      width: m.holat==="yuborildi" ? "25%" : m.holat==="korib_chiqilmoqda" ? "50%" : m.holat==="bajarilmoqda" ? "75%" : "100%",
                      boxShadow:`0 0 8px ${sc}60`,
                    }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
