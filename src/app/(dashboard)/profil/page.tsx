"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Superadmin",
  admin:      "Admin",
  tashkilot:  "Tashkilot",
  user:       "Foydalanuvchi",
};
const ROLE_COLORS: Record<string, string> = {
  superadmin: "#f43f5e",
  admin:      "#3b82f6",
  tashkilot:  "#10b981",
  user:       "#f59e0b",
};

export default function ProfilPage() {
  const { user } = useAuthStore();
  const dot = ROLE_COLORS[user?.role || "user"];

  const [ism,       setIsm]       = useState(user?.ism || "");
  const [email,     setEmail]     = useState(user?.email || "");
  const [tel,       setTel]       = useState("+998 90 000 00 00");
  const [parol,     setParol]     = useState("");
  const [parol2,    setParol2]    = useState("");
  const [showP,     setShowP]     = useState(false);
  const [showP2,    setShowP2]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [pwdSaved,  setPwdSaved]  = useState(false);
  const [pwdError,  setPwdError]  = useState("");

  const handleSaveInfo = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePwd = () => {
    if (!parol) { setPwdError("Parol kiritilmadi"); return; }
    if (parol.length < 6) { setPwdError("Kamida 6 ta belgi bo'lishi kerak"); return; }
    if (parol !== parol2) { setPwdError("Parollar mos kelmadi"); return; }
    setPwdError("");
    setParol(""); setParol2("");
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Profil</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Shaxsiy ma'lumotlar va hisob sozlamalari</p>
      </div>

      {/* Avatar card */}
      <div className="p-6 rounded-2xl flex items-center gap-5"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
          style={{ background:`${dot}20`, border:`2px solid ${dot}50`, boxShadow:`0 0 28px ${dot}30`, color:dot }}>
          {user?.ism?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1" style={{ color:"rgba(210,225,255,0.95)" }}>{user?.ism}</h2>
          <p className="text-sm mb-2" style={{ color:"rgba(120,150,200,0.6)" }}>{user?.email}</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background:`${dot}18`, color:dot, border:`1px solid ${dot}35` }}>
            {ROLE_LABELS[user?.role || "user"]}
          </span>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs mb-1" style={{ color:"rgba(100,130,200,0.45)" }}>ID</p>
          <p className="text-sm font-mono font-semibold" style={{ color:"rgba(150,180,230,0.65)" }}>
            #{user?.id?.slice?.(0,8) || "—"}
          </p>
        </div>
      </div>

      {/* Ma'lumotlar */}
      <div className="p-5 rounded-2xl space-y-4"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-sm font-bold" style={{ color:"rgba(150,180,230,0.75)" }}>👤 Shaxsiy ma'lumotlar</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(120,150,200,0.55)" }}>To'liq ism</label>
            <input value={ism} onChange={e=>setIsm(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(120,150,200,0.55)" }}>Telefon</label>
            <input value={tel} onChange={e=>setTel(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(120,150,200,0.55)" }}>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>
        </div>

        <button onClick={handleSaveInfo}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: saved ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.15)",
            border: `1px solid ${saved ? "rgba(16,185,129,0.4)" : "rgba(59,130,246,0.35)"}`,
            color: saved ? "#34d399" : "#60a5fa",
          }}
          onMouseEnter={e=>{ if(!saved) e.currentTarget.style.background="rgba(59,130,246,0.25)"; }}
          onMouseLeave={e=>{ if(!saved) e.currentTarget.style.background="rgba(59,130,246,0.15)"; }}>
          {saved ? "✓ Saqlandi!" : "💾 Saqlash"}
        </button>
      </div>

      {/* Parol */}
      <div className="p-5 rounded-2xl space-y-4"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-sm font-bold" style={{ color:"rgba(150,180,230,0.75)" }}>🔒 Parolni o'zgartirish</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(120,150,200,0.55)" }}>Yangi parol</label>
            <div className="relative">
              <input
                type={showP ? "text" : "password"}
                value={parol} onChange={e=>setParol(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                className="w-full text-sm px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
              />
              <button type="button" onClick={()=>setShowP(!showP)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color:"rgba(120,150,200,0.5)" }}>
                {showP
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(120,150,200,0.55)" }}>Parolni tasdiqlang</label>
            <div className="relative">
              <input
                type={showP2 ? "text" : "password"}
                value={parol2} onChange={e=>setParol2(e.target.value)}
                placeholder="Parolni qayta kiriting"
                className="w-full text-sm px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
              />
              <button type="button" onClick={()=>setShowP2(!showP2)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color:"rgba(120,150,200,0.5)" }}>
                {showP2
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {pwdError && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.2)" }}>
            ⚠️ {pwdError}
          </p>
        )}

        <button onClick={handleSavePwd}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: pwdSaved ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.15)",
            border: `1px solid ${pwdSaved ? "rgba(16,185,129,0.4)" : "rgba(139,92,246,0.35)"}`,
            color: pwdSaved ? "#34d399" : "#a78bfa",
          }}
          onMouseEnter={e=>{ if(!pwdSaved) e.currentTarget.style.background="rgba(139,92,246,0.25)"; }}
          onMouseLeave={e=>{ if(!pwdSaved) e.currentTarget.style.background="rgba(139,92,246,0.15)"; }}>
          {pwdSaved ? "✓ Parol yangilandi!" : "🔒 Parolni o'zgartirish"}
        </button>
      </div>

      {/* Hisob ma'lumotlari */}
      <div className="p-5 rounded-2xl"
        style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm font-bold mb-4" style={{ color:"rgba(150,180,230,0.75)" }}>ℹ️ Hisob ma'lumotlari</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:"Rol",          val: ROLE_LABELS[user?.role || "user"],                        icon:"🛡️" },
            { label:"Holat",        val: "Faol",                                                    icon:"✅" },
            { label:"Qo'shilgan",   val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("uz-UZ") : "—", icon:"📅" },
            { label:"Tizim ID",     val: user?.id?.slice?.(0,8) || "—",                            icon:"🔖" },
          ].map(r => (
            <div key={r.label} className="p-3 rounded-xl"
              style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[10px] mb-1 flex items-center gap-1" style={{ color:"rgba(100,130,200,0.45)" }}>
                {r.icon} {r.label}
              </p>
              <p className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.8)" }}>{r.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
