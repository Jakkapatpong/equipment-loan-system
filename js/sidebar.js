function renderSidebar(){const t=storage.getToken();const role=t?.role||'user';const el=document.querySelector('.sidebar');if(!el)return;el.innerHTML=`
<div class="brand"><span class="material-symbols-outlined">qr_code_scanner</span> Equip Manager V2.3</div>
<div class="menu">
  <div class="section"><button><span class="material-symbols-outlined">home</span> หน้าแรก</button><div class="tabs"><a href="home.html"><span class="material-symbols-outlined">dashboard</span> Homepage</a></div></div>
  ${(role==='admin'||role==='dev')?`
  <div class="section"><button><span class="material-symbols-outlined">inventory_2</span> อุปกรณ์</button><div class="tabs">
    <a href="add-equipment.html"><span class="material-symbols-outlined">add_circle</span> เพิ่มอุปกรณ์</a>
    <a href="equipment-list.html"><span class="material-symbols-outlined">list</span> รายการอุปกรณ์</a>
    <a href="available.html"><span class="material-symbols-outlined">task_alt</span> อุปกรณ์ที่ว่าง</a>
    <a href="print-qr.html"><span class="material-symbols-outlined">print</span> พิมพ์ QR</a>
  </div></div>`:''}
  <div class="section"><button><span class="material-symbols-outlined">qr_code_scanner</span> การยืม</button><div class="tabs">
    <a href="borrow.html"><span class="material-symbols-outlined">qr_code_scanner</span> สแกนยืม</a>
    <a href="my-borrows.html"><span class="material-symbols-outlined">person</span> ของฉัน</a>
    ${(role==='admin'||role==='dev')?`<a href="all-borrows.html"><span class="material-symbols-outlined">groups</span> ทั้งหมด</a>`:''}
  </div></div>
  <div class="section"><button><span class="material-symbols-outlined">monitoring</span> รายงาน</button><div class="tabs">
    <a href="reports.html"><span class="material-symbols-outlined">summarize</span> ประวัติ/รายงาน</a>
  </div></div>
  ${(role==='admin'||role==='dev')?`
  <div class="section"><button><span class="material-symbols-outlined">manage_accounts</span> ผู้ใช้</button><div class="tabs">
    <a href="users.html"><span class="material-symbols-outlined">person_add</span> สร้าง/จัดการผู้ใช้</a>
  </div></div>`:''}
  <div class="section"><button><span class="material-symbols-outlined">account_circle</span> โปรไฟล์</button><div class="tabs">
    <a href="profile.html"><span class="material-symbols-outlined">account_circle</span> โปรไฟล์ของฉัน</a>
  </div></div>
  <div class="section"><div class="tabs" style="display:block"><a href="#" onclick="logout()"><span class="material-symbols-outlined">logout</span> ออกจากระบบ</a></div></div>
</div>`; initSidebar();}
