(function(){
  'use strict';

  const STORAGE_PREFIX='bos-plan-ui-collapse:';
  const bySel=(s,r=document)=>r.querySelector(s);

  function movePlanNameIntoPlan(){
    const topPlanName=bySel('.top-plan-name');
    const planView=bySel('#planView');
    if(!topPlanName||!planView||bySel('.plan-name-card')) return;

    const card=document.createElement('section');
    card.className='plan-name-card card';
    card.setAttribute('aria-label','Nom du plan');
    const inner=document.createElement('div');
    inner.className='plan-name-card-inner';
    card.appendChild(inner);
    inner.appendChild(topPlanName);
    planView.insertBefore(card,planView.firstElementChild);
  }

  function normalizeStageHeading(){
    const head=bySel('.stage-title-head');
    if(!head) return;
    if(!head.querySelector(':scope > .bos-inline-heading')){
      const step=head.querySelector(':scope > .step');
      const copy=head.querySelector(':scope > .heading-copy');
      if(step&&copy){
        const group=document.createElement('div');
        group.className='bos-inline-heading';
        head.insertBefore(group,step);
        group.append(step,copy);
      }
    }
  }

  function makeCollapseButton(card,head,key){
    if(!card||!head||head.querySelector('.bos-bubble-collapse')) return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='bos-bubble-collapse';
    btn.setAttribute('aria-label','Réduire ou développer la section');
    btn.innerHTML='<span aria-hidden="true">⌄</span>';
    head.appendChild(btn);

    const saved=localStorage.getItem(STORAGE_PREFIX+key);
    const collapsed=saved==='1';
    card.classList.toggle('ui-collapsed',collapsed);
    btn.setAttribute('aria-expanded',String(!collapsed));

    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      const next=!card.classList.contains('ui-collapsed');
      card.classList.toggle('ui-collapsed',next);
      btn.setAttribute('aria-expanded',String(!next));
      localStorage.setItem(STORAGE_PREFIX+key,next?'1':'0');
    });
  }

  function installCollapsibles(){
    normalizeStageHeading();
    makeCollapseButton(bySel('.stage-card'),bySel('.stage-title-head'),'plan');
    makeCollapseButton(bySel('.camera-preview'),bySel('.camera-preview .preview-head'),'camera');
    makeCollapseButton(bySel('.inline-library-card'),bySel('.inline-library-card .inline-library-head'),'library');
  }

  function makeIconButton(cls,label,svg){
    const b=document.createElement('button');
    b.type='button';
    b.className='inspector-object-action '+cls;
    b.setAttribute('aria-label',label);
    b.title=label;
    b.innerHTML=svg;
    return b;
  }

  function installInspectorActions(){
    const head=bySel('.inspector-title-head');
    const toggle=bySel('#toggleInspectorBtn');
    if(!head||!toggle||head.querySelector('.inspector-head-actions')) return;

    const actions=document.createElement('div');
    actions.className='inspector-head-actions';

    const duplicate=makeIconButton('duplicate-selected','Dupliquer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="10" height="10" rx="2"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>');
    const remove=makeIconButton('delete-selected','Supprimer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg>');

    actions.append(duplicate,remove,toggle);
    head.appendChild(actions);

    function selectedId(){
      try{return state && state.selected ? state.selected : null}catch(_){return null}
    }
    function sync(){
      const enabled=!!selectedId();
      duplicate.disabled=!enabled;
      remove.disabled=!enabled;
    }
    duplicate.addEventListener('click',(e)=>{
      e.stopPropagation();
      const id=selectedId();
      if(id && typeof duplicateObjectById==='function') duplicateObjectById(id);
      sync();
    });
    remove.addEventListener('click',(e)=>{
      e.stopPropagation();
      const id=selectedId();
      if(id && typeof deleteObjectById==='function') deleteObjectById(id);
      sync();
    });

    const hint=bySel('#selectionHint');
    if(hint) new MutationObserver(sync).observe(hint,{subtree:true,childList:true,characterData:true});
    document.addEventListener('pointerup',()=>setTimeout(sync,0),true);
    sync();
  }

  function normalizeInspectorCollapse(){
    const inspector=bySel('#inspector');
    const toggle=bySel('#toggleInspectorBtn');
    if(!inspector||!toggle) return;
    const refresh=()=>{
      const collapsed=inspector.classList.contains('collapsed');
      toggle.setAttribute('aria-expanded',String(!collapsed));
      try{localStorage.setItem(STORAGE_PREFIX+'settings',collapsed?'1':'0')}catch(_){}
    };
    toggle.addEventListener('click',()=>setTimeout(refresh,0));
    refresh();
  }

  function init(){
    movePlanNameIntoPlan();
    installCollapsibles();
    installInspectorActions();
    normalizeInspectorCollapse();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
