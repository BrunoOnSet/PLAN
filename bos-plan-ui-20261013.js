(function(){
  'use strict';

  const STORAGE_PREFIX='bos-plan-ui-collapse:';
  const bySel=(s,r=document)=>r.querySelector(s);

  function movePlanCommandbarIntoPlan(){
    const commandbar=bySel('.plan-commandbar');
    const planView=bySel('#planView');
    if(!commandbar||!planView) return;
    if(commandbar.parentElement===planView) return;
    commandbar.classList.add('plan-commandbar-in-plan');
    planView.insertBefore(commandbar,planView.firstElementChild);
  }

  function normalizeStageHeading(){
    const head=bySel('.stage-title-head, .stage-head');
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

    const side=head.querySelector(':scope > .stage-head-side');
    if(side){
      side.classList.add('stage-content-tools');
      head.insertAdjacentElement('afterend',side);
    }
  }

  function normalizeInspectorHeading(){
    const head=bySel('.inspector-title-head, .inspector-head');
    if(!head) return;
    const first=head.querySelector(':scope > div:first-child');
    const selection=first?.querySelector(':scope > .selection-model-row');
    if(selection){
      selection.classList.add('inspector-selection-row');
      head.insertAdjacentElement('afterend',selection);
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
    makeCollapseButton(bySel('.stage-card'),bySel('.stage-title-head, .stage-head'),'plan');
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
    const inspector=bySel('#inspector');
    const head=bySel('.inspector-title-head, .inspector-head');
    const toggle=bySel('#toggleInspectorBtn');
    if(!inspector||!head||!toggle||head.querySelector('.inspector-head-actions')||inspector.querySelector(':scope > .inspector-content-actions')) return;

    /* Le chevron reste exactement dans l'entête. */
    const headActions=document.createElement('div');
    headActions.className='inspector-head-actions';

    toggle.classList.add('inspector-native-toggle');

    const collapseProxy=document.createElement('button');
    collapseProxy.type='button';
    collapseProxy.className='inspector-collapse-proxy';
    collapseProxy.setAttribute('aria-label','Réduire ou développer la section');
    collapseProxy.innerHTML='<span aria-hidden="true">⌄</span>';

    const syncCollapseProxy=()=>{
      const expanded=toggle.getAttribute('aria-expanded')!=='false';
      collapseProxy.setAttribute('aria-expanded',String(expanded));
    };
    collapseProxy.addEventListener('click',(e)=>{
      e.stopPropagation();
      toggle.click();
      requestAnimationFrame(syncCollapseProxy);
    });
    new MutationObserver(syncCollapseProxy).observe(toggle,{attributes:true,attributeFilter:['aria-expanded']});

    headActions.append(collapseProxy);
    head.appendChild(headActions);
    syncCollapseProxy();

    /* Dupliquer + Corbeille appartiennent au contenu rétractable :
       première ligne juste sous le trait de séparation. */
    const contentActions=document.createElement('div');
    contentActions.className='inspector-content-actions';

    const duplicate=makeIconButton('duplicate-selected','Dupliquer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="10" height="10" rx="2"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>');
    const remove=makeIconButton('delete-selected','Supprimer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg>');

    contentActions.append(duplicate,remove);
    head.insertAdjacentElement('afterend',contentActions);

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
    const wanted=localStorage.getItem(STORAGE_PREFIX+'settings');
    if(wanted==='1' && !inspector.classList.contains('collapsed')) toggle.click();
    const refresh=()=>{
      const collapsed=inspector.classList.contains('collapsed');
      toggle.setAttribute('aria-expanded',String(!collapsed));
      try{localStorage.setItem(STORAGE_PREFIX+'settings',collapsed?'1':'0')}catch(_){}
    };
    toggle.addEventListener('click',()=>setTimeout(refresh,0));
    refresh();
  }

  function init(){
    movePlanCommandbarIntoPlan();
    normalizeInspectorHeading();
    installCollapsibles();
    installInspectorActions();
    normalizeInspectorCollapse();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

/* Extension isolée MES PLANS : chargée après le cœur et sans toucher aux fonctions PLAN. */
(function(){
  if(document.querySelector('script[data-bos-plan-library-direct]'))return;
  const s=document.createElement('script');
  s.src='bos-plan-library-direct.js?v=20261013-1';
  s.async=false;
  s.dataset.bosPlanLibraryDirect='1';
  document.body.appendChild(s);
})();
