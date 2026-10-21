(function(){
  'use strict';

  const INSTALLED_KEY='bos-plan-installed-v1';
  let deferredInstallPrompt=null;

  function standalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches===true || window.navigator.standalone===true;
  }

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  }

  function isAndroid(){
    return /android/i.test(navigator.userAgent);
  }

  function isIOSChrome(){
    return isIOS() && /crios/i.test(navigator.userAgent);
  }

  function makeDialog(){
    let dialog=document.getElementById('bosPlanInstallDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='bosPlanInstallDialog';
    dialog.innerHTML=`
      <div class="bos-install-inner">
        <div class="bos-install-head">
          <div><strong>Installer PLAN</strong><small id="bosPlanInstallHelpText">Ajoutez l’application à votre écran d’accueil.</small></div>
          <button class="bos-install-close" type="button" aria-label="Fermer">×</button>
        </div>
        <div class="bos-install-help" id="bosPlanInstallHelpBody"></div>
        <div class="bos-install-actions"><button type="button">Compris</button></div>
      </div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('.bos-install-close')?.addEventListener('click',()=>dialog.close());
    return dialog;
  }

  function setup(){
    const shell=document.querySelector('.app-shell');
    const topbar=shell?.querySelector('.topbar');
    const oldBtn=document.getElementById('installAppBtn');
    if(!shell||!topbar||!oldBtn)return;

    /* Le bouton PLAN existant est remplacé par son clone afin d'enlever uniquement
       l'ancien gestionnaire d'installation. Tous les autres éléments restent intacts. */
    const installBtn=oldBtn.cloneNode(true);
    installBtn.innerHTML='INSTALLER L’APPLICATION <span aria-hidden="true">→</span>';
    oldBtn.replaceWith(installBtn);

    let installRow=document.getElementById('installAppRow');
    if(!installRow){
      installRow=document.createElement('section');
      installRow.className='install-app-row';
      installRow.id='installAppRow';
      installRow.hidden=true;
      installRow.setAttribute('aria-label','Installer PLAN');
      shell.insertBefore(installRow,topbar);
    }
    installRow.appendChild(installBtn);

    window.addEventListener('beforeinstallprompt',event=>{
      event.preventDefault();
      deferredInstallPrompt=event;
      if(installRow&&!standalone())installRow.hidden=false;
    });

    window.addEventListener('appinstalled',()=>{
      try{localStorage.setItem(INSTALLED_KEY,'1')}catch(_){ }
      installRow.hidden=true;
      deferredInstallPrompt=null;
    });

    function updateInstall(){
      if(standalone()){
        try{localStorage.setItem(INSTALLED_KEY,'1')}catch(_){ }
        installRow.hidden=true;
        return;
      }
      let installed=false;
      try{installed=localStorage.getItem(INSTALLED_KEY)==='1'}catch(_){ }
      installRow.hidden=installed;
    }

    installBtn.addEventListener('click',()=>{
      const dialog=makeDialog();
      const helpText=dialog.querySelector('#bosPlanInstallHelpText');
      const helpBody=dialog.querySelector('#bosPlanInstallHelpBody');
      const actionBtn=dialog.querySelector('.bos-install-actions button');

      if(isIOSChrome()){
        if(helpText)helpText.textContent='Installation sur iPhone / iPad · Chrome';
        if(helpBody)helpBody.innerHTML=`
          <p><strong>1.</strong> Restez dans <strong>Chrome</strong> : il n’est pas nécessaire d’ouvrir Safari.</p>
          <p><strong>2.</strong> Touchez le bouton <strong>Partager</strong> <span aria-hidden="true">↑</span> à droite de la barre d’adresse.</p>
          <p><strong>3.</strong> Choisissez <strong>Ajouter à l’écran d’accueil</strong>.</p>
          <p><strong>4.</strong> Vérifiez le nom puis touchez <strong>Ajouter</strong>.</p>`;
        if(actionBtn){
          actionBtn.textContent='Compris';
          actionBtn.onclick=()=>dialog.close();
        }
      }else if(isIOS()){
        if(helpText)helpText.textContent='Installation sur iPhone / iPad · Safari';
        if(helpBody)helpBody.innerHTML=`
          <p><strong>1.</strong> Dans <strong>Safari</strong>, touchez le bouton <strong>Partager</strong> <span aria-hidden="true">↑</span>.</p>
          <p><strong>2.</strong> Faites défiler puis choisissez <strong>Ajouter à l’écran d’accueil</strong>.</p>
          <p><strong>3.</strong> Vérifiez le nom puis touchez <strong>Ajouter</strong>.</p>
          <p style="margin-top:10px"><strong>Si cette page est ouverte depuis Instagram, Gmail, Messenger ou une autre application :</strong> ouvrez-la d’abord dans Safari ou Chrome.</p>`;
        if(actionBtn){
          actionBtn.textContent='Compris';
          actionBtn.onclick=()=>dialog.close();
        }
      }else if(isAndroid()){
        if(helpText)helpText.textContent='Installation sur Android';
        if(helpBody)helpBody.innerHTML=`
          <p><strong>1.</strong> Ouvrez PLAN dans <strong>Chrome</strong>.</p>
          <p><strong>2.</strong> Touchez le menu <strong>⋮</strong> en haut à droite.</p>
          <p><strong>3.</strong> Choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p>
          <p><strong>4.</strong> Confirmez avec <strong>Installer</strong>.</p>`;
        if(actionBtn){
          if(deferredInstallPrompt){
            actionBtn.textContent='Installer maintenant';
            actionBtn.onclick=async()=>{
              dialog.close();
              deferredInstallPrompt.prompt();
              try{await deferredInstallPrompt.userChoice}catch(_){ }
              deferredInstallPrompt=null;
            };
          }else{
            actionBtn.textContent='Compris';
            actionBtn.onclick=()=>dialog.close();
          }
        }
      }else{
        if(helpText)helpText.textContent='Installation depuis votre navigateur';
        if(helpBody)helpBody.innerHTML=`
          <p><strong>Chrome / Edge :</strong> ouvrez le menu du navigateur puis choisissez <strong>Installer l’application</strong>.</p>
          <p>Si cette option n’apparaît pas, cherchez <strong>Ajouter à l’écran d’accueil</strong> dans le menu du navigateur.</p>`;
        if(actionBtn){
          if(deferredInstallPrompt){
            actionBtn.textContent='Installer maintenant';
            actionBtn.onclick=async()=>{
              dialog.close();
              deferredInstallPrompt.prompt();
              try{await deferredInstallPrompt.userChoice}catch(_){ }
              deferredInstallPrompt=null;
            };
          }else{
            actionBtn.textContent='Compris';
            actionBtn.onclick=()=>dialog.close();
          }
        }
      }

      dialog.showModal();
    });

    updateInstall();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
