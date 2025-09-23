function getQuery(name){const u=new URL(location.href); return u.searchParams.get(name);}
async function fetchAndRender(id){try{const d=await api('getEquipment',{payload:{id}}); document.getElementById('pname').textContent=d.name; document.getElementById('pid').textContent=d.id; document.getElementById('pqr').src=d.qrUrl; document.title='QR - '+d.name; }catch(e){ alert(e.message); }}
document.getElementById('sel').addEventListener('submit', (e)=>{e.preventDefault(); const id=document.getElementById('eid').value.trim(); if(id) fetchAndRender(id);});
document.getElementById('printBtn').addEventListener('click', ()=>{ window.print(); });
document.addEventListener('DOMContentLoaded', ()=>{ const id=getQuery('id'); if(id){ document.getElementById('eid').value=id; fetchAndRender(id);} });
