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
    dialog.querySelector('.bos-install-actions button')?.addEventListener('click',()=>dialog.close());
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

    installBtn.addEventListener('click',async()=>{
      if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        try{await deferredInstallPrompt.userChoice}catch(_){ }
        deferredInstallPrompt=null;
        return;
      }

      const dialog=makeDialog();
      const helpText=dialog.querySelector('#bosPlanInstallHelpText');
      const helpBody=dialog.querySelector('#bosPlanInstallHelpBody');
      if(helpText)helpText.textContent=isIOS()?'Installation sur iPhone / iPad':'Installation depuis votre navigateur';
      if(helpBody){
        helpBody.innerHTML=isIOS()
          ?'<p><strong>Safari :</strong> touchez <strong>Partager</strong>, puis <strong>Ajouter à l’écran d’accueil</strong>.</p>'
          :'<p>Ouvrez le menu du navigateur puis choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p>';
      }
      dialog.showModal();
    });

    updateInstall();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
