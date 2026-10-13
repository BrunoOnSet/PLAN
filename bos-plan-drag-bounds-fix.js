/* PLAN — correctif ciblé de la limite basse de déplacement.
   Ne modifie ni la géométrie de l'interface, ni les bulles, ni les autres contrôles.
   Le cœur limite encore Y à 585 px ; cette extension remplace uniquement cette
   limite basse fixe par la hauteur réelle du plan courant. */
(function(){
  'use strict';

  if(typeof stage==='undefined' || !stage) return;

  stage.addEventListener('pointermove',function(e){
    try{
      if(typeof drag==='undefined' || !drag || drag.mode!=='move') return;
      if(typeof state==='undefined' || !state || !Array.isArray(state.objects)) return;
      if(typeof pointerToStage!=='function' || typeof stageH!=='function') return;

      const o=state.objects.find(x=>x.id===drag.id);
      if(!o) return;

      const p=pointerToStage(e);
      const rawY=p.y-drag.dy;
      const snappedY=(typeof snapValue==='function') ? snapValue(rawY) : rawY;
      const maxY=Math.max(35,stageH()-35);
      const wantedY=Math.max(35,Math.min(maxY,snappedY));

      /* L'ancien gestionnaire a déjà traité le mouvement. On ne réécrit que Y
         lorsque sa valeur doit dépasser l'ancienne limite fixe ou être ramenée
         dans un plan plus court. */
      if(Math.abs(o.y-wantedY)>.001){
        o.y=wantedY;
        if(typeof renderCanvas==='function') renderCanvas();
      }
    }catch(_){ }
  });
})();
