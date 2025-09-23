(function(){
  const MENU = {
    user: [
      { href:'home.html',           icon:'home',              text:'หน้าแรก' },
      { href:'borrow.html',         icon:'qr_code_scanner',   text:'สแกนยืม' },
      { href:'my-borrows.html',     icon:'person',            text:'ของฉัน' },
      { href:'profile.html',        icon:'account_circle',    text:'โปรไฟล์' },
    ],
    admin: [
      { href:'home.html',           icon:'home',              text:'หน้าแรก' },
      { href:'add-equipment.html',  icon:'add',               text:'เพิ่มอุปกรณ์' },
      { href:'equipment-list.html', icon:'inventory_2',       text:'รายการอุปกรณ์' },
      { href:'available.html',      icon:'check_circle',      text:'อุปกรณ์ที่ว่าง' },
      { href:'all-borrows.html',    icon:'list',              text:'ยืมทั้งหมด' },
      { href:'reports.html',        icon:'bar_chart',         text:'รายงาน' },
      { href:'users.html',          icon:'group',             text:'ผู้ใช้' },
      { href:'profile.html',        icon:'account_circle',    text:'โปรไฟล์' },
    ],
    dev: [
      // dev เข้าทุกหน้า = เหมือน admin + อนาคตเพิ่มหน้า dev-only ได้
      { href:'home.html',           icon:'home',              text:'หน้าแรก' },
      { href:'add-equipment.html',  icon:'add',               text:'เพิ่มอุปกรณ์' },
      { href:'equipment-list.html', icon:'inventory_2',       text:'รายการอุปกรณ์' },
      { href:'print-qr.html',       icon:'print',             text:'พิมพ์ QR' },
      { href:'borrow.html',         icon:'qr_code_scanner',   text:'สแกนยืม' },
      { href:'my-borrows.html',     icon:'person',            text:'ของฉัน' },
      { href:'all-borrows.html',    icon:'list',              text:'ยืมทั้งหมด' },
      { href:'available.html',      icon:'check_circle',      text:'อุปกรณ์ที่ว่าง' },
      { href:'reports.html',        icon:'bar_chart',         text:'รายงาน' },
      { href:'users.html',          icon:'group',             text:'ผู้ใช้' },
      { href:'profile.html',        icon:'account_circle',    text:'โปรไฟล์' },
    ]
  };

  window.renderSidebar = function(){
    const s  = (typeof getSession==='function') ? getSession() : {};
    const r  = (s.role || 'user').toLowerCase();
    const el = document.querySelector('.sidebar');
    if (!el) return;

    const items = MENU[r] || MENU.user;
    const cur   = location.pathname.split('/').pop() || 'home.html';

    el.innerHTML = `
      <div class="logo">Equip Manager</div>
      <nav class="nav">
        ${items.map(it => `
          <a class="nav-item ${cur===it.href?'active':''}" href="${it.href}">
            <span class="material-symbols-outlined">${it.icon}</span>
            <span>${it.text}</span>
          </a>`).join('')}
        <div class="nav-item" onclick="logout()">
          <span class="material-symbols-outlined">logout</span><span>ออกจากระบบ</span>
        </div>
      </nav>`;
    // ปุ่มแฮมเบอร์เกอร์
    const ham = document.querySelector('.hamburger');
    if (ham) ham.onclick = () => document.body.classList.toggle('sidebar-open');
  };
})();
