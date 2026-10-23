// ==========================================================================
// TIDPRO EXAM - Clean Reading Experience & Auth Controller
// ==========================================================================

// DOM Elements: Main Content & Search
const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');
const countAllSpan = document.getElementById('countAll');

const subjectSelect = document.getElementById('subjectSelect');
const sortSelect = document.getElementById('sortSelect');

const filterIndicator = document.getElementById('filterIndicator');
const filterQueryText = document.getElementById('filterQueryText');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

// Navigation & Liquid Glass Elements
const desktopNav = document.getElementById('desktopNav');
const navSlider = document.getElementById('navSlider');
const desktopNavBtns = document.querySelectorAll('.desktop-category-nav .nav-btn');
const mobileChips = document.querySelectorAll('.mobile-chip-scroll .chip');
const themeDots = document.querySelectorAll('.theme-dot');
const authTabSlider = document.getElementById('authTabSlider');
const mouseGlow = document.getElementById('mouseGlowFollower');

// --------------------------------------------------------------------------
// Liquid Glass Tab Slider & Theme Management (Sepia & Paper Light)
// --------------------------------------------------------------------------
function updateNavSlider(targetBtn) {
  if (!navSlider || !desktopNav) return;
  const activeBtn = targetBtn || desktopNav.querySelector('.nav-btn.active');
  if (!activeBtn) {
    navSlider.style.opacity = '0';
    return;
  }
  const navRect = desktopNav.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  // Include scrollLeft so the slider aligns accurately when scrolled horizontally
  const left = (btnRect.left - navRect.left) + desktopNav.scrollLeft;
  const width = btnRect.width;

  navSlider.style.opacity = '1';
  navSlider.style.transform = `translateX(${left}px)`;
  navSlider.style.width = `${width}px`;
}

function updateAuthSlider(tab) {
  if (!authTabSlider) return;
  if (tab === 'register') {
    authTabSlider.style.transform = 'translateX(100%)';
  } else {
    authTabSlider.style.transform = 'translateX(0%)';
  }
}

function setTheme(theme) {
  // Strictly allow only sepia or light (dark mode completely removed)
  const safeTheme = (theme === 'light') ? 'light' : 'sepia';
  document.body.setAttribute('data-theme', safeTheme);
  localStorage.setItem('tidpro_reading_theme', safeTheme);
  localStorage.setItem('tidpro_theme', safeTheme);

  themeDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.setTheme === safeTheme);
  });
  setTimeout(() => updateNavSlider(), 80);
}

function initTheme() {
  let savedTheme = localStorage.getItem('tidpro_reading_theme') || localStorage.getItem('tidpro_theme') || 'sepia';
  if (savedTheme === 'dark') savedTheme = 'sepia';
  setTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetTheme = dot.dataset.setTheme;
      if (targetTheme && targetTheme !== 'dark') {
        setTheme(targetTheme);
        const themeNames = {
          sepia: "โทนถนอมสายตา (Sepia Warm)",
          light: "โทนกระดาษขาว (Paper White)"
        };
        showToast(`🎨 สลับเป็น ${themeNames[targetTheme] || targetTheme}`);
      }
    });
  });
}

// PDF Modal Elements
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

// Reading History Drawer Elements
const historyDrawer = document.getElementById('historyDrawer');
const historyClose = document.getElementById('historyClose');
const historyBadge = document.getElementById('historyBadge');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Toast Element
const toastNotify = document.getElementById('toastNotify');

// Auth & User Profile Elements
const loginOpenBtn = document.getElementById('loginOpenBtn');
const userMenuContainer = document.getElementById('userMenuContainer');
const userPillBtn = document.getElementById('userPillBtn');
const userDropdownPanel = document.getElementById('userDropdownPanel');
const navUserAvatar = document.getElementById('navUserAvatar');
const navUserName = document.getElementById('navUserName');
const dropdownAvatar = document.getElementById('dropdownAvatar');
const dropdownFullName = document.getElementById('dropdownFullName');
const dropdownTarget = document.getElementById('dropdownTarget');
const dropdownBmCount = document.getElementById('dropdownBmCount');
const dropdownHistoryCount = document.getElementById('dropdownHistoryCount');
const menuMyBookmarks = document.getElementById('menuMyBookmarks');
const menuMyHistory = document.getElementById('menuMyHistory');
const logoutBtn = document.getElementById('logoutBtn');

// Auth Modal Elements
const authModal = document.getElementById('authModal');
const authModalClose = document.getElementById('authModalClose');
const authModalHeading = document.getElementById('authModalHeading');
const authModalSubheading = document.getElementById('authModalSubheading');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const toggleLoginPwd = document.getElementById('toggleLoginPwd');
const rememberMe = document.getElementById('rememberMe');
const regFullName = document.getElementById('regFullName');
const regUsername = document.getElementById('regUsername');
const regTarget = document.getElementById('regTarget');
const regPassword = document.getElementById('regPassword');
const demoLoginBtns = document.querySelectorAll('.btn-demo-pill');

// ==========================================================================
// 1. Accounts & Authentication System
// ==========================================================================
const DEFAULT_ACCOUNTS = [
  {
    username: 'cadet',
    password: '1234',
    fullName: 'น้องกานต์ (นตท.65)',
    target: 'โรงเรียนเตรียมทหาร (4 เหล่าทัพ)',
    avatar: 'ตท',
    bookmarks: [],
    history: []
  },
  {
    username: 'mtts',
    password: '1234',
    fullName: 'น้องเอก (ช่างฝีมือทหาร)',
    target: 'โรงเรียนช่างฝีมือทหาร (MTTS)',
    avatar: 'ชท',
    bookmarks: [],
    history: []
  }
];

