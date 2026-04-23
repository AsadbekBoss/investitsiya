"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockLogin } from "@/lib/mockAuth";

const ROLES = [
  { label:"Superadmin", email:"superadmin@test.com", pass:"super123",     color:"#f43f5e" },
  { label:"Admin",      email:"admin@test.com",      pass:"admin123",     color:"#3b82f6" },
  { label:"Tashkilot",  email:"elektr@test.com",     pass:"tashkilot123", color:"#10b981" },
  { label:"User",       email:"user@test.com",       pass:"user123",      color:"#f59e0b" },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  top:  (i * 137.5) % 100,
  left: (i * 97.3)  % 100,
  size: i % 6 === 0 ? 2 : 1,
  opacity: 0.15 + (i % 8) * 0.07,
  dur: 2.5 + (i % 5) * 0.8,
  delay: (i % 7) * 0.4,
}));

/* Floating stat cards data */
const CARDS = [
  { icon:"⚡", label:"Elektr momolari", val:"128", change:"+12", color:"#f59e0b", up:true,  pos:"top-[14%] left-[8%]"  },
  { icon:"💧", label:"Suv momolari",    val:"94",  change:"+7",  color:"#06b6d4", up:true,  pos:"top-[38%] left-[3%]"  },
  { icon:"✅", label:"Hal qilindi",      val:"847", change:"98%", color:"#10b981", up:true,  pos:"bottom-[28%] right-[5%]" },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const { setAuth, redirectByRole } = useAuth();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = mockLogin(email, password);
    if (result) { setAuth(result.user, result.token); redirectByRole(); return; }
    setError("Email yoki parol noto'g'ri");
    setLoading(false);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background:"linear-gradient(135deg, #060b18 0%, #0a1020 40%, #080e1c 100%)" }}>

      {/* Background glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width:700, height:700, top:"-20%", left:"-15%", background:"radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)" }} />
        <div className="absolute rounded-full" style={{ width:600, height:600, bottom:"-15%", right:"-10%", background:"radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)", backgroundSize:"50px 50px" }} />
      </div>

      {/* ── MAIN CARD ── */}
      <div
        className={`relative w-full max-w-[960px] rounded-3xl overflow-hidden flex transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ minHeight:580, boxShadow:"0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="hidden md:flex md:w-[48%] relative overflow-hidden flex-col">
          {/* Sky gradient */}
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(170deg, #0c1830 0%, #0a1525 30%, #0f2040 55%, #162e52 75%, #0d1e38 100%)" }} />

          {/* Stars */}
          <div className="absolute inset-0">
            {STARS.map((s, i) => (
              <div key={i} className="absolute rounded-full"
                style={{ width:s.size, height:s.size, top:`${s.top}%`, left:`${s.left}%`,
                  background:"#fff", opacity:s.opacity,
                  animation:`twinkle ${s.dur}s ease-in-out infinite`,
                  animationDelay:`${s.delay}s` }} />
            ))}
          </div>

          {/* Horizon */}
          <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom:"36%", height:1, background:"linear-gradient(90deg,transparent,rgba(96,165,250,0.5),rgba(147,197,253,0.7),rgba(96,165,250,0.5),transparent)" }} />
          <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom:"36%", height:130, background:"linear-gradient(0deg,transparent,rgba(24,74,180,0.2))" }} />

          {/* Moon */}
          <div className="absolute" style={{ top:"11%", right:"20%", width:38, height:38, borderRadius:"50%", background:"rgba(210,230,255,0.1)", border:"1px solid rgba(210,230,255,0.12)", boxShadow:"0 0 30px rgba(147,197,253,0.15), inset -7px -3px 0 rgba(0,0,0,0.3)" }} />

          {/* Dunes */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 800 360" preserveAspectRatio="none" className="w-full" style={{ height:"62%" }}>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e3a6a"/><stop offset="100%" stopColor="#0c1828"/></linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#162e52"/><stop offset="100%" stopColor="#0a1420"/></linearGradient>
                <linearGradient id="lg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#253f6e"/><stop offset="100%" stopColor="#111e38"/></linearGradient>
              </defs>
              <path d="M0,210 Q180,85 380,155 Q580,225 800,105 L800,360 L0,360 Z" fill="url(#lg3)"/>
              <path d="M0,265 Q155,148 358,205 Q545,262 800,168 L800,360 L0,360 Z" fill="url(#lg2)"/>
              <path d="M0,315 Q205,235 425,278 Q615,322 800,245 L800,360 L0,360 Z" fill="url(#lg1)"/>
            </svg>
          </div>

          {/* Floating stat cards */}
          {CARDS.map((c, i) => (
            <div key={i}
              className={`absolute ${c.pos} anim-float`}
              style={{
                animationDelay:`${i * 0.7}s`,
                animationDuration:`${3.5 + i * 0.5}s`,
              }}>
              {/* Outer glow halo */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow:`0 0 28px ${c.color}25`, borderRadius:16 }} />

              <div className="relative px-3.5 py-2.5 rounded-2xl flex items-center gap-3 overflow-hidden"
                style={{
                  background:`linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)`,
                  backdropFilter:"blur(20px) saturate(180%)",
                  WebkitBackdropFilter:"blur(20px) saturate(180%)",
                  border:"1px solid rgba(255,255,255,0.12)",
                  borderTop:"1px solid rgba(255,255,255,0.18)",
                  boxShadow:`inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.25)`,
                  minWidth:152,
                }}>

                {/* Subtle color tint top-right */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background:`radial-gradient(circle, ${c.color}18 0%, transparent 70%)`, transform:"translate(20%,-40%)" }} />

                {/* Icon */}
                <div className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
                  style={{
                    background:`linear-gradient(135deg, ${c.color}28 0%, ${c.color}12 100%)`,
                    border:`1px solid ${c.color}40`,
                    boxShadow:`0 0 12px ${c.color}30`,
                  }}>
                  {c.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 relative">
                  <p className="text-[9px] font-semibold tracking-wide truncate mb-0.5"
                    style={{ color:"rgba(180,205,255,0.45)" }}>{c.label}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color:"rgba(230,240,255,0.95)", textShadow:"0 0 12px rgba(255,255,255,0.15)" }}>
                      {c.val}
                    </p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-lg"
                      style={{
                        background: c.up ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)",
                        color:      c.up ? "#4ade80"              : "#f87171",
                        border:`1px solid ${c.up?"rgba(74,222,128,0.25)":"rgba(248,113,113,0.25)"}`,
                        backdropFilter:"blur(4px)",
                      }}>
                      {c.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Logo top-left */}
          <div className="relative z-10 p-7">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background:"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.35)", boxShadow:"0 0 16px rgba(59,130,246,0.2)" }}>
                🌍
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color:"rgba(210,230,255,0.8)" }}>Yer Momo</p>
                <p className="text-[9px]" style={{ color:"rgba(100,140,220,0.4)" }}>Tizim v2.0</p>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="relative z-10 mt-auto p-7 pb-9">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2.5"
              style={{ color:"rgba(96,165,250,0.5)" }}>AI yordamida boshqaring</p>
            <h2 className="text-2xl font-bold leading-snug mb-2"
              style={{ color:"rgba(255,255,255,0.9)" }}>
              Yer uchastkangizni<br />
              <span style={{ background:"linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                aqlli nazorat qiling
              </span>
            </h2>
            <p className="text-xs leading-relaxed" style={{ color:"rgba(150,185,255,0.45)" }}>
              Momolarni AI yordamida aniqlang va<br />tegishli tashkilotga avtomatik yuboring.
            </p>
          </div>
        </div>

        {/* ═══ RIGHT PANEL — form ═══ */}
        <div className="flex-1 flex items-center justify-center px-8 py-10 relative"
          style={{ background:"rgba(10,16,32,0.97)" }}>

          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background:"radial-gradient(circle at top right, rgba(139,92,246,0.08), transparent 70%)" }} />

          <div className="w-full max-w-[340px]">

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.3)" }}>🌍</div>
              <p className="text-sm font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>Yer Momo Tizim</p>
            </div>

            {/* Heading */}
            <div className={`mb-7 transition-all duration-600 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-5"}`}
              style={{ transitionDelay:"80ms" }}>
              <h1 className="text-2xl font-bold mb-1" style={{ color:"rgba(220,235,255,0.97)" }}>
                Xush kelibsiz! 👋
              </h1>
              <p className="text-sm" style={{ color:"rgba(120,150,210,0.5)" }}>
                Hisobingizga kirish uchun ma'lumot kiriting
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Email */}
              <div className={`transition-all duration-600 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}
                style={{ transitionDelay:"160ms" }}>
                <label className="text-[11px] font-semibold tracking-wide block mb-1.5"
                  style={{ color:"rgba(130,165,220,0.6)" }}>EMAIL</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: email?"rgba(96,165,250,0.7)":"rgba(80,110,180,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${email?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.07)"}`, color:"rgba(220,235,255,0.9)" }}
                    onFocus={e=>{ e.target.style.borderColor="rgba(59,130,246,0.6)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)"; e.target.style.background="rgba(59,130,246,0.05)"; }}
                    onBlur={e=>{ e.target.style.boxShadow="none"; e.target.style.borderColor=email?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.07)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`transition-all duration-600 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}
                style={{ transitionDelay:"230ms" }}>
                <label className="text-[11px] font-semibold tracking-wide block mb-1.5"
                  style={{ color:"rgba(130,165,220,0.6)" }}>PAROL</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: password?"rgba(96,165,250,0.7)":"rgba(80,110,180,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${password?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.07)"}`, color:"rgba(220,235,255,0.9)" }}
                    onFocus={e=>{ e.target.style.borderColor="rgba(59,130,246,0.6)"; e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)"; e.target.style.background="rgba(59,130,246,0.05)"; }}
                    onBlur={e=>{ e.target.style.boxShadow="none"; e.target.style.borderColor=password?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.07)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
                  />
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                    style={{ color:"rgba(90,125,190,0.5)" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(59,130,246,0.15)"; e.currentTarget.style.color="rgba(96,165,250,0.9)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(90,125,190,0.5)"; }}>
                    {showPass
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className={`flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-xl ${shake?"anim-shake":""}`}
                  style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.25)", color:"#fca5a5" }}>
                  <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className={`pt-1 transition-all duration-600 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}
                style={{ transitionDelay:"300ms" }}>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all overflow-hidden relative"
                  style={{
                    background: loading ? "rgba(25,45,85,0.7)" : "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #1d4ed8 100%)",
                    border:`1px solid ${loading?"rgba(59,130,246,0.15)":"rgba(96,165,250,0.45)"}`,
                    color:"rgba(220,235,255,0.95)",
                    boxShadow: loading ? "none" : "0 0 28px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    opacity: loading ? 0.65 : 1,
                  }}
                  onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 36px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.12)"; }}}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 28px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"; }}>
                  {loading
                    ? <span className="flex items-center justify-center gap-2.5">
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(120,160,255,0.2)", borderTopColor:"rgba(147,197,253,0.9)" }} />
                        Tekshirilmoqda...
                      </span>
                    : <span className="flex items-center justify-center gap-2">
                        Kirish
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                  }
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color:"rgba(90,120,180,0.4)" }}>tez kirish</span>
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
            </div>

            {/* Quick role buttons */}
            <div className={`grid grid-cols-2 gap-2 transition-all duration-600 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}
              style={{ transitionDelay:"380ms" }}>
              {ROLES.map(r => (
                <button key={r.label} type="button" onClick={()=>{ setEmail(r.email); setPassword(r.pass); setError(""); }}
                  className="relative flex items-center gap-2 p-2.5 rounded-xl text-left transition-all active:scale-95 overflow-hidden group"
                  style={{
                    background: email===r.email ? `${r.color}14` : "rgba(255,255,255,0.03)",
                    border:`1px solid ${email===r.email ? r.color+"45" : "rgba(255,255,255,0.07)"}`,
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${r.color}12`; e.currentTarget.style.borderColor=`${r.color}35`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=email===r.email?`${r.color}14`:"rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor=email===r.email?`${r.color}45`:"rgba(255,255,255,0.07)"; }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background:`${r.color}20`, color:r.color }}>
                    {r.label[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold leading-none" style={{ color:"rgba(200,220,255,0.88)" }}>{r.label}</p>
                    <p className="text-[9px] mt-0.5 truncate" style={{ color:"rgba(110,140,200,0.4)" }}>{r.email}</p>
                  </div>
                  {email===r.email && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color:r.color }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] mt-3" style={{ color:"rgba(80,110,170,0.35)" }}>
              Bosing — avtomatik to'ldiriladi
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}15%{transform:translateX(-5px)}30%{transform:translateX(5px)}45%{transform:translateX(-3px)}60%{transform:translateX(3px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}
        }
        .anim-shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}
