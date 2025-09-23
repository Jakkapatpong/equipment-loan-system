async function api(action, payload = {}) {
  const tok = (typeof getToken === 'function') ? getToken() : null;
  const body = JSON.stringify({ action, token: tok, payload });
  const r = await fetch(API_BASE, { method: "POST", body });
  return r.json();
}