function getStoredUsers() {
  const users = localStorage.getItem('tidpro_users');
  if (!users) {
    localStorage.setItem('tidpro_users', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  try {
    return JSON.parse(users);
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

function saveStoredUsers(users) {
  localStorage.setItem('tidpro_users', JSON.stringify(users));
}

let currentUser = null;
try {
  const sessionData = localStorage.getItem('tidpro_current_user');
  if (sessionData) {
    currentUser = JSON.parse(sessionData);
  }
} catch (e) {
  currentUser = null;
}

// User Bookmarks and History State
let savedBookmarks = [];
let readingHistory = [];

function syncUserLocalData() {
  if (currentUser) {
    savedBookmarks = currentUser.bookmarks || [];
    readingHistory = currentUser.history || [];
  } else {
    try {
      savedBookmarks = JSON.parse(localStorage.getItem('tidpro_guest_bookmarks') || '[]');
      readingHistory = JSON.parse(localStorage.getItem('tidpro_guest_history') || '[]');
    } catch (e) {
      savedBookmarks = [];
      readingHistory = [];
    }
  }
}

function persistUserData() {
  if (currentUser) {
    currentUser.bookmarks = savedBookmarks;
    currentUser.history = readingHistory;
    localStorage.setItem('tidpro_current_user', JSON.stringify(currentUser));
    
    // Sync into global user accounts list
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
    if (idx > -1) {
      users[idx] = currentUser;
      saveStoredUsers(users);
    }
  } else {
    localStorage.setItem('tidpro_guest_bookmarks', JSON.stringify(savedBookmarks));
    localStorage.setItem('tidpro_guest_history', JSON.stringify(readingHistory));
  }
}

function generateAvatarInitials(name) {
  if (!name) return 'ตท';
  const clean = name.replace(/น้อง|นาย|ด\.ช\.|ด\.ญ\./g, '').trim();
  return clean.slice(0, 2) || 'ตท';
}

function updateAuthUI() {
  if (currentUser) {
    if (loginOpenBtn) loginOpenBtn.style.display = 'none';
    if (userMenuContainer) userMenuContainer.style.display = 'inline-block';

    const avatarText = currentUser.avatar || generateAvatarInitials(currentUser.fullName);
    if (navUserAvatar) navUserAvatar.textContent = avatarText;
    if (navUserName) navUserName.textContent = currentUser.fullName.split(' ')[0] || currentUser.username;
    if (dropdownAvatar) dropdownAvatar.textContent = avatarText;
    if (dropdownFullName) dropdownFullName.textContent = currentUser.fullName;
    if (dropdownTarget) dropdownTarget.textContent = currentUser.target || 'เตรียมตัวสอบทหาร';
    if (dropdownBmCount) dropdownBmCount.textContent = savedBookmarks.length;
    if (dropdownHistoryCount) dropdownHistoryCount.textContent = readingHistory.length;
  } else {
    if (loginOpenBtn) loginOpenBtn.style.display = 'inline-flex';
    if (userMenuContainer) {
      userMenuContainer.style.display = 'none';
      userMenuContainer.classList.remove('active');
    }
  }
  updateBookmarkUI();
  updateHistoryUI();
}

// User Menu Dropdown Toggle
if (userPillBtn) {
  userPillBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenuContainer.classList.toggle('active');
  });
}

document.addEventListener('click', (e) => {
  if (userMenuContainer && !userMenuContainer.contains(e.target)) {
    userMenuContainer.classList.remove('active');
  }
});

// Auth Modal Open & Close
function openAuthModal(mode = 'login') {
  if (userMenuContainer) userMenuContainer.classList.remove('active');
  authModal.classList.add('active');
  setAuthTab(mode);
}

function closeAuthModal() {
  authModal.classList.remove('active');
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
}

function setAuthTab(tab) {
  updateAuthSlider(tab);
  if (tab === 'login') {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    authModalHeading.textContent = 'เข้าสู่ระบบ TIDPRO EXAM';
    authModalSubheading.textContent = 'บันทึกข้อสอบโปรด และเก็บสถิติการทบทวนส่วนตัว';
    if (loginUsername) loginUsername.focus();
  } else {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    authModalHeading.textContent = 'สมัครสมาชิกใหม่ TIDPRO EXAM';
    authModalSubheading.textContent = 'สร้างบัญชีเพื่อเข้าถึงคลังข้อสอบและบันทึกประวัติฟรี';
    if (regFullName) regFullName.focus();
  }
}

if (loginOpenBtn) loginOpenBtn.addEventListener('click', () => openAuthModal('login'));
if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => setAuthTab('login'));
if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => setAuthTab('register'));

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
});

// Password Reveal Toggle
if (toggleLoginPwd && loginPassword) {
  toggleLoginPwd.addEventListener('click', () => {
    const isPassword = loginPassword.type === 'password';
    loginPassword.type = isPassword ? 'text' : 'password';
    toggleLoginPwd.style.color = isPassword ? 'var(--accent-study)' : 'var(--text-muted)';
  });
}

