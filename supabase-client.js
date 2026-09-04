(function(){
  const cfg=window.SUPABASE_CONFIG||{};
  const ready=!!(window.supabase&&cfg.enabled&&cfg.url&&cfg.publishableKey);
  let client=null;
  if(ready) client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const redirectUrl=()=>window.location.origin+window.location.pathname;
  async function getSession(){if(!client)return null;const r=await client.auth.getSession();return r.data.session||null}
  async function signIn(email,password){if(!client)throw new Error('Supabase no configurado');return client.auth.signInWithPassword({email,password})}
  async function signUp(email,password){if(!client)throw new Error('Supabase no configurado');return client.auth.signUp({email,password,options:{emailRedirectTo:redirectUrl()}})}
  async function resendConfirmation(email){if(!client)throw new Error('Supabase no configurado');return client.auth.resend({type:'signup',email,options:{emailRedirectTo:redirectUrl()}})}
  async function signOut(){if(client)return client.auth.signOut()}
  window.ControlHorarioSupabase={configured:ready,client,auth:{getSession,signIn,signUp,resendConfirmation,signOut}};
})();
