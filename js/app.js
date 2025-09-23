/***** GLOBAL HELPERS *****/
window.setToken = function (t) { try { localStorage.setItem('token', JSON.stringify(t)); } catch(e){} };
window.getToken = function () { try { return JSON.parse(localStorage.getItem('token')); } catch(e){ return null; } };
window.clearToken = function () { try { localStorage.removeItem('token'); } catch(e){} };

window.setSession = function (s) { try { localStorage.setItem('session', JSON.stringify(s||{})); } catch(e){} };
window.getSession = function () { try { return JSON.parse(localStorage.getItem('session')||'{}'); } catch(e){ return {}; } };

/***** CALL APPS SCRIPT (simple request → no OPTIONS) *****/
window.api = async function (action, payload = {}) {
  var tok = (typeof window.getToken === 'function') ? window.getToken() : null;
  var body = JSON.stringify({ action: action, token: tok, payload: payload });
  var res  = await fetch(API_BASE, { method: "POST", body: body });
  return res.json(); // { ok, data, error }
};

/***** LOGIN GUARD *****/
window.requireLogin = function (allowRoles /* array|string|null */) {
  var t = getToken();
  if (!t) { window.location.href = 'index.html'; return; }

  // ถ้ามีเงื่อนไข role
  if (allowRoles) {
    var sess = getSession();
    var role = (sess && sess.role) || '';
    var allows = Array.isArray(allowRoles) ? allowRoles : [allowRoles];
    if (allows.length && allows.indexOf(role) === -1) {
      alert('คุณไม่มีสิทธิ์เข้าหน้านี้');
      window.location.href = 'home.html';
    }
  }

  // ใส่ชื่อมุมขวาบน ถ้ามี element .user-info
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
