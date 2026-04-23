"use client";
import { useState } from "react";
import Modal from "@/components/shared/Modal";

const VILOYATLAR = [
  "Toshkent","Samarqand","Farg'ona","Buxoro","Namangan","Andijon",
  "Xorazm","Qashqadaryo","Surxondaryo","Navoiy","Sirdaryo","Jizzax","Qoraqalpog'iston",
];
const MOCK_ADMINS = ["Nodir Xolmatov","Kamola Umarova","Sherzod Rajabov","Dildora Yunusova","Farhod Ismoilov"];

type User = {
  id: number; ism: string; email: string; viloyat: string;
  admin: string; tel: string; momolar: number; holat: string; sana: string;
};

const INITIAL: User[] = [
  { id:1,  ism:"Alisher Karimov",    email:"alisher@gmail.com",   viloyat:"Toshkent",  admin:"Nodir Xolmatov",   tel:"+998 90 123 45 67", momolar:12, holat:"faol",       sana:"2025-11-03" },
  { id:2,  ism:"Malika Yusupova",    email:"malika@gmail.com",    viloyat:"Samarqand", admin:"Kamola Umarova",   tel:"+998 91 234 56 78", momolar:7,  holat:"faol",       sana:"2025-12-18" },
  { id:3,  ism:"Bobur Toshmatov",    email:"bobur@gmail.com",     viloyat:"Farg'ona",  admin:"Sherzod Rajabov",  tel:"+998 93 345 67 89", momolar:24, holat:"faol",       sana:"2025-10-07" },
  { id:4,  ism:"Nilufar Rashidova",  email:"nilufar@gmail.com",   viloyat:"Buxoro",    admin:"Dildora Yunusova", tel:"+998 94 456 78 90", momolar:3,  holat:"bloklangan", sana:"2026-01-22" },
  { id:5,  ism:"Jasur Mirzayev",     email:"jasur@gmail.com",     viloyat:"Namangan",  admin:"Farhod Ismoilov",  tel:"+998 97 567 89 01", momolar:18, holat:"faol",       sana:"2025-09-15" },
  { id:6,  ism:"Shahnoza Ergasheva", email:"shahnoza@gmail.com",  viloyat:"Andijon",   admin:"Farhod Ismoilov",  tel:"+998 99 678 90 12", momolar:9,  holat:"faol",       sana:"2026-02-01" },
  { id:7,  ism:"Otabek Xasanov",     email:"otabek@gmail.com",    viloyat:"Xorazm",    admin:"Nodir Xolmatov",   tel:"+998 90 789 01 23", momolar:0,  holat:"kutilmoqda", sana:"2026-03-30" },
  { id:8,  ism:"Zulfiya Norova",     email:"zulfiya@gmail.com",   viloyat:"Toshkent",  admin:"Nodir Xolmatov",   tel:"+998 91 890 12 34", momolar:5,  holat:"faol",       sana:"2025-08-14" },
  { id:9,  ism:"Sardor Tojiboyev",   email:"sardor@gmail.com",    viloyat:"Farg'ona",  admin:"Sherzod Rajabov",  tel:"+998 93 901 23 45", momolar:31, holat:"faol",       sana:"2025-07-20" },
  { id:10, ism:"Mohira Qodieva",     email:"mohira@gmail.com",    viloyat:"Samarqand", admin:"Kamola Umarova",   tel:"+998 94 012 34 56", momolar:8,  holat:"faol",       sana:"2026-01-05" },
];

const HOLAT_STYLE: Record<string, { bg:string; color:string }> = {
  faol:       { bg:"rgba(16,185,129,0.12)",  color:"#34d399" },
  bloklangan: { bg:"rgba(244,63,94,0.12)",   color:"#fb7185" },
  kutilmoqda: { bg:"rgba(245,158,11,0.12)",  color:"#fbbf24" },
};

const EMPTY_FORM = { ism:"", email:"", parol:"", viloyat:"", admin:"", tel:"", holat:"faol" };

