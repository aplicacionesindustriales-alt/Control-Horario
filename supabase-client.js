(function(){
  const cfg=window.SUPABASE_CONFIG||{};
  const ready=!!(window.supabase&&cfg.enabled&&cfg.url&&cfg.publishableKey);
  let client=null;
  if(ready) client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  async function getSession(){if(!client)return null;const r=await client.auth.getSession();return r.data.session||null}
  async function signIn(email,password){if(!client)throw new Error('Supabase no configurado');return client.auth.signInWithPassword({email,password})}
  async function signUp(email,password){if(!client)throw new Error('Supabase no configurado');return client.auth.signUp({email,password})}
  async function signOut(){if(client)return client.auth.signOut()}
  window.ControlHorarioSupabase={configured:ready,client,auth:{getSession,signIn,signUp,signOut}};
})();
