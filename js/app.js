/***** GLOBAL HELPERS *****/
window.setToken = function (t) {
  try { localStorage.setItem('token', JSON.stringify(t)); } catch (e) {}
};
window.getToken = function () {
  try { return JSON.parse(localStorage.getItem('token')); } catch (e) { return null; }
};
window.clearToken = function () {
  try { localStorage.removeItem('token'); } catch (e) {}
};

window.setSession = function (s) {
  try { localStorage.setItem('session', JSON.stringify(s || {})); } catch (e) {}
};
window.getSession = function () {
  try { return JSON.parse(localStorage.getItem('session') || '{}'); } catch (e) { return {}; }
};

/***** CALL APPS SCRIPT (simple request → no OPTIONS preflight) *****/
window.api = async function (action, payload = {}) {
  if (typeof API_BASE === 'undefined' || !API_BASE) {
    throw new Error('API_BASE ไม่ถูกตั้งค่าใน js/config.js');
  }
  var tok  = (typeof window.getToken === 'function') ? window.getToken() : null;
  var body = JSON.stringify({ action: action, token: tok, payload: payload });

  // ใช้ POST ไม่มี headers → ไม่เกิด OPTIONS
  var res  = await fetch(API_BASE, { method: 'POST', body: body });
  let js;
  try { js = await res.json(); } catch (e) { throw new Error('API ตอบไม่ใช่ JSON'); }

  if (!js || js.ok !== true) {
    // รวม error จาก server/เครือข่าย
    throw new Error((js && js.error) || ('HTTP ' + res.status + ' ' + res.statusText));
  }
  // ✅ คืนเฉพาะ data ให้ฝั่งหน้าเว็บใช้ง่าย
  return js.data;
};

/***** LOGIN GUARD *****/
window.requireLogin = function (allowRoles /* array|string|null */) {
  var t = getToken();
  if (!t) { window.location.href = 'index.html'; return; }

  // ตรวจ role ถ้าหน้ากำหนด
  if (allowRoles) {
    var sess  = getSession();
    var role  = (sess && sess.role) || (t.role || '');
    var allow = Array.isArray(allowRoles) ? allowRoles : [allowRoles];
    if (allow.length && allow.map(String).map(s=>s.toLowerCase()).indexOf(String(role).toLowerCase()) === -1) {
      alert('คุณไม่มีสิทธิ์เข้าหน้านี้');
      window.location.href = 'home.html';
      return;
    }
  }

  // แสดงชื่อมุมขวาบน ถ้ามี element .user-info
  var el = document.querySelector('.user-info');
  if (el) {
    var s = getSession();
    el.innerHTML = `<span class="small">${(s.fullname||s.user||'')}</span>
      <span class="badge">${(s.role||'')}</span>
      <button class="btn" onclick="logout()">Logout</button>`;
  }
};

window.logout = function (){
  clearToken(); setSession({});
  window.location.href = 'index.html';
};
