/***** GLOBAL HELPERS *****/
window.setToken = function (t) { try { localStorage.setItem('token', JSON.stringify(t)); } catch(e){} };
window.getToken = function () { try { return JSON.parse(localStorage.getItem('token')); } catch(e){ return null; } };
window.clearToken = function () { try { localStorage.removeItem('token'); } catch(e){} };

window.setSession = function (s) { try { localStorage.setItem('session', JSON.stringify(s||{})); } catch(e){} };
window.getSession = function () { try { return JSON.parse(localStorage.getItem('session')||'{}'); } catch(e){ return {}; } };

/***** FILE → base64 (DataURL) *****/
window.fileToBase64 = function(file){
  return new Promise((resolve,reject)=>{
    if(!file) return resolve('');
    const r=new FileReader();
    r.onload = ()=> resolve(r.result);             // << คืนทั้ง dataURL
    r.onerror = reject;
    r.readAsDataURL(file);
  });
};

/***** CALL APPS SCRIPT (simple request → no OPTIONS preflight) *****/
window.api = async function (action, payload = {}) {
  if (typeof API_BASE === 'undefined' || !API_BASE) throw new Error('API_BASE ไม่ถูกตั้งค่าใน js/config.js');
  var tok = (typeof window.getToken === 'function') ? window.getToken() : null;
  var body = JSON.stringify({ action: action, token: tok, payload: payload });

  const res = await fetch(API_BASE, { method: "POST", body: body });
  let js; try { js = await res.json(); } catch(e){ throw new Error('API ตอบไม่ใช่ JSON'); }
  if (!js || js.ok !== true) throw new Error((js && js.error) || ('HTTP '+res.status+' '+res.statusText));
  return js.data; // << คืน data ตรงๆ
};

/***** LOGIN GUARD *****/
window.requireLogin = function (allowRoles /* array|string|null */) {
  var t = getToken();
  if (!t) { window.location.href = 'index.html'; return; }

  if (allowRoles) {
    var sess = getSession();
    var role = (sess && sess.role) || (t.role || '');
    var allows = Array.isArray(allowRoles) ? allowRoles : [allowRoles];
    if (allows.length && allows.map(s=>String(s).toLowerCase()).indexOf(String(role).toLowerCase()) === -1) {
      alert('คุณไม่มีสิทธิ์เข้าหน้านี้'); window.location.href = 'home.html'; return;
    }
  }

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
