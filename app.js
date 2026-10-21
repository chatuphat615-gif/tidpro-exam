// ==========================================================================
// ติดโปร Exam (tidpro-exam) - Full System Application Logic
// ==========================================================================

// DOM Elements
const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');
const tabs = document.querySelectorAll('.tab-btn');
const countAllSpan = document.getElementById('countAll');
const statTotalExams = document.getElementById('statTotalExams');

const subjectSelect = document.getElementById('subjectSelect');
const sortSelect = document.getElementById('sortSelect');

const filterIndicator = document.getElementById('filterIndicator');
const filterQueryText = document.getElementById('filterQueryText');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

// Modal Elements
const modal = document.getElementById('docModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalDirectLink = document.getElementById('modalDirectLink');

// Bookmark Elements
const bookmarkDrawerBtn = document.getElementById('bookmarkDrawerBtn');
const bookmarkDrawer = document.getElementById('bookmarkDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const bookmarkCount = document.getElementById('bookmarkCount');
const drawerBadge = document.getElementById('drawerBadge');
const bookmarkList = document.getElementById('bookmarkList');

// Dark Mode Toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// Timer Widget Elements
const timerWidget = document.getElementById('timerWidget');
const timerMinBtn = document.getElementById('timerMinBtn');
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const openTimerToolBtn = document.getElementById('openTimerToolBtn');

// Toast
const toastNotify = document.getElementById('toastNotify');

// State
let currentCategory = 'all';
let currentSubject = 'all';
let currentSort = 'year-desc';
let savedBookmarks = JSON.parse(localStorage.getItem('tidpro_bookmarks') || '[]');

// ==========================================================================
// 1. Toast Notification Helper
// ==========================================================================
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastNotify.textContent = message;
  toastNotify.classList.add('active');
  toastTimeout = setTimeout(() => {
    toastNotify.classList.remove('active');
  }, 2200);
}

// ==========================================================================
// 2. Dark Mode Management
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('tidpro_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    // Sun icon
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    // Moon icon
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('tidpro_theme', target);
  updateThemeIcon(target);
  showToast(target === 'dark' ? '🌙 เปลี่ยนเป็นโหมดกลางคืน' : '☀️ เปลี่ยนเป็นโหมดสว่าง');
});

// ==========================================================================
// 3. Exam Live Countdown (สู่ช่วงสอบต้นปี มีนาคม 2570)
// ==========================================================================
function startCountdown() {
  // วันที่สอบจำลอง: วันที่ 15 มีนาคม ของปีถัดไป
  const nextExamDate = new Date("2027-03-15T09:00:00").getTime();

  function update() {
    const now = new Date().getTime();
    const distance = nextExamDate - now;

    if (distance < 0) {
      document.getElementById('cdDays').textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = days < 10 ? '0' + days : days;
    document.getElementById('cdHours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('cdMins').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('cdSecs').textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 4. Practice Stopwatch / Timer
// ==========================================================================
let stopwatchSeconds = 0;
let stopwatchInterval = null;

function formatTime(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
}

startTimerBtn.addEventListener('click', () => {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchSeconds++;
    stopwatchDisplay.textContent = formatTime(stopwatchSeconds);
  }, 1000);
});

pauseTimerBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
});

resetTimerBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchSeconds = 0;
  stopwatchDisplay.textContent = "00:00:00";
});

timerMinBtn.addEventListener('click', () => {
  timerWidget.classList.toggle('minimized');
  timerMinBtn.textContent = timerWidget.classList.contains('minimized') ? '+' : '−';
});

openTimerToolBtn.addEventListener('click', () => {
  timerWidget.classList.remove('minimized');
  timerMinBtn.textContent = '−';
  showToast("⏱️ เปิดเครื่องมือจับเวลาทำข้อสอบแล้วครับ");
});

