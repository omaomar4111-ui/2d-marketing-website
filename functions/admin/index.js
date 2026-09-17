function checkAuth(request, env) {
  const PASS = env.ADMIN_PASSWORD || 'pr2026';
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Basic ')) return false;
  try {
    const base64 = authHeader.slice(6).trim();
    const decoded = atob(base64);
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return false;
    return decoded.slice(colonIdx + 1) === PASS;
  } catch (e) {
    return false;
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!checkAuth(request, env)) {
    return new Response('Unauthorized Access to PR Agency Admin', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="PR Agency Admin", charset="UTF-8"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PR Agency — لوحة إدارة الرسائل</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg: #040000;
      --card-bg: #0a0000;
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.03);
      --red: #c00000;
      --red-glow: rgba(192, 0, 0, 0.35);
      --red-hover: #e00000;
      --text: #ffffff;
      --text-muted: rgba(255, 255, 255, 0.65);
      --text-sub: rgba(255, 255, 255, 0.4);
      --green: #10b981;
      --amber: #f59e0b;
      --gray: #6b7280;
      --font: 'Cairo', system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.5;
      min-height: 100vh;
      background-image: radial-gradient(ellipse at 50% -10%, rgba(192, 0, 0, 0.18), transparent 60%);
      padding: 24px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Topbar */
    .topbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 28px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand img {
      width: 46px;
      height: 46px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(192,0,0,0.5));
    }

    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #fff;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 99px;
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      margin-top: 2px;
    }

    .brand-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 8px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--red);
      color: #fff;
      box-shadow: 0 4px 14px var(--red-glow);
    }
    .btn-primary:hover {
      background: var(--red-hover);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 2px;
      background: var(--card-border);
    }

    .stat-card.today::before { background: var(--green); }
    .stat-card.week::before  { background: var(--amber); }
    .stat-card.month::before { background: var(--red); }
    .stat-card.total::before { background: #fff; }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 600;
    }

    .stat-value {
      font-size: 34px;
      font-weight: 900;
      color: #fff;
      line-height: 1.1;
    }

    .stat-desc {
      font-size: 12px;
      color: var(--text-sub);
    }

    /* Controls Bar */
    .controls-bar {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .search-box {
      flex: 1;
      min-width: 260px;
      position: relative;
    }

    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 10px 14px 10px 38px;
      color: #fff;
      font-family: var(--font);
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--red);
      background: rgba(255, 255, 255, 0.07);
      box-shadow: 0 0 0 3px rgba(192, 0, 0, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .counter-tag {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Table */
    .table-wrap {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 13.5px;
      min-width: 980px;
    }

    thead th {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
      font-weight: 700;
      padding: 14px 16px;
      border-bottom: 1px solid var(--card-border);
      white-space: nowrap;
    }

    tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
      color: #e5e5e5;
    }

    tbody tr:hover {
      background: var(--card-hover);
    }

    .cell-id {
      font-family: monospace;
      font-size: 12px;
      color: var(--text-sub);
      width: 40px;
    }

    .cell-date {
      white-space: nowrap;
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      margin-left: 6px;
    }
    .badge-today { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-week  { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
    .badge-old   { background: rgba(107, 114, 128, 0.2); color: #9ca3af; border: 1px solid rgba(107, 114, 128, 0.4); }

    .cell-name {
      font-weight: 700;
      color: #fff;
    }

    .cell-phone {
      font-family: monospace;
      direction: ltr;
      text-align: right;
      color: #93c5fd;
      font-weight: 600;
    }

    .cell-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.06);
      color: #f3f4f6;
    }

    .cell-message {
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-muted);
    }

    .cell-message:hover {
      white-space: normal;
      word-break: break-word;
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .act-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 13px;
    }

    .act-wa {
      background: rgba(37, 211, 102, 0.15);
      color: #25d366;
    }
    .act-wa:hover {
      background: #25d366;
      color: #000;
      transform: scale(1.08);
    }

    .act-copy {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    .act-copy:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: scale(1.08);
    }

    .act-del {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    .act-del:hover {
      background: #ef4444;
      color: #fff;
      transform: scale(1.08);
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #18181b;
      color: #fff;
      border: 1px solid var(--card-border);
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      font-size: 14px;
      font-weight: 700;
      transition: all 0.3s ease;
      z-index: 9999;
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s;
    }
    .modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      background: #0f0f11;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9);
    }
    .modal-title {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 10px;
      color: #fff;
    }
    .modal-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    /* Empty state */
    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 15px;
    }

    @media (max-width: 768px) {
      body { padding: 16px; }
      .brand-title { font-size: 18px; }
      .stat-value { font-size: 26px; }
    }
  </style>
</head>
<body>

