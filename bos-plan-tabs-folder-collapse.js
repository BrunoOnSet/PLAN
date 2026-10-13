(function(){
  'use strict';

  const FOLDER_COLLAPSE_PREFIX='bos-plan-folder-collapse:';

  function installTabIcons(){
    const plan=document.getElementById('planTabBtn');
    const plans=document.getElementById('plansTabBtn');
    if(plan&&!plan.querySelector('.main-tab-icon')){
      plan.innerHTML='<span class="main-tab-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="2.3"/><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17"/></svg></span><span class="main-tab-label">PLAN</span>';
    }
    if(plans&&!plans.querySelector('.main-tab-icon')){
      plans.innerHTML='<span class="main-tab-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="7" y="4.5" width="12.5" height="14.5" rx="2.2"/><path d="M7 8H5.8a2 2 0 0 0-2 2v8.2a2 2 0 0 0 2 2H14a2 2 0 0 0 2-2V19"/></svg></span><span class="main-tab-label">MES PLANS</span>';
    }
  }

  function folderStorageKey(id){return FOLDER_COLLAPSE_PREFIX+id}

  function enhanceFolder(box){
    if(!box||box.dataset.folderCollapseReady==='1')return;
    const id=box.dataset.folderId;
    const head=box.querySelector(':scope > .direct-folder-head');
    const actions=head?.querySelector('.direct-folder-actions');
    if(!id||!head||!actions)return;

    box.dataset.folderCollapseReady='1';

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='direct-folder-collapse';
    btn.title='Réduire ou développer le dossier';
    btn.setAttribute('aria-label','Réduire ou développer le dossier');
    btn.innerHTML='<span aria-hidden="true"></span>';
    actions.appendChild(btn);

    let collapsed=false;
    try{collapsed=localStorage.getItem(folderStorageKey(id))==='1'}catch(_){ }

    const apply=()=>{
      box.classList.toggle('folder-collapsed',collapsed);
      btn.setAttribute('aria-expanded',String(!collapsed));
    };

    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      collapsed=!collapsed;
      try{localStorage.setItem(folderStorageKey(id),collapsed?'1':'0')}catch(_){ }
      apply();
    });

    btn.addEventListener('pointerdown',e=>e.stopPropagation());
    apply();
  }

  function enhanceFolders(){
    document.querySelectorAll('#plansView .direct-folder-block').forEach(enhanceFolder);
  }

  function init(){
    installTabIcons();
    enhanceFolders();

    const plansView=document.getElementById('plansView');
    if(plansView){
      const observer=new MutationObserver(()=>enhanceFolders());
      observer.observe(plansView,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
