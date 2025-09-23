// js/sidebar.js
(function () {
  const MENU = {
    user: [
      { href:'home.html',           icon:'home',            text:'หน้าแรก' },
      { href:'borrow.html',         icon:'qr_code_scanner', text:'สแกนยืม' },
      { href:'my-borrows.html',     icon:'person',          text:'ของฉัน' },
      { href:'profile.html',        icon:'account_circle',  text:'โปรไฟล์' },
    ],
    admin: [
      { href:'home.html',           icon:'home',            text:'หน้าแรก' },
      { href:'add-equipment.html',  icon:'add',             text:'เพิ่มอุปกรณ์' },
      { href:'equipment-list.html', icon:'inventory_2',     text:'รายการอุปกรณ์' },
      { href:'print-qr.html',       icon:'print',           text:'พิมพ์ QR' },
      { href:'borrow.html',         icon:'qr_code_scanner', text:'สแกนยืม' },
      { href:'all-borrows.html',    icon:'list',            text:'ยืมทั้งหมด' },
      { href:'available.html',      icon:'check_circle',    text:'อุปกรณ์ที่ว่าง' },
      { href:'reports.html',        icon:'bar_chart',       text:'รายงาน' },
      { href:'users.html',          icon:'group',           text:'ผู้ใช้' },
      { href:'profile.html',        icon:'account_circle',  text:'โปรไฟล์' },
    ],
    dev: [
      { href:'home.html',           icon:'home',            text:'หน้าแรก' },
      { href:'add-equipment.html',  icon:'add',             text:'เพิ่มอุปกรณ์' },
      { href:'equipment-list.html', icon:'inventory_2',     text:'รายการอุปกรณ์' },
      { href:'print-qr.html',       icon:'print',           text:'พิมพ์ QR' },
      { href:'borrow.html',         icon:'qr_code_scanner', text:'สแกนยืม' },
      { href:'my-borrows.html',     icon:'person',          text:'ของฉัน' },
      { href:'all-borrows.html',    icon:'list',            text:'ยืมทั้งหมด' },
      { href:'available.html',      icon:'check_circle',    text:'อุปกรณ์ที่ว่าง' },
      { href:'reports.html',        icon:'bar_chart',       text:'รายงาน' },
      { href:'users.html',          icon:'group',           text:'ผู้ใช้' },
      { href:'profile.html',        icon:'account_circle',  text:'โปรไฟล์' },
    ]
  };

  function isCollapsed(){ return localStorage.getItem('sidebarCollapsed') === '1'; }
  function setCollapsed(v){ localStorage.setItem('sidebarCollapsed', v ? '1' : '0'); }

  window.renderSidebar = function(){
    const sess = (typeof getSession==='function') ? getSession() : {};
    const role = (sess.role || 'user').toLowerCase();
    const items = MENU[role] || MENU.user;
    const el = document.querySelector('.sidebar');
    if (!el) return;

    const cur = location.pathname.split('/').pop() || 'home.html';
    el.innerHTML = `
      <div class="logo-row">
        <div class="logo">
          <span class="material-symbols-outlined">qr_code_scanner</span>
          <span class="label">Equip Manager</span>
        </div>
        <button class="pin" title="ย่อ/ขยายเมนู">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
      </div>
      <nav class="nav">
        ${items.map(it => `
          <a class="nav-item ${cur===it.href?'active':''}" href="${it.href}" title="${it.text}">
            <span class="material-symbols-outlined">${it.icon}</span>
            <span class="label">${it.text}</span>
          </a>`).join('')}
        <a class="nav-item" href="#" onclick="logout();return false;" title="ออกจากระบบ">
          <span class="material-symbols-outlined">logout</span>
          <span class="label">ออกจากระบบ</span>
        </a>
      </nav>
    `;

    // collapse state (desktop)
    if (isCollapsed()) el.classList.add('collapsed');
    el.querySelector('.pin').onclick = function(){
      const c = el.classList.toggle('collapsed');
      setCollapsed(c);
    };

    // hamburger (mobile)
    const ham = document.querySelector('.hamburger');
    if (ham) {
      ham.onclick = () => document.body.classList.toggle('sidebar-open');
    }

    // overlay (mobile) – สร้างครั้งเดียว
    if (!document.querySelector('.sidebar-overlay')) {
      const ov = document.createElement('div');
      ov.className = 'sidebar-overlay';
      document.body.appendChild(ov);
      ov.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    }

    // เมื่อคลิกเมนูบนมือถือ ให้ปิด drawer
    el.querySelectorAll('.nav-item').forEach(a => {
      a.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    });
  };
})();
