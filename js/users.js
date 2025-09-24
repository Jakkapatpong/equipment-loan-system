// js/users.js
document.addEventListener('DOMContentLoaded', () => {
  requireLogin(['admin','dev']);
  renderSidebar();

  // toggle-eye บนหน้านี้
  document.querySelectorAll('.toggle-eye').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.target;
      const input = id ? document.getElementById(id) : btn.closest('.field')?.querySelector('input');
      if(!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.querySelector('.material-symbols-outlined').textContent = show ? 'visibility_off' : 'visibility';
      input.focus();
    });
  });

  document.getElementById('btn_create').addEventListener('click', onCreateUser);
  document.getElementById('btn_clear').addEventListener('click', clearForm);

  loadUsers();
});

async function loadUsers(){
  try{
    const res = await api('user_list');
    if(!res.ok) throw new Error(res.error||'โหลดผู้ใช้ไม่สำเร็จ');
    const tb = document.getElementById('users_tbody');
    if (!res.data || !res.data.length){
      tb.innerHTML = `<tr><td colspan="8" class="small">ไม่มีข้อมูล</td></tr>`;
      return;
    }
    tb.innerHTML = res.data.map(u => `
      <tr>
        <td>${safe(u.id)}</td>
        <td>${safe(u.user)}</td>
        <td>${safe(u.name||'')}</td>
        <td>${safe(u.dept||'')}</td>
        <td>${safe(u.position||'')}</td>
        <td>${safe(u.role)}</td>
        <td>${safe(u.status)}</td>
        <td class="right">
          <button class="btn" onclick="toggleStatus('${encode(u.id)}','${encode(u.user)}','${u.status==='active'?'inactive':'active'}')">
            ${u.status==='active'?'ปิดการใช้งาน':'เปิดการใช้งาน'}
          </button>
          <button class="btn danger" onclick="resetPwPrompt('${encode(u.user)}')">รีเซ็ตรหัส</button>
        </td>
      </tr>`).join('');
  }catch(e){
    alert(e.message||String(e));
  }
}

async function onCreateUser(){
  const b = document.getElementById('btn_create');
  b.disabled = true; b.textContent = 'กำลังสร้าง...';
  try{
    const p = {
      username: document.getElementById('u_user').value.trim(),
      password: document.getElementById('u_pass').value,
      name:     document.getElementById('u_name').value.trim(),
      dept:     document.getElementById('u_dept').value.trim(),
      position: document.getElementById('u_pos').value.trim(),
      status:   document.getElementById('u_status').value,
      role:     document.getElementById('u_role').value,
      imageBase64: await fileToBase64(document.getElementById('u_pic').files[0])
    };
    const res = await api('user_create', p);
    if(!res.ok) throw new Error(res.error||'สร้างผู้ใช้ไม่สำเร็จ');
    alert('สร้างผู้ใช้สำเร็จ');
    clearForm();
    await loadUsers();
  }catch(e){
    alert(e.message||String(e));
  }finally{
    b.disabled=false; b.textContent='สร้างผู้ใช้';
  }
}

function clearForm(){
  ['u_user','u_pass','u_name','u_dept','u_pos'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('u_status').value='active';
  document.getElementById('u_role').value='user';
  const pic = document.getElementById('u_pic'); if (pic) pic.value='';
}

async function toggleStatus(id, user, toStatus){
  try{
    const res = await api('user_set_status', { id: decode(id), user: decode(user), status: toStatus });
    if(!res.ok) throw new Error(res.error||'อัปเดตสถานะไม่สำเร็จ');
    await loadUsers();
  }catch(e){ alert(e.message||String(e)); }
}

async function resetPwPrompt(user){
  const pw = prompt(`กำหนดรหัสผ่านใหม่ให้ ${user}`);
  if (!pw) return;
  try{
    const res = await api('user_reset_password', { username: user, password: pw });
    if(!res.ok) throw new Error(res.error||'รีเซ็ตรหัสผ่านไม่สำเร็จ');
    alert('รีเซ็ตรหัสผ่านเรียบร้อย');
  }catch(e){ alert(e.message||String(e)); }
}

/* helpers */
function safe(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function encode(s){ return encodeURIComponent(s==null?'':String(s)); }
function decode(s){ return decodeURIComponent(s==null?'':String(s)); }
function fileToBase64(file){
  return new Promise((resolve)=>{ if(!file) return resolve('');
    const r=new FileReader(); r.onload=()=>resolve(String(r.result).split(',')[1]); r.readAsDataURL(file);
  });
}
