async function api(action, payload = {}) {
  const form = new URLSearchParams();
  form.append("data", JSON.stringify({ action, token: getToken(), payload }));
  const res = await fetch(API_BASE, {
    method: "POST",
    body: form // simple request เช่นกัน
  });
  return res.json();
}
