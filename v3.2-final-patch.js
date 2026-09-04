/* Control Horario V3.2 definitiva - ajustes finales */
(function(){
  const escSafe = v => String(v ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  // Proyectos: permite código automático o introducido manualmente.
  window.projectsAdmin = function(c){
    c.innerHTML=`<div class="card"><div class="section-title"><h2>Proyectos</h2><button id="newProject" class="primary">＋ Alta</button></div><div class="notice">El número de proyecto puede ser automático o introducirse manualmente. No se permiten números duplicados.</div>${projects.length?projects.map(p=>`<div class="admin-row"><div><strong>${escSafe(p.code)}</strong> · ${escSafe(p.name)} <span class="badge ${p.active?'':'off'}">${p.active?'Activo':'Inactivo'}</span></div><div><button class="secondary editP" data-id="${p.id}">Editar</button><button class="secondary toggleP" data-id="${p.id}">${p.active?'Desactivar':'Activar'}</button></div></div>`).join(''):'<div class="empty">Sin proyectos.</div>'}</div>`;
    $('#newProject').onclick=()=>{
      let proposed=typeof nextProjectCode==='function'?nextProjectCode():null;
      let code=prompt('Número de proyecto:',proposed||'');
      if(!code?.trim())return;
      code=code.trim();
      if(projects.some(p=>String(p.code).toLowerCase()===code.toLowerCase())){alert('Ese número de proyecto ya existe.');return}
      let n=prompt('Nombre del proyecto:');
      if(n?.trim()){projects.push({id:uid(),code,name:n.trim(),active:true,allowedTaskIds:[]});save('projects',projects);renderAdmin();}
    };
    $$('.editP').forEach(b=>b.onclick=()=>{
      let p=projects.find(x=>x.id===b.dataset.id);if(!p)return;
      let code=prompt('Número de proyecto:',p.code);if(!code?.trim())return;
      code=code.trim();
      if(projects.some(x=>x.id!==p.id&&String(x.code).toLowerCase()===code.toLowerCase())){alert('Ese número de proyecto ya existe.');return}
      let n=prompt('Nombre del proyecto:',p.name);if(n?.trim()){p.code=code;p.name=n.trim();save('projects',projects);renderAdmin();}
    });
    $$('.toggleP').forEach(b=>b.onclick=()=>{let p=projects.find(x=>x.id===b.dataset.id);p.active=!p.active;save('projects',projects);renderAdmin();});
  };

  // Copia de seguridad: textos limpios y botones exactamente uniformes.
  window.settingsAdmin = function(c){
    c.innerHTML=`<div class="card"><h2>Configuración</h2><label>Teléfono WhatsApp<input id="waPhone" inputmode="tel" placeholder="346XXXXXXXXX" value="${escSafe(settings.whatsappPhone||'')}"></label><button id="saveSettings" class="primary backup-btn">Guardar</button></div><div class="card"><h2>PIN de administración</h2><p class="small">${settings.pinHash?'PIN configurado. Puedes sustituirlo.':'No hay PIN configurado. Crea uno para proteger Administración.'}</p><input id="newPin" type="password" inputmode="numeric" maxlength="8" placeholder="Nuevo PIN (4–8 dígitos)"><button id="savePin" class="primary backup-btn">Guardar PIN</button></div><div class="card"><h2>Copia de seguridad</h2><div class="backup-actions"><button id="backup" type="button" class="secondary">Exportar copia</button><button id="restoreBtn" type="button" class="secondary">Restaurar copia</button><input id="restore" type="file" accept="application/json" hidden></div></div>`;
    $('#saveSettings').onclick=()=>{settings.whatsappPhone=$('#waPhone').value.trim();save('settings',settings);alert('Configuración guardada.');};
    $('#savePin').onclick=async()=>{let p=$('#newPin').value.trim();if(!/^\d{4,8}$/.test(p)){alert('El PIN debe tener entre 4 y 8 dígitos.');return}settings.pinHash=await hash(p);save('settings',settings);alert('PIN actualizado.');renderAdmin();};
    $('#backup').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({workers,projects,tasks,reports,settings,version:'3.2-definitiva'},null,2)],{type:'application/json'}));a.download='control_horario_backup.json';a.click();};
    $('#restoreBtn').onclick=()=>$('#restore').click();
    $('#restore').onchange=e=>{let f=e.target.files[0];if(!f)return;let rd=new FileReader;rd.onload=()=>{try{let d=JSON.parse(rd.result);if(!d||!Array.isArray(d.workers)||!Array.isArray(d.projects)||!Array.isArray(d.tasks)||!Array.isArray(d.reports))throw Error();workers=d.workers;projects=d.projects;tasks=d.tasks;reports=d.reports;settings=d.settings||{};saveAll();renderWorkers();resetForm();renderHistory();renderDashboard();renderAdmin();alert('Copia restaurada correctamente.');}catch{alert('Copia no válida.');}e.target.value='';};rd.readAsText(f);};
  };
})();
