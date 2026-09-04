(function(){
  const cfg=window.SUPABASE_CONFIG||{};
  const ready=!!(window.supabase&&cfg.enabled&&cfg.url&&cfg.publishableKey);
  let client=null;
  if(ready) client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  async function getSession(){if(!client)return null;const r=await client.auth.getSession();return r.data.session||null}
  async function signIn(phone){if(!client)throw new Error('Supabase no configurado');return client.auth.signInWithOtp({phone,options:{shouldCreateUser:false}})}
  async function verifyOtp(phone,token){if(!client)throw new Error('Supabase no configurado');return client.auth.verifyOtp({phone,token,type:'sms'})}
  async function signUp(phone){if(!client)throw new Error('Supabase no configurado');return client.auth.signInWithOtp({phone,options:{shouldCreateUser:true}})}
  async function resendConfirmation(phone){return signIn(phone)}
  async function signOut(){if(client)return client.auth.signOut()}
  window.ControlHorarioSupabase={configured:ready,client,auth:{getSession,signIn,verifyOtp,signUp,resendConfirmation,signOut}};
})();