// Quick 1-Click Demo Login
demoLoginBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const demoType = btn.dataset.demo;
    const users = getStoredUsers();
    const demoUser = users.find(u => u.username === demoType);
    if (demoUser) {
      handleLoginSuccess(demoUser);
    }
  });
});

function handleLoginSuccess(user) {
  currentUser = user;
  syncUserLocalData();
  persistUserData();
  updateAuthUI();
  filterAndSortItems();
  closeAuthModal();
  showToast(`🎉 ยินดีต้อนรับคุณ ${user.fullName}`);
}

// Login Form Submit
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameVal = loginUsername.value.trim().toLowerCase();
    const passwordVal = loginPassword.value.trim();

    const users = getStoredUsers();
    const foundUser = users.find(u => 
      (u.username.toLowerCase() === usernameVal || (u.email && u.email.toLowerCase() === usernameVal)) &&
      u.password === passwordVal
    );

    if (foundUser) {
      handleLoginSuccess(foundUser);
    } else {
      showToast('❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองคลิกปุ่มบัญชีทดลองได้ครับ)');
      loginPassword.focus();
    }
  });
}

// Register Form Submit
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullNameVal = regFullName.value.trim();
    const usernameVal = regUsername.value.trim().toLowerCase();
    const targetVal = regTarget.value;
    const passwordVal = regPassword.value.trim();

    const users = getStoredUsers();
    const exists = users.some(u => u.username.toLowerCase() === usernameVal);
    if (exists) {
      showToast('⚠️ ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาเลือกชื่ออื่นครับ');
      regUsername.focus();
      return;
    }

    const newUser = {
      username: usernameVal,
      password: passwordVal,
      fullName: fullNameVal,
      target: targetVal,
      avatar: generateAvatarInitials(fullNameVal),
      bookmarks: [],
      history: []
    };

    users.push(newUser);
    saveStoredUsers(users);
    handleLoginSuccess(newUser);
    showToast(`✨ สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${fullNameVal}`);
  });
}

// Logout
function handleLogout() {
  if (userMenuContainer) userMenuContainer.classList.remove('active');
  const oldName = currentUser ? currentUser.fullName : '';
  currentUser = null;
  localStorage.removeItem('tidpro_current_user');
  syncUserLocalData();
  updateAuthUI();
  filterAndSortItems();
  showToast(`👋 ออกจากระบบเรียบร้อยแล้ว`);
}

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

// Menu item clicks
if (menuMyBookmarks) {
  menuMyBookmarks.addEventListener('click', () => {
    if (userMenuContainer) userMenuContainer.classList.remove('active');
    bookmarkDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
  });
}

if (menuMyHistory) {
  menuMyHistory.addEventListener('click', () => {
    if (userMenuContainer) userMenuContainer.classList.remove('active');
    historyDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
  });
}

// Toast notification
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
// 3. Bookmark System
// ==========================================================================
function updateBookmarkUI() {
  const count = savedBookmarks.length;
  if (bookmarkCount) bookmarkCount.textContent = count;
  if (drawerBadge) drawerBadge.textContent = count;
  if (dropdownBmCount) dropdownBmCount.textContent = count;

  if (!bookmarkList) return;
  bookmarkList.innerHTML = '';
  
  if (count === 0) {
    bookmarkList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 50px 10px;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">⭐</span>
        <p>ยังไม่มีข้อสอบที่บันทึกไว้</p>
        <p style="font-size: 0.85rem;">กดไอคอนรูปดาวบนการ์ดข้อสอบเพื่อเก็บไว้อ่านทบทวน</p>
      </div>
    `;
    return;
  }

  savedBookmarks.forEach(item => {
    const el = document.createElement('div');
    el.className = 'drawer-item';
    el.innerHTML = `
      <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); line-height: 1.4;">${item.title}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <a href="${item.pdf_url}" target="_blank" class="btn-open-external" style="padding: 4px 10px; font-size: 0.8rem;">เปิด PDF &rarr;</a>
        <button class="remove-bm-btn" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem; font-family:'Sarabun'; font-weight:600;" data-url="${item.url}">ลบ</button>
      </div>
    `;
    bookmarkList.appendChild(el);
  });

  document.querySelectorAll('.remove-bm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBookmarkByUrl(btn.dataset.url);
    });
  });
}

function toggleBookmark(item) {
  const index = savedBookmarks.findIndex(b => b.url === item.url);
  const isSaving = (index === -1);
  if (!isSaving) {
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
  persistUserData();
  updateBookmarkUI();

  // Instant in-place card bookmark button update without full grid re-render!
  if (cardContainer) {
    const btn = cardContainer.querySelector(`.btn-bookmark-action[data-url="${CSS.escape(item.url)}"]`);
    if (btn) {
      btn.classList.toggle('saved', isSaving);
      btn.setAttribute('title', isSaving ? 'ลบจากที่บันทึก' : 'บันทึกข้อสอบ');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', isSaving ? '#d97706' : 'none');
    }
  }
}

function toggleBookmarkByUrl(url) {
  const item = examData.find(x => x.url === url);
  if (item) toggleBookmark(item);
}

if (bookmarkDrawerBtn) {
  bookmarkDrawerBtn.addEventListener('click', () => {
    bookmarkDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
  });
}

if (drawerClose) {
  drawerClose.addEventListener('click', () => {
    bookmarkDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
  });
}

// ==========================================================================
// 4. Reading History System
// ==========================================================================
function recordHistory(title, pdfUrl, directUrl) {
  const now = new Date();
  const timeFormatted = now.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Filter out duplicate url, add fresh on top
  readingHistory = readingHistory.filter(h => h.pdf_url !== pdfUrl);
  readingHistory.unshift({
    title: formatTitle(title),
    pdf_url: pdfUrl,
    direct_url: directUrl || pdfUrl,
    timestamp: timeFormatted
  });

  // Cap at 25 items
  if (readingHistory.length > 25) {
    readingHistory = readingHistory.slice(0, 25);
  }

  persistUserData();
  updateHistoryUI();
}

function updateHistoryUI() {
  const count = readingHistory.length;
  if (historyBadge) historyBadge.textContent = count;
  if (dropdownHistoryCount) dropdownHistoryCount.textContent = count;

  if (!historyList) return;
  historyList.innerHTML = '';

  if (count === 0) {
    historyList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 50px 10px;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">📖</span>
        <p>ยังไม่มีประวัติการเปิดอ่านข้อสอบ</p>
        <p style="font-size: 0.85rem;">เมื่อคุณกดดูตัวอย่างหรือเปิดอ่านข้อสอบ ระบบจะบันทึกไว้ที่นี่</p>
      </div>
    `;
    return;
  }

  readingHistory.forEach(item => {
    const el = document.createElement('div');
    el.className = 'drawer-item';
    el.innerHTML = `
      <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); line-height: 1.4;">${item.title}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span style="font-size: 0.78rem; color: var(--text-muted);">🕒 ${item.timestamp}</span>
        <a href="${item.direct_url}" target="_blank" class="btn-open-external" style="padding: 4px 10px; font-size: 0.8rem;">เปิด PDF &rarr;</a>
      </div>
    `;
    historyList.appendChild(el);
  });
}

