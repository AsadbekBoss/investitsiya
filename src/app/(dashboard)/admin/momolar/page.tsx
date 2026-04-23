"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_MOMOLAR, STATUS_COLORS, STATUS_LABELS } from "@/data/mockMomolar";
import { MomoStatus } from "@/types/momo.types";

const STATUS_TABS: { key: MomoStatus | "barchasi"; label: string }[] = [
  { key:"barchasi",          label:"Barchasi" },
  { key:"yuborildi",         label:"Yangi" },
  { key:"korib_chiqilmoqda", label:"Ko'rilmoqda" },
  { key:"bajarilmoqda",      label:"Jarayonda" },
  { key:"bajarildi",         label:"Bajarildi" },
];

const TUR_ICONS: Record<string, string> = {
  elektr:"⚡", suv:"💧", gaz:"🔥", yol:"🛣️", quvur:"🔧",
};

export default function AdminMomolarPage() {
  const [tab,    setTab]    = useState<MomoStatus | "barchasi">("barchasi");
  const [search, setSearch] = useState("");
  const [turFilter, setTurFilter] = useState("barchasi");

  const tashkilotlar = ["Samarqand Energo","Samarqand Suv ta'minoti","Samarqand Gaz","Yo'l xo'jaligi","Kommunal xizmat"];

  const turlar = ["barchasi", ...Array.from(new Set(MOCK_MOMOLAR.map(m => m.tur)))];

  const filtered = useMemo(() => {
    return MOCK_MOMOLAR.filter(m => {
      const matchTab = tab === "barchasi" || m.holat === tab;
      const matchTur = turFilter === "barchasi" || m.tur === turFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || m.id.toLowerCase().includes(q) ||
        m.tavsif.toLowerCase().includes(q) || m.manzil.toLowerCase().includes(q) ||
        m.yuboruvchi.toLowerCase().includes(q);
      return matchTab && matchTur && matchSearch;
    });
  }, [tab, search, turFilter]);

  const counts: Record<string, number> = { barchasi: MOCK_MOMOLAR.length };
  MOCK_MOMOLAR.forEach(m => { counts[m.holat] = (counts[m.holat] || 0) + 1; });
  const shoshilinchCount = MOCK_MOMOLAR.filter(m => m.shoshilinch).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
            Barcha momolar
          </h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
            Tizimga kelgan barcha momolarni boshqarish
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami",        val: MOCK_MOMOLAR.length,                                          color:"#60a5fa" },
          { label:"Yangi",       val: counts["yuborildi"]          || 0,                            color:"#64748b" },
          { label:"Jarayonda",   val: (counts["korib_chiqilmoqda"]||0)+(counts["bajarilmoqda"]||0), color:"#f59e0b" },
          { label:"Shoshilinch", val: shoshilinchCount,                                              color:"#f87171" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:"rgba(100,130,200,0.4)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ID, yuboruvchi, manzil..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.35)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.boxShadow="none";}}
          />
        </div>

        {/* Tur filter */}
        <div className="flex gap-2 flex-wrap">
          {turlar.map(t => (
            <button key={t} onClick={()=>setTurFilter(t)}
              className="text-xs px-3 py-2 rounded-xl font-medium transition-all capitalize"
              style={{
                background: turFilter===t ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${turFilter===t ? "rgba(139,92,246,0.38)" : "rgba(255,255,255,0.07)"}`,
                color: turFilter===t ? "#a78bfa" : "rgba(130,160,210,0.65)",
              }}>
              {t === "barchasi" ? "Barcha turlar" : `${TUR_ICONS[t]||"📋"} ${t.charAt(0).toUpperCase()+t.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(t => (
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

      {/* Table header (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr_80px] gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide"
        style={{ color:"rgba(100,130,200,0.4)" }}>
        <span>Momo ID</span>
        <span>Tavsif</span>
        <span>Tashkilot</span>
        <span>Sana</span>
        <span>Holat</span>
        <span></span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Momolar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Bu toifada momolar yo'q"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m, i) => {
            const sc = STATUS_COLORS[m.holat];
            return (
              <Link key={m.id} href={`/admin/momolar/${m.id}`}
                className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1.5fr_1fr_1fr_80px] gap-3 items-center p-4 rounded-2xl transition-all group"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", animationDelay:`${i*30}ms` }}
                onMouseEnter={(e:any) => { e.currentTarget.style.background="rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e:any) => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; }}>

                {/* ID + icon */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background:`${m.color}18`, border:`1.5px solid ${m.color}35` }}>
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold" style={{ color:"rgba(150,180,230,0.85)" }}>{m.id}</span>
                    {m.shoshilinch && (
                      <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background:"rgba(244,63,94,0.15)", color:"#f87171", border:"1px solid rgba(244,63,94,0.2)" }}>
                        🔴
                      </span>
                    )}
                  </div>
                </div>

                {/* Tavsif */}
                <p className="text-sm line-clamp-1 w-full md:w-auto" style={{ color:"rgba(200,220,255,0.85)" }}>
                  {m.tavsif}
                </p>

                {/* Tashkilot */}
                <p className="text-xs w-full md:w-auto" style={{ color:"rgba(130,160,210,0.6)" }}>
                  🏢 {m.tashkilot}
                </p>

                {/* Sana */}
                <p className="text-xs w-full md:w-auto" style={{ color:"rgba(100,130,200,0.5)" }}>
                  {m.sana.split(" ")[0]}
                </p>

                {/* Status */}
                <div className="w-full md:w-auto">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:`${sc}18`, color:sc, border:`1px solid ${sc}30` }}>
                    {STATUS_LABELS[m.holat]}
                  </span>
                </div>

                {/* Action */}
                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ color:"#60a5fa" }}>
                  Ko'rish →
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-xs text-center" style={{ color:"rgba(100,130,200,0.35)" }}>
        Jami {filtered.length} ta momo ko'rsatilmoqda
      </p>
    </div>
  );
}
