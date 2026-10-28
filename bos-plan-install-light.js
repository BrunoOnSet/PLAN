(function(){
  'use strict';

  const INSTALLED_KEY='bos-plan-installed-v1';
  const shell=document.querySelector('.app-shell');
  const topbar=shell?.querySelector('.topbar');
  const oldBtn=document.getElementById('installAppBtn');
  let deferredInstallPrompt=null;

  function standalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches===true || window.navigator.standalone===true;
  }

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  }

  if(!shell||!topbar||!oldBtn)return;

  /* Comme dans LIGHT : le bouton d'installation vit dans sa propre ligne,
     au-dessus de l'entête. Le clone retire uniquement l'ancien gestionnaire PLAN. */
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

  /* Copie de la logique LIGHT : on conserve l'événement natif d'installation
     pour pouvoir l'ouvrir directement au clic de l'utilisateur. */
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    if(installRow&&!standalone())installRow.hidden=false;
  });

  window.addEventListener('appinstalled',()=>{
    try{localStorage.setItem(INSTALLED_KEY,'1')}catch(_){}
    if(installRow)installRow.hidden=true;
    deferredInstallPrompt=null;
  });

  function updateInstall(){
    if(standalone()){
      try{localStorage.setItem(INSTALLED_KEY,'1')}catch(_){}
      installRow.hidden=true;
      return;
    }
    let installed=false;
    try{installed=localStorage.getItem(INSTALLED_KEY)==='1'}catch(_){}
    installRow.hidden=installed;
  }

  installBtn.addEventListener('click',async()=>{
    /* Sur Android / Chrome et navigateurs compatibles :
       UN clic sur le bouton PLAN ouvre directement la fenêtre native,
       exactement comme LIGHT. */
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      try{await deferredInstallPrompt.userChoice}catch(_){}
      deferredInstallPrompt=null;
      return;
    }

    /* Même secours que LIGHT lorsque le navigateur ne fournit pas
       beforeinstallprompt (notamment iPhone/iPad). */
    if(isIOS()){
      alert('Pour installer l’application, utilise le bouton Partager puis « Ajouter à l’écran d’accueil ».');
    }else{
      alert('Pour installer l’application, utilise le menu de ton navigateur puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».');
    }
  });

  updateInstall();
})();