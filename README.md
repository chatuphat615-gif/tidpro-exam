# 📚 TIDPRO EXAM (ติดโปร Exam)

> คลังรวบรวมข้อสอบเก่าและแนวข้อสอบจริง โรงเรียนเตรียมทหาร 4 เหล่าทัพ, ช่างฝีมือทหาร (MTTS) และโรงเรียนมัธยมชั้นนำ (เตรียมอุดมฯ, KVIS, MWIT, สวนกุหลาบ, บดินทรเดชา, สาธิต ปทุมวัน) ดาวน์โหลดไฟล์ PDF ฟรี พร้อมเฉลยละเอียดทุกชุด

🌐 **เว็บไซต์ออนไลน์**: [https://chatuphat615-gif.github.io/tidpro-exam/](https://chatuphat615-gif.github.io/tidpro-exam/)

---

## 🌟 ฟีเจอร์เด่น (Key Features)

- **⚡ สถาปัตยกรรม Zero-Lag 120fps:** ปรับแต่ง CSS และ JS ให้ทำงานแบบ Hardware-Accelerated ลื่นไหลสูงสุดทั้งบนสมาร์ตโฟน แท็บเล็ต และคอมพิวเตอร์
- **📖 คลังข้อสอบกว่า 160+ ชุด:** รวมข้อสอบคณิตศาสตร์, วิทยาศาสตร์ (ฟิสิกส์/เคมี/ชีวะ), ภาษาอังกฤษ, ภาษาไทย และสังคมศึกษา
- **🎨 โหมดสีถนอมสายตา (Eye-Friendly Reading Themes):**
  - **Sepia Warm (โทนกระดาษถนอมสายตา):** โทนสีน้ำผึ้งอบอุ่น สบายตา เหมาะสำหรับอ่านหนังสือนานๆ
  - **Paper White (โทนกระดาษขาว):** โทนสีขาวหิมะ สะอาด คมชัด
- **🔍 ระบบค้นหาและตัวกรองด่วน (Instant Search & Filters):** ค้นหาตามชื่อวิชา ปี พ.ศ. (2530 - 2563) หรือสถาบัน พร้อมแถบเลือก 8 หมวดหมู่ด่วนสำหรับมือถือ
- **⭐ ระบบบุ๊กมาร์ก & ประวัติการเปิดอ่าน (Bookmarks & Reading History):** บันทึกข้อสอบชุดโปรดและดูรายการที่เคยเปิดอ่านได้ทันที
- **👁️ ระบบพรีวิวเอกสาร PDF:** ดูตัวอย่างข้อสอบความละเอียดสูงผ่าน Google Drive Viewer ได้ทันทีโดยไม่ต้องดาวน์โหลดลงเครื่อง
- **👤 ระบบบัญชีและการเข้าสู่ระบบด่วน 1 คลิก:** มีปุ่มทดลองใช้งานสำหรับนักเรียนเตรียมทหารและช่างฝีมือทหาร

---

## 📂 โครงสร้างโปรเจกต์ (Project Files)

```text
tidpro-exam/
├── index.html               # โครงสร้างหน้าเว็บหลักตามหลัก Semantic SEO
├── style.css                # ดีไซน์ระบบ Liquid Glass แบบ Zero-Lag 120fps
├── app.js                   # ระบบควบคุม Filter, Search, Auth, Bookmarks, History
├── exam_data.js             # ฐานข้อมูลข้อสอบ 162 ชุด (JSON)
├── robots.txt               # กฎการจัดทำดัชนีของ Search Engine (Googlebot)
├── sitemap.xml              # แผนผังเว็บไซต์สำหรับ Google Search Console
├── site_logo.png            # โลโก้หลักของเว็บไซต์ (Open Graph / Social Sharing)
├── site_logo_thumb.png      # โลโก้ขนาดเล็กความละเอียด Retina สำหรับ Navbar
├── favicon.png              # ไอคอน Favicon หน้าเบราว์เซอร์ (PNG)
├── favicon.ico              # ไอคอน Favicon หน้าเบราว์เซอร์ (ICO)
├── tutor_user.png           # ภาพติวเตอร์พี่เบน (Harvard University Honours)
├── tutor_friend.png         # ภาพติวเตอร์พี่พอตเตอร์ (Harvard University Honours)
└── [assets/insignias]       # ตราสัญลักษณ์และไอคอนสถาบัน (PNG & SVG)
```

---

## 🚀 วิธีการติดตั้งและรันบนเครื่องคอมพิวเตอร์ (Local Development)

รันเซิร์ฟเวอร์จำลองเพื่อทดสอบบนเครื่องด้วย Python:
```bash
python -m http.server 8080
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:8080`

---

## 📄 แหล่งที่มาและเครดิต (Credits)
ขอขอบคุณแหล่งข้อมูลต้นฉบับจาก **[CadetExam Blogspot](https://cadetexam.blogspot.com/)** คลังข้อสอบเตรียมทหาร นายร้อย ช่างฝีมือทหาร จัดทำขึ้นเพื่อประโยชน์ทางการศึกษาแก่เยาวชนไทยทุกคน
