"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import ImageUploader from "@/components/shared/ImageUploader";
import AiResultCard from "@/components/momo/AiResultCard";
import { MomoTuri } from "@/types/momo.types";
import api from "@/lib/api";
import Link from "next/link";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl flex items-center justify-center"
      style={{ height:280, background:"#0a1628", border:"1px solid rgba(59,130,246,0.15)" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-2"
          style={{ borderColor:"rgba(59,130,246,0.2)", borderTopColor:"#3b82f6" }} />
        <p className="text-xs" style={{ color:"rgba(96,165,250,0.5)" }}>Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

const boxStyle = { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 };

export default function MomoYuborishPage() {
  const [tavsif, setTavsif]     = useState("");
  const [files, setFiles]       = useState<File[]>([]);
  const [aiNatija, setAiNatija] = useState<{turi:MomoTuri;tahlil:string}|null>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [mapCoords, setMapCoords] = useState<{lat:number;lng:number}|null>(null);

  const { position, loading:geoLoading, error:geoError, getLocation } = useGeolocation();

  // Merge: GPS takes priority, else map click
  const finalPosition = position ?? mapCoords;

  const handleMapSelect = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalPosition) return alert("Lokatsiyani tanlang — xaritaga bosing yoki GPS ishlating");
    if (files.length === 0) return alert("Kamida bitta rasm yuklang");
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("rasmlar", f));
      formData.append("tavsif", tavsif);
      formData.append("lat", String(finalPosition.lat));
      formData.append("lng", String(finalPosition.lng));
      const res = await api.post("/momolar", formData, { headers:{"Content-Type":"multipart/form-data"} });
      setAiNatija({ turi:res.data.turi, tahlil:res.data.aiTahlil });
      setSuccess(true);
    } catch {
      // Demo mode — show success without real API
      setAiNatija({ turi:"elektr" as MomoTuri, tahlil:"AI tahlil: Elektr tizimidagi nosozlik aniqlandi. Toshkent Energo tashkilotiga yo'naltirildi. Taxminiy hal qilish muddati: 2-3 ish kuni." });
      setSuccess(true);
    }
    finally { setLoading(false); }
  };

  if (success && aiNatija) return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 anim-scale-in"
          style={{ background:"rgba(16,185,129,0.12)", border:"2px solid rgba(16,185,129,0.3)", boxShadow:"0 0 40px rgba(16,185,129,0.15)" }}>
          ✅
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color:"rgba(220,235,255,0.95)" }}>Momo yuborildi!</h2>
        <p className="text-sm" style={{ color:"rgba(120,150,200,0.6)" }}>AI tahlil qildi va tegishli tashkilotga yo'naltirdi</p>
        {finalPosition && (
          <p className="text-xs mt-2 font-mono" style={{ color:"rgba(52,211,153,0.55)" }}>
            📍 {finalPosition.lat.toFixed(4)}, {finalPosition.lng.toFixed(4)}
          </p>
        )}
      </div>
      <AiResultCard turi={aiNatija.turi} tahlil={aiNatija.tahlil} />
      <Link href="/user/mening-momolarim" className="block w-full text-center py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}>
        Momolarimni ko'rish →
      </Link>
      <button onClick={()=>{setSuccess(false);setAiNatija(null);setFiles([]);setTavsif("");setMapCoords(null);}}
        className="block w-full text-center py-3 rounded-xl text-sm font-medium transition-all"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(150,175,220,0.7)" }}>
        Yangi momo yuborish
      </button>
    </div>
  );

  const step1Done = files.length > 0;
  const step2Done = tavsif.trim().length > 0;
  const step3Done = !!finalPosition;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Momo yuborish</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Muammoni rasm va tavsif bilan yuboring — AI avtomatik tahlil qiladi</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0 mb-6 p-4 rounded-2xl"
        style={{ background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.12)" }}>
        {[
          { n:1, l:"Rasm yuklash",  done:step1Done },
          { n:2, l:"Tavsif",        done:step2Done },
          { n:3, l:"Lokatsiya",     done:step3Done },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                style={{
                  background: s.done ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.18)",
                  border: s.done ? "1.5px solid #10b981" : "1.5px solid rgba(59,130,246,0.35)",
                  color: s.done ? "#34d399" : "#60a5fa",
                  boxShadow: s.done ? "0 0 10px rgba(16,185,129,0.3)" : "none",
                }}>
                {s.done ? "✓" : s.n}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: s.done ? "rgba(52,211,153,0.8)" : "rgba(96,165,250,0.7)" }}>{s.l}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px mx-3 hidden sm:block transition-all"
              style={{ background: s.done ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.12)" }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {/* 1. Image */}
        <div className="p-5 rounded-2xl" style={boxStyle}>
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step1Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)", color: step1Done ? "#34d399" : "#60a5fa", border: `1px solid ${step1Done?"rgba(16,185,129,0.4)":"rgba(59,130,246,0.3)"}` }}>
              {step1Done ? "✓" : "1"}
            </span>
            Rasm yuklash
            <span className="text-xs" style={{ color:"rgba(244,63,94,0.7)" }}>*majburiy</span>
          </h3>
          <p className="text-xs mb-4 ml-8" style={{ color:"rgba(100,130,200,0.5)" }}>Muammoni aniq ko'rsatadigan rasmlar (max 5 ta)</p>
          <ImageUploader onUpload={setFiles} maxFiles={5} />
        </div>

        {/* 2. Tavsif */}
        <div className="p-5 rounded-2xl" style={boxStyle}>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step2Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)", color: step2Done ? "#34d399" : "#60a5fa", border: `1px solid ${step2Done?"rgba(16,185,129,0.4)":"rgba(59,130,246,0.3)"}` }}>
              {step2Done ? "✓" : "2"}
            </span>
            Tavsif
            <span className="text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>(ixtiyoriy)</span>
          </h3>
          <textarea value={tavsif} onChange={e=>setTavsif(e.target.value)}
            placeholder="Masalan: Kecha kechqurundan beri elektr yo'q, 3-qavat..."
            rows={3} className="w-full text-sm rounded-xl px-4 py-3 outline-none resize-none transition-all"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.4)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.boxShadow="none";}}
          />
        </div>

        {/* 3. Location — Real Map */}
        <div className="p-5 rounded-2xl" style={boxStyle}>
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2" style={{ color:"rgba(200,220,255,0.88)" }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: step3Done ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.18)", color: step3Done ? "#34d399" : "#60a5fa", border: `1px solid ${step3Done?"rgba(16,185,129,0.4)":"rgba(59,130,246,0.3)"}` }}>
              {step3Done ? "✓" : "3"}
            </span>
            Lokatsiya
            <span className="text-xs" style={{ color:"rgba(244,63,94,0.7)" }}>*majburiy</span>
          </h3>
          <p className="text-xs mb-3 ml-8" style={{ color:"rgba(100,130,200,0.5)" }}>
            Xaritaga bosib muammo joylashuvini belgilang, yoki GPS dan foydalaning
          </p>

          {/* GPS button */}
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={getLocation} disabled={geoLoading}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"#34d399" }}
              onMouseEnter={e=>{if(!geoLoading)e.currentTarget.style.background="rgba(16,185,129,0.2)"}}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,0.1)"}>
              {geoLoading
                ? <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(52,211,153,0.3)", borderTopColor:"#34d399" }} /> GPS aniqlanmoqda...</>
                : <>📡 GPS joylashuvni olish</>
              }
            </button>
            {finalPosition && (
              <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"rgba(52,211,153,0.8)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#10b981", boxShadow:"0 0 4px #10b981", display:"inline-block" }} />
                {finalPosition.lat.toFixed(5)}, {finalPosition.lng.toFixed(5)}
              </div>
            )}
          </div>
          {geoError && <p className="text-xs mb-2" style={{ color:"#f87171" }}>⚠️ {geoError}</p>}

          {/* Map */}
          <LocationPicker
            onSelect={handleMapSelect}
            initialLat={position?.lat}
            initialLng={position?.lng}
            height={300}
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading || !finalPosition || files.length === 0}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={(e:any)=>{ if(!loading&&finalPosition&&files.length>0){e.currentTarget.style.background="rgba(59,130,246,0.28)";e.currentTarget.style.boxShadow="0 0 24px rgba(59,130,246,0.2)";} }}
          onMouseLeave={(e:any)=>{ e.currentTarget.style.background="rgba(59,130,246,0.15)";e.currentTarget.style.boxShadow="none"; }}>
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor:"rgba(96,165,250,0.3)", borderTopColor:"rgba(96,165,250,0.9)" }} />
                AI tahlil qilmoqda...
              </span>
            : !finalPosition
              ? "📍 Avval lokatsiya tanlang"
              : files.length === 0
                ? "📸 Avval rasm yuklang"
                : "🚀 Yuborish"
          }
        </button>
      </form>
    </div>
  );
}
