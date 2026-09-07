(function(){'use strict';
const C=window.ControlHorarioSupabase;if(!C||!C.configured)return;
const LS='ch_reports',MAP='ch_cloud_report_ids';
const reports=()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch{return[]}};
const saveReports=r=>localStorage.setItem(LS,JSON.stringify(r));
const maps=()=>{try{return JSON.parse(localStorage.getItem(MAP)||'{}')}catch{return{}}};
const saveMaps=m=>localStorage.setItem(MAP,JSON.stringify(m));
const session=()=>{try{return JSON.parse(localStorage.getItem('ch_worker_session')||'null')}catch{return null}};
const hours=(a,b,br=0)=>{if(!a||!b)return 0;let [ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number),m=bh*60+bm-ah*60-am-Number(br||0);if(m<0)m+=1440;return Math.max(0,m)/60};
let busy=false;
async function syncWorkerReports(){const ws=session();if(!ws?.token||!ws?.employee_id||busy)return;busy=true;try{const rs=reports(),mp=maps();for(let i=0;i<rs.length;i++){const r=rs[i];if(r.workerId!==ws.employee_id)continue;const cloudId=mp[r.id]||r.cloud_id||null;const report={...r,cloud_id:cloudId,lines:(r.lines||[]).map(l=>({...l,hours:hours(l.start,l.end,l.break)}))};const x=await C.client.functions.invoke('worker-api',{body:{action:'save',token:ws.token,report}});if(x.error)throw x.error;if(x.data?.error)throw new Error(x.data.error);if(x.data?.timesheet_id){mp[r.id]=x.data.timesheet_id;rs[i]={...r,cloud_id:x.data.timesheet_id}}}saveMaps(mp);saveReports(rs)}catch(e){console.error('Control Horario: error guardando en nube',e);alert('El parte se ha guardado localmente, pero NO se pudo guardar en la nube. Comprueba la conexión e inténtalo de nuevo.')}finally{busy=false}}
async function deleteWorkerReport(id){const ws=session();if(!ws?.token||!id)return;const mp=maps(),cloudId=mp[id]||id;if(!cloudId)return;try{const x=await C.client.functions.invoke('worker-api',{body:{action:'delete',token:ws.token,report_id:cloudId}});if(x.error||x.data?.error)console.error('Control Horario: error eliminando en nube',x.error||x.data.error);else{delete mp[id];saveMaps(mp)}}catch(e){console.error(e)}}
function init(){document.addEventListener('submit',e=>{if(e.target?.id==='reportForm')setTimeout(syncWorkerReports,400)});document.addEventListener('click',e=>{const b=e.target?.closest?.('.deleteReport');if(b)setTimeout(()=>deleteWorkerReport(b.dataset.id),400)});setTimeout(syncWorkerReports,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();