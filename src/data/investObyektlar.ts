export type ObyektHolat = "qurilmoqda" | "ishlamoqda" | "rejalashtirilgan" | "toxtagan";

export type InvestObyekt = {
  id:          string;
  nomi:        string;
  tur:         string;
  icon:        string;
  color:       string;
  lat:         number;
  lng:         number;
  tuman:       string;
  manzil:      string;
  quvvat:      string;
  qiymat:      string;
  xorijiy:     string;
  maydon:      string;
  holat:       ObyektHolat;
  ish_joylari: number;
  mahsulot:    string;
  tavsif:      string;
  rasmlar:     string[];
};

export const INVEST_OBYEKTLAR: InvestObyekt[] = [
  /* Faqat 2 ta aktiv metka */
  {
    id: "INV-001",
    nomi: "Baklajan, gips va zarba-bardosh mahsulotlar",
    tur: "Ishlab chiqarish",
    icon: "🏭",
    color: "#f59e0b",
    lat: 39.6850,
    lng: 66.9200,
    tuman: "Samarqand shahri",
    manzil: "Samarqand shahri, Shimoliy sanoat zonasi",
    quvvat: "10 000 dona mahsulot/yil",
    qiymat: "400 ming USD",
    xorijiy: "600 USD",
    maydon: "1 gektar",
    holat: "qurilmoqda",
    ish_joylari: 45,
    mahsulot: "Baklajan, gips, zarba-bardosh plitalar",
    tavsif: "Samarqand shahrida baklajan, gips va zarba-bardosh qurilish materiallari ishlab chiqarish korxonasi. Xorijiy investitsiyalar jalb qilingan zamonaviy loyiha.",
    rasmlar: ["plant1", "plant2", "plant3"],
  },
  {
    id: "INV-007",
    nomi: "Gidroponikada issiqxonalar barpo etish",
    tur: "Qishloq xo'jaligi",
    icon: "🌿",
    color: "#22c55e",
    lat: 39.6720,
    lng: 66.9850,
    tuman: "Samarqand shahri",
    manzil: "Samarqand shahri, Sharqiy qishloq xo'jaligi hududi",
    quvvat: "30 000 tonna mahsulot/yil",
    qiymat: "3.1 million USD",
    xorijiy: "4.1 million USD",
    maydon: "12 gektar (issiqxona: 9 gektar)",
    holat: "qurilmoqda",
    ish_joylari: 150,
    mahsulot: "Sabzavot, pomidor (gidroponika usulida)",
    tavsif: "Gidroponika texnologiyasi yordamida issiqxonalarda sabzavot yetishtirish loyihasi. Yillik eksport hajmi 8.9 million USD ga teng. Zamonaviy texnologiya asosida qurilayotgan 9 gektar issiqxona majmuasi xalqaro standartlarga javob beradi.",
    rasmlar: [
      "/images/greenhouse/rasim1.jpg",
      "/images/greenhouse/rasm2.jpg",
      "/images/greenhouse/rasm3.jpg",
      "/images/greenhouse/rasm4.jpg",
    ],
  },
];

export const HOLAT_COLORS: Record<ObyektHolat, string> = {
  ishlamoqda:       "#10b981",
  qurilmoqda:       "#f59e0b",
  rejalashtirilgan: "#3b82f6",
  toxtagan:         "#ef4444",
};
export const HOLAT_LABELS: Record<ObyektHolat, string> = {
  ishlamoqda:       "Ishlamoqda",
  qurilmoqda:       "Qurilmoqda",
  rejalashtirilgan: "Rejalashtirilgan",
  toxtagan:         "To'xtatilgan",
};