if (historyClose) {
  historyClose.addEventListener('click', () => {
    historyDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
  });
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    readingHistory = [];
    persistUserData();
    updateHistoryUI();
    showToast('🗑️ ล้างประวัติการอ่านเรียบร้อย');
  });
}

if (drawerBackdrop) {
  drawerBackdrop.addEventListener('click', () => {
    bookmarkDrawer.classList.remove('active');
    historyDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
  });
}

// ==========================================================================
// 5. Authentic Institutional Logos & Characteristic Subject Badges
// Real, official logos with transparent backgrounds & characteristic symbols
// ==========================================================================
function getInsigniaLogo(item) {
  if (!item) return `<img src="simulator.svg" alt="TIDPRO EXAM" class="card-insignia-img" loading="lazy" decoding="async">`;
  const academy = (item.academy || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const sub = (item.sub_academy || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const subj = (item.subject || '').toLowerCase();

  // 1. KVIS (รร.กำเนิดวิทย์) - โลโก้จริงสถาบัน
  if (academy.includes('กำเนิดวิทย์') || title.includes('kvis') || title.includes('กำเนิดวิทย์') || sub.includes('kvis')) {
    return `<img src="kvis.png" alt="โลโก้ รร.กำเนิดวิทย์ (KVIS)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 2. รร.เตรียมอุดมศึกษา - พระเกี้ยว (Official Emblem)
  if (academy.includes('เตรียมอุดม') || title.includes('เตรียมอุดม') || sub.includes('triam')) {
    return `<img src="tu.svg" alt="พระเกี้ยว รร.เตรียมอุดมศึกษา" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 3. รร.มหิดลวิทยานุสรณ์ (MWIT) - โลโก้จริงสถาบัน
  if (academy.includes('มหิดล') || title.includes('มหิดล') || title.includes('mwit') || sub.includes('mwit')) {
    return `<img src="mwit.png" alt="โลโก้ รร.มหิดลวิทยานุสรณ์ (MWIT)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 4. รร.สวนกุหลาบวิทยาลัย - ตรากุหลาบ ส.ก. (Official Crest)
  if (academy.includes('สวนกุหลาบ') || title.includes('สวนกุหลาบ') || sub.includes('sk')) {
    return `<img src="sk.png" alt="ตราประจำ รร.สวนกุหลาบวิทยาลัย" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 5. รร.บดินทรเดชา (สิงห์ สิงหเสนี) - ตราประจำโรงเรียน
  if (academy.includes('บดินทร') || title.includes('บดินทร') || sub.includes('bodin')) {
    return `<img src="bodin.png" alt="ตราประจำ รร.บดินทรเดชา" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 6. รร.สาธิต มศว ปทุมวัน - ตรากราฟ มศว
  if (academy.includes('สาธิต') || title.includes('สาธิต') || title.includes('ปทุมวัน') || sub.includes('patumwan')) {
    return `<img src="patumwan.svg" alt="ตรา รร.สาธิต มศว ปทุมวัน" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 7. รร.ช่างฝีมือทหาร (MTTS) - ตราจริงเฟืองและสมอ
  if (academy.includes('ช่างฝีมือทหาร') || title.includes('ช่างฝีมือทหาร') || sub.includes('mtts') || cat.includes('ช่างฝีมือทหาร')) {
    return `<img src="mtts.png" alt="ตรา รร.ช่างฝีมือทหาร (MTTS)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 8. รร.นายร้อย จปร. (CRMA - ทหารบก) - ตราจริงนายร้อย จปร.
  if (academy.includes('จปร') || title.includes('จปร') || sub.includes('crma') || title.includes('ทหารบก')) {
    return `<img src="crma.png" alt="ตรา รร.นายร้อยพระจุลจอมเกล้า (จปร.)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 9. รร.นายเรือ (RTNA - ทหารเรือ) - ตราจริงนายเรือ
  if (academy.includes('นายเรือ') || title.includes('นายเรือ') || sub.includes('rtna') || title.includes('ทหารเรือ')) {
    return `<img src="rtna.png" alt="ตรา รร.นายเรือ (RTNA)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 10. รร.นายเรืออากาศฯ (RTAFA - ทหารอากาศ) - ตราจริงนายเรืออากาศ
  if (academy.includes('นายเรืออากาศ') || title.includes('นายเรืออากาศ') || sub.includes('rtafa') || title.includes('ทหารอากาศ')) {
    return `<img src="rtafa.svg" alt="ตรา รร.นายเรืออากาศนวมินทกษัตริยาธิราช" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 11. รร.นายร้อยตำรวจ (RPCA) - ตราจริงนายร้อยตำรวจ
  if (academy.includes('ตำรวจ') || title.includes('ตำรวจ') || sub.includes('rpca')) {
    return `<img src="rpca.png" alt="ตรา รร.นายร้อยตำรวจ (RPCA)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 12. รร.เตรียมทหาร 4 เหล่า (AFAPS) - ตราจริงเตรียมทหาร
  if (academy.includes('เตรียมทหาร') || title.includes('เตรียมทหาร') || sub.includes('afaps') || cat.includes('เตรียมทหาร')) {
    return `<img src="afaps.png" alt="ตรา รร.เตรียมทหาร (AFAPS)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 13. แบบฝึกข้อสอบคณิตศาสตร์ - เครื่องหมายบวกลบคูณหารอันเป็นเอกลักษณ์ (+ - × ÷ =)
  if (subj === 'คณิต' || cat.includes('คณิต') || sub.includes('math') || title.includes('คณิต')) {
    return `<img src="subject_math.svg" alt="สัญลักษณ์คณิตศาสตร์ (+ - × ÷ =)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 14. แบบฝึกข้อสอบวิทยาศาสตร์ - หลอดทดลองเคมีและวงโคจรอิเล็กตรอน
  if (subj === 'วิทย์' || cat.includes('วิทย์') || sub.includes('sci') || title.includes('วิทย')) {
    return `<img src="subject_science.svg" alt="สัญลักษณ์วิทยาศาสตร์ (เคมี & ฟิสิกส์)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 15. แบบฝึกข้อสอบภาษาอังกฤษ - ตัวอักษร ABC และธงสหราชอาณาจักร
  if (subj === 'อังกฤษ' || cat.includes('อังกฤษ') || sub.includes('eng') || title.includes('อังกฤษ')) {
    return `<img src="subject_english.svg" alt="สัญลักษณ์วิชาภาษาอังกฤษ (A B C)" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 16. แบบฝึกภาษาไทย & สังคมศึกษา - อักษร ก ข ค และพานรัฐธรรมนูญ
  if (subj === 'ไทย' || subj === 'สังคม' || cat.includes('ไทย') || sub.includes('thai') || title.includes('ไทย') || title.includes('สังคม')) {
    return `<img src="subject_thai_social.svg" alt="สัญลักษณ์วิชาภาษาไทย & สังคมศึกษา" class="card-insignia-img" loading="lazy" decoding="async">`;
  }
  // 17. Default simulator seal
  return `<img src="simulator.svg" alt="แนวข้อสอบจำลอง" class="card-insignia-img" loading="lazy" decoding="async">`;
}

function formatTitle(title) {
  return title.replace(/\[PDF\]/gi, '').replace(/\[VIDEO\]/gi, '').trim();
}

// ==========================================================================
// 6. Card Rendering
// ==========================================================================
function createCardHtml(item) {
  const displayTitle = formatTitle(item.title);
  const yearDisplay = item.year > 0 ? `พ.ศ. ${item.year}` : 'แนวข้อสอบ';
  const isSaved = savedBookmarks.some(b => b.url === item.url);
  const insigniaHtml = getInsigniaLogo(item);

  return `
    <article class="exam-book-card" data-category="${item.category}">
      <div class="card-insignia-banner">
        <div class="card-top-tags">
          <span class="badge-academy">${item.academy || item.category}</span>
          <div class="card-right-tags">
            <span class="badge-solution">✓ มีเฉลย</span>
            <span class="badge-year">${yearDisplay}</span>
          </div>
        </div>
        <div class="insignia-icon-wrapper">
          ${insigniaHtml}
        </div>
      </div>

      <div class="card-content">
        <div class="academy-subtext">${item.sub_academy || 'CADET & SCHOOLS'} &bull; เอกสาร PDF</div>
        ${item.topic ? `<div class="badge-topic">📌 ${item.topic}</div>` : ''}
        <h2 class="exam-card-title">${displayTitle}</h2>

        <div class="card-action-bar">
          <a href="${item.pdf_url}" target="_blank" rel="noopener noreferrer" class="btn-open-pdf" data-title="${displayTitle}" data-pdf="${item.pdf_url}">
            <span>ดาวน์โหลด PDF</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>
          ${item.preview_pdf ? `<button type="button" class="btn-preview-doc" data-preview="${item.preview_pdf}" data-title="${displayTitle}" data-direct="${item.pdf_url}">ตัวอย่าง</button>` : ''}
          <button type="button" class="btn-bookmark-action ${isSaved ? 'saved' : ''}" data-url="${item.url}" title="${isSaved ? 'ลบจากที่บันทึก' : 'บันทึกข้อสอบ'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? '#d97706' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// Single Event Delegation for ultra-high performance on mobile and tablet
let isCardContainerBound = false;
function initCardContainerEvents() {
  if (isCardContainerBound || !cardContainer) return;
  isCardContainerBound = true;

  cardContainer.addEventListener('click', (e) => {
    // 1. Bookmark Action
    const bookmarkBtn = e.target.closest('.btn-bookmark-action');
    if (bookmarkBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmarkByUrl(bookmarkBtn.dataset.url);
      return;
    }

    // 2. Preview Doc Modal
    const previewBtn = e.target.closest('.btn-preview-doc');
    if (previewBtn) {
      e.preventDefault();
      e.stopPropagation();
      openPreview(previewBtn.dataset.preview, previewBtn.dataset.title, previewBtn.dataset.direct);
      return;
    }

    // 3. Open PDF direct history tracking
    const openPdfLink = e.target.closest('.btn-open-pdf');
    if (openPdfLink) {
      recordHistory(openPdfLink.dataset.title, openPdfLink.dataset.pdf, openPdfLink.dataset.pdf);
      return;
    }
  });
}

// High-speed bulk DOM insertion
function renderCards(items) {
  initCardContainerEvents();
  
  if (countAllSpan) {
    countAllSpan.textContent = typeof examData !== 'undefined' ? examData.length : items.length;
  }
  
  if (!items || items.length === 0) {
    cardContainer.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  cardContainer.innerHTML = items.map(item => createCardHtml(item)).join('');
}

// ==========================================================================
// 7. Filtering & Sorting Logic
// ==========================================================================
let currentCategory = 'all';
let currentSubject = 'all';
let currentSort = 'year-desc';

function filterAndSortItems() {
  if (typeof examData === 'undefined') return;

  const query = searchInput.value.toLowerCase().trim();
  clearSearchBtn.classList.toggle('active', query.length > 0);

  let filtered = examData.filter(item => {
    const titleLower = item.title.toLowerCase();
    const itemCat = item.category || '';
    const itemSub = item.subject || '';
    const itemTopic = (item.topic || '').toLowerCase();

    // 1. Category Filter
    if (currentCategory !== 'all') {
      if (currentCategory === 'รร.ดัง & เตรียมอุดม') {
        const isSchool = itemCat.includes('รร.ดัง') || itemCat.includes('เตรียมอุดม') || 
                         titleLower.includes('เตรียมอุดม') || titleLower.includes('มหิดล') || 
                         titleLower.includes('kvis') || titleLower.includes('กำเนิดวิทย์') || 
                         titleLower.includes('สวนกุหลาบ') || titleLower.includes('บดินทร') || 
                         titleLower.includes('สาธิต');
        if (!isSchool) return false;
      } else if (currentCategory === 'คณิตศาสตร์ (Math)') {
        if (itemCat !== 'คณิตศาสตร์ (Math)' && itemSub !== 'คณิต' && !titleLower.includes('คณิต')) return false;
      } else if (currentCategory === 'วิทยาศาสตร์ (Science)') {
        if (itemCat !== 'วิทยาศาสตร์ (Science)' && itemSub !== 'วิทย์' && !titleLower.includes('วิทย') && !titleLower.includes('เคมี') && !titleLower.includes('ฟิสิกส์')) return false;
      } else if (currentCategory === 'ภาษาอังกฤษ (English)') {
        if (itemCat !== 'ภาษาอังกฤษ (English)' && itemSub !== 'อังกฤษ' && !titleLower.includes('อังกฤษ') && !titleLower.includes('eng')) return false;
      } else if (currentCategory === 'ภาษาไทย & สังคม') {
        if (itemCat !== 'ภาษาไทย & สังคม' && itemSub !== 'ไทย' && itemSub !== 'สังคม' && !titleLower.includes('ไทย') && !titleLower.includes('สังคม')) return false;
      } else if (currentCategory === 'ช่างฝีมือทหาร') {
        if (itemCat !== 'ช่างฝีมือทหาร' && !titleLower.includes('ช่างฝีมือทหาร') && !titleLower.includes('mtts')) return false;
      } else if (currentCategory === 'เตรียมทหาร') {
        const isCadet = itemCat === 'เตรียมทหาร' || titleLower.includes('เตรียมทหาร') || 
                        titleLower.includes('จปร') || titleLower.includes('นายเรือ') || 
                        titleLower.includes('ตำรวจ') || titleLower.includes('นายสิบ');
        if (!isCadet) return false;
      } else if (itemCat !== currentCategory) {
        return false;
      }
    }

    // 2. Subject Filter Dropdown
    if (currentSubject !== 'all') {
      if (currentSubject === 'คณิต') {
        if (itemSub !== 'คณิต' && !titleLower.includes('คณิต') && !titleLower.includes('pat 1') && !titleLower.includes('คำนวณ')) return false;
      } else if (currentSubject === 'วิทย์') {
        if (itemSub !== 'วิทย์' && !titleLower.includes('วิทย') && !titleLower.includes('ฟิสิกส์') && !titleLower.includes('เคมี') && !titleLower.includes('ชีว') && !titleLower.includes('แสง')) return false;
      } else if (currentSubject === 'อังกฤษ') {
        if (itemSub !== 'อังกฤษ' && !titleLower.includes('อังกฤษ') && !titleLower.includes('eng')) return false;
      } else if (currentSubject === 'ไทย') {
        if (itemSub !== 'ไทย' && !titleLower.includes('ไทย')) return false;
      } else if (currentSubject === 'สังคม') {
        if (itemSub !== 'สังคม' && !titleLower.includes('สังคม')) return false;
      } else if (currentSubject === 'ครบทุกวิชา') {
        if (itemSub !== 'ครบทุกวิชา' && !titleLower.includes('รวม') && !titleLower.includes('ทุกวิชา') && !titleLower.includes('ฉบับจริง')) return false;
      }
    }

    // 3. Search Query Filter
    if (query) {
      const matchTitle = titleLower.includes(query);
      const matchCat = itemCat.toLowerCase().includes(query);
      const matchSub = itemSub.toLowerCase().includes(query);
      const matchTopic = itemTopic.includes(query);
      const matchYear = (item.year || '').toString().includes(query);
      const matchAcademy = (item.academy || '').toLowerCase().includes(query);
      if (!matchTitle && !matchCat && !matchSub && !matchTopic && !matchYear && !matchAcademy) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (currentSort === 'year-desc') {
      return (b.year || 0) - (a.year || 0);
    } else if (currentSort === 'year-asc') {
      return (a.year || 0) - (b.year || 0);
    }
    return 0;
  });

  renderCards(filtered);

  // Filter Indicator
  const isFiltered = currentCategory !== 'all' || currentSubject !== 'all' || query.length > 0;
  if (isFiltered) {
    filterIndicator.style.display = 'flex';
    let filterLabels = [];
    if (currentCategory !== 'all') filterLabels.push(`หมวด: ${currentCategory}`);
    if (currentSubject !== 'all') filterLabels.push(`วิชา: ${currentSubject}`);
    if (query) filterLabels.push(`คำค้น: "${query}"`);
    filterQueryText.textContent = `${filterLabels.join(' | ')} (พบ ${filtered.length} ชุด)`;
  } else {
    filterIndicator.style.display = 'none';
  }
}

// Reset Filters
function resetAllFilters() {
  currentCategory = 'all';
  currentSubject = 'all';
  currentSort = 'year-desc';
  searchInput.value = '';
  clearSearchBtn.classList.remove('active');

  if (subjectSelect) subjectSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'year-desc';

  desktopNavBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
  mobileChips.forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
  document.querySelectorAll('.quick-cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
  });

  updateNavSlider();
  filterAndSortItems();
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('active');
    filterAndSortItems();
    searchInput.focus();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', resetAllFilters);
}

function setCategory(cat, shouldScroll = true) {
  currentCategory = cat;
  desktopNavBtns.forEach(btn => {
    if (btn.dataset.category) {
      btn.classList.toggle('active', btn.dataset.category === cat);
    } else if (btn.dataset.navTarget === 'home') {
      btn.classList.remove('active');
    }
  });
  mobileChips.forEach(chip => chip.classList.toggle('active', chip.dataset.category === cat));
  document.querySelectorAll('.quick-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === cat);
  });
  updateNavSlider();
  filterAndSortItems();

  if (shouldScroll) {
    const target = scrollTargetId || (window.innerWidth <= 768 ? 'cardContainer' : 'examsSection');
    setTimeout(() => scrollToSection(target), 40);
  }
}

// Robust, overshoot-free smooth scroll with sticky header offset
function scrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  
  target.classList.add('revealed');
  
  const navHeader = document.querySelector('.reading-nav-header');
  const headerOffset = navHeader ? navHeader.offsetHeight + 16 : 75;
  
  const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: 'smooth'
  });
}

function goToHome() {
  desktopNavBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.navTarget === 'home');
  });
  updateNavSlider();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation Bar Button Click, Center Align & Gliding Hover
desktopNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.navTarget;
    if (target === 'home') {
      goToHome();
    } else {
      const cat = btn.dataset.category || 'all';
      setCategory(cat, true, 'examsSection');
    }
    // Smoothly scroll active button into center view so it is never clipped
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setTimeout(() => updateNavSlider(btn), 150);
  });
  btn.addEventListener('mouseenter', () => updateNavSlider(btn));
});

// Left / Right Scroll Chevrons
const navScrollLeftBtn = document.getElementById('navScrollLeft');
const navScrollRightBtn = document.getElementById('navScrollRight');

if (navScrollLeftBtn && desktopNav) {
  navScrollLeftBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    desktopNav.scrollBy({ left: -220, behavior: 'smooth' });
  });
}

