<!-- print-qr.js -->
<script>
function qs(name){ return new URL(location.href).searchParams.get(name); }

document.addEventListener('DOMContentLoaded', ()=>{
  // ถ้าหน้านี้ต้องล็อกอินและมี sidebar ให้เรียก
  if (typeof requireLogin === 'function') requireLogin(['admin','dev']);
  if (typeof renderSidebar === 'function') renderSidebar();

  const form = document.getElementById('sel');
  const input = document.getElementById('eid');
  const btnPrint = document.getElementById('printBtn');

  form?.addEventListener('submit', ev=>{
    ev.preventDefault();
    const id = (input?.value || '').trim();
    if (!id) return alert('กรุณาใส่ ID อุปกรณ์');
    fetchAndRender(id);
  });

  btnPrint?.addEventListener('click', ()=>window.print());

  // ถ้ามี ?id=EQXXXX มากับ URL ให้โหลดเลย
  const idFromQS = qs('id');
  if (idFromQS) { if (input) input.value = idFromQS; fetchAndRender(idFromQS); }
});

async function fetchAndRender(id){
  try{
    // ✅ เรียก action ให้ตรง และ payload ไม่ซ้อน
    const res = await api('equipment_get', { id });

    if (!res || !res.ok) throw new Error((res && res.error) || 'โหลดข้อมูลอุปกรณ์ไม่สำเร็จ');
    const d = res.data; // { id, name, qrUrl, qrData, ... }

    // เติมหน้าจอ
    const $ = s => document.getElementById(s);
    $('pname').textContent = d.name || d.id;
    $('pid').textContent   = d.id;

    // ถ้ามี URL ของ QR ที่บันทึกไว้ก็ใช้เลย ไม่งั้นลองสร้างจาก qrData (ถ้ามี lib QRCode)
    if (d.qrUrl){
      $('pqr').src = d.qrUrl;
    } else if (d.qrData && window.QRCode){
      QRCode.toDataURL(d.qrData, { width:256, margin:2 }).then(url => $('pqr').src = url);
    }

    document.title = 'QR - ' + (d.name || d.id);
  }catch(e){
    alert(e.message || String(e));
  }
}
</script>