export default function SuperadminUserlarPage() {
  const [users,       setUsers]       = useState<User[]>(INITIAL);
  const [search,      setSearch]      = useState("");
  const [holatFilter, setHolatFilter] = useState("barchasi");
  const [modal,       setModal]       = useState(false);
  const [editId,      setEditId]      = useState<number | null>(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [showPwd,     setShowPwd]     = useState(false);
  const [delId,       setDelId]       = useState<number | null>(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.ism.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.viloyat.toLowerCase().includes(q);
    const matchH = holatFilter === "barchasi" || u.holat === holatFilter;
    return matchQ && matchH;
  });

  const openAdd = () => {
    setEditId(null); setForm(EMPTY_FORM); setErrors({}); setShowPwd(false); setModal(true);
  };
  const openEdit = (u: User) => {
    setEditId(u.id);
    setForm({ ism:u.ism, email:u.email, parol:"", viloyat:u.viloyat, admin:u.admin, tel:u.tel, holat:u.holat });
    setErrors({}); setShowPwd(false); setModal(true);
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.ism.trim())          e.ism     = "Ism majburiy";
    if (!form.email.includes("@")) e.email   = "Email noto'g'ri";
    if (!editId && !form.parol)    e.parol   = "Parol majburiy";
    if (!form.viloyat)             e.viloyat = "Viloyat tanlang";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editId) {
      setUsers(prev => prev.map(u => u.id === editId
        ? { ...u, ism:form.ism, email:form.email, viloyat:form.viloyat, admin:form.admin, tel:form.tel, holat:form.holat }
        : u
      ));
    } else {
      setUsers(prev => [...prev, {
        id: Date.now(), ism:form.ism, email:form.email, viloyat:form.viloyat,
        admin:form.admin, tel:form.tel, holat:form.holat, momolar:0,
        sana: new Date().toISOString().slice(0,10),
      }]);
    }
    setModal(false);
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDelId(null);
  };

  const F = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Barcha foydalanuvchilar</h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Barcha viloyatlar bo'yicha userlar ro'yxati</p>
        </div>
        <button onClick={openAdd}
          className="text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.25)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.15)")}>
          <span className="text-base">+</span> User qo'shish
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ism, email, viloyat..."
          className="flex-1 min-w-[200px] text-sm px-4 py-2.5 rounded-xl outline-none"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.9)" }}
          onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.4)";}}
          onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
        />
        {["barchasi","faol","bloklangan","kutilmoqda"].map(h => (
          <button key={h} onClick={()=>setHolatFilter(h)}
            className="text-sm px-4 py-2 rounded-xl capitalize transition-all"
            style={{
              background: holatFilter===h ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${holatFilter===h ? "rgba(59,130,246,0.38)" : "rgba(255,255,255,0.08)"}`,
              color: holatFilter===h ? "#60a5fa" : "rgba(150,180,230,0.6)",
            }}>
            {h}
          </button>
        ))}
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label:"Jami",       val:users.length,                                 color:"#60a5fa" },
          { label:"Faol",       val:users.filter(u=>u.holat==="faol").length,      color:"#34d399" },
          { label:"Bloklangan", val:users.filter(u=>u.holat==="bloklangan").length, color:"#fb7185" },
          { label:"Kutilmoqda", val:users.filter(u=>u.holat==="kutilmoqda").length, color:"#fbbf24" },
        ].map(s => (
          <div key={s.label} className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-lg font-bold" style={{ color:s.color }}>{s.val}</span>
            <span className="text-xs" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#","Foydalanuvchi","Viloyat","Admin","Tel","Momolar","Holat","Sana",""].map(th => (
                <th key={th} className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider"
                  style={{ color:"rgba(100,130,200,0.6)" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const hs = HOLAT_STYLE[u.holat] || HOLAT_STYLE.faol;
              return (
                <tr key={u.id}
                  style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                  <td className="px-4 py-3.5" style={{ color:"rgba(100,130,200,0.5)" }}>{i+1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background:"rgba(59,130,246,0.15)", color:"#60a5fa" }}>
                        {u.ism[0]}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{u.ism}</p>
                        <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(150,180,230,0.65)" }}>{u.viloyat}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(150,180,230,0.5)" }}>{u.admin || "—"}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(130,160,210,0.55)" }}>{u.tel}</td>
                  <td className="px-4 py-3.5 font-bold" style={{ color:"rgba(200,220,255,0.8)" }}>{u.momolar}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{ background:hs.bg, color:hs.color }}>
                      {u.holat}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>{u.sana}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(u)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background:"rgba(59,130,246,0.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.2)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.1)")}>
                        Tahrirlash
                      </button>
                      <button onClick={()=>setDelId(u.id)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background:"rgba(244,63,94,0.08)", color:"#fb7185", border:"1px solid rgba(244,63,94,0.15)" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.08)")}>
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color:"rgba(100,130,200,0.4)" }}>
            <div className="text-4xl mb-3">👥</div>
            <p className="text-sm">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs" style={{ color:"rgba(100,130,200,0.4)" }}>Ko'rsatilmoqda: {filtered.length} / {users.length}</p>

      {/* ─── Add / Edit Modal ─── */}
      <Modal
        open={modal}
        onClose={()=>setModal(false)}
        title={editId ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
        subtitle={editId ? "Ma'lumotlarni yangilang" : "Yangi user uchun ma'lumotlarni kiriting"}
      >
        <div className="space-y-4">
          {/* Ism */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              👤 To'liq ism <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input value={form.ism} onChange={e=>F("ism",e.target.value)}
              placeholder="Ism Familiya"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.ism?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
              onBlur={e=>{e.target.style.borderColor=errors.ism?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
            {errors.ism && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.ism}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              📧 Email <span style={{ color:"#f87171" }}>*</span>
            </label>
            <input type="email" value={form.email} onChange={e=>F("email",e.target.value)}
              placeholder="user@gmail.com"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.email?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
              onBlur={e=>{e.target.style.borderColor=errors.email?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.email}</p>}
          </div>

          {/* Parol */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              🔒 Parol {!editId && <span style={{ color:"#f87171" }}>*</span>}
              {editId && <span style={{ color:"rgba(100,130,200,0.4)" }}> (o'zgartirmasangiz bo'sh qoldiring)</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.parol} onChange={e=>F("parol",e.target.value)}
                placeholder={editId ? "Yangi parol (ixtiyoriy)" : "Kamida 6 ta belgi"}
                className="w-full text-sm px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.parol?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
                onBlur={e=>{e.target.style.borderColor=errors.parol?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
              />
              <button type="button" onClick={()=>setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color:"rgba(120,150,200,0.5)" }}>
                {showPwd
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.parol && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.parol}</p>}
          </div>

          {/* Viloyat + Holat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                🗺️ Viloyat <span style={{ color:"#f87171" }}>*</span>
              </label>
              <select value={form.viloyat} onChange={e=>F("viloyat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)"}`, color: form.viloyat?"rgba(210,225,255,0.9)":"rgba(100,130,200,0.45)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";}}
                onBlur={e=>{e.target.style.borderColor=errors.viloyat?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.1)";}}
              >
                <option value="" style={{ background:"#111e38" }}>— Tanlang —</option>
                {VILOYATLAR.map(v => <option key={v} value={v} style={{ background:"#111e38" }}>{v}</option>)}
              </select>
              {errors.viloyat && <p className="text-xs mt-1" style={{ color:"#f87171" }}>{errors.viloyat}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
                ✅ Holat
              </label>
              <select value={form.holat} onChange={e=>F("holat",e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
                onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
              >
                <option value="faol"       style={{ background:"#111e38" }}>Faol</option>
                <option value="kutilmoqda" style={{ background:"#111e38" }}>Kutilmoqda</option>
                <option value="bloklangan" style={{ background:"#111e38" }}>Bloklangan</option>
              </select>
            </div>
          </div>

          {/* Admin */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              🛡️ Mas'ul admin
            </label>
            <select value={form.admin} onChange={e=>F("admin",e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color: form.admin?"rgba(210,225,255,0.9)":"rgba(100,130,200,0.45)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
            >
              <option value="" style={{ background:"#111e38" }}>— Tanlang (ixtiyoriy) —</option>
              {MOCK_ADMINS.map(a => <option key={a} value={a} style={{ background:"#111e38" }}>{a}</option>)}
            </select>
          </div>

          {/* Tel */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color:"rgba(150,180,230,0.7)" }}>
              📞 Telefon
            </label>
            <input value={form.tel} onChange={e=>F("tel",e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl outline-none"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(210,225,255,0.9)" }}
              onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.1)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.boxShadow="none";}}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={()=>setModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
              Bekor qilish
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background:"rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.4)", color:"#60a5fa" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(59,130,246,0.32)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(59,130,246,0.2)")}>
              {editId ? "✓ Saqlash" : "+ Qo'shish"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Delete confirm ─── */}
      <Modal open={delId !== null} onClose={()=>setDelId(null)} title="Foydalanuvchini o'chirish" width="max-w-sm">
        <p className="text-sm mb-6" style={{ color:"rgba(150,180,230,0.75)" }}>
          Ushbu foydalanuvchini tizimdan o'chirishni tasdiqlaysizmi?
        </p>
        <div className="flex gap-3">
          <button onClick={()=>setDelId(null)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(150,180,230,0.7)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.09)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}>
            Bekor
          </button>
          <button onClick={()=>delId && handleDelete(delId)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background:"rgba(244,63,94,0.15)", border:"1px solid rgba(244,63,94,0.3)", color:"#f87171" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(244,63,94,0.25)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(244,63,94,0.15)")}>
            🗑 O'chirish
          </button>
        </div>
      </Modal>
    </div>
  );
}