if (navScrollRightBtn && desktopNav) {
  navScrollRightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    desktopNav.scrollBy({ left: 220, behavior: 'smooth' });
  });
}

// Silky Smooth Drag & Wheel Sliding on Desktop Bar
if (desktopNav) {
  // 1. Mouse Wheel Horizontal Gliding
  desktopNav.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      desktopNav.scrollLeft += e.deltaY * 0.95;
    }
  }, { passive: false });

  // 2. Keep liquid pill accurately tracked during scroll (RAF throttled)
  let navScrollTicking = false;
  desktopNav.addEventListener('scroll', () => {
    if (!navScrollTicking) {
      navScrollTicking = true;
      requestAnimationFrame(() => {
        updateNavSlider();
        navScrollTicking = false;
      });
    }
  }, { passive: true });

  // 3. Smooth Mouse Click & Drag
  let isNavDragging = false;
  let navStartX = 0;
  let navScrollStart = 0;
  let hasDragged = false;

  desktopNav.addEventListener('mousedown', (e) => {
    isNavDragging = true;
    hasDragged = false;
    navStartX = e.pageX - desktopNav.offsetLeft;
    navScrollStart = desktopNav.scrollLeft;
    desktopNav.classList.add('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    if (isNavDragging) {
      isNavDragging = false;
      desktopNav.classList.remove('is-dragging');
    }
  });

  desktopNav.addEventListener('mouseleave', () => {
    if (isNavDragging) {
      isNavDragging = false;
      desktopNav.classList.remove('is-dragging');
    }
  });

  desktopNav.addEventListener('mousemove', (e) => {
    if (!isNavDragging) return;
    const x = e.pageX - desktopNav.offsetLeft;
    const walk = (x - navStartX) * 1.5;
    if (Math.abs(walk) > 3) {
      hasDragged = true;
      e.preventDefault();
      desktopNav.scrollLeft = navScrollStart - walk;
    }
  });

  desktopNav.addEventListener('mouseleave', () => updateNavSlider());
}
window.addEventListener('resize', () => updateNavSlider());