<div class="container">
  <!-- Topbar -->
  <header class="topbar">
    <div class="brand">
      <img src="/assets/logos/pr-agency.webp" alt="PR Agency" onerror="this.src='/favicon.ico'"/>
      <div>
        <h1 class="brand-title">PR Agency — لوحة إدارة الرسائل</h1>
        <div class="brand-badge">
          <span class="brand-badge-dot"></span>
          <span>قاعدة البيانات D1 متصلة ومحمية</span>
        </div>
      </div>
    </div>
    <div class="topbar-actions">
      <button class="btn btn-secondary" onclick="loadAll()" title="تحديث البيانات">
        <span>🔄</span> تحديث
      </button>
      <button class="btn btn-primary" onclick="exportCSV()" title="تصدير ملف Excel">
        <span>📥</span> تصدير CSV
      </button>
    </div>
  </header>

  <!-- Stats Grid -->
  <section class="stats-grid">
    <div class="stat-card today">
      <div class="stat-header">
        <span>رسائل اليوم</span>
        <span>🟢</span>
      </div>
      <div class="stat-value" id="statToday">0</div>
      <div class="stat-desc">خلال آخر 24 ساعة</div>
    </div>
    <div class="stat-card week">
      <div class="stat-header">
        <span>رسائل هذا الأسبوع</span>
        <span>🟡</span>
      </div>
      <div class="stat-value" id="statWeek">0</div>
      <div class="stat-desc">آخر 7 أيام</div>
    </div>
    <div class="stat-card month">
      <div class="stat-header">
        <span>رسائل هذا الشهر</span>
        <span>🔴</span>
      </div>
      <div class="stat-value" id="statMonth">0</div>
      <div class="stat-desc">خلال الشهر الحالي</div>
    </div>
    <div class="stat-card total">
      <div class="stat-header">
        <span>إجمالي الرسائل</span>
        <span>⚪</span>
      </div>
      <div class="stat-value" id="statTotal">0</div>
      <div class="stat-desc">إجمالي الوارد في D1</div>
    </div>
  </section>

  <!-- Controls Bar -->
  <div class="controls-bar">
    <div class="search-box">
      <input type="text" id="searchInput" class="search-input" placeholder="ابحث بالاسم، رقم الموبايل، أو نوع النشاط..." oninput="handleSearch()"/>
      <span class="search-icon">🔍</span>
    </div>
    <div class="counter-tag" id="counterTag">جارٍ تحميل الرسائل...</div>
  </div>

  <!-- Messages Table -->
  <div class="table-wrap">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>التاريخ والوقت</th>
            <th>الاسم</th>
            <th>رقم الموبايل</th>
            <th>نوع النشاط</th>
            <th>الميزانية</th>
            <th>نص الرسالة</th>
            <th style="text-align:center">الإجراءات</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr><td colspan="8" class="empty-state">جارٍ الاتصال بقاعدة البيانات...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-overlay" id="deleteModal">
  <div class="modal-card">
    <h3 class="modal-title">تأكيد حذف الرسالة</h3>
    <p class="modal-desc" id="modalDesc">هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً من قاعدة البيانات؟</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-primary" id="confirmDeleteBtn" style="background:#ef4444">تأكيد الحذف</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
  let allMessages = [];
  let deleteTargetId = null;

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) return location.reload();
      const json = await res.json();
      if (json.success && json.stats) {
        document.getElementById('statToday').innerText = json.stats.today;
        document.getElementById('statWeek').innerText = json.stats.week;
        document.getElementById('statMonth').innerText = json.stats.month;
        document.getElementById('statTotal').innerText = json.stats.total;
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  }

  async function fetchMessages(search = '') {
    try {
      const url = search ? ('/api/admin/messages?search=' + encodeURIComponent(search)) : '/api/admin/messages';
      const res = await fetch(url);
      if (res.status === 401) return location.reload();
      const json = await res.json();
      if (json.success) {
        allMessages = json.data || [];
        renderTable(allMessages);
      }
    } catch (e) {
      console.error('Failed to load messages:', e);
      document.getElementById('tableBody').innerHTML = '<tr><td colspan="8" class="empty-state" style="color:#ef4444">حدث خطأ في تحميل الرسائل، حاول مجدداً.</td></tr>';
    }
  }

  function getRelativeBadge(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr.replace(' ', 'T') + 'Z');
      const now = new Date();
      const diffHours = (now - d) / (1000 * 60 * 60);
      if (diffHours <= 24) return '<span class="badge badge-today">اليوم</span>';
      if (diffHours <= 168) return '<span class="badge badge-week">هذا الأسبوع</span>';
      return '<span class="badge badge-old">سابق</span>';
    } catch (e) {
      return '';
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr.replace(' ', 'T') + 'Z');
      return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) + ' · ' + 
             d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch(e) {
      return dateStr;
    }
  }

  function cleanPhoneForWa(phone) {
    if (!phone) return '';
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('01')) p = '20' + p.substring(1);
    else if (!p.startsWith('20') && p.length === 10) p = '20' + p;
    return p;
  }

  function renderTable(list) {
    const tbody = document.getElementById('tableBody');
    const counter = document.getElementById('counterTag');
    counter.innerText = 'إجمالي المعروض: ' + list.length + ' رسالة';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">لا توجد رسائل مسجلة حالياً</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(m => {
      const waNumber = cleanPhoneForWa(m.phone);
      const waLink = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent('أهلاً بك ' + m.name + '، تواصلنا معك بخصوص طلبك في PR Agency');
      const badge = getRelativeBadge(m.created_at);
      const formattedDate = formatDate(m.created_at);

      return [
        '<tr>',
        '  <td class="cell-id">#' + m.id + '</td>',
        '  <td class="cell-date">' + badge + ' ' + formattedDate + '</td>',
        '  <td class="cell-name">' + escapeHtml(m.name || 'بدون اسم') + '</td>',
        '  <td class="cell-phone"><a href="tel:' + escapeHtml(m.phone) + '" style="color:inherit;text-decoration:none">' + escapeHtml(m.phone) + '</a></td>',
        '  <td><span class="cell-badge">' + escapeHtml(m.business || 'غير محدد') + '</span></td>',
        '  <td style="color:#fbbf24;font-weight:700">' + escapeHtml(m.budget || '—') + '</td>',
        '  <td class="cell-message" title="' + escapeHtml(m.message || '') + '">' + escapeHtml(m.message || '—') + '</td>',
        '  <td style="text-align:center">',
        '    <div class="actions-cell">',
        '      <a href="' + waLink + '" target="_blank" rel="noopener" class="act-btn act-wa" title="محادثة واتساب">💬</a>',
        '      <button class="act-btn act-copy" onclick="copyPhone(\'' + escapeHtml(m.phone) + '\')" title="نسخ الرقم">📋</button>',
        '      <button class="act-btn act-del" onclick="confirmDelete(' + m.id + ', \'' + escapeHtml(m.name) + '\')" title="حذف الرسالة">🗑️</button>',
        '    </div>',
        '  </td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  let searchTimeout;
  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const term = document.getElementById('searchInput').value.trim();
      fetchMessages(term);
    }, 250);
  }

  function copyPhone(phone) {
    navigator.clipboard.writeText(phone).then(() => {
      showToast('تم نسخ الرقم ' + phone + ' بنجاح! 📋');
    }).catch(() => {
      showToast('فشل النسخ تلقائياً: ' + phone);
    });
  }

  function confirmDelete(id, name) {
    deleteTargetId = id;
    document.getElementById('modalDesc').innerText = 'هل أنت متأكد من رغبتك في حذف رسالة العميل (' + name + ') نهائياً؟';
    document.getElementById('deleteModal').classList.add('open');
    document.getElementById('confirmDeleteBtn').onclick = () => executeDelete(id);
  }

  function closeModal() {
    document.getElementById('deleteModal').classList.remove('open');
    deleteTargetId = null;
  }

  async function executeDelete(id) {
    try {
      const res = await fetch('/api/admin/messages?id=' + id, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف الرسالة بنجاح 🗑️');
        closeModal();
        loadAll();
      } else {
        alert('حدث خطأ أثناء الحذف: ' + (json.error || ''));
      }
    } catch(e) {
      alert('فشل الاتصال بالخادم لحذف الرسالة');
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  function exportCSV() {
    if (!allMessages || allMessages.length === 0) {
      alert('لا توجد رسائل لتصديرها!');
      return;
    }

    const headers = ['المعرف (ID)', 'تاريخ الإرسال', 'الاسم', 'رقم الهاتف', 'نوع النشاط', 'الميزانية', 'الرسالة'];
    const rows = allMessages.map(m => [
      m.id,
      m.created_at || '',
      '"' + (m.name || '').replace(/"/g, '""') + '"',
      '"' + (m.phone || '').replace(/"/g, '""') + '"',
      '"' + (m.business || '').replace(/"/g, '""') + '"',
      '"' + (m.budget || '').replace(/"/g, '""') + '"',
      '"' + (m.message || '').replace(/"/g, '""') + '"'
    ]);

    // UTF-8 BOM so Excel opens Arabic correctly
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PR_Agency_Contacts_' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('تم تصدير ملف Excel بنجاح! 📥');
  }

  function loadAll() {
    fetchStats();
    fetchMessages(document.getElementById('searchInput').value.trim());
  }

  // Initial load
  loadAll();
</script>

</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
