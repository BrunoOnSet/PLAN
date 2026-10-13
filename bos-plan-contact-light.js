(function(){
  'use strict';

  function ensureProjectDialog(){
    let dialog=document.getElementById('projectDialog');
    if(dialog)return dialog;

    dialog=document.createElement('dialog');
    dialog.id='projectDialog';
    dialog.className='sheet project-sheet';
    dialog.innerHTML=`
      <form method="dialog" class="sheet-inner project-sheet-inner">
        <div class="project-sheet-head">
          <div><span class="project-kicker">BRUNO ONSET</span></div>
          <button class="project-close" value="close" aria-label="Fermer">×</button>
        </div>
        <div class="project-actions">
          <a class="project-email-btn" href="mailto:brunoguillardcontact@gmail.com?subject=Projet%20de%20tournage%20%E2%80%94%20Bruno%20OnSet&body=Bonjour%20Bruno%2C%0A%0AJe%20vous%20contacte%20depuis%20Bruno%20OnSet.%0A%0A">Écrire à Bruno <span aria-hidden="true">→</span></a>
          <div class="project-secondary-links">
            <a class="project-secondary-link" href="https://wa.me/33679979111?text=Bonjour%20Bruno%2C%0A%0AJe%20vous%20contacte%20depuis%20Bruno%20OnSet.%0A%0A" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <span aria-hidden="true">·</span>
            <a class="project-secondary-link" href="https://brunoguillard.com" target="_blank" rel="noopener noreferrer">BrunoGuillard.com</a>
          </div>
        </div>
      </form>`;
    document.body.appendChild(dialog);
    return dialog;
  }

  function init(){
    /* Bulle 02 : on garde uniquement le reste du sous-titre demandé. */
    const planSubtitle=document.querySelector('.stage-card .heading-copy p');
    if(planSubtitle)planSubtitle.textContent='déplacer et orienter directement les éléments';

    /* Même comportement que LIGHT : ouvre la fiche de contact Bruno OnSet. */
    const projectBtn=document.getElementById('projectContactBtn');
    if(projectBtn){
      projectBtn.addEventListener('click',event=>{
        event.preventDefault();
        event.stopImmediatePropagation();
        ensureProjectDialog().showModal();
      },true);
    }

    /* Même comportement que LIGHT : ouvre directement un e-mail de suggestion. */
    const ideaBtn=document.getElementById('improveAppBtn');
    if(ideaBtn){
      ideaBtn.addEventListener('click',event=>{
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href='mailto:brunoguillardcontact@gmail.com?subject=Suggestion%20%E2%80%94%20BOS%20PLAN&body=Bonjour%20Bruno%2C%0A%0AJ%E2%80%99ai%20une%20id%C3%A9e%20pour%20am%C3%A9liorer%20BOS%20PLAN%20%3A%0A%0A';
      },true);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

/* Charge uniquement la zone cliquable complète des entêtes 02/03/04.
   Aucun changement de structure, de style ou de contenu. */
(function(){
  if(document.querySelector('script[data-bos-plan-bubble-full-click]'))return;
  const s=document.createElement('script');
  s.src='bos-plan-bubble-full-click.js?v=20261013-1';
  s.async=false;
  s.dataset.bosPlanBubbleFullClick='1';
  document.body.appendChild(s);
})();

/* Correctifs isolés du canevas : bord bas, échelle, lisibilité faisceaux en LIGHT. */
(function(){
  if(document.querySelector('script[data-bos-plan-stage-visual-fix]'))return;
  const s=document.createElement('script');
  s.src='bos-plan-stage-visual-fix.js?v=20261013-1';
  s.async=false;
  s.dataset.bosPlanStageVisualFix='1';
  document.body.appendChild(s);
})();
