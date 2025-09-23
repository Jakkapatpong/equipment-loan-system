async function load(){const d=await api('listEquipment');const tb=document.querySelector('#tbl tbody');tb.innerHTML='';d.items.forEach(it=>{const badge=it.status==='ว่าง'?'badge ok':(it.status==='ลบ'?'badge deleted':'badge busy');const tr=document.createElement('tr');tr.innerHTML=`
<td>${it.id}</td><td>${it.index}</td><td>${it.name}</td>
<td><span class="${badge}">${it.status}</span></td><td>${it.holder||''}</td><td>${it.price||''}</td><td>${it.purchaseDate||''}</td>
<td class="right">
  <button class="btn" data-act="return" data-id="${it.id}" ${it.status!=='ยืมอยู่'?'disabled':''}>คืน</button>
  <button class="btn" data-act="edit" data-id="${it.id}">แก้ไข</button>
  <button class="btn" data-act="printqr" data-id="${it.id}">พิมพ์ QR</button>
  <button class="btn danger" data-act="del" data-id="${it.id}">ลบ</button>
</td>`;tb.appendChild(tr)})}
document.addEventListener('click',async e=>{const b=e.target.closest('button[data-act]'); if(!b) return; const id=b.dataset.id, act=b.dataset.act;
 if(act==='del'){ if(confirm('ยืนยันลบ?')){ await api('deleteEquipment',{payload:{id}}); await load(); } }
 else if(act==='return'){ if(confirm('คืนอุปกรณ์นี้?')){ const d=await api('returnById',{payload:{id}}); alert('คืนสำเร็จ ใช้เวลา '+(d.durationText||'-')); await load(); } }
 else if(act==='edit'){ const name=prompt('ชื่อใหม่ (เว้นว่างหากไม่แก้)'); const price=prompt('ราคาใหม่ (เว้นว่างหากไม่แก้)'); await api('updateEquipment',{payload:{id,name,price}}); await load(); }
 else if(act==='printqr'){ window.location.href = 'print-qr.html?id='+encodeURIComponent(id); }
});
document.addEventListener('DOMContentLoaded', load);
