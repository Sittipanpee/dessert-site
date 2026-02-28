export interface MenuVariation {
  id: string;
  name: string; // เช่น "แก้วใหญ่", "แก้วเล็ก"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  imageUrl: string;
  variations?: MenuVariation[];
}

export interface Branch {
  id: string;
  name: string;
  mapEmbedUrl: string;
}

export interface SiteContent {
  shopName: string;
  hero: {
    heading: string;
    subtext: string;
    phone: string;
    websiteUrl: string;
  };
  menu: MenuItem[];
  about: {
    heading: string;
    paragraphs: string[];
    imageUrl: string;
  };
  cta: {
    heading: string;
    phone: string;
    websiteUrl: string;
  };
  branches: Branch[];
  footer: {
    tagline: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export const defaultContent: SiteContent = {
  shopName: "หวานละมุน",
  hero: {
    heading: "หวานละมุน ทุกคำคือความสุข",
    subtext: "ขนมไทยสไตล์โมเดิร์น ที่ใส่ใจทุกรายละเอียด",
    phone: "0812345678",
    websiteUrl: "https://example.com",
  },
  menu: [
    {
      id: "1",
      name: "ข้าวเหนียวมะม่วง",
      description: "ข้าวเหนียวมูนกะทิหอม คู่มะม่วงน้ำดอกไม้สุกฉ่ำ",
      price: 120,
      isPopular: true,
      imageUrl: "",
    },
    {
      id: "2",
      name: "ลอดช่องสิงคโปร์",
      description: "ลอดช่องเส้นนุ่ม น้ำกะทิหวานมัน เย็นชื่นใจ",
      price: 65,
      isPopular: false,
      imageUrl: "",
    },
    {
      id: "3",
      name: "ขนมถ้วยฟู",
      description: "นุ่มฟู หอมใบเตย หวานน้อย สไตล์โฮมเมด",
      price: 45,
      isPopular: false,
      imageUrl: "",
    },
    {
      id: "4",
      name: "บัวลอยไข่หวาน",
      description: "บัวลอยหลากสี น้ำขิงอุ่น ไข่หวานเยิ้ม",
      price: 55,
      isPopular: true,
      imageUrl: "",
    },
    {
      id: "5",
      name: "ขนมชั้น",
      description: "เนื้อเนียนละเอียด สีสันสดใส กลิ่นใบเตยหอม",
      price: 40,
      isPopular: false,
      imageUrl: "",
    },
    {
      id: "6",
      name: "ทองหยอด",
      description: "ทองหยอดเม็ดเล็ก สูตรโบราณ หวานกำลังดี",
      price: 80,
      isPopular: true,
      imageUrl: "",
    },
  ],
  about: {
    heading: "เรื่องราวของเรา",
    imageUrl: "",
    paragraphs: [
      "เราเริ่มต้นจากความรักในขนมไทย ที่อยากทำให้คนรุ่นใหม่ได้ลองชิมของอร่อยแบบดั้งเดิม ในสไตล์ที่ทันสมัยและน่าสนใจมากขึ้น",
      "ทุกเมนูของเราคัดสรรวัตถุดิบอย่างพิถีพิถัน ใช้กะทิสด ใบเตยจากสวน และน้ำตาลมะพร้าวแท้ เพราะเราเชื่อว่าของอร่อยต้องเริ่มจากวัตถุดิบที่ดี",
      "มาลองชิมกันได้นะ รับรองว่าจะติดใจ ไม่ว่าจะเป็นเมนูคลาสสิกหรือเมนูใหม่ที่เราคิดขึ้นมา ทุกอย่างทำสดใหม่ทุกวันเลย!",
    ],
  },
  cta: {
    heading: "อยากลองชิม? ติดต่อเราได้เลย",
    phone: "0812345678",
    websiteUrl: "https://example.com",
  },
  branches: [
    {
      id: "1",
      name: "สาขาสยาม",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5318!3d13.7463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzIyLjciTiAxMDDCsDMwJzA2LjUiRQ!5e0!3m2!1sth!2sth!4v1700000000000",
    },
    {
      id: "2",
      name: "สาขาทองหล่อ",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5818!3d13.7363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzEwLjgiTiAxMDDCsDM0JzU0LjUiRQ!5e0!3m2!1sth!2sth!4v1700000000000",
    },
  ],
  footer: {
    tagline: "ขนมไทยสไตล์โมเดิร์น ใส่ใจทุกคำ",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
};
