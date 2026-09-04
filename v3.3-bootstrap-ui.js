(function(){
'use strict';
function remove(){document.getElementById('initialAdminCard')?.remove()}
function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function data(){try{return JSON.parse(localStorage.getItem('ch_reports')||'[]')}catch{return[]}}
function workers(){try{return JSON.parse(localStorage.getItem('ch_workers')||'[]')}catch{return[]}}
function projects(){try{return JSON.parse(localStorage.getItem('ch_projects')||'[]')}catch{return[]}}
function tasks(){try{return JSON.parse(localStorage.getItem('ch_tasks')||'[]')}catch{return[]}}
function fmt(n){return Number(n||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})}
function mins(a,b){if(!a||!b)return 0;let [ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number),m=bh*60+bm-ah*60-am;return m<0?m+1440:m}
function hrs(l){return Math.max(0,mins(l.start,l.end)-Number(l.break||0))/60}
function renderHistory(){
 const c=document.getElementById('adminContent');if(!c)return;
 const rs=data(),ws=workers(),ps=projects(),ts=tasks();
 const q=(document.getElementById('adminHistorySearch')?.value||'').toLowerCase();
 const wid=document.getElementById('adminHistoryWorker')?.value||'';
 const from=document.getElementById('adminHistoryFrom')?.value||'';
 const to=document.getElementById('adminHistoryTo')?.value||'';
 const filtered=rs.filter(r=>{const w=ws.find(x=>x.id===r.workerId)?.name||'Trabajador eliminado';const text=[w,r.date,...(r.lines||[]).flatMap(l=>{const p=ps.find(x=>x.id===l.projectId),t=ts.find(x=>x.id===l.taskId);return[p?.name,p?.code,t?.name,l.note]})].join(' ').toLowerCase();return(!q||text.includes(q))&&(!wid||r.workerId===wid)&&(!from||r.date>=from)&&(!to||r.date<=to)}).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 c.innerHTML='<div class="card"><div class="section-title"><div><h2>Histórico de partes</h2><p class="small">Todos los partes registrados de la empresa.</p></div><button id="adminHistoryExport" class="secondary">Exportar CSV</button></div><div class="filters"><input id="adminHistorySearch" placeholder="Buscar trabajador, proyecto o tarea…" value="'+esc(q)+'"><input id="adminHistoryFrom" type="date" value="'+esc(from)+'"><input id="adminHistoryTo" type="date" value="'+esc(to)+'"><select id="adminHistoryWorker"><option value="">Todos los trabajadores</option>'+ws.map(w=>'<option value="'+w.id+'" '+(w.id===wid?'selected':'')+'>'+esc(w.name)+'</option>').join('')+'</select><button id="adminHistoryClear" class="secondary">Limpiar</button></div><div style="margin-top:14px">'+(filtered.length?filtered.map(r=>{const w=ws.find(x=>x.id===r.workerId)?.name||'Trabajador eliminado';const lines=(r.lines||[]).map(l=>{const p=ps.find(x=>x.id===l.projectId),t=ts.find(x=>x.id===l.taskId);return '<div>• '+esc(p?.code||'')+' '+esc(p?.name||'')+' — '+esc(t?.name||'')+' · '+esc(l.start||'')+'-'+esc(l.end||'')+' · '+fmt(hrs(l))+' h'+(l.note?' · '+esc(l.note):'')+'</div>'}).join('');const total=Number(r.totalHours||((r.lines||[]).reduce((s,l)=>s+hrs(l),0)));return '<article class="history-item"><div class="history-head"><div><strong>'+esc(r.date)+' · '+esc(w)+'</strong><div class="history-meta">Total: '+fmt(total)+' h · '+(r.lines||[]).length+' línea(s)</div></div></div><div class="history-lines">'+lines+'</div></article>'}).join(''):'<div class="empty">No hay partes que coincidan con los filtros.</div>')+'</div></div>';
 ['adminHistorySearch','adminHistoryFrom','adminHistoryTo','adminHistoryWorker'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderHistory));
 document.getElementById('adminHistoryClear')?.addEventListener('click',renderHistory);
 document.getElementById('adminHistoryExport')?.addEventListener('click',()=>{const rows=[['Fecha','Trabajador','Proyecto','Código','Tarea','Entrada','Salida','Pausa min','Horas','Observaciones']];filtered.forEach(r=>(r.lines||[]).forEach(l=>{const w=ws.find(x=>x.id===r.workerId)||{},p=ps.find(x=>x.id===l.projectId)||{},t=ts.find(x=>x.id===l.taskId)||{};rows.push([r.date,w.name,p.name,p.code,t.name,l.start,l.end,l.break,hrs(l).toFixed(2),l.note])}));const csv='\\ufeff'+rows.map(row=>row.map(v=>'\"'+String(v??'').replace(/\"/g,'\"\"')+'\"').join(';')).join('\\r\\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='historico_partes.csv';a.click()});
}
function addTab(){const tabs=document.querySelector('.tabs');if(!tabs||document.getElementById('adminHistoryTab'))return;const b=document.createElement('button');b.id='adminHistoryTab';b.className='tab';b.dataset.tab='history';b.textContent='Histórico de partes';tabs.appendChild(b);b.onclick=()=>{document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderHistory()}}
function start(){remove();addTab();setInterval(()=>{remove();addTab()},1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
