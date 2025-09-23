// js/app.js
async function api(action, payload = {}) {
  const tok = (typeof getToken === 'function') ? getToken() : null; // ✅ กัน error
  const body = JSON.stringify({ action, token: tok, payload });
  const res = await fetch(API_BASE, { method: "POST", body });     // ❗ ไม่มี headers
  const json = await res.json();
  return json; // { ok, data, error }
}
