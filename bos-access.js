(function(){
  'use strict';

  const DEFAULT_CONFIG=Object.freeze({
    schema:1,
    module:'PLAN',
    version:'V1.60',
    build:1,
    access:'free',
    accessProvider:'none'
  });

  const state={
    config:DEFAULT_CONFIG,
    source:'default',
    ready:false,
    error:null
  };

  async function fetchJson(url){
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    return response.json();
  }

  async function loadConfig(){
    const stamp=Date.now();
    try{
      const central=await fetchJson('https://raw.githubusercontent.com/BrunoOnSet/Bruno-On-Set/main/bos-config.json?ts='+stamp);
      const remote=central?.modules?.PLAN;
      if(!remote||typeof remote!=='object')throw new Error('PLAN config missing');
      state.config=Object.freeze({...DEFAULT_CONFIG,...remote,module:'PLAN'});
      state.source='central';
      state.error=null;
    }catch(centralError){
      try{
        const local=await fetchJson('version.json?ts='+stamp);
        state.config=Object.freeze({...DEFAULT_CONFIG,...local,module:'PLAN'});
        state.source='local';
        state.error=centralError;
      }catch(localError){
        state.config=DEFAULT_CONFIG;
        state.source='default';
        state.error=localError;
      }
    }finally{
      state.ready=true;
    }
    return state;
  }

  const ready=loadConfig();

  window.BOSAccess=Object.freeze({
    state,
    ready,
    getConfig(){return state.config;},
    async authorize(){
      await ready;
      const mode=String(state.config.access||'free').toLowerCase();
      return {
        allowed:mode==='free',
        mode,
        provider:state.config.accessProvider||'none'
      };
    }
  });

  // Vérification non intrusive : aucune navigation ni aucun reload forcé.
  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{
      if(!navigator.onLine)return;
      try{
        const registration=await navigator.serviceWorker.getRegistration();
        if(registration)await registration.update();
      }catch(_){ }
    },{once:true});
  }
})();
