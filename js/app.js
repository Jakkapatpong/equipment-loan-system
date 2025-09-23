// --- helpers เก็บ/อ่าน token ---
function setToken(t) {
  try { localStorage.setItem('token', JSON.stringify(t)); } catch(e) {}
}
function getToken() {
  try { return JSON.parse(localStorage.getItem('token')); } catch(e) { return null; }
}
function clearToken() {
  try { localStorage.removeItem('token'); } catch(e) {}
}

// --- เรียก API แบบ simple request (ไม่มี headers → ไม่เกิด OPTIONS) ---
async function api(action, payload = {}) {
  const tok = (typeof getToken === 'function') ? getToken() : null; // กัน undefined
  const body = JSON.stringify({ action, token: tok, payload });
  const res  = await fetch(API_BASE, { method: "POST", body });
  return res.json(); // คาดหวังรูปแบบ { ok, data, error }
}
