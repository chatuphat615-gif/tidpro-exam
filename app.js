// ข้อมูลตัวอย่างสำหรับเนื้อหาในโมดอล
const sampleArticles = {
  "บันทึกแนะนำโครงสร้างคลังความรู้": {
    category: "ทั่วไป",
    title: "บันทึกแนะนำโครงสร้างคลังความรู้",
    content: `
      <h2>ยินดีต้อนรับสู่คลังความรู้</h2>
      <p>หน้านี้เป็นเทมเพลตเริ่มต้นแบบคลีน (Clean & Minimal) ที่เน้นความสบายตาและอ่านง่ายด้วยฟอนต์ <strong>TH Sarabun</strong></p>
      <p>คุณสามารถระบุหัวข้อ เทคนิค หรือคำสั่งที่ใช้งานบ่อย และทยอยแจ้งให้เพิ่มส่วนต่างๆ เช่น:</p>
      <ul>
        <li>กล่องคัดลอกโค้ด/คำสั่ง (Copy to Clipboard)</li>
        <li>ระบบแบ่งหมวดหมู่แบบละเอียด (Tagging / Folders)</li>
        <li>Dark Mode สลับธีมมืด-สว่าง</li>
        <li>ระบบ Bookmark หรือปักหมุดเทคนิคที่ใช้บ่อย</li>
      </ul>
    `
  },
  "การตั้งค่าและปรับแต่งระบบเบื้องต้น": {
    category: "คอมพิวเตอร์ & Windows",
    title: "การตั้งค่าและปรับแต่งระบบเบื้องต้น",
    content: `
      <h2>การปรับแต่งและบำรุงรักษา Windows</h2>
      <p>ตัวอย่างสคริปต์และคำสั่งที่ใช้ในการล้างแคชและแก้ปัญหาเน็ตเวิร์กเบื้องต้น:</p>
      <pre># ล้าง DNS Cache
ipconfig /flushdns

# รีเซ็ตการตั้งค่า Winsock
netsh winsock reset</pre>
      <p>บันทึกเหล่านี้สามารถปรับเปลี่ยนเป็นขั้นตอนและคำอธิบายของคุณได้เลยครับ</p>
    `
  },
  "การอัปเดตเว็บขึ้น GitHub Pages (.github.io)": {
    category: "เว็บไซต์ & โค้ด",
    title: "การอัปเดตเว็บขึ้น GitHub Pages (.github.io)",
    content: `
      <h2>วิธีเปิดใช้งานบน .github.io</h2>
      <p>ขั้นตอนการนำไฟล์ขึ้น GitHub เพื่อให้เป็นเว็บออนไลน์:</p>
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li>สร้าง Repository ใน GitHub โดยตั้งชื่อว่า <code>[ชื่อบัญชีคุณ].github.io</code></li>
        <li>นำไฟล์ <code>index.html</code>, <code>style.css</code> และ <code>app.js</code> อัปโหลดเข้าไปที่หน้าหลัก (Root)</li>
        <li>ไปที่เมนู <strong>Settings &gt; Pages</strong> ตรวจสอบว่า Branch ชี้ไปที่ <code>main</code> หรือ <code>master</code> แล้วกด Save</li>
        <li>รอประมาณ 1-2 นาที คุณจะเข้าดูเว็บได้ทันทีผ่านลิงก์ <code>https://[ชื่อบัญชีคุณ].github.io</code></li>
      </ol>
    `
  }
};

// Search Filter Logic
const searchInput = document.getElementById('searchInput');
const cardContainer = document.getElementById('cardContainer');
const cards = document.querySelectorAll('.doc-card');
const emptyState = document.getElementById('emptyState');
const tabs = document.querySelectorAll('.tab-btn');

let currentCategory = 'all';

// ฟังก์ชันกรองการแสดงผล
function filterCards() {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const summary = card.querySelector('.card-summary').textContent.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch = title.includes(query) || summary.includes(query);
    const matchesCategory = (currentCategory === 'all' || category === currentCategory);

    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Event Listeners สำหรับแท็บหมวดหมู่
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    filterCards();
  });
});

// Event Listener สำหรับช่องค้นหา
searchInput.addEventListener('input', filterCards);

// Modal Logic
const modal = document.getElementById('docModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.card-title').textContent;
    const article = sampleArticles[title];

    if (article) {
      modalBody.innerHTML = article.content;
      modal.classList.add('active');
    }
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});