// ==========================================================================
// 5. Bookmark System (บันทึกข้อสอบที่ชอบ)
// ==========================================================================
function updateBookmarkUI() {
  const count = savedBookmarks.length;
  bookmarkCount.textContent = count;
  drawerBadge.textContent = count;

  bookmarkList.innerHTML = '';
  if (count === 0) {
    bookmarkList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 40px 10px;">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">⭐</span>
        <p>ยังไม่มีข้อสอบที่บันทึกไว้</p>
        <p style="font-size: 0.85rem;">กดไอคอนรูปดาวบนการ์ดข้อสอบเพื่อเก็บไว้อ่านทบทวนภายหลัง</p>
      </div>
    `;
    return;
  }

  savedBookmarks.forEach(item => {
    const el = document.createElement('div');
    el.className = 'bookmark-item';
    el.innerHTML = `
      <div class="bookmark-item-title">${item.title}</div>
      <div class="bookmark-item-actions">
        <a href="${item.pdf_url}" target="_blank" class="btn-sm-open" style="font-size:0.8rem; padding: 4px 8px;">เปิด PDF &rarr;</a>
        <button class="remove-bm-btn" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.82rem; font-family:'Sarabun'; font-weight:600;" data-url="${item.url}">ลบ</button>
      </div>
    `;
    bookmarkList.appendChild(el);
  });

  // Remove event
  document.querySelectorAll('.remove-bm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBookmarkByUrl(btn.dataset.url);
    });
  });
}

function toggleBookmark(item) {
  const index = savedBookmarks.findIndex(b => b.url === item.url);
  if (index > -1) {
    savedBookmarks.splice(index, 1);
    showToast("ลบออกจากข้อสอบที่บันทึกแล้ว");
  } else {
    savedBookmarks.push({
      title: formatTitle(item.title),
      url: item.url,
      pdf_url: item.pdf_url
    });
    showToast("⭐ บันทึกข้อสอบเข้าคลังส่วนตัวแล้ว");
  }
  localStorage.setItem('tidpro_bookmarks', JSON.stringify(savedBookmarks));
  updateBookmarkUI();
  filterAndSortItems();
}

function toggleBookmarkByUrl(url) {
  const item = examData.find(x => x.url === url);
  if (item) toggleBookmark(item);
}

bookmarkDrawerBtn.addEventListener('click', () => {
  bookmarkDrawer.classList.add('active');
  drawerBackdrop.classList.add('active');
});

drawerClose.addEventListener('click', () => {
  bookmarkDrawer.classList.remove('active');
  drawerBackdrop.classList.remove('active');
});

drawerBackdrop.addEventListener('click', () => {
  bookmarkDrawer.classList.remove('active');
  drawerBackdrop.classList.remove('active');
});

// ==========================================================================
// 6. Card Rendering & Filtering Engine
// ==========================================================================
function getBadgeClass(category) {
  if (category === 'ช่างฝีมือทหาร') return 'badge-mtts';
  if (category === 'นายร้อย & จปร.') return 'badge-crma';
  return 'badge-afaps';
}

function formatTitle(title) {
  return title.replace(/\[PDF\]/gi, '').replace(/\[VIDEO\]/gi, '').trim();
}

function copyPdfLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast("📋 คัดลอกลิงก์ PDF เรียบร้อยแล้ว!");
  });
}

function renderCards(items) {
  cardContainer.innerHTML = '';
  
  if (items.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'doc-card';
    card.dataset.category = item.category;

    const displayTitle = formatTitle(item.title);
    const badgeClass = getBadgeClass(item.category);
    const yearDisplay = item.year > 0 ? `<span class="year-badge">พ.ศ. ${item.year}</span>` : `<span class="year-badge">แนวข้อสอบ</span>`;
    const isSaved = savedBookmarks.some(b => b.url === item.url);

    card.innerHTML = `
      <div class="card-meta">
        <div class="meta-left">
          <span class="badge ${badgeClass}">${item.category}</span>
          ${yearDisplay}
        </div>
        <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-url="${item.url}" title="${isSaved ? 'ลบจากที่บันทึก' : 'บันทึกข้อสอบนี้'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>

      <h2 class="card-title">${displayTitle}</h2>

      <div class="card-actions">
        <a href="${item.pdf_url}" target="_blank" rel="noopener noreferrer" class="btn-open-pdf">
          <span>ดาวน์โหลด / เปิด PDF</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        ${item.preview_pdf ? `<button class="btn-view-preview" data-preview="${item.preview_pdf}" data-title="${displayTitle}" data-direct="${item.pdf_url}">ตัวอย่าง</button>` : ''}
        <button class="btn-copy-link" data-link="${item.pdf_url}" title="คัดลอกลิงก์">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    `;

    cardContainer.appendChild(card);
  });

  // Bookmark buttons click
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetItem = examData.find(x => x.url === btn.dataset.url);
      if (targetItem) toggleBookmark(targetItem);
    });
  });

  // Preview buttons click
  document.querySelectorAll('.btn-view-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPreview(btn.dataset.preview, btn.dataset.title, btn.dataset.direct);
    });
  });

  // Copy link buttons click
  document.querySelectorAll('.btn-copy-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyPdfLink(btn.dataset.link);
    });
  });
}

// กรองข้อมูลและเรียงลำดับหลายมิติ
function filterAndSortItems() {
  const query = searchInput.value.toLowerCase().trim();
  clearSearchBtn.classList.toggle('active', query.length > 0);

  let results = examData.filter(item => {
    const titleLower = item.title.toLowerCase();
    const categoryLower = item.category.toLowerCase();
    const yearStr = item.year ? item.year.toString() : '';

    // Search Query
    const matchesQuery = !query || titleLower.includes(query) || categoryLower.includes(query) || yearStr.includes(query);

    // Category Filter
    const matchesCategory = (currentCategory === 'all' || item.category === currentCategory);

    // Subject Filter
    let matchesSubject = true;
    if (currentSubject !== 'all') {
      if (currentSubject === 'คณิต') matchesSubject = titleLower.includes('คณิต');
      else if (currentSubject === 'วิทย์') matchesSubject = titleLower.includes('วิทย์') || titleLower.includes('เคมี') || titleLower.includes('เลนส์') || titleLower.includes('ไฟฟ้า') || titleLower.includes('แสง') || titleLower.includes('นิวตัน');
      else if (currentSubject === 'อังกฤษ') matchesSubject = titleLower.includes('อังกฤษ') || titleLower.includes('eng');
      else if (currentSubject === 'ไทย') matchesSubject = titleLower.includes('ไทย') || titleLower.includes('สังคม');
      else if (currentSubject === 'ครบทุกวิชา') matchesSubject = titleLower.includes('ครบทุกวิชา');
    }

    return matchesQuery && matchesCategory && matchesSubject;
  });

  // Sort by Year
  results.sort((a, b) => {
    const yearA = a.year || 0;
    const yearB = b.year || 0;
    if (currentSort === 'year-desc') {
      return yearB - yearA;
    } else {
      return (yearA || 9999) - (yearB || 9999);
    }
  });

  // Active filters banner
  if (query || currentCategory !== 'all' || currentSubject !== 'all') {
    filterIndicator.style.display = 'flex';
    const activeText = [
      query ? `"${query}"` : null,
      currentCategory !== 'all' ? currentCategory : null,
      currentSubject !== 'all' ? `วิชา ${currentSubject}` : null
    ].filter(Boolean).join(' + ');
    filterQueryText.textContent = `${activeText} (${results.length} รายการ)`;
  } else {
    filterIndicator.style.display = 'none';
  }

  renderCards(results);
}

// Reset filters
function resetAllFilters() {
  searchInput.value = '';
  currentCategory = 'all';
  currentSubject = 'all';
  currentSort = 'year-desc';

  tabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
  if (subjectSelect) subjectSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'year-desc';

  filterAndSortItems();
}

resetFiltersBtn.addEventListener('click', resetAllFilters);
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterAndSortItems();
});

// Category Tabs
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    filterAndSortItems();
  });
});

// Subject Dropdown
if (subjectSelect) {
  subjectSelect.addEventListener('change', (e) => {
    currentSubject = e.target.value;
    filterAndSortItems();
  });
}

// Sort Dropdown
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterAndSortItems();
  });
}

searchInput.addEventListener('input', filterAndSortItems);

// ==========================================================================
// 7. PDF Preview Modal Management
// ==========================================================================
function openPreview(url, title, directLink) {
  modalTitle.textContent = title;
  modalSubtitle.textContent = "กำลังเปิดตัวอย่างไฟล์ PDF ผ่าน Google Drive Viewer";
  modalDirectLink.href = directLink || url;
  modalBody.innerHTML = `<iframe src="${url}" allow="autoplay" loading="lazy"></iframe>`;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  modalBody.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    bookmarkDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
  }
});

// ==========================================================================
// 8. Initialization
// ==========================================================================
initTheme();
startCountdown();
updateBookmarkUI();

if (typeof examData !== 'undefined') {
  countAllSpan.textContent = examData.length;
  statTotalExams.textContent = `${examData.length}+ ชุด`;
  filterAndSortItems();
}
