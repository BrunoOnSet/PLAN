(function(){
  'use strict';

  /* Correctifs strictement limités au plan :
     - remet une marge basse au canevas pour que son bord ne soit plus rogné ;
     - masque l'échelle SVG blanche jugée instable ;
     - renforce uniquement la lisibilité des faisceaux en thème clair. */
  const style=document.createElement('style');
  style.textContent=`
    .stage-card:not(.ui-collapsed) > .stage-wrap{margin-bottom:14px!important}
    .scale-overlay-group{display:none!important}
  `;
  document.head.appendChild(style);

  const layer=document.getElementById('beamsLayer');
  if(!layer)return;

  function restore(beam){
    if(beam.dataset.bosBeamPrepared!=='1')return;
    const fill=beam.dataset.bosBeamOriginalFill||'';
    const stroke=beam.dataset.bosBeamOriginalStroke||'';
    const sw=beam.dataset.bosBeamOriginalStrokeWidth||'';
    if(fill)beam.style.fill=fill;else beam.style.removeProperty('fill');
    if(stroke)beam.style.stroke=stroke;else beam.style.removeProperty('stroke');
    if(sw)beam.style.strokeWidth=sw;else beam.style.removeProperty('stroke-width');
  }

  function prepare(beam){
    if(beam.dataset.bosBeamPrepared==='1')return;
    beam.dataset.bosBeamPrepared='1';
    beam.dataset.bosBeamOriginalFill=beam.style.fill||'';
    beam.dataset.bosBeamOriginalStroke=beam.style.stroke||'';
    beam.dataset.bosBeamOriginalStrokeWidth=beam.style.strokeWidth||'';
  }

  function strengthen(beam){
    prepare(beam);
    if(document.body.classList.contains('dark')){
      restore(beam);
      return;
    }

    const originalFill=beam.dataset.bosBeamOriginalFill||beam.style.fill||'';
    let m=originalFill.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[\d.]+\s*\)/i);
    if(m){
      const r=Number(m[1]),g=Number(m[2]),b=Number(m[3]);
      beam.style.fill=`rgba(${r},${g},${b},0.26)`;
      beam.style.stroke=`rgba(${Math.round(r*.62)},${Math.round(g*.62)},${Math.round(b*.62)},0.80)`;
      beam.style.strokeWidth='2.4';
      return;
    }

    m=originalFill.match(/hsla\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*[\d.]+\s*\)/i);
    if(m){
      const h=Number(m[1]),s=Number(m[2]);
      beam.style.fill=`hsla(${h},${s}%,50%,0.26)`;
      beam.style.stroke=`hsla(${h},${Math.max(42,s)}%,36%,0.82)`;
      beam.style.strokeWidth='2.4';
    }
  }

  function sync(){
    layer.querySelectorAll('.beam').forEach(strengthen);
  }

  const layerObserver=new MutationObserver(sync);
  layerObserver.observe(layer,{childList:true});
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  sync();
})();
