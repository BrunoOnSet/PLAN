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

  function normalizeCameraTabs(){
    const head=bySel('.camera-preview .preview-head');
    if(!head) return;
    const tabs=head.querySelector('.preview-tabs');
    if(tabs){
      const row=document.createElement('div');
      row.className='bos-exact-preview-tabs-row';
      head.insertAdjacentElement('afterend',row);
      row.appendChild(tabs);
    }
  }

  function makeExactToggle({card,number,title,subtitle,key,mode='class',className='ui-collapsed',nativeToggle=null,sourceSubtitle=null}){
    if(!card || card.querySelector(':scope > .bos-exact-toggle')) return null;

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='bos-exact-toggle';
    btn.setAttribute('aria-label','Réduire ou développer la section');
    btn.innerHTML=
      '<span class="bos-exact-number">'+number+'</span>'+ 
      '<span class="bos-exact-copy">'+
        '<span class="bos-exact-title">'+title+'</span>'+ 
        '<span class="bos-exact-subtitle"></span>'+ 
      '</span>'+ 
      '<span class="bos-exact-caret" aria-hidden="true"></span>';

    const sub=btn.querySelector('.bos-exact-subtitle');
    const readSubtitle=()=>{
      const value=sourceSubtitle ? (sourceSubtitle.textContent||'').trim() : (subtitle||'');
      sub.textContent=value;
    };
    readSubtitle();
    if(sourceSubtitle){
      new MutationObserver(readSubtitle).observe(sourceSubtitle,{subtree:true,childList:true,characterData:true});
    }

    card.insertBefore(btn,card.firstElementChild);

    const setVisual=(expanded)=>btn.setAttribute('aria-expanded',String(expanded));

    if(mode==='native' && nativeToggle){
      const sync=()=>{
        const expanded=!card.classList.contains('collapsed');
        setVisual(expanded);
      };
      btn.addEventListener('click',(e)=>{
        e.stopPropagation();
        nativeToggle.click();
        requestAnimationFrame(sync);
      });
      new MutationObserver(sync).observe(card,{attributes:true,attributeFilter:['class']});
      sync();
      return btn;
    }

    const saved=localStorage.getItem(STORAGE_PREFIX+key);
    const collapsed=saved==='1';
    card.classList.toggle(className,collapsed);
    setVisual(!collapsed);

    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      const next=!card.classList.contains(className);
      card.classList.toggle(className,next);
      setVisual(!next);
      try{localStorage.setItem(STORAGE_PREFIX+key,next?'1':'0')}catch(_){}
    });

    return btn;
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
    if(!inspector || inspector.querySelector(':scope > .bos-exact-actions')) return;

    const actions=document.createElement('div');
    actions.className='bos-exact-actions';

    const duplicate=makeIconButton('duplicate-selected','Dupliquer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="10" height="10" rx="2"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>');
    const remove=makeIconButton('delete-selected','Supprimer l’élément sélectionné',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg>');

    actions.append(duplicate,remove);
    inspector.appendChild(actions);

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

  function installExactBubbles(){
    const stage=bySel('.stage-card');
    makeExactToggle({
      card:stage,
      number:'02',
      title:'PLAN',
      subtitle:'Vue du dessus · déplacer et orienter directement les éléments',
      key:'plan'
    });

    const inspector=bySel('#inspector');
    const nativeInspectorToggle=bySel('#toggleInspectorBtn');
    makeExactToggle({
      card:inspector,
      number:'03',
      title:'RÉGLAGES',
      subtitle:'Modifier précisément l’élément sélectionné',
      key:'settings',
      mode:'native',
      nativeToggle:nativeInspectorToggle
    });

    const camera=bySel('.camera-preview');
    makeExactToggle({
      card:camera,
      number:'04',
      title:'VUES CAMÉRA',
      subtitle:'',
      key:'camera',
      sourceSubtitle:bySel('#cameraReadout')
    });

    const library=bySel('.inline-library-card');
    makeExactToggle({
      card:library,
      number:'05',
      title:'MES PLANS',
      subtitle:'Retrouve directement tous tes plans enregistrés.',
      key:'library'
    });
  }

  function init(){
    movePlanCommandbarIntoPlan();
    normalizeStageHeading();
    normalizeInspectorHeading();
    normalizeCameraTabs();
    normalizeInspectorCollapse();
    installExactBubbles();
    installInspectorActions();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
