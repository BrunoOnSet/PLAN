(function(){
  'use strict';

  function bindWholeHeader(head, toggle){
    if(!head || !toggle || head.dataset.wholeBubbleClick==='1') return;
    head.dataset.wholeBubbleClick='1';
    head.addEventListener('click', function(e){
      if(e.target.closest('button,a,input,select,textarea,label')) return;
      toggle.click();
    });
  }

  function init(){
    bindWholeHeader(
      document.querySelector('.stage-card .stage-title-head, .stage-card .stage-head'),
      document.querySelector('.stage-card .bos-bubble-collapse')
    );

    bindWholeHeader(
      document.querySelector('#inspector .inspector-title-head, #inspector .inspector-head'),
      document.querySelector('#inspector .inspector-collapse-proxy') || document.getElementById('toggleInspectorBtn')
    );

    bindWholeHeader(
      document.querySelector('.camera-preview .preview-head'),
      document.querySelector('.camera-preview .bos-bubble-collapse')
    );
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
