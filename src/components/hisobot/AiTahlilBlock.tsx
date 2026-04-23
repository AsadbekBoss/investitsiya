export default function AiTahlilBlock({ xulosa, tavsiyalar, sana }: {
  xulosa:string; tavsiyalar?:string[]; sana?:string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5"
      style={{ background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)" }}>
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)" }}>
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color:"rgba(196,181,253,0.95)" }}>AI Tahlili</p>
              <p className="text-[11px]" style={{ color:"rgba(124,58,237,0.6)" }}>Avtomatik generatsiya</p>
            </div>
          </div>
          {sana && <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background:"rgba(124,58,237,0.15)", color:"#a78bfa" }}>{sana}</span>}
        </div>
        <div className="rounded-xl p-4 mb-4"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(124,58,237,0.15)" }}>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(200,215,255,0.75)" }}>{xulosa}</p>
        </div>
        {tavsiyalar && tavsiyalar.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color:"rgba(124,58,237,0.6)" }}>
              💡 Tavsiyalar
            </p>
            <div className="space-y-2">
              {tavsiyalar.map((t, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(124,58,237,0.1)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background:"rgba(124,58,237,0.25)", color:"#a78bfa" }}>{i+1}</span>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(180,200,255,0.7)" }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