// CTA from Tutor Hero Section to Exams
const btnExploreExams = document.getElementById('btnExploreExams');
if (btnExploreExams) {
  btnExploreExams.addEventListener('click', (e) => {
    if (e) e.preventDefault();
    setCategory('all', false);
    const targetId = window.innerWidth <= 768 ? 'mobileQuickCategories' : 'examsSection';
    setTimeout(() => scrollToSection(targetId), 40);
  });
}

mobileChips.forEach(chip => {
  chip.addEventListener('click', () => setCategory(chip.dataset.category));
});

if (subjectSelect) {
  subjectSelect.addEventListener('change', (e) => {
    currentSubject = e.target.value;
    filterAndSortItems();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterAndSortItems();
  });
}

// Debounced Search Input (prevents keypress stutter on virtual keyboards)
let searchDebounceTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    filterAndSortItems();
  }, 90);
});

// ==========================================================================
// 8. PDF Modal Viewer
// ==========================================================================
function openPreview(url, title, directLink) {
  modalTitle.textContent = title;
  modalSubtitle.textContent = "ตัวอย่างเอกสารความละเอียดสูงผ่าน Google Drive Viewer";
  modalDirectLink.href = directLink || url;
  modalBody.innerHTML = `<iframe src="${url}" allow="autoplay" loading="lazy"></iframe>`;
  modal.classList.add('active');

  // Record into Reading History
  recordHistory(title, url, directLink);
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
    closeAuthModal();
    if (bookmarkDrawer) bookmarkDrawer.classList.remove('active');
    if (historyDrawer) historyDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (userMenuContainer) userMenuContainer.classList.remove('active');
  }
});

