(function(){
'use strict';
let accessProfile=null;
async function loadAccess(){
  try{
    const C=window.ControlHorarioSupabase;if(!C||!C.configured)return;
    const session=await C.auth.getSession();if(!session?.user)return;
    const {data,error}=await C.client.from('profiles').select('company_id,employee_id,role,active').eq('id',session.user.id).maybeSingle();
    if(error||!data||!data.active)return;
    accessProfile=data;window.ControlHorarioRole=data.role;window.ControlHorarioEmployeeId=data.employee_id||'';enforce();
  }catch(e){}
}
function isAdmin(){return accessProfile?.role==='admin'}
function enforce(){
  if(!accessProfile)return;
  const admin=isAdmin();
  const dashNav=document.querySelector('[data-view="dashboardView"]');
  const dashView=document.getElementById('dashboardView');
  if(dashNav)dashNav.style.display=admin?'':'none';
  if(!admin&&dashView){dashView.classList.remove('active');dashView.setAttribute('aria-hidden','true')}
  const adminNav=document.getElementById('navAdmin');if(adminNav)adminNav.style.display=admin?'':'none';
  const worker=document.getElementById('worker');const employeeId=accessProfile.employee_id||'';
  if(accessProfile.role==='worker'&&worker&&employeeId){
    const current=Array.from(worker.options).find(o=>o.value===employeeId);worker.innerHTML='';
    const o=document.createElement('option');o.value=employeeId;o.textContent=current?.text||'Mi usuario';worker.appendChild(o);worker.value=employeeId;worker.disabled=true;
  }
  const historyWorker=document.getElementById('historyWorker');
  if(accessProfile.role==='worker'&&historyWorker){historyWorker.innerHTML='<option value="">Mis partes</option>';historyWorker.value='';historyWorker.disabled=true}
}
function guardClick(e){if(!accessProfile)return;const b=e.target.closest('[data-view="dashboardView"]');if(b&&!isAdmin()){e.preventDefault();e.stopImmediatePropagation();document.getElementById('dashboardView')?.classList.remove('active');document.getElementById('homeView')?.classList.add('active');return false}}
document.addEventListener('click',guardClick,true);
const timer=setInterval(enforce,500);window.addEventListener('beforeunload',()=>clearInterval(timer));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadAccess);else loadAccess();
window.ControlHorarioAccess={enforce};
})();
