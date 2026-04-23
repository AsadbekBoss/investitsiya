import { MomoStatus, MomoTuri } from "@/types/momo.types";

export type Momo = {
  id:         string;
  tur:        MomoTuri;
  icon:       string;
  color:      string;
  tavsif:     string;
  manzil:     string;
  sana:       string;
  holat:      MomoStatus;
  tashkilot:  string;
  yuboruvchi: string;
  tel:        string;
  koordinata: string;
  shoshilinch: boolean;
  izoh?:      string;
  deadline?:  string;
  xodim?:     string;
  tarix:      { holat: MomoStatus; vaqt: string; izoh?: string }[];
};

export const MOCK_MOMOLAR: Momo[] = [
  {
    id:"M-1042", tur:"elektr" as MomoTuri, icon:"⚡", color:"#f59e0b",
    tavsif:"Ko'cha chiroqlari ishlamayapti, tungi xavfsizlik xavf ostida. Kecha kechasi boshlanib, hali ham davom etmoqda.",
    manzil:"Registon ko'chasi, 12-uy", sana:"07.04.2026 09:14",
    holat:"korib_chiqilmoqda", tashkilot:"Samarqand Energo", yuboruvchi:"Alisher Karimov",
    tel:"+998 90 123 45 67", koordinata:"39.654, 66.976", shoshilinch:true,
    izoh:"Texniklar yuborildi, tez orada hal qilinadi", deadline:"10.04.2026",
    xodim:"Sardor Nazarov",
    tarix:[
      { holat:"yuborildi",         vaqt:"07.04.2026 09:14", izoh:"Momo qabul qilindi" },
      { holat:"korib_chiqilmoqda", vaqt:"07.04.2026 10:30", izoh:"Texniklar yuborildi" },
    ],
  },
  {
    id:"M-1039", tur:"suv" as MomoTuri, icon:"💧", color:"#06b6d4",
    tavsif:"Quvur yorilib, ko'cha suv bilan to'ldi. Tezkor yordam kerak.",
    manzil:"Siob bozori yaqini", sana:"06.04.2026 18:32",
    holat:"bajarilmoqda", tashkilot:"Samarqand Suv ta'minoti", yuboruvchi:"Malika Yusupova",
    tel:"+998 91 234 56 78", koordinata:"39.661, 66.971", shoshilinch:true,
    izoh:"Brigada joylashdi, 3 soatda hal qilinadi", deadline:"07.04.2026",
    xodim:"Eldor Qodirov",
    tarix:[
      { holat:"yuborildi",         vaqt:"06.04.2026 18:32" },
      { holat:"korib_chiqilmoqda", vaqt:"06.04.2026 19:00", izoh:"Qabul qilindi" },
      { holat:"bajarilmoqda",      vaqt:"06.04.2026 20:15", izoh:"Brigada yetib keldi" },
    ],
  },
  {
    id:"M-1035", tur:"gaz" as MomoTuri, icon:"🔥", color:"#f97316",
    tavsif:"Gaz hidi sezilmoqda, xavfli vaziyat. Uy aholisi tashqariga chiqdi.",
    manzil:"Aeroport yo'li, 3-mavze", sana:"05.04.2026 11:07",
    holat:"yuborildi", tashkilot:"Samarqand Gaz", yuboruvchi:"Bobur Toshmatov",
    tel:"+998 93 345 67 89", koordinata:"39.670, 66.983", shoshilinch:true,
    tarix:[
      { holat:"yuborildi", vaqt:"05.04.2026 11:07" },
    ],
  },
  {
    id:"M-1029", tur:"yol" as MomoTuri, icon:"🛣️", color:"#64748b",
    tavsif:"Yo'l yuzasi buzilib ketgan, chuqur çukur hosil bo'lgan.",
    manzil:"Buyuk ipak yo'li ko'chasi", sana:"03.04.2026 14:55",
    holat:"bajarildi", tashkilot:"Yo'l xo'jaligi", yuboruvchi:"Jasur Mirzayev",
    tel:"+998 94 456 78 90", koordinata:"39.645, 66.950", shoshilinch:false,
    izoh:"Yo'l ta'mirlandi", deadline:"08.04.2026",
    tarix:[
      { holat:"yuborildi",         vaqt:"03.04.2026 14:55" },
      { holat:"korib_chiqilmoqda", vaqt:"04.04.2026 09:00" },
      { holat:"bajarilmoqda",      vaqt:"05.04.2026 08:00", izoh:"Ta'mirlash ishlari boshlandi" },
      { holat:"bajarildi",         vaqt:"07.04.2026 17:00", izoh:"Muvaffaqiyatli yakunlandi" },
    ],
  },
  {
    id:"M-1021", tur:"quvur" as MomoTuri, icon:"🔧", color:"#8b5cf6",
    tavsif:"Kanalizatsiya tiqilib qolgan, yoqimsiz hid tarqalmoqda.",
    manzil:"Pastdarg'om magistrali", sana:"01.04.2026 08:20",
    holat:"bajarildi", tashkilot:"Kommunal xizmat", yuboruvchi:"Nilufar Rahimova",
    tel:"+998 95 567 89 01", koordinata:"39.635, 66.965", shoshilinch:false,
    izoh:"Kanal tozalandi",
    tarix:[
      { holat:"yuborildi",         vaqt:"01.04.2026 08:20" },
      { holat:"korib_chiqilmoqda", vaqt:"01.04.2026 10:00" },
      { holat:"bajarilmoqda",      vaqt:"02.04.2026 09:00" },
      { holat:"bajarildi",         vaqt:"02.04.2026 15:30", izoh:"Kanal tozalandi, hid yo'qoldi" },
    ],
  },
  {
    id:"M-1018", tur:"elektr" as MomoTuri, icon:"⚡", color:"#f59e0b",
    tavsif:"Elektr hisoblagich ishlamayapti, qo'shnilarda ham muammo bor.",
    manzil:"Shiroq tumani, 5-kvartal", sana:"31.03.2026 16:45",
    holat:"korib_chiqilmoqda", tashkilot:"Samarqand Energo", yuboruvchi:"Kamol Xasanov",
    tel:"+998 97 678 90 12", koordinata:"39.658, 66.940", shoshilinch:false,
    deadline:"12.04.2026",
    tarix:[
      { holat:"yuborildi",         vaqt:"31.03.2026 16:45" },
      { holat:"korib_chiqilmoqda", vaqt:"01.04.2026 09:30", izoh:"Texnik tashrifga belgilandi" },
    ],
  },
  {
    id:"M-1015", tur:"suv" as MomoTuri, icon:"💧", color:"#06b6d4",
    tavsif:"Suv uch kundan beri kelmayapti.",
    manzil:"Bog'ishamol ko'chasi", sana:"30.03.2026 12:00",
    holat:"bajarildi", tashkilot:"Samarqand Suv ta'minoti", yuboruvchi:"Zulfiya Nazarova",
    tel:"+998 99 789 01 23", koordinata:"39.675, 66.958", shoshilinch:false,
    izoh:"Quvur ta'mirlandi, suv berildi",
    tarix:[
      { holat:"yuborildi",         vaqt:"30.03.2026 12:00" },
      { holat:"korib_chiqilmoqda", vaqt:"30.03.2026 14:00" },
      { holat:"bajarilmoqda",      vaqt:"31.03.2026 09:00" },
      { holat:"bajarildi",         vaqt:"31.03.2026 18:00", izoh:"Ta'mir yakunlandi" },
    ],
  },
];

export const STATUS_COLORS: Record<MomoStatus, string> = {
  yuborildi:         "#64748b",
  korib_chiqilmoqda: "#f59e0b",
  bajarilmoqda:      "#3b82f6",
  bajarildi:         "#10b981",
};
export const STATUS_LABELS: Record<MomoStatus, string> = {
  yuborildi:         "Yuborildi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  bajarilmoqda:      "Bajarilmoqda",
  bajarildi:         "Bajarildi",
};
export const NEXT_STATUS: Record<MomoStatus, MomoStatus | null> = {
  yuborildi:"korib_chiqilmoqda", korib_chiqilmoqda:"bajarilmoqda",
  bajarilmoqda:"bajarildi", bajarildi:null,
};
export const NEXT_BTN: Partial<Record<MomoStatus, string>> = {
  yuborildi:         "Ko'rib chiqishni boshlash",
  korib_chiqilmoqda: "Bajarilmoqda deb belgilash",
  bajarilmoqda:      "Bajarildi deb belgilash",
};
