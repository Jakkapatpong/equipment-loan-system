// js/add-equipment.js

// ย่อรูปก่อนอัปโหลด (คืน DataURL ครบหัว data:image/…)
async function toB64(file, maxW = 1280, maxH = 1280, q = 0.82) {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const img = new Image();
    const fr = new FileReader();
    fr.onload = e => {
      img.onload = () => {
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', q));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

document.getElementById('f').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value;
  const purchaseDate = document.getElementById('pdate').value;
  const file = document.getElementById('img').files[0];
  const imageBase64 = await toB64(file);

  try {
    // ✅ ใช้ชื่อ action ที่ถูกต้อง และส่ง payload ชั้นเดียว
    const d = await api('equipment_add', { name, price, purchaseDate, imageBase64 });

    alert('เพิ่มอุปกรณ์สำเร็จ');
    if (d && d.qr_url) {
      document.getElementById('qrLink').href = d.qr_url;
      document.getElementById('qrResult').style.display = 'block';
    }
    e.target.reset();
  } catch (err) {
    alert(err.message || String(err));
  }
});
