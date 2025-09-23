async function api(action, payload = {}) {
  const body = JSON.stringify({ action, token: getToken && getToken(), payload });
  const res = await fetch(API_BASE, {
    method: "POST",
    body
  });
  return res.json();
}