// ==========================================================================
// 9. Startup Initialization & Dynamic Mouse Tracking Engine
// ==========================================================================
initTheme();
getStoredUsers();
syncUserLocalData();
updateAuthUI();

// Interactive Dynamic Mouse Follower Spotlight (Desktop Fine-Pointer Only)
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer && mouseGlow) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;
  let rafId = null;

  function updateSpotlight() {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    currentX += dx * 0.14;
    currentY += dy * 0.14;
    
    mouseGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
      rafId = requestAnimationFrame(updateSpotlight);
    } else {
      isMoving = false;
      rafId = null;
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
    }
  }, { passive: true });
} else if (mouseGlow) {
  mouseGlow.style.display = 'none';
}

// ==========================================================================
// 10. Scroll-Driven Reveal & Smooth Floating Animation
// ==========================================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, {
  threshold: 0.01,
  rootMargin: '100px 0px 100px 0px'
});

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
  revealObserver.observe(el);
  if (window.innerWidth <= 1024) {
    el.classList.add('revealed');
  }
});

// Immediately reveal the hero landing section on page load
const homeSec = document.getElementById('homeSection');
if (homeSec) {
  homeSec.classList.add('revealed');
}

// Silky smooth scroll parallax on tutor duo cutouts (Desktop Fine-Pointer Only)
const tutorFigLeft = document.querySelector('.figure-left');
const tutorFigRight = document.querySelector('.figure-right');
const tutorInfoCol = document.querySelector('.tutor-info-col');

if (isFinePointer && window.innerWidth > 1024) {
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (tutorFigLeft && tutorFigRight && scrollY < 800) {
          const floatOffset = scrollY * 0.12;
          tutorFigLeft.style.transform = `translateX(18px) translateY(-${floatOffset}px)`;
          tutorFigRight.style.transform = `translateX(-18px) translateY(-${floatOffset * 0.85}px)`;
          if (tutorInfoCol) {
            tutorInfoCol.style.transform = `translateY(-${scrollY * 0.04}px)`;
          }
        }
        scrollTicking = false;
      });
    }
  }, { passive: true });
}

// Initial Exam Catalog Rendering & liquid nav slider positioning
function initExamCatalog() {
  if (typeof examData !== 'undefined') {
    if (countAllSpan) countAllSpan.textContent = examData.length;
    filterAndSortItems();
  }
}
initExamCatalog();

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  initExamCatalog();
  setTimeout(() => updateNavSlider(), 100);
});

window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
  initExamCatalog();
});
setTimeout(() => updateNavSlider(), 150);


