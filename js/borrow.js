async function borrowWithData(qrData){try{const d=await api('borrowByQR',{payload:{qrData}}); alert('ยืมสำเร็จ #' + d.borrowId);}catch(err){ alert(err.message); }}
document.getElementById('manual').addEventListener('submit',(e)=>{e.preventDefault(); borrowWithData(document.getElementById('qrdata').value);});
document.addEventListener('DOMContentLoaded',()=>{const s=new Html5QrcodeScanner('reader',{fps:10,qrbox:250}); s.render((txt)=>borrowWithData(txt), ()=>{});});
