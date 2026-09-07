(function(){'use strict';
const C=window.ControlHorarioSupabase;if(!C||!C.configured)return;
const LS='ch_reports';
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const h=(a,b,br=0)=>{if(!a||!b)return 0;let x=a.split(':').map(Number),y=b.split(':').map(Number),m=y[0]*60+y[1]-x[0]*60-x[1]-Number(br||0);if(m<0)m+=1440;return Math.max(0,m)/60};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
async function getSession(){const r=await C.auth.getSession();return r?.data?.session||null}
async function adminLoad(){
 try{
  const s=await getSession();if(!s?.user?.id)return;
  const p=await C.client.from('profiles').select('id,company_id,employee_id,role,active').eq('id',s.user.id).maybeSingle();
  if(p.error||!p.data||!p.data.active||!['admin','manager'].includes(p.data.role))return;
  const q=await C.client.from('timesheets').select('*,timesheet_lines(*)').eq('company_id',p.data.company_id).order('work_date',{ascending:false}).order('created_at',{ascending:false});
  if(q.error)throw q.error;
  const reports=(q.data||[]).map(x=>({id:x.id,date:x.work_date,workerId:x.employee_id,lines:(x.timesheet_lines||[]).map(l=>({projectId:l.project_id,taskId:l.task_id,start:l.start_time?.slice(0,5)||'',end:l.end_time?.slice(0,5)||'',break:0,note:l.description||''})),totalHours:Number((x.timesheet_lines||[]).reduce((s,l)=>s+Number(l.hours||0),0)||0),createdAt:x.created_at}));
  set(LS,reports);
  const panel=document.getElementById('cloudPanel');if(panel)panel.style.display='none';
  window.__CH_ADMIN_CLOUD__={session:s,profile:p.data,reports};
  if(typeof window.applyRoleUI==='function')window.applyRoleUI();
  if(typeof window.renderHistory==='function')window.renderHistory();
  addAdminHistoryTab(reports);
 }catch(e){console.error('Admin history:',e)}
}
function addAdminHistoryTab(reports){
 const tabs=document.querySelector('.tabs'),admin=document.getElementById('adminView');if(!tabs||!admin)return;
 if(!tabs.querySelector('[data-tab="history"]')){const b=document.createElement('button');b.className='tab';b.dataset.tab='history';b.textContent='Histórico de partes';tabs.appendChild(b);b.onclick=()=>{tabs.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderAdminHistory(reports)}}
}
function renderAdminHistory(reports){
 const c=document.getElementById('adminContent');if(!c)return;
 const workers=JSON.parse(localStorage.getItem('ch_workers')||'[]'),projects=JSON.parse(localStorage.getItem('ch_projects')||'[]'),tasks=JSON.parse(localStorage.getItem('ch_tasks')||'[]');
 c.innerHTML='<div class="card"><div class="section-title"><div><h2>Histórico de partes</h2><p class="small">Todos los partes registrados en la nube.</p></div><button id="adminHistRefresh" class="secondary">Actualizar</button></div><div id="adminHistList"></div></div>';
 const box=document.getElementById('adminHistList');
 if(!reports.length){box.innerHTML='<div class="empty">No hay partes registrados todavía.</div>';return}
 box.innerHTML=reports.map(r=>{const w=workers.find(x=>x.id===r.workerId)?.name||'Trabajador';const lines=(r.lines||[]).map(l=>{const p=projects.find(x=>x.id===l.projectId),t=tasks.find(x=>x.id===l.taskId);return '<div>• '+esc(p?.code||'')+' '+esc(p?.name||'')+' — '+esc(t?.name||'')+' · '+esc(l.start)+'-'+esc(l.end)+' · '+Number(h(l.start,l.end,l.break)).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' h</div>'}).join('');return '<article class="history-item"><div class="history-head"><div><strong>'+esc(r.date)+' · '+esc(w)+'</strong><div class="history-meta">Total: '+Number(r.totalHours||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' h · '+(r.lines||[]).length+' línea(s)</div></div></div><div class="history-lines">'+lines+'</div></article>'}).join('');
 document.getElementById('adminHistRefresh').onclick=async()=>{await adminLoad();const rr=window.__CH_ADMIN_CLOUD__?.reports||[];renderAdminHistory(rr)};
}
function hook(){
 setTimeout(()=>{adminLoad()},700);
 document.addEventListener('click',e=>{const b=e.target?.closest?.('#navAdmin,#adminBtn');if(b)setTimeout(()=>adminLoad(),500)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();