/***** Token helpers *****/
function setToken(t) {
  try { localStorage.setItem('token', JSON.stringify(t)); } catch (e) {}
}
function getToken() {
  try { return JSON.parse(localStorage.getItem('token')); } catch (e) { return null; }
}
function clearToken() {
  try { localStorage.removeItem('token'); } catch (e) {}
}

/***** Simple fetch API (no headers => no OPTIONS preflight) *****/
async function api(action, payload = {}) {
  const tok = (typeof getToken === 'function') ? getToken() : null;
  const body = JSON.stringify({ action, token: tok, payload });
  const res  = await fetch(API_BASE, { method: "POST", body }); // ไม่มี headers
  return res.json(); // server ควรตอบ { ok, data, error }
}
