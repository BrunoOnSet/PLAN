(function(){
  'use strict';

  const inlineTarget=document.getElementById('inlinePlanLibraryList');
  const plansView=document.getElementById('plansView');
  if(!inlineTarget||!plansView)return;

  const coreBuildLibraryInto=(typeof buildLibraryInto==='function')?buildLibraryInto:null;
  let draggedPlanId=null;
  let draggedFolderId=null;
  let touchPlanDrag=null;

  const escapeHtml=(value)=>{
    try{if(typeof esc==='function')return esc(value)}catch(_){ }
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  };

  function persistAndRender(){
    try{if(typeof persistLibrary==='function')persistLibrary()}catch(_){ }
    try{if(typeof renderLibraryList==='function')renderLibraryList();else renderDirectLibrary(inlineTarget)}catch(_){renderDirectLibrary(inlineTarget)}
  }

  function cleanFolderName(value){
    return String(value||'').trim().replace(/\s+/g,' ');
  }

  function folderNameExists(name,excludeId=null){
    const key=cleanFolderName(name).toLocaleLowerCase('fr');
    return library.folders.some(f=>f.id!==excludeId&&cleanFolderName(f.name).toLocaleLowerCase('fr')===key);
  }

  function createFolder(){
    const raw=prompt('Nom du nouveau dossier :','Nouveau dossier');
    if(raw===null)return;
    const name=cleanFolderName(raw);
    if(!name)return;
    if(folderNameExists(name)){alert('Un dossier porte déjà ce nom.');return}
    library.folders.push({id:uid('folder'),name});
    persistAndRender();
  }

  function renameFolder(id){
    const folder=library.folders.find(f=>f.id===id);if(!folder)return;
    const raw=prompt('Renommer le dossier :',folder.name||'');
    if(raw===null)return;
    const name=cleanFolderName(raw);
    if(!name||name===folder.name)return;
    if(folderNameExists(name,id)){alert('Un dossier porte déjà ce nom.');return}
    folder.name=name;
    persistAndRender();
  }

  function deleteFolder(id){
    const index=library.folders.findIndex(f=>f.id===id);
    if(index<0)return;
    if(library.folders.length<=1){
      alert('Il faut conserver au moins un dossier dans Mes plans.');
      return;
    }

    const folder=library.folders[index];
    const destination=library.folders[index+1]||library.folders[index-1];
    const plans=library.plans.filter(p=>p.folderId===id);
    const message=plans.length
      ? `Supprimer le dossier « ${folder.name} » ?\n\nLes ${plans.length} plan${plans.length>1?'s':''} qu’il contient seront déplacés dans « ${destination.name} ». Aucun plan ne sera supprimé.`
      : `Supprimer le dossier « ${folder.name} » ?`;
    if(!confirm(message))return;

    plans.forEach(plan=>{plan.folderId=destination.id});
    if(state.folderId===id){
      state.folderId=destination.id;
      try{if(typeof persistCurrent==='function')persistCurrent()}catch(_){ }
    }
    library.folders.splice(index,1);
    persistAndRender();
    try{if(typeof flash==='function')flash(`Dossier « ${folder.name} » supprimé`)}catch(_){ }
  }

  function moveFolderBy(id,delta){
    const index=library.folders.findIndex(f=>f.id===id);
    if(index<0)return;
    const next=index+delta;
    if(next<0||next>=library.folders.length)return;
    const [folder]=library.folders.splice(index,1);
    library.folders.splice(next,0,folder);
    persistAndRender();
  }

  function moveFolderNear(dragId,targetId,after){
    if(!dragId||!targetId||dragId===targetId)return;
    const from=library.folders.findIndex(f=>f.id===dragId);
    if(from<0)return;
    const [folder]=library.folders.splice(from,1);
    let to=library.folders.findIndex(f=>f.id===targetId);
    if(to<0){library.folders.push(folder)}
    else{if(after)to+=1;library.folders.splice(to,0,folder)}
    persistAndRender();
  }

  function movePlanToFolder(planId,folderId){
    const rec=library.plans.find(p=>p.id===planId);
    const folder=library.folders.find(f=>f.id===folderId);
    if(!rec||!folder||rec.folderId===folderId)return;
    rec.folderId=folderId;
    if(state.planId===planId){
      state.folderId=folderId;
      try{if(typeof persistCurrent==='function')persistCurrent()}catch(_){ }
    }
    try{if(typeof persistLibrary==='function')persistLibrary()}catch(_){ }
    try{if(typeof flash==='function')flash(`Plan déplacé dans « ${folder.name} »`)}catch(_){ }
    try{if(typeof renderLibraryList==='function')renderLibraryList();else renderDirectLibrary(inlineTarget)}catch(_){renderDirectLibrary(inlineTarget)}
  }

  function clearDropTargets(){
    document.querySelectorAll('#plansView .folder-drop-target').forEach(el=>el.classList.remove('folder-drop-target'));
  }

  function ensureDirectShell(){
    const card=inlineTarget.closest('.inline-library-card');
    if(!card)return null;
    card.classList.remove('ui-collapsed');
    try{localStorage.removeItem('bos-plan-ui-collapse:library')}catch(_){ }
    card.querySelectorAll('.bos-bubble-collapse').forEach(btn=>btn.remove());

    let toolbar=card.querySelector('.direct-library-toolbar');
    if(!toolbar){
      toolbar=document.createElement('div');
      toolbar.className='direct-library-toolbar';
      toolbar.innerHTML='<div class="direct-library-toolbar-copy"><strong>Mes plans</strong><span>Crée des dossiers, réorganise-les et glisse un plan dans le dossier voulu.</span></div><button class="direct-library-new-folder" type="button">+ Nouveau dossier</button>';
      card.insertBefore(toolbar,inlineTarget);
      toolbar.querySelector('.direct-library-new-folder').addEventListener('click',createFolder);
    }
    return card;
  }

  function makePlanRow(rec){
    const row=document.createElement('div');
    row.className='plan-row';
    row.draggable=true;
    row.dataset.planId=rec.id;
    row.title='Glisser ce plan vers un dossier pour le ranger';
    const thumb=(typeof planThumbnailData==='function')?planThumbnailData(rec.state):'';
    const date=(typeof formatSavedDate==='function')?formatSavedDate(rec.updatedAt):'';
    row.innerHTML=`<div class="plan-row-preview"><img class="plan-thumb" src="${thumb}" alt="Aperçu de ${escapeHtml(rec.name)}"></div><div class="plan-row-main"><div class="plan-name-line"><span class="plan-drag-handle" title="Glisser vers un dossier" aria-label="Glisser vers un dossier">⋮⋮</span><strong>${escapeHtml(rec.name)}</strong></div><small>${escapeHtml(date)}${rec.id===state.planId?' · plan ouvert':''}</small></div><div class="plan-row-actions"><button class="primary-mini" data-act="open" type="button">Ouvrir</button><button data-act="duplicate" type="button">Dupliquer</button><button class="danger-mini" data-act="delete" type="button">Supprimer</button></div>`;

    row.querySelector('[data-act="open"]').onclick=()=>openLibraryPlan(rec.id);
    row.querySelector('[data-act="duplicate"]').onclick=()=>duplicateLibraryPlan(rec.id);
    row.querySelector('[data-act="delete"]').onclick=()=>deleteLibraryPlan(rec.id);

    row.addEventListener('dragstart',e=>{
      draggedFolderId=null;
      draggedPlanId=rec.id;
      row.classList.add('plan-dragging');
      try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/x-bos-plan',rec.id)}catch(_){ }
    });
    row.addEventListener('dragend',()=>{
      draggedPlanId=null;
      row.classList.remove('plan-dragging');
      clearDropTargets();
    });

    /* Mobile / tactile : le petit repère ⋮⋮ sert de poignée de glisser. */
    const handle=row.querySelector('.plan-drag-handle');
    handle.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse')return;
      e.preventDefault();
      touchPlanDrag={id:rec.id,pointerId:e.pointerId,targetFolderId:null};
      row.classList.add('plan-dragging');
      try{handle.setPointerCapture(e.pointerId)}catch(_){ }
    });
    handle.addEventListener('pointermove',e=>{
      if(!touchPlanDrag||touchPlanDrag.pointerId!==e.pointerId)return;
      e.preventDefault();
      clearDropTargets();
      const hit=document.elementFromPoint(e.clientX,e.clientY);
      const folder=hit?.closest?.('#plansView .direct-folder-block');
      touchPlanDrag.targetFolderId=folder?.dataset.folderId||null;
      if(folder)folder.classList.add('folder-drop-target');
    });
    const endTouch=e=>{
      if(!touchPlanDrag||touchPlanDrag.pointerId!==e.pointerId)return;
      const {id,targetFolderId}=touchPlanDrag;
      touchPlanDrag=null;
      row.classList.remove('plan-dragging');
      clearDropTargets();
      try{handle.releasePointerCapture(e.pointerId)}catch(_){ }
      if(targetFolderId)movePlanToFolder(id,targetFolderId);
    };
    handle.addEventListener('pointerup',endTouch);
    handle.addEventListener('pointercancel',endTouch);

    return row;
  }

  function renderDirectLibrary(target){
    ensureDirectShell();
    target.innerHTML='';

    if(!Array.isArray(library.folders)||!library.folders.length){
      library.folders=[{id:'folder_general',name:'Plans'}];
      try{persistLibrary()}catch(_){ }
    }

    library.folders.forEach((folder,index)=>{
      const box=document.createElement('section');
      box.className='folder-block direct-folder-block';
      box.dataset.folderId=folder.id;

      const plans=library.plans.filter(p=>p.folderId===folder.id).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
      const head=document.createElement('div');
      head.className='folder-title direct-folder-head';
      head.draggable=true;
      head.innerHTML=`<div class="direct-folder-title"><span class="direct-folder-drag" aria-hidden="true">⋮⋮</span><div class="direct-folder-name"><strong>${escapeHtml(folder.name)}</strong><small>${plans.length} plan${plans.length>1?'s':''}</small></div></div><div class="direct-folder-actions"><button type="button" data-folder-act="up" title="Monter le dossier" aria-label="Monter le dossier" ${index===0?'disabled':''}>↑</button><button type="button" data-folder-act="down" title="Descendre le dossier" aria-label="Descendre le dossier" ${index===library.folders.length-1?'disabled':''}>↓</button><button type="button" data-folder-act="rename" title="Renommer le dossier" aria-label="Renommer le dossier">✎</button><button type="button" class="direct-folder-delete" data-folder-act="delete" title="Supprimer le dossier" aria-label="Supprimer le dossier"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg></button></div>`;
      box.appendChild(head);

      head.querySelector('[data-folder-act="up"]').onclick=e=>{e.stopPropagation();moveFolderBy(folder.id,-1)};
      head.querySelector('[data-folder-act="down"]').onclick=e=>{e.stopPropagation();moveFolderBy(folder.id,1)};
      head.querySelector('[data-folder-act="rename"]').onclick=e=>{e.stopPropagation();renameFolder(folder.id)};
      head.querySelector('[data-folder-act="delete"]').onclick=e=>{e.stopPropagation();deleteFolder(folder.id)};

      head.addEventListener('dragstart',e=>{
        if(e.target.closest('button')){e.preventDefault();return}
        draggedPlanId=null;
        draggedFolderId=folder.id;
        box.classList.add('folder-dragging');
        try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/x-bos-folder',folder.id)}catch(_){ }
      });
      head.addEventListener('dragend',()=>{
        draggedFolderId=null;
        box.classList.remove('folder-dragging');
        clearDropTargets();
      });

      box.addEventListener('dragover',e=>{
        if(!draggedPlanId&&!draggedFolderId)return;
        e.preventDefault();
        try{e.dataTransfer.dropEffect='move'}catch(_){ }
        box.classList.add('folder-drop-target');
      });
      box.addEventListener('dragleave',e=>{
        if(!box.contains(e.relatedTarget))box.classList.remove('folder-drop-target');
      });
      box.addEventListener('drop',e=>{
        e.preventDefault();
        e.stopPropagation();
        box.classList.remove('folder-drop-target');
        if(draggedPlanId){
          const id=draggedPlanId;draggedPlanId=null;movePlanToFolder(id,folder.id);return;
        }
        if(draggedFolderId){
          const id=draggedFolderId;draggedFolderId=null;
          const rect=box.getBoundingClientRect();
          const after=e.clientY>rect.top+rect.height/2;
          moveFolderNear(id,folder.id,after);
        }
      });

      if(!plans.length){
        const empty=document.createElement('div');
        empty.className='folder-empty';
        empty.textContent='Aucun plan dans ce dossier. Glisse un plan ici pour le ranger.';
        box.appendChild(empty);
      }else{
        plans.forEach(rec=>box.appendChild(makePlanRow(rec)));
      }
      target.appendChild(box);
    });

    if(!library.plans.length){
      const empty=document.createElement('div');
      empty.className='direct-library-empty';
      empty.textContent='Aucun plan enregistré pour le moment.';
      target.appendChild(empty);
    }
  }

  if(coreBuildLibraryInto){
    buildLibraryInto=function(target){
      if(target&&target.id==='inlinePlanLibraryList')return renderDirectLibrary(target);
      return coreBuildLibraryInto(target);
    };
  }

  function init(){
    ensureDirectShell();
    /* Si l’ancienne bulle 05 avait été repliée, on neutralise cet état définitivement. */
    const card=inlineTarget.closest('.inline-library-card');
    card?.classList.remove('ui-collapsed');
    try{localStorage.removeItem('bos-plan-ui-collapse:library')}catch(_){ }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
