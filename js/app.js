/***** Token helpers (global) *****/
window.setToken = function (t) {
  try { localStorage.setItem('token', JSON.stringify(t)); } catch(e) {}
};
window.getToken = function () {
  try { return JSON.parse(localStorage.getItem('token')); } catch(e) { return null; }
};
window.clearToken = function () {
  try { localStorage.removeItem('token'); } catch(e) {}
};

/***** Simple fetch API (no headers => no OPTIONS) *****/
window.api = async function (action, payload = {}) {
  var tok = (typeof window.getToken === 'function') ? window.getToken() : null;
  var body = JSON.stringify({ action: action, token: tok, payload: payload });
  var res  = await fetch(API_BASE, { method: "POST", body: body }); // ไม่มี headers
  return res.json(); // { ok, data, error }
};

// ช่วย debug ให้เห็นว่าฟังก์ชันถูกโหลดจริง
console.log('[app.js loaded]', typeof window.api, typeof window.getToken);
