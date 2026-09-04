(function(){
'use strict';
const C=()=>window.ControlHorarioSupabase;let users=[];let directWorkers=[];
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const isAdmin=()=>window.ControlHorarioRole==='admin'||document.querySelector('[data-view="adminView"]')?.classList.contains('active')||!!localStorage.getItem('ch_admin_session');
const call=body=>{const c=C();if(!c?.configured||!c.client)throw new Error('Supabase no configurado');return c.client.functions.invoke('admin-users',{body})};
function localWorkers(){try{return JSON.parse(localStorage.getItem('ch_workers')||'[]').filter(x=>x.active!==false)}catch{return []}}
async function directEmployeeLoad(){
  const c=C();if(!c?.client)throw new Error('Supabase no configurado');
  const s=await c.client.auth.getSession();
  if(s.error)throw s.error;
  const uid=s.data?.session?.user?.id;
  if(!uid)throw new Error('Sesión de administrador no disponible.');
  const p=await c.client.from('profiles').select('company_id,role,active').eq('id',uid).maybeSingle();
  if(p.error)throw p.error;
  if(!p.data?.company_id)throw new Error('No se encontró la empresa del administrador.');
  if(p.data.role!=='admin')throw new Error('La cuenta actual no tiene permisos de administrador.');
  const e=await c.client.from('employees').select('id,first_name,last_name,employee_code,email,phone,active').eq('company_id',p.data.company_id).eq('active',true).order('first_name');
  if(e.error)throw e.error;
  directWorkers=(e.data||[]).map(x=>({id:x.id,name:(x.first_name+' '+x.last_name).trim(),active:x.active,code:x.employee_code,email:x.email,phone:x.phone}));
  localStorage.setItem('ch_workers',JSON.stringify(directWorkers));
  return directWorkers;
}
async function load(){
  // La lista de trabajadores se obtiene directamente de employees. No depende de
  // ch_workers ni de que existan cuentas de acceso previamente creadas.
  const workers=await directEmployeeLoad();
  try{await syncLocalWorkers(workers)}catch(e){console.warn('Sincronización de trabajadores:',e)}
  const r=await call({action:'list'});
  if(r.error)throw r.error;
  users=r.data?.users||[];
  render(workers);
}
async function syncLocalWorkers(workers){for(const w of workers){try{await call({action:'sync',employee:{name:w.name,code:w.code,email:w.email,phone:w.phone,active:true}})}catch(e){console.warn('No se pudo sincronizar trabajador',w,e)}}}
function render(workers=directWorkers){const c=document.getElementById('adminContent');if(!c)return;const byId=new Map(users.map(u=>[u.employee_id,u]));c.innerHTML=`<div class="card users-card"><div class="section-title"><div><h2>Usuarios y accesos</h2><p class="small">Todos los trabajadores aparecen aquí. Los que indiquen “Sin cuenta” pueden recibir un código personal de 6 dígitos.</p></div><button id="newUser" class="primary">＋ Nueva cuenta</button></div><div class="users-table">${workers.length?workers.map(w=>{const u=byId.get(w.id),has=!!u?.has_pin;const status=has?(u.active?'Activa':'Desactivada'):'Sin cuenta';return `<div class="user-row"><div><strong>👤 ${esc(w.name||'Sin nombre')}</strong><div class="small">${esc(w.code||'')} · Trabajador</div></div><div><span class="badge">${status}</span> <span class="badge">${has?'Código asignado':'Sin código'}</span></div><div class="user-actions">${has?`<button class="secondary pin-user" data-id="${w.id}">Cambiar código</button><button class="secondary toggle-user" data-id="${w.id}" data-active="${u.active}">${u.active?'Desactivar':'Activar'}</button>`:`<button class="secondary create-user" data-id="${w.id}">Crear acceso</button>`}</div></div>`}).join(''):'<div class="empty">No hay trabajadores activos en la empresa.</div>'}</div></div>`;document.getElementById('newUser').onclick=()=>showCreate(workers,byId);c.querySelectorAll('.toggle-user').forEach(b=>b.onclick=()=>update(b.dataset.id,{active:b.dataset.active!=='true'}));c.querySelectorAll('.pin-user').forEach(b=>b.onclick=()=>changePin(b.dataset.id));c.querySelectorAll('.create-user').forEach(b=>b.onclick=()=>createFor(b.dataset.id))}
async function update(employee_id,patch){try{const r=await call({action:'update',employee_id,...patch});if(r.error)throw r.error;await load()}catch(e){alert(e.message||'No se pudo actualizar la cuenta');await load().catch(()=>{})}}
function pinPrompt(title='Código personal'){const p=prompt(title+' (6 dígitos):');if(p===null)return null;if(!/^\d{6}$/.test(p))throw new Error('El código debe tener exactamente 6 dígitos.');return p}
async function changePin(id){try{const pin=pinPrompt('Nuevo código');if(pin===null)return;await update(id,{pin})}catch(e){alert(e.message||'No se pudo cambiar el código')}}
async function createFor(employee_id){try{const pin=pinPrompt('Código personal');if(pin===null)return;const r=await call({action:'create',employee_id,pin});if(r.error)throw r.error;alert('Acceso creado correctamente.');await load()}catch(e){alert(e.message||'No se pudo crear la cuenta')}}
function showCreate(workers,byId){
  const available=workers.filter(w=>w.id&&!byId.get(w.id)?.has_pin);
  const box=document.createElement('div');box.className='modal';box.innerHTML=`<div class="modal-card"><h2>Nueva cuenta</h2><p class="small">Selecciona cualquier trabajador y asigna un código personal de 6 dígitos.</p><label>Trabajador<select id="newUserEmployee"><option value="">Selecciona trabajador</option>${available.map(w=>`<option value="${esc(w.id)}">${esc(w.name||'Trabajador')}${w.code?' · '+esc(w.code):''}</option>`).join('')}</select></label><label>Código personal<input id="newUserPin" type="password" inputmode="numeric" maxlength="6" placeholder="6 dígitos"></label><p id="newUserError" class="error">${available.length?'':'No hay trabajadores disponibles.'}</p><div class="actions"><button id="cancelNewUser" class="secondary">Cancelar</button><button id="saveNewUser" class="primary">Crear cuenta</button></div></div>`;document.body.appendChild(box);box.querySelector('#cancelNewUser').onclick=()=>box.remove();box.querySelector('#saveNewUser').onclick=async()=>{const id=box.querySelector('#newUserEmployee').value,pin=box.querySelector('#newUserPin').value.trim();try{if(!id||!/^[0-9]{6}$/.test(pin))throw new Error('Selecciona trabajador e introduce un código de 6 dígitos.');box.querySelector('#saveNewUser').disabled=true;const r=await call({action:'create',employee_id:id,pin});if(r.error)throw r.error;box.remove();alert('Cuenta creada correctamente.');await load()}catch(e){box.querySelector('#newUserError').textContent=e.message||'No se pudo crear la cuenta';box.querySelector('#saveNewUser').disabled=false}}}
function addTab(){if(!isAdmin())return;const tabs=document.querySelector('.tabs');if(!tabs||tabs.querySelector('[data-tab="users"]'))return;const b=document.createElement('button');b.className='tab';b.dataset.tab='users';b.textContent='Usuarios y accesos';tabs.appendChild(b)}
function open(){if(!isAdmin())return;addTab();document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));document.querySelector('.tabs [data-tab="users"]')?.classList.add('active');load().catch(e=>{const c=document.getElementById('adminContent');if(c)c.innerHTML='<div class="card"><p class="error">'+esc(e.message||e)+'</p></div>'})}
document.addEventListener('click',e=>{const b=e.target.closest('.tabs [data-tab="users"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();open()},true);
const css=document.createElement('style');css.textContent='.users-table{display:grid;gap:10px}.user-row{display:grid;grid-template-columns:1.4fr .9fr 1.8fr;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #e5e7eb}.user-actions{display:flex;gap:7px;flex-wrap:wrap}.badge{display:inline-block;padding:3px 7px;border-radius:99px;background:#f3f4f6;font-size:11px}.users-card .section-title{align-items:center}@media(max-width:850px){.user-row{grid-template-columns:1fr}.user-actions{justify-content:flex-start}}';document.head.appendChild(css);const timer=setInterval(addTab,800);window.addEventListener('beforeunload',()=>clearInterval(timer));window.ControlHorarioUsers={open,load};
})();
