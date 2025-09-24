/***** Token & Session *****/
function setToken(t){ try{localStorage.setItem('token', JSON.stringify(t));}catch(e){} }
function getToken(){ try{return JSON.parse(localStorage.getItem('token'));}catch(e){return null;} }
function clearToken(){ try{localStorage.removeItem('token');}catch(e){} }

function setSession(s){ try{localStorage.setItem('session', JSON.stringify(s||{}));}catch(e){} }
function getSession(){ try{return JSON.parse(localStorage.getItem('session')||'{}');}catch(e){return {};} }

/***** Guard pages *****/
function requireLogin(roles){ // roles = null = ไม่ล็อก role
  const tok = getToken();
  if(!tok){ window.location.href='index.html'; return; }
  if(Array.isArray(roles) && roles.length){
    const r = String(tok.role||'').toLowerCase();
    if(!roles.map(x=>String(x).toLowerCase()).includes(r)){
      alert('สิทธิ์ไม่เพียงพอ'); window.location.href='home.html'; return;
    }
  }
}

/***** fetch API (ไม่มี headers -> ไม่เกิด preflight) *****/
async function api(action, payload={}){
  const tok = getToken();
  const body = JSON.stringify({ action, token: tok, payload });
  const res = await fetch(API_BASE, { method:'POST', body });
  const js  = await res.json();
  if(!js || js.ok !== true) throw new Error((js && js.error) || 'API error');
  return js.data; // โครงสร้าง: { ... } ที่ ROUTER ส่ง
}

/***** Utils *****/
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(r.result);
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}
