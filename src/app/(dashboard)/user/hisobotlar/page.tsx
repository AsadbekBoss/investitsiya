import HisobotCard from "@/components/hisobot/HisobotCard";
import AiTahlilBlock from "@/components/hisobot/AiTahlilBlock";

export default function UserHisobotlarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Hisobotlar</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Momolaringiz bo'yicha statistika va AI tahlili</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HisobotCard tur="kunlik"   jami={3}  bajarildi={2}  bajarilmadi={1} period="Bugun" />
        <HisobotCard tur="haftalik" jami={12} bajarildi={9}  bajarilmadi={3} period="Bu hafta" />
        <HisobotCard tur="oylik"    jami={45} bajarildi={38} bajarilmadi={7} period="Bu oy" />
      </div>
      <AiTahlilBlock
        xulosa="Siz bu oyda eng ko'p elektr momolari yuborgan foydalanuvchilardan birisiz. Momo yechilish tezligi o'tgan oyga nisbatan 18% oshdi."
        tavsiyalar={["Elektr momosi yuzaga kelganda avval sigortani tekshiring","Aniq GPS lokatsiya ko'rsating","Rasm sifatli va yorug' joyda olingan bo'lsin"]}
        sana="Aprel 2026"
      />
    </div>
  );
}
