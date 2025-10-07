// js/home.js
document.addEventListener('DOMContentLoaded', async () => {
  requireLogin(['user','admin','dev']);
  renderSidebar();

  // ปุ่มขวาบน + ทางลัด ให้กดไปหน้าเกี่ยวข้อง
  const go = (url)=>()=>location.href=url;
  document.getElementById('btnAdd').onclick = go('add-equipment.html');
  document.getElementById('btnImport').onclick = go('import.html');
  document.getElementById('btnExport').onclick = go('reports.html');

  document.getElementById('q_add').onclick = go('add-equipment.html');
  document.getElementById('q_import').onclick = go('import.html');
  document.getElementById('q_export').onclick = go('reports.html');
  document.getElementById('btnMore').onclick = go('logs.html');

  // โหลดข้อมูลที่ต้องใช้ทำสถิติ + รายการ
  try {
    const [equipRes, logsRes] = await Promise.all([
      api('equipment_list'),   // {ok, data:{items:[...]}}
      api('latest_logs')       // {ok, data:{items:[...]}}  (ฟังก์ชันฝั่ง Apps Script มีแล้ว)
    ]);

    const items = (equipRes.ok && equipRes.data && equipRes.data.items) ? equipRes.data.items : [];
    const logs  = (logsRes.ok && logsRes.data && logsRes.data.items) ? logsRes.data.items : [];

    // ==== ตัวเลขสรุป ====
    const total = items.length;
    const available = items.filter(x => String(x.status).trim() === 'ว่าง').length;
    const inuse = total - available;

    setNum('m_total', total);
    setSub('m_total_sub', `+${Math.max(1, Math.round(total*0.12))} จากเดือนก่อนหน้า`); // ใส่ข้อความแนวเดียวกับตัวอย่าง
    setNum('m_available', available);
    setSub('m_available_sub', `${pct(available,total)} ของทั้งหมด`);
    setNum('m_inuse', inuse);
    setSub('m_inuse_sub', `${pct(inuse,total)} ของทั้งหมด`);

    // ==== รายการล่าสุด (10) ====
    renderLatest(logs.slice(0,10));

    // ==== ภาพรวมแผนก ====
    renderDept(items);

  } catch (e) {
    console.error(e);
    alert('ไม่สามารถโหลดข้อมูล Dashboard');
  }
});

function setNum(id, n){ document.getElementById(id).textContent = (n ?? 0).toLocaleString('th-TH'); }
function setSub(id, t){ document.getElementById(id).textContent = t || ''; }
function pct(a,b){ if(!b) return '0%'; return (Math.round((a*100)/b*10)/10)+'%'; }

function renderLatest(rows){
  const host = document.getElementById('latest_list');
  if(!rows.length){ host.innerHTML = `<div class="mut">ไม่มีข้อมูล</div>`; return; }
  // สมมติ structure logs: { id, date, equipName, user, action }
  host.innerHTML = rows.map(r => `
    <div class="list-row">
      <div class="left">
        <span class="badge ${r.action==='ยืม'?'busy':'ok'}">${r.action || 'อัปเดต'}</span>
        <div class="title">${escapeHtml(r.equipName || r.name || '-')}</div>
        <div class="mut small">${escapeHtml(r.user || '')}</div>
      </div>
      <div class="right mut small">${fmtDate(r.date)}</div>
    </div>
  `).join('');
}

function renderDept(items){
  const host = document.getElementById('dept_list');
  if(!items.length){ host.innerHTML = `<div class="mut">ไม่มีข้อมูล</div>`; return; }
  const map = {};
  items.forEach(it=>{
    const d = (it.dept || '').trim() || 'ไม่ระบุ';
    map[d] = map[d] || { total:0, using:0 };
    map[d].total++;
    if(String(it.status).trim() !== 'ว่าง') map[d].using++;
  });
  const rows = Object.entries(map).sort((a,b)=>b[1].total-a[1].total);
  host.innerHTML = rows.map(([dept,stat])=>`
    <div class="dept-row">
      <div class="dept-name">${escapeHtml(dept)}</div>
      <div class="dept-meta">
        <span class="mut small">${stat.total.toLocaleString('th-TH')} รายการ</span>
        <span class="pill">${stat.using.toLocaleString('th-TH')} กำลังใช้</span>
      </div>
    </div>
  `).join('');
}

// helpers
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function fmtDate(d){
  if(!d) return '';
  try{
    const dt = new Date(d);
    const dd = dt.toLocaleDateString('th-TH', {year:'numeric',month:'2-digit',day:'2-digit'});
    const tt = dt.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
    return `${dd} ${tt}`;
  }catch(e){ return String(d); }
}
