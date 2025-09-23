let lastReport={borrow:[],returned:[]};
function ymd(d){const y=d.getFullYear(),m=('0'+(d.getMonth()+1)).slice(-2),da=('0'+d.getDate()).slice(-2);return `${y}-${m}-${da}`;}
function setDateRange(from,to){document.getElementById('from').value=from?ymd(from):'';document.getElementById('to').value=to?ymd(to):'';}
function thisMonth(){const now=new Date();const f=new Date(now.getFullYear(),now.getMonth(),1);const t=new Date(now.getFullYear(),now.getMonth()+1,0);setDateRange(f,t);}
function thisQuarter(){const now=new Date();const q=Math.floor(now.getMonth()/3);const f=new Date(now.getFullYear(),q*3,1);const t=new Date(now.getFullYear(),q*3+3,0);setDateRange(f,t);}
function thisYear(){const now=new Date();const f=new Date(now.getFullYear(),0,1);const t=new Date(now.getFullYear(),11,31);setDateRange(f,t);}
function clearDates(){setDateRange(null,null);}

async function loadOptions(){
  const o = await api('getFilterOptions');
  // equipment list
  const dl = document.getElementById('equipList'); dl.innerHTML='';
  (o.equipmentNames||[]).forEach(n=>{const opt=document.createElement('option');opt.value=n;dl.appendChild(opt)});
  // employees & depts (admin/dev only)
  const token = storage.getToken(); const role = token?.role||'user';
  if(role==='admin' || role==='dev'){
    const empSel = document.getElementById('employee'); empSel.innerHTML = '<option value="">ทั้งหมด</option>';
    (o.employees||[]).forEach(e=>{const op=document.createElement('option'); op.value=e.user; op.textContent = (e.fullname||e.user)+' ('+(e.dept||'-')+')'; empSel.appendChild(op);});
    const deptSel = document.getElementById('dept'); deptSel.innerHTML = '<option value="">ทั้งหมด</option>';
    (o.depts||[]).forEach(d=>{const op=document.createElement('option'); op.value=d; op.textContent=d; deptSel.appendChild(op);});
  }else{
    document.querySelectorAll('.admin-only').forEach(el=>el.style.display='none');
  }
}
function getFilters(){
  const token = storage.getToken(); const role = token?.role||'user';
  const payload = {
    dateFrom: document.getElementById('from').value || null,
    dateTo: document.getElementById('to').value || null,
    equipmentName: document.getElementById('equipName').value || null
  };
  if(role==='admin' || role==='dev'){
    payload.employee = document.getElementById('employee').value || null;
    payload.dept = document.getElementById('dept').value || null;
  }
  return payload;
}
async function runReport(){
  const d = await api('reportLogs',{payload:getFilters()});
  lastReport = d;
  const t1 = document.querySelector('#tbl1 tbody'); const t2=document.querySelector('#tbl2 tbody');
  t1.innerHTML = ''; t2.innerHTML='';
  (d.borrow||[]).forEach(r=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${r.id}</td><td>${fmtDate(r['วันที่'])}</td><td>${r['ชื่ออุปกรณ์']}</td><td>${r['ชื่อพนักงาน']}</td>`; t1.appendChild(tr);});
  (d.returned||[]).forEach(r=>{const tr=document.createElement('tr'); tr.innerHTML = `<td>${r.id}</td><td>${fmtDate(r['วันที่'])}</td><td>${r['ชื่ออุปกรณ์']}</td><td>${r['ชื่อพนักงาน']}</td><td>${r['ผู้รับคืน']||''}</td><td>${r['ระยะเวลา']||r['ระยะเวลาแสดงผล']||''}</td><td>${r['ชั่วโมง']||''}</td>`; t2.appendChild(tr);});
}

function toCSV(objArray, headers){
  const bom='\ufeff'; // UTF-8 BOM for Excel
  const rows=[headers.join(',')];
  objArray.forEach(o=>{rows.push(headers.map(h=>{
    let v = (o[h]!==undefined && o[h]!==null) ? String(o[h]) : '';
    v = v.replace(/"/g,'""');
    if(v.search(/[",\n]/)>=0){ v = '"'+v+'"'; }
    return v;
  }).join(','))});
  return bom + rows.join('\n');
}
function download(filename, mime, dataStr){
  const blob = new Blob([dataStr], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
}
function exportBorrowCSV(){
  const headers=['id','วันที่','ชื่ออุปกรณ์','ชื่อพนักงาน'];
  const csv = toCSV(lastReport.borrow || [], headers);
  download('borrow_report.csv','text/csv;charset=utf-8',csv);
}
function exportReturnCSV(){
  const headers=['id','วันที่','ชื่ออุปกรณ์','ชื่อพนักงาน','ผู้รับคืน','ระยะเวลา','ชั่วโมง'];
  const data = (lastReport.returned||[]).map(x=>{
    const o = Object.assign({}, x);
    if(o['ชั่วโมง']===undefined && o['ใช้เวลา(ชม.)']!==undefined){ o['ชั่วโมง']=o['ใช้เวลา(ชม.)']; }
    if(o['ระยะเวลา']===undefined && o['ระยะเวลาแสดงผล']!==undefined){ o['ระยะเวลา']=o['ระยะเวลาแสดงผล']; }
    return o;
  });
  const csv = toCSV(data, headers);
  download('return_report.csv','text/csv;charset=utf-8',csv);
}
function tableHtml(headers, rows){
  const th = headers.map(h=>`<th>${h}</th>`).join('');
  const tr = rows.map(o=>`<tr>${headers.map(h=>`<td>${(o[h]!==undefined&&o[h]!==null)?String(o[h]).replace(/&/g,'&amp;').replace(/</g,'&lt;') : ''}</td>`).join('')}</tr>`).join('');
  return `<table border="1"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}
function exportBorrowXLS(){
  const headers=['id','วันที่','ชื่ออุปกรณ์','ชื่อพนักงาน'];
  const html = tableHtml(headers, lastReport.borrow||[]);
  download('borrow_report.xls','application/vnd.ms-excel',html);
}
function exportReturnXLS(){
  const headers=['id','วันที่','ชื่ออุปกรณ์','ชื่อพนักงาน','ผู้รับคืน','ระยะเวลา','ชั่วโมง'];
  const data = (lastReport.returned||[]).map(x=>{
    const o = Object.assign({}, x);
    if(o['ชั่วโมง']===undefined && o['ใช้เวลา(ชม.)']!==undefined){ o['ชั่วโมง']=o['ใช้เวลา(ชม.)']; }
    if(o['ระยะเวลา']===undefined && o['ระยะเวลาแสดงผล']!==undefined){ o['ระยะเวลา']=o['ระยะเวลาแสดงผล']; }
    return o;
  });
  const html = tableHtml(headers, data);
  download('return_report.xls','application/vnd.ms-excel',html);
}

document.getElementById('filters').addEventListener('submit', async (e)=>{ e.preventDefault(); await runReport(); });
document.getElementById('qThisMonth').addEventListener('click', ()=>{ thisMonth(); runReport(); });
document.getElementById('qThisQuarter').addEventListener('click', ()=>{ thisQuarter(); runReport(); });
document.getElementById('qThisYear').addEventListener('click', ()=>{ thisYear(); runReport(); });
document.getElementById('qClear').addEventListener('click', ()=>{ clearDates(); runReport(); });
document.getElementById('expBorrowCsv').addEventListener('click', exportBorrowCSV);
document.getElementById('expBorrowXls').addEventListener('click', exportBorrowXLS);
document.getElementById('expReturnCsv').addEventListener('click', exportReturnCSV);
document.getElementById('expReturnXls').addEventListener('click', exportReturnXLS);
document.addEventListener('DOMContentLoaded', async ()=>{ await loadOptions(); thisMonth(); await runReport(); });
