(function(){'use strict';
let accessProfile=null;
function workerSession(){try{return JSON.parse(localStorage.getItem('ch_worker_session')||'null')}catch{return null}}
async function loadAccess(){
 try{
  const ws=workerSession();if(ws?.employee_id){accessProfile={role:'worker',employee_id:ws.employee_id,active:true};window.ControlHorarioRole='worker';window.ControlHorarioEmployeeId=ws.employee_id;enforce();return}
  const C=window.ControlHorarioSupabase;if(!C||!C.configured)return;
  const r=await C.auth.getSession();const session=r?.data?.session;if(!session?.user?.id)return;
  const {data,error}=await C.client.from('profiles').select('company_id,employee_id,role,active').eq('id',session.user.id).maybeSingle();if(error||!data||!data.active)return;
  accessProfile=data;window.ControlHorarioRole=data.role;window.ControlHorarioEmployeeId=data.employee_id||'';enforce();
 }catch(e){console.warn('Access control:',e)}
}
function isAdmin(){return accessProfile?.role==='admin'||accessProfile?.role==='manager'}
function enforce(){
 if(!accessProfile)return;const admin=isAdmin(),ws=workerSession();
 document.querySelectorAll('#navAdmin,#mobileAdmin,#adminBtn').forEach(x=>{if(x)x.style.display=admin?'':'none'});
 const worker=document.getElementById('worker'),employeeId=accessProfile.employee_id||ws?.employee_id||'';
 if(accessProfile.role==='worker'&&worker&&employeeId){let current=Array.from(worker.options).find(o=>o.value===employeeId);if(!current){current=document.createElement('option');current.value=employeeId;current.textContent=ws?.name||'Mi usuario';worker.appendChild(current)}worker.value=employeeId;worker.disabled=false;const label=worker.closest('label');if(label)label.classList.add('worker-field')}
 const historyWorker=document.getElementById('historyWorker');if(accessProfile.role==='worker'&&historyWorker){historyWorker.innerHTML='<option value="">Mis partes</option>';historyWorker.value='';historyWorker.disabled=true}
}
function guardAdmin(e){if(!accessProfile||isAdmin())return;const b=e.target.closest('#navAdmin,#mobileAdmin,#adminBtn,[data-view="adminView"]');if(b){e.preventDefault();e.stopImmediatePropagation();return false}}
document.addEventListener('click',guardAdmin,true);
const timer=setInterval(()=>{if(!accessProfile){loadAccess()}else enforce()},700);window.addEventListener('beforeunload',()=>clearInterval(timer));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadAccess);else loadAccess();
window.ControlHorarioAccess={enforce,loadAccess};
})();