(function(){
'use strict';
function role(){return window.ControlHorarioRole||null}
function isAdmin(){return role()==='admin'}
function enforce(){
  const r=role();
  if(!r)return;
  const dashNav=document.querySelector('[data-view="dashboardView"]');
  const dashView=document.getElementById('dashboardView');
  if(dashNav)dashNav.style.display=isAdmin()?'':'none';
  if(!isAdmin()&&dashView){dashView.classList.remove('active');dashView.setAttribute('aria-hidden','true')}
  const adminNav=document.getElementById('navAdmin');
  if(adminNav)adminNav.style.display=isAdmin()?'':'none';
  const worker=document.getElementById('worker');
  const employeeId=window.ControlHorarioEmployeeId||'';
  if(r==='worker'&&worker&&employeeId){
    const name=(worker.options[...worker.options].find(o=>o.value===employeeId)||{}).text||'Mi usuario';
    worker.innerHTML='';
    const o=document.createElement('option');o.value=employeeId;o.textContent=name;worker.appendChild(o);worker.value=employeeId;worker.disabled=true;
  }
  const historyWorker=document.getElementById('historyWorker');
  if(r==='worker'&&historyWorker){historyWorker.innerHTML='<option value="">Mis partes</option>';historyWorker.value='';historyWorker.disabled=true}
}
function guardClick(e){
  const b=e.target.closest('[data-view="dashboardView"]');
  if(b&&!isAdmin()){e.preventDefault();e.stopImmediatePropagation();return false}
}
document.addEventListener('click',guardClick,true);
const timer=setInterval(enforce,500);window.addEventListener('beforeunload',()=>clearInterval(timer));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforce);else enforce();
window.ControlHorarioAccess={enforce};
})();
