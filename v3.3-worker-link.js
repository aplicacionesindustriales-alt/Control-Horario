(function(){'use strict';
const qs=new URLSearchParams(location.search),workerId=qs.get('worker');if(!workerId)return;
function session(){try{return JSON.parse(localStorage.getItem('ch_worker_session')||'null')}catch{return null}}
function cleanUrl(){try{const u=new URL(location.href);u.searchParams.delete('worker');history.replaceState({},'',u.pathname+(u.search?'?'+u.searchParams.toString():'')+u.hash)}catch{}}
const ws=session();if(ws?.employee_id===workerId){cleanUrl();return}
let tries=0;const timer=setInterval(()=>{tries++;const sel=document.getElementById('workerLoginName'),pin=document.getElementById('workerLoginPin'),btn=document.getElementById('workerLogin');if(sel){const opt=[...sel.options].find(o=>o.value===workerId);if(opt){sel.value=workerId;sel.disabled=true;sel.style.display='none';const box=sel.parentElement;const p=box?.querySelector('p');if(p)p.textContent='Acceso personal de '+opt.textContent.replace(' · Sin acceso','')+'. Introduce tu código personal para entrar.';if(btn)btn.textContent='Entrar';if(pin){pin.placeholder='Código personal';pin.focus()}clearInterval(timer);return}}if(tries>30)clearInterval(timer)},250);
})();
