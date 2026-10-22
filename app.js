const APP_VERSION='V1.60';
const NS='http://www.w3.org/2000/svg';
const stage=document.getElementById('stage');
const beamsLayer=document.getElementById('beamsLayer');
const objectsLayer=document.getElementById('objectsLayer');
const inspector=document.getElementById('inspector');
const inspectorBody=document.getElementById('inspectorBody');
const toggleInspectorBtn=document.getElementById('toggleInspectorBtn');
const inspectorToggleLabel=document.getElementById('inspectorToggleLabel');
const inspectorEmpty=document.getElementById('inspectorEmpty');
const inspectorFields=document.getElementById('inspectorFields');
const selectionHint=document.getElementById('selectionHint');
const changeFixtureHeader=document.getElementById('changeFixtureHeader');
const cameraReadout=document.getElementById('cameraReadout');
const cameraMonitors=document.getElementById('cameraMonitors');
const previewTabs=document.getElementById('previewTabs');
const addDialog=document.getElementById('addDialog');
const addKinds=document.getElementById('addKinds');
const lightChooser=document.getElementById('lightChooser');
const cameraChooser=document.getElementById('cameraChooser');
const cameraBrandChoices=document.getElementById('cameraBrandChoices');
const cameraModelChoice=document.getElementById('cameraModelChoice');
const confirmCameraChoiceBtn=document.getElementById('confirmCameraChoiceBtn');
const simpleChooser=document.getElementById('simpleChooser');
const dialogTitle=document.getElementById('dialogTitle');
const brandChoices=document.getElementById('brandChoices');
const familyChoices=document.getElementById('familyChoices');
const modelChoices=document.getElementById('modelChoices');
const favoriteChoices=document.getElementById('favoriteChoices');
const catalogCount=document.getElementById('catalogCount');
const simpleGrid=document.getElementById('simpleGrid');
const simpleLabel=document.getElementById('simpleLabel');
const toggleSnapBtn=document.getElementById('toggleSnapBtn');
const labelsModeSelect=document.getElementById('labelsModeSelect');
const toggleBeamsBtn=document.getElementById('toggleBeamsBtn');
const gridOpacityRange=document.getElementById('gridOpacityRange');
const gridOpacityValue=document.getElementById('gridOpacityValue');
const planLengthRange=document.getElementById('planLengthRange');
const planLengthValue=document.getElementById('planLengthValue');
const currentPlanBadge=document.getElementById('currentPlanBadge');
const libraryDialog=document.getElementById('libraryDialog');
const planNameInput=document.getElementById('planNameInput');
const topPlanNameInput=document.getElementById('topPlanNameInput');
const folderSelect=document.getElementById('folderSelect');
const planLibraryList=document.getElementById('planLibraryList');
const inlinePlanLibraryList=document.getElementById('inlinePlanLibraryList');
const planTabBtn=document.getElementById('planTabBtn');
const plansTabBtn=document.getElementById('plansTabBtn');
const planView=document.getElementById('planView');
const plansView=document.getElementById('plansView');
const shareProjectBtn=document.getElementById('shareProjectBtn');
const importProjectBtn=document.getElementById('importProjectBtn');
const exportMenuBtn=document.getElementById('exportMenuBtn');
const exportPopover=document.getElementById('exportPopover');
const exportBtn=document.getElementById('exportBtn');
const equipmentListBtn=document.getElementById('equipmentListBtn');
const equipmentDialog=document.getElementById('equipmentDialog');
const equipmentCategories=document.getElementById('equipmentCategories');
const equipmentProduction=document.getElementById('equipmentProduction');
const equipmentContacts=document.getElementById('equipmentContacts');
const equipmentNotes=document.getElementById('equipmentNotes');
const equipmentAddTabs=document.getElementById('equipmentAddTabs');
const equipmentAddCatalog=document.getElementById('equipmentAddCatalog');
const equipmentPrintArea=document.getElementById('equipmentPrintArea');
const importProjectInput=document.getElementById('importProjectInput');
const stageWrap=document.getElementById('stageWrap');
const stageCard=stageWrap?.closest('.stage-card');
const stageWidthToggle=document.getElementById('stageWidthToggle');
const stageHandModeBtn=document.getElementById('stageHandModeBtn');
const stageLassoModeBtn=document.getElementById('stageLassoModeBtn');
const stageBeamsBtn=document.getElementById('stageBeamsBtn');
const stageInfosBtn=document.getElementById('stageInfosBtn');
let stageInteractionMode='hand';
let lastVisibleLabelsMode='full';
const STAGE_WIDE_KEY='bos-plan-stage-wide-v1';
const zoomReadout=document.getElementById('zoomReadout');
const zoomOutBtn=document.getElementById('zoomOutBtn');
const zoomInBtn=document.getElementById('zoomInBtn');
const planLengthMinusBtn=document.getElementById('planLengthMinusBtn');
const planLengthPlusBtn=document.getElementById('planLengthPlusBtn');
const planLengthQuickValue=document.getElementById('planLengthQuickValue');
const quickControls=document.getElementById('quickControls');
let quickControlsDrag=null;

function setStageInteractionMode(mode){
  stageInteractionMode=mode==='lasso'?'lasso':'hand';
  if(stageHandModeBtn){
    const on=stageInteractionMode==='hand';
    stageHandModeBtn.classList.toggle('active',on);
    stageHandModeBtn.setAttribute('aria-pressed',String(on));
  }
  if(stageLassoModeBtn){
    const on=stageInteractionMode==='lasso';
    stageLassoModeBtn.classList.toggle('active',on);
    stageLassoModeBtn.setAttribute('aria-pressed',String(on));
  }
  stage?.classList.toggle('lasso-mode',stageInteractionMode==='lasso');
  stage?.classList.toggle('hand-mode',stageInteractionMode==='hand');
}
stageHandModeBtn?.addEventListener('click',()=>setStageInteractionMode('hand'));
stageLassoModeBtn?.addEventListener('click',()=>setStageInteractionMode('lasso'));

function setStageWide(on){
  const wide=!!on&&window.innerWidth>=1000;
  stageCard?.classList.toggle('stage-wide',wide);
  if(stageWidthToggle){
    stageWidthToggle.setAttribute('aria-pressed',String(wide));
    stageWidthToggle.textContent=wide?'Réduire':'Élargir';
    stageWidthToggle.title=wide?'Revenir à la largeur normale':'Élargir le plan';
  }
  try{localStorage.setItem(STAGE_WIDE_KEY,wide?'1':'0')}catch(_){}
}
if(stageWidthToggle)stageWidthToggle.addEventListener('click',()=>setStageWide(!stageCard?.classList.contains('stage-wide')));

function clampQuickControlsPosition(left,top){
  if(!quickControls)return {left,top};
  const card=quickControls.getBoundingClientRect();
  const pad=8;
  return {
    left:clamp(left,pad,Math.max(pad,window.innerWidth-card.width-pad)),
    top:clamp(top,pad,Math.max(pad,window.innerHeight-card.height-pad))
  };
}

function beginQuickControlsDrag(e){
  if(!quickControls||quickControls.hidden)return;
  const handle=e.target.closest?.('.quick-control-head');
  if(!handle||!quickControls.contains(handle))return;
  if(e.button!==undefined&&e.button!==0&&e.pointerType==='mouse')return;

  const card=quickControls.getBoundingClientRect();
  quickControlsDrag={
    pointerId:e.pointerId,
    dx:e.clientX-card.left,
    dy:e.clientY-card.top
  };

  if(quickControls.parentElement!==document.body)document.body.appendChild(quickControls);
  quickControls.style.position='fixed';
  quickControls.style.right='auto';
  quickControls.style.bottom='auto';
  quickControls.style.left=`${card.left}px`;
  quickControls.style.top=`${card.top}px`;
  quickControls.style.zIndex='1000';
  quickControls.classList.add('is-dragging');
  document.documentElement.classList.add('quick-controls-drag-active');
  try{quickControls.setPointerCapture?.(e.pointerId)}catch(_){}
  e.preventDefault();
  e.stopPropagation();
}

function moveQuickControlsDrag(e){
  if(!quickControlsDrag||quickControlsDrag.pointerId!==e.pointerId)return;
  const pos=clampQuickControlsPosition(
    e.clientX-quickControlsDrag.dx,
    e.clientY-quickControlsDrag.dy
  );
  quickControls.style.left=`${pos.left}px`;
  quickControls.style.top=`${pos.top}px`;
  e.preventDefault();
}

function endQuickControlsDrag(e){
  if(!quickControlsDrag||quickControlsDrag.pointerId!==e.pointerId)return;
  try{quickControls.releasePointerCapture?.(e.pointerId)}catch(_){}
  quickControlsDrag=null;
  quickControls.classList.remove('is-dragging');
  document.documentElement.classList.remove('quick-controls-drag-active');
}

if(quickControls){
  quickControls.addEventListener('pointerdown',beginQuickControlsDrag);
  window.addEventListener('pointermove',moveQuickControlsDrag,{passive:false});
  window.addEventListener('pointerup',endQuickControlsDrag);
  window.addEventListener('pointercancel',endQuickControlsDrag);
}

const CAMERA_DB_URL="https://raw.githubusercontent.com/BrunoSetTools/BOS-CAMERA-DB/main/cameras.json";
const CAMERA_DB_CACHE_KEY="bos-camera-db-cache-v2";
const FALLBACK_CAMERA_DB={"schemaVersion":1,"databaseVersion":"1.2","updated":"2026-08-18","cameras":[{"id":"fx30","name":"Sony FX30","brand":"Sony","group":"SONY","sensorWidthMm":23.3,"dof":{"label":"Super 35 / APS-C","cocMm":0.019,"cropToFF":1.5},"media":{"label":"FX30","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}},"exposure":{"unit":"ISO","defaultProfile":"slog3","profiles":{"slog3":{"label":"S-Log3 / Cine EI","baseValues":[800,2500],"defaultValue":800,"baseType":"dualBaseISO","gain":{"type":"cameraSpecific"},"sources":["https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000888939.html"]},"scinetone":{"label":"S-Cinetone","baseValues":[],"defaultValue":null,"baseType":"notPublished","gain":{"type":"cameraSpecific"},"note":"Sony ne publie pas de Base ISO Cine EI pour S-Cinetone ; ne pas surligner un ISO natif par déduction.","sources":["https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000876510.html"]}}}},{"id":"fx3","name":"Sony FX3","brand":"Sony","group":"SONY","sensorWidthMm":35.6,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX3","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}},"exposure":{"unit":"ISO","defaultProfile":"slog3","profiles":{"slog3":{"label":"S-Log3 / Cine EI","baseValues":[800,12800],"defaultValue":800,"baseType":"dualBaseISO","gain":{"type":"cameraSpecific"},"sources":["https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000888939.html"]},"scinetone":{"label":"S-Cinetone","baseValues":[],"defaultValue":null,"baseType":"notPublished","gain":{"type":"cameraSpecific"},"note":"Ne pas déduire les Base ISO S-Log3 pour S-Cinetone.","sources":["https://www.sony.fr/electronics/appareils-photo-a-objectifs-interchangeables/ilme-fx3a"]}}}},{"id":"fx5","name":"Sony FX5","brand":"Sony","group":"SONY","sensorWidthMm":35.9,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX5","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S-L 422":{"kind":"fixed","rates":{"25":140,"50":200,"100":280,"23.98":100,"29.97":140,"59.94":200,"119.88":280},"note":"Long GOP · 4:2:2 10 bit"},"XAVC HS-L 422":{"kind":"fixed","rates":{"50":200,"100":280,"23.98":100,"59.94":200,"119.88":280},"note":"HEVC Long GOP · 4:2:2 10 bit"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC S-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC S-L 422":{"kind":"fixed","rates":{"25":50,"50":50,"100":100,"23.98":50,"29.97":50,"59.94":50,"119.88":100},"note":"Long GOP · preset 4:2:2 10 bit / débit haut"}}}}},"exposure":{"unit":"ISO","defaultProfile":"slog3","profiles":{"slog3":{"label":"S-Log3 / Cine EI / Flexible ISO","baseValues":[800,4000,12800],"defaultValue":800,"baseType":"multiBaseISO","gain":{"type":"cameraSpecific"},"specialModes":[{"id":"iso800DualGain","label":"ISO 800 (Dual Gain)","value":800,"type":"dualGain"}],"sources":["https://helpguide.sony.net/ilc/2630/v1/en/contents/base_iso.html"]},"scinetone":{"label":"S-Cinetone","baseValues":[],"defaultValue":null,"baseType":"notPublished","gain":{"type":"cameraSpecific"},"note":"S-Cinetone est disponible en mode Custom ; les valeurs Base ISO du mode Log ne doivent pas être transposées automatiquement.","sources":["https://helpguide.sony.net/ilc/2630/v1/en/contents/paint_look.html"]}}}},{"id":"fx6","name":"Sony FX6","brand":"Sony","group":"SONY","sensorWidthMm":35.6,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0},"media":{"label":"FX6","modes":{"DCI 4K":{"width":4096,"height":2160,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"}}},"UHD 4K":{"width":3840,"height":2160,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"24":240,"25":250,"50":500,"23.98":240,"29.97":300,"59.94":600},"note":"All-Intra · 4:2:2 10 bit"},"XAVC-L":{"kind":"fixed","rates":{"25":100,"50":150,"23.98":100,"29.97":100,"59.94":150},"note":"Long GOP · VBR"}}},"HD":{"width":1920,"height":1080,"codecs":{"XAVC-I":{"kind":"fixed","rates":{"25":93,"50":185,"23.98":89,"29.97":111,"59.94":222},"note":"All-Intra · 4:2:2 10 bit"},"XAVC-L 50":{"kind":"fixed","rates":{"25":50,"50":50,"23.98":50,"29.97":50,"59.94":50},"note":"Long GOP · VBR · 50 Mb/s max"},"XAVC-L 35":{"kind":"fixed","rates":{"25":35,"50":35,"23.98":35,"29.97":35,"59.94":35},"note":"Long GOP · VBR · 35 Mb/s max"}}}}},"exposure":{"unit":"ISO","defaultProfile":"slog3","profiles":{"slog3":{"label":"S-Log3 / Cine EI","baseValues":[800,12800],"defaultValue":800,"baseType":"dualBaseISO","gain":{"type":"cameraSpecific"},"sources":["https://pro.sony/bp_BR/products/handheld-camcorders/ilme-fx6"]},"scinetone":{"label":"S-Cinetone","baseValues":[],"defaultValue":null,"baseType":"notPublished","gain":{"type":"cameraSpecific"},"note":"Le second Base ISO 12 800 est documenté par Sony pour S-Log3 ; ne pas le transposer à S-Cinetone sans source dédiée.","sources":["https://pro.sony/en_GB/filmmaking/filmmaking-stories/ilme-fx6-wilderness-bts"]}}}},{"id":"vraptor","name":"RED V-RAPTOR VV","brand":"RED","group":"ARRI / RED","sensorWidthMm":40.96,"dof":{"label":"Vista Vision","cocMm":0.033,"cropToFF":0.88},"exposure":{"unit":"ISO","defaultProfile":"ipp2","profiles":{"ipp2":{"label":"IPP2 / Log3G10","baseValues":[],"referenceValues":[800],"defaultValue":800,"baseType":"referenceOnly","isoRange":[250,12800],"gain":{"type":"metadata"},"note":"RED décrit ISO 800 comme valeur ISO par défaut et point de départ recommandé. L’ISO R3D est un réglage de monitoring/métadonnée ajustable en post, pas un Dual Native ISO.","sources":["https://docs.red.com/955-0199/955-0199_V1.3_Rev-B_RED_PS_V-RAPTOR_8K_VV_Operation_Guide/Content/4_Menus/a_Image_LUT/02_ISO.htm"]}}}},{"id":"miniLF","name":"ARRI ALEXA Mini LF","brand":"ARRI","group":"ARRI / RED","sensorWidthMm":36.7,"dof":{"label":"Large Format","cocMm":0.03,"cropToFF":0.98},"media":{"label":"ALEXA Mini LF","modes":{"4.5K Open Gate":{"width":4448,"height":3096,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","40"]},"UHD":{"width":3840,"height":2160,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60"]},"HD":{"width":1920,"height":1080,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","75","90"]}}},"exposure":{"unit":"EI","defaultProfile":"logc3","profiles":{"logc3":{"label":"ARRI Log C3","baseValues":[800],"defaultValue":800,"baseType":"baseSensitivity","eiRange":[160,3200],"gain":{"type":"ei"},"sources":["https://www.arri.com/en/cine-systems/cine-cameras/alexa-mini-lf"]}}}},{"id":"alexa35","name":"ARRI ALEXA 35","brand":"ARRI","group":"ARRI / RED","sensorWidthMm":27.99,"dof":{"label":"Super 35","cocMm":0.023,"cropToFF":1.29},"media":{"label":"ALEXA 35","modes":{"4.6K Open Gate":{"width":4608,"height":3164,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60"]},"4K 16:9":{"width":4096,"height":2304,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","75","100"]},"UHD":{"width":3840,"height":2160,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","100","120"]},"HD":{"width":1920,"height":1080,"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 4444":{"kind":"prores","target1080":330,"note":"ProRes · débit cible VBR"},"ProRes 4444 XQ":{"kind":"prores","target1080":500,"note":"ProRes · débit cible VBR"}},"fps":["24","25","30","48","50","60","100","120"]}}},"exposure":{"unit":"EI","defaultProfile":"logc4","profiles":{"logc4":{"label":"ARRI LogC4 / REVEAL","baseValues":[800],"defaultValue":800,"baseType":"baseSensitivity","eiRange":[160,6400],"gain":{"type":"ei"},"specialModes":[{"id":"enhancedSensitivity","label":"Enhanced Sensitivity","type":"enhancedSensitivity"}],"note":"EI 800 reste la sensibilité de base ALEV4 ; Enhanced Sensitivity améliore le bruit en basse lumière sans être traité ici comme un second ISO natif.","sources":["https://www.arri.com/en/cine-systems/cine-cameras/legacy-cine-cameras/alexa-35","https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/hdr-faq"]}}}},{"id":"bmpcc4k","name":"Blackmagic Pocket Cinema Camera 4K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":18.96,"sensorHeightMm":10.0,"dof":{"label":"Four Thirds","cocMm":0.014,"cropToFF":1.9},"media":{"label":"Cinema 4K","modes":{"4K DCI":{"width":4096,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":136,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":82,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":51,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":35,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":127,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":77,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":48,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":32,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":33,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":20,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":13,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":8.4,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}},"exposure":{"unit":"ISO","defaultProfile":"bmfilm5","profiles":{"bmfilm5":{"label":"Blackmagic Film Gen 5","baseValues":[400,3200],"defaultValue":400,"baseType":"dualNativeISO","gain":{"type":"cameraSpecific"},"sources":["https://www.blackmagicdesign.com/products/blackmagicpocketcinemacamera"]}}}},{"id":"bmpcc6k","name":"Blackmagic Pocket Cinema Camera 6K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":23.1,"sensorHeightMm":12.99,"dof":{"label":"Super 35","cocMm":0.018,"cropToFF":1.56},"media":{"label":"Cinema 6K","modes":{"6K":{"width":6144,"height":3456,"fps":["24","25","30","50"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":323,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":194,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":121,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":81,"note":"Blackmagic RAW · débit constant"}}},"4K DCI":{"width":4096,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":136,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":82,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":51,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":35,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60"],"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60"],"codecs":{"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}},"exposure":{"unit":"ISO","defaultProfile":"bmfilm5","profiles":{"bmfilm5":{"label":"Blackmagic Film Gen 5","baseValues":[400,3200],"defaultValue":400,"baseType":"dualNativeISO","gain":{"type":"cameraSpecific"},"sources":["https://www.blackmagicdesign.com/products/blackmagicpocketcinemacamera/techspecs"]}}}},{"id":"ursamp46kg2","name":"Blackmagic URSA Mini Pro 4.6K G2","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":25.34,"sensorHeightMm":14.25,"dof":{"label":"Super 35","cocMm":0.019,"cropToFF":1.42},"media":{"label":"URSA Mini Pro 4.6K","modes":{"4.6K":{"width":4608,"height":2592,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":183,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":110,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":68,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":46,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"UHD":{"width":3840,"height":2160,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":127,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":76,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":48,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":32,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}},"HD":{"width":1920,"height":1080,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 3:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":33,"note":"Blackmagic RAW · débit constant"},"BRAW 5:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":20,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":12,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":30,"baseMBps":8,"note":"Blackmagic RAW · débit constant"},"ProRes 422 HQ":{"kind":"prores","target1080":220,"note":"ProRes · débit cible VBR"},"ProRes 422":{"kind":"prores","target1080":147,"note":"ProRes · débit cible VBR"},"ProRes 422 LT":{"kind":"prores","target1080":102,"note":"ProRes · débit cible VBR"},"ProRes Proxy":{"kind":"prores","target1080":45,"note":"ProRes · débit cible VBR"}}}}},"exposure":{"unit":"ISO","defaultProfile":"bmfilm","profiles":{"bmfilm":{"label":"Blackmagic Film","baseValues":[800],"defaultValue":800,"baseType":"nativeISO","gain":{"type":"cameraSpecific"},"note":"La 4.6K G2 n’est pas traitée comme dual-native dans BOS. ISO 800 est la référence native retenue.","sources":["https://www.blackmagicdesign.com/products/blackmagicursaminipro/gallery"]}}}},{"id":"ursamp12k","name":"Blackmagic URSA Mini Pro 12K","brand":"Blackmagic","group":"BLACKMAGIC","sensorWidthMm":27.03,"sensorHeightMm":14.25,"dof":{"label":"Super 35","cocMm":0.02,"cropToFF":1.33},"media":{"label":"URSA Mini Pro 12K","modes":{"12K":{"width":12288,"height":6480,"fps":["24","25","30","50","60"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":578,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":361,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":241,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":160,"note":"Blackmagic RAW · débit constant"}}},"8K":{"width":8192,"height":4320,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":257,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":161,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":107,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":71,"note":"Blackmagic RAW · débit constant"}}},"6K S16":{"width":6144,"height":3240,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":146,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":91,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":61,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":40,"note":"Blackmagic RAW · débit constant"}}},"4K":{"width":4096,"height":2160,"fps":["24","25","30","50","60","100","120"],"codecs":{"BRAW 5:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":161,"note":"Blackmagic RAW · débit constant"},"BRAW 8:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":107,"note":"Blackmagic RAW · débit constant"},"BRAW 12:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":80,"note":"Blackmagic RAW · débit constant"},"BRAW 18:1":{"kind":"scaledMBps","baseFps":24,"baseMBps":53,"note":"Blackmagic RAW · débit constant"}}}}},"exposure":{"unit":"ISO","defaultProfile":"bmfilm5","profiles":{"bmfilm5":{"label":"Blackmagic Film Gen 5","baseValues":[800],"defaultValue":800,"baseType":"nativeISO","gain":{"type":"cameraSpecific"},"sources":["https://www.blackmagicdesign.com/products/blackmagicursaminipro"]}}}},{"id":"ff","name":"Full Frame 36 mm","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":36.0,"dof":{"label":"Full Frame","cocMm":0.029,"cropToFF":1.0}},{"id":"s35","name":"Super 35","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":24.89,"dof":{"label":"Super 35","cocMm":0.019,"cropToFF":1.5}},{"id":"apsc","name":"APS-C","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":23.5,"dof":{"label":"APS-C","cocMm":0.019,"cropToFF":1.53}},{"id":"mft","name":"Micro 4/3","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":17.3,"dof":{"label":"Micro 4/3","cocMm":0.014,"cropToFF":2.08}},{"id":"oneinch","name":"1 pouce","brand":"Générique","group":"GÉNÉRIQUE","sensorWidthMm":13.2,"dof":{"label":"1 pouce","cocMm":0.011,"cropToFF":2.73}}],"notes":["V1.2 : ajout des données d’exposition aux 11 caméras réelles de la base.","Les capteurs génériques ff/s35/apsc/mft/oneinch n’ont volontairement pas de bloc exposure.","baseType distingue ISO natif/base EI, dual/multi-base et simple ISO de référence (RED).","Ne pas convertir ISO↔dB avec une formule universelle : utiliser gain.type et les données spécifiques caméra.","V1.1: profils MEDIA centralisés + Blackmagic ajoutées à la liste commune."]};
let cameraDb=FALLBACK_CAMERA_DB;
let cameraPresets=[...FALLBACK_CAMERA_DB.cameras];
let cameras={};
// Compatibilité avec les plans créés avant la base caméra commune.
const LEGACY_CAMERAS={
  'Sony a7S III':{w:35.6,h:35.6*9/16,legacy:true},
  'Full Frame 3:2':{w:36,h:36*9/16,legacy:true},
  'Super 35 / APS-C':{w:23.5,h:23.5*9/16,legacy:true}
};
function validCameraDb(data){
  return !!(data&&Array.isArray(data.cameras)&&data.cameras.some(c=>c?.id&&c?.name&&Number(c.sensorWidthMm)>0));
}
function cameraSensorHeight(c){
  const explicit=Number(c?.sensorHeightMm??c?.sensorHeight??c?.frame?.sensorHeightMm??c?.sensor?.heightMm);
  // PLAN affiche une vue 16:9 : si la DB ne contient que la largeur (schéma actuel),
  // on utilise la hauteur 16:9 correspondante. Une future hauteur explicite sera utilisée automatiquement.
  return explicit>0?explicit:Number(c?.sensorWidthMm||36)*9/16;
}
function rebuildCameraMap(){
  const shared={};
  cameraPresets.forEach(c=>{
    const w=Number(c.sensorWidthMm)||36;
    shared[c.name]={w,h:cameraSensorHeight(c),id:c.id,brand:c.brand||'',group:c.group||'',label:c.dof?.label||''};
  });
  cameras={...LEGACY_CAMERAS,...shared};
}
function setCameraDb(data){
  if(!validCameraDb(data))return false;
  const presets=data.cameras.filter(c=>c?.id&&c?.name&&Number(c.sensorWidthMm)>0);
  if(!presets.length)return false;
  cameraDb=data;cameraPresets=presets;rebuildCameraMap();return true;
}
function loadCachedCameraDb(){
  try{const cached=JSON.parse(localStorage.getItem(CAMERA_DB_CACHE_KEY)||'null');if(cached)setCameraDb(cached)}catch(_ ){}
}
async function refreshCameraDb(){
  try{
    const res=await fetch(CAMERA_DB_URL,{cache:'no-store'});if(!res.ok)throw new Error(String(res.status));
    const data=await res.json();if(!setCameraDb(data))throw new Error('invalid');
    try{localStorage.setItem(CAMERA_DB_CACHE_KEY,JSON.stringify(data))}catch(_ ){}
    if(typeof state!=='undefined'){
      state.objects?.filter(o=>o.kind==='camera').forEach(normalizeCameraObject);
      if(!cameras[state.cameraModel])state.cameraModel='Sony FX3';
      if(cameraChooser&&!cameraChooser.classList.contains('hidden'))renderCameraChooser();
      render();
    }
  }catch(_ ){}
}
setCameraDb(FALLBACK_CAMERA_DB);
loadCachedCameraDb();

let lightCatalog=[
  // AMARAN — Halo
  {brand:'Amaran',family:'Halo',name:'amaran Halo 60x',short:'H60x',form:'halo',beam:55},
  {brand:'Amaran',family:'Halo',name:'amaran Halo 100x',short:'H100',form:'halo',beam:55},
  {brand:'Amaran',family:'Halo',name:'amaran Halo 200x',short:'H200',form:'halo',beam:55},
  {brand:'Amaran',family:'Halo',name:'amaran Halo 300x',short:'H300',form:'halo',beam:55},
  {brand:'Amaran',family:'Halo',name:'amaran Halo 600x',short:'H600',form:'halo',beam:55},
  // AMARAN — Ray
  {brand:'Amaran',family:'Ray',name:'amaran Ray 60c',short:'R60c',form:'ray',beam:70},
  {brand:'Amaran',family:'Ray',name:'amaran Ray 120c',short:'R120',form:'ray',beam:55},
  {brand:'Amaran',family:'Ray',name:'amaran Ray 360c',short:'R360',form:'ray',beam:55},
  {brand:'Amaran',family:'Ray',name:'amaran Ray 660c',short:'R660',form:'ray',beam:55},
  // AMARAN — COB S
  {brand:'Amaran',family:'COB S',name:'amaran COB 60d S',short:'60dS',form:'cob',beam:55},
  {brand:'Amaran',family:'COB S',name:'amaran COB 60x S',short:'60xS',form:'cob',beam:55},
  {brand:'Amaran',family:'COB S',name:'amaran 100d S',short:'100d',form:'cob',beam:55},
  {brand:'Amaran',family:'COB S',name:'amaran 100x S',short:'100x',form:'cob',beam:55},
  {brand:'Amaran',family:'COB S',name:'amaran 200d S',short:'200d',form:'cob',beam:55},
  {brand:'Amaran',family:'COB S',name:'amaran 200x S',short:'200x',form:'cob',beam:55},
  // AMARAN — COB couleur
  {brand:'Amaran',family:'COB couleur',name:'amaran 150c',short:'150c',form:'cob-color',beam:55},
  {brand:'Amaran',family:'COB couleur',name:'amaran 300c',short:'300c',form:'cob-color',beam:55},
  // AMARAN — Panels
  {brand:'Amaran',family:'Panels',name:'amaran Pano 60c',short:'P60c',form:'panel',beam:120,aspect:1.55},
  {brand:'Amaran',family:'Panels',name:'amaran Pano 120c',short:'P120',form:'panel',beam:120,aspect:1.65},
  {brand:'Amaran',family:'Panels',name:'amaran P60c',short:'P60c',form:'panel',beam:120,aspect:1.35},
  {brand:'Amaran',family:'Panels',name:'amaran P60x',short:'P60x',form:'panel',beam:120,aspect:1.35},
  {brand:'Amaran',family:'Panels',name:'amaran Verge',short:'VERGE',form:'panel-wide',beam:120,aspect:2.1},
  {brand:'Amaran',family:'Panels',name:'amaran Verge Max',short:'V MAX',form:'panel-wide',beam:120,aspect:2.4},
  // AMARAN — Pocket
  {brand:'Amaran',family:'Pocket',name:'amaran Ace 25c',short:'A25c',form:'pocket',beam:120},
  {brand:'Amaran',family:'Pocket',name:'amaran Ace 25x',short:'A25x',form:'pocket',beam:120},
  {brand:'Amaran',family:'Pocket',name:'amaran Go',short:'GO',form:'pocket-round',beam:120},
  // AMARAN — Tubes
  {brand:'Amaran',family:'Tubes',name:'amaran T2c',short:'T2c',form:'tube',beam:180,length:55},
  {brand:'Amaran',family:'Tubes',name:'amaran T4c',short:'T4c',form:'tube',beam:180,length:78},
  {brand:'Amaran',family:'Pixel Tubes',name:'amaran PT1c',short:'PT1',form:'pixel-bar',beam:180,length:38},
  {brand:'Amaran',family:'Pixel Tubes',name:'amaran PT2c',short:'PT2',form:'pixel-bar',beam:180,length:56},
  {brand:'Amaran',family:'Pixel Tubes',name:'amaran PT4c',short:'PT4',form:'pixel-bar',beam:180,length:80},
  // AMARAN — Flex
  {brand:'Amaran',family:'Flex',name:'amaran F21c',short:'F21c',form:'mat',beam:180,aspect:2},
  {brand:'Amaran',family:'Flex',name:'amaran F21x',short:'F21x',form:'mat',beam:180,aspect:2},
  {brand:'Amaran',family:'Flex',name:'amaran F22c',short:'F22c',form:'mat',beam:180,aspect:1},
  {brand:'Amaran',family:'Flex',name:'amaran F22x',short:'F22x',form:'mat',beam:180,aspect:1},
  {brand:'Amaran',family:'Pixel',name:'amaran SM5c',short:'SM5c',form:'strip',beam:180,length:76},

  // APUTURE — STORM
  {brand:'Aputure',family:'STORM',name:'Aputure STORM 80c',short:'80c',form:'storm',beam:55},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM 400x',short:'400x',form:'storm',beam:55},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM 700x',short:'700x',form:'storm',beam:55},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM 1000c',short:'1000c',form:'storm-color',beam:55},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM 1200x',short:'1200x',form:'storm',beam:55},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM XT52',short:'XT52',form:'storm-heavy',beam:45},
  {brand:'Aputure',family:'STORM',name:'Aputure STORM CS32',short:'CS32',form:'storm-heavy',beam:45},
  // APUTURE — Electro Storm
  {brand:'Aputure',family:'Electro Storm',name:'Aputure Electro Storm XT26',short:'XT26',form:'storm-heavy',beam:45},
  {brand:'Aputure',family:'Electro Storm',name:'Aputure Electro Storm CS15',short:'CS15',form:'storm-heavy-color',beam:45},
  // APUTURE — Light Storm
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 60d',short:'60d',form:'ls-small',beam:45},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 60x',short:'60x',form:'ls-small',beam:45},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 300d II',short:'300d',form:'ls',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 300x',short:'300x',form:'ls',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 600d',short:'600d',form:'ls',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 600d Pro',short:'600dP',form:'ls',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 600x Pro',short:'600xP',form:'ls',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 600c Pro',short:'600cP',form:'ls-color',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 600c Pro II',short:'600cII',form:'ls-color',beam:55},
  {brand:'Aputure',family:'Light Storm',name:'Aputure LS 1200d Pro',short:'1200d',form:'ls-heavy',beam:55},
  // APUTURE — NOVA
  {brand:'Aputure',family:'NOVA',name:'Aputure NOVA II 1x1',short:'N II 1',form:'nova',beam:120,aspect:1},
  {brand:'Aputure',family:'NOVA',name:'Aputure NOVA II 2x1',short:'N II 2',form:'nova',beam:120,aspect:2},
  {brand:'Aputure',family:'NOVA',name:'Aputure NOVA 9° 2x1',short:'N 9°',form:'nova-narrow',beam:9,aspect:2},
  {brand:'Aputure',family:'NOVA',name:'Aputure Nova P300c',short:'P300',form:'nova',beam:120,aspect:1.4},
  {brand:'Aputure',family:'NOVA',name:'Aputure Nova P600c',short:'P600',form:'nova',beam:120,aspect:2},
  // APUTURE — INFINIMAT
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 1x2',short:'IM1×2',form:'mat',beam:180,aspect:2},
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 1x4',short:'IM1×4',form:'mat',beam:180,aspect:3.2},
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 2x4',short:'IM2×4',form:'mat',beam:180,aspect:2},
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 4x4',short:'IM4×4',form:'mat',beam:180,aspect:1},
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 8x8',short:'IM8×8',form:'mat',beam:180,aspect:1},
  {brand:'Aputure',family:'INFINIMAT',name:'Aputure INFINIMAT 20x20',short:'IM20',form:'mat',beam:180,aspect:1},
  // APUTURE — INFINIBAR
  {brand:'Aputure',family:'INFINIBAR',name:'Aputure INFINIBAR PB3',short:'PB3',form:'pixel-bar',beam:180,length:38},
  {brand:'Aputure',family:'INFINIBAR',name:'Aputure INFINIBAR PB6',short:'PB6',form:'pixel-bar',beam:180,length:57},
  {brand:'Aputure',family:'INFINIBAR',name:'Aputure INFINIBAR PB12',short:'PB12',form:'pixel-bar',beam:180,length:82},
  // APUTURE — Mini / Practical
  {brand:'Aputure',family:'Mini',name:'Aputure MT Pro',short:'MT',form:'pixel-bar',beam:180,length:40},
  {brand:'Aputure',family:'Mini',name:'Aputure MC Pro',short:'MCP',form:'pocket',beam:120},
  {brand:'Aputure',family:'Mini',name:'Aputure MC',short:'MC',form:'pocket',beam:120},
  {brand:'Aputure',family:'Practical',name:'Aputure Accent B7c',short:'B7c',form:'bulb',beam:180}
];

const LIGHT_DB_URL="https://raw.githubusercontent.com/BrunoSetTools/BOS-LIGHT-DB/main/lights.json";
const LIGHT_DB_CACHE_KEY="bos-light-db-cache-v1";
function planPresetFromSharedFixture(f){
  if(!f||f.capabilities?.planFeu===false||!f.plan)return null;
  return {id:f.id,name:f.name,brand:f.brand||'Autre',family:f.family||'Projecteur',short:f.short||f.name,form:f.plan.form||'cob',beam:Number(f.plan.beam)||55,aspect:f.plan.aspect,length:f.plan.length};
}
function setSharedLightDb(data){
  const presets=(data?.fixtures||[]).map(planPresetFromSharedFixture).filter(Boolean);
  if(!presets.length)return false;
  lightCatalog=presets;
  return true;
}
function loadCachedLightDb(){
  try{const cached=JSON.parse(localStorage.getItem(LIGHT_DB_CACHE_KEY)||'null');if(cached)setSharedLightDb(cached)}catch(_){ }
}
async function refreshLightDb(){
  let data=null;
  try{const res=await fetch(LIGHT_DB_URL,{cache:'no-store'});if(!res.ok)throw new Error(String(res.status));data=await res.json()}catch(_){
    try{const res=await fetch('./lights.json',{cache:'no-store'});if(res.ok)data=await res.json()}catch(__){ }
  }
  if(data&&setSharedLightDb(data)){
    try{localStorage.setItem(LIGHT_DB_CACHE_KEY,JSON.stringify(data))}catch(_){ }
    state.objects?.filter(o=>o.kind==='light').forEach(normalizeLightObject);
    render();
  }
}


// Objets grip et décor disponibles dans Ajouter un élément.
const accessoryCatalog=[
  {type:'diffusion',name:'Cadre de diffusion',short:'DIFF',width:2,height:.08,zHeight:2},
  {type:'borniol',name:'Borniol',short:'BOR',width:3,height:.08,zHeight:1.2},
  {type:'flag',name:'Drapeau',short:'DRAP',width:1.2,height:.05,zHeight:1.2},
  {type:'negative',name:'Negative fill',short:'NEG',width:1.2,height:.05,zHeight:2},
  {type:'reflector',name:'Réflecteur',short:'REF',width:1.2,height:.08,zHeight:2}
];
const decorCatalog=[
  {type:'wall',name:'Mur',short:'MUR',width:3,height:.15},
  {type:'door',name:'Porte',short:'PORTE',width:.9,height:.1},
  {type:'window',name:'Fenêtre',short:'FEN',width:1.5,height:.1},
  {type:'table',name:'Table',short:'TABLE',width:1.6,height:.8}
];

const CURRENT_KEY='bos-plan-feu-v06-current';
const FAVORITES_KEY='bos-plan-feu-favorite-lights-v01';
const LIB_KEY='bos-plan-feu-library-v06';
let state={objects:[],selected:null,activePreviewCamera:null,cameraModel:'Sony FX3',focal:50,snap:.25,labelsMode:'full',beamsVisible:true,gridOpacity:.5,planLength:10,planId:null,planName:'Plan sans nom',folderId:'folder_general',planOptionsOpen:true,equipmentSheet:null};
let library={folders:[{id:'folder_general',name:'Plans'}],plans:[]};
let drag=null;
let multiSelectedIds=new Set();
let lassoDrag=null;

// Navigation du plan : le canevas reste toujours ajusté au téléphone au chargement,
// puis peut être déplacé et zoomé sans modifier les coordonnées réelles du plan.
const STAGE_RATIO=.62, BASE_STAGE_W=1000, MAX_VIEW_ZOOM=4;
function stageW(){return Math.max(400,Math.round((Number(state.planLength)||10)*SCALE))}
function stageH(){return Math.round(stageW()*STAGE_RATIO)}
let stageViewport={x:0,y:0,w:BASE_STAGE_W,h:Math.round(BASE_STAGE_W*STAGE_RATIO)};
const activeTouchPointers=new Map();
let panGesture=null, pinchGesture=null;
function clampViewport(v){
  const fullW=stageW(),fullH=stageH();
  const minW=fullW/MAX_VIEW_ZOOM;
  const w=clamp(Number(v.w)||fullW,minW,fullW),h=w*fullH/fullW;
  const x=clamp(Number(v.x)||0,0,fullW-w),y=clamp(Number(v.y)||0,0,fullH-h);
  return {x,y,w,h};
}
function updateStageGeometry(){
  const w=stageW(),h=stageH();
  const bg=stage.querySelector('.stage-bg'); if(bg){bg.setAttribute('width',String(w));bg.setAttribute('height',String(h))}
  const gridRect=stage.querySelector('rect[fill="url(#grid)"]'); if(gridRect){gridRect.setAttribute('width',String(w));gridRect.setAttribute('height',String(h))}
}
function planLengthAnchorSubject(){
  return state.objects.find(o=>o.kind==='subject')||null;
}
function setPlanLength(length,{keepViewport=true}={}){
  const prevW=stageW(),prevH=stageH();
  const prevViewport={...stageViewport};
  const anchor=planLengthAnchorSubject();
  const anchorBefore=anchor?{x:anchor.x,y:anchor.y}:null;

  state.planLength=clamp(Number(length)||10,4,30);
  const nextW=stageW(),nextH=stageH();
  if(nextW===prevW&&nextH===prevH)return;

  let dx=(nextW-prevW)/2;
  let dy=(nextH-prevH)/2;

  if(anchorBefore){
    dx=anchorBefore.x*(nextW/prevW-1);
    dy=anchorBefore.y*(nextH/prevH-1);
  }

  state.objects.forEach(o=>{
    o.x=Number(o.x||0)+dx;
    o.y=Number(o.y||0)+dy;
  });

  if(keepViewport){
    const viewW=prevViewport.w/prevW*nextW;
    const viewH=viewW*nextH/nextW;

    if(anchorBefore){
      const rx=(anchorBefore.x-prevViewport.x)/Math.max(1,prevViewport.w);
      const ry=(anchorBefore.y-prevViewport.y)/Math.max(1,prevViewport.h);
      const anchorAfter={x:anchorBefore.x+dx,y:anchorBefore.y+dy};
      stageViewport={
        x:anchorAfter.x-rx*viewW,
        y:anchorAfter.y-ry*viewH,
        w:viewW,
        h:viewH
      };
    }else{
      stageViewport={
        x:(prevViewport.x+prevViewport.w/2)+dx-viewW/2,
        y:(prevViewport.y+prevViewport.h/2)+dy-viewH/2,
        w:viewW,
        h:viewH
      };
    }
  }else{
    stageViewport={x:0,y:0,w:nextW,h:nextH};
  }

  updateStageGeometry();
  applyStageViewport();
  renderCanvas();
  scheduleAutosave();
}
function applyStageViewport(){
  stageViewport=clampViewport(stageViewport);
  stage.setAttribute('viewBox',`${stageViewport.x} ${stageViewport.y} ${stageViewport.w} ${stageViewport.h}`);
  if(zoomReadout)zoomReadout.textContent=`${Math.round(stageW()/stageViewport.w*100)} %`;
  stage.classList.toggle('desktop-pan-ready',stageViewport.w<stageW()-.5);
}
function resetStageViewport(){stageViewport={x:0,y:0,w:stageW(),h:stageH()};applyStageViewport()}
function stagePointFromClient(clientX,clientY){
  const r=stage.getBoundingClientRect();
  if(!r.width||!r.height)return {x:stageViewport.x,y:stageViewport.y};
  return {x:stageViewport.x+(clientX-r.left)/r.width*stageViewport.w,y:stageViewport.y+(clientY-r.top)/r.height*stageViewport.h};
}
function zoomStage(factor,clientX=null,clientY=null){
  const fullW=stageW(),fullH=stageH();
  const newW=clamp(stageViewport.w/factor,fullW/MAX_VIEW_ZOOM,fullW);
  const newH=newW*fullH/fullW;
  const r=stage.getBoundingClientRect();
  const hasPointer=Number.isFinite(clientX)&&Number.isFinite(clientY)&&r.width&&r.height;
  const rx=hasPointer?clamp((clientX-r.left)/r.width,0,1):.5;
  const ry=hasPointer?clamp((clientY-r.top)/r.height,0,1):.5;
  const anchor=hasPointer
    ?stagePointFromClient(clientX,clientY)
    :{x:stageViewport.x+stageViewport.w/2,y:stageViewport.y+stageViewport.h/2};
  stageViewport=clampViewport({
    x:anchor.x-rx*newW,
    y:anchor.y-ry*newH,
    w:newW,
    h:newH
  });
  applyStageViewport();
}
function viewportFromPinch(start,midX,midY,distance){
  const ratio=Math.max(.01,distance/start.distance);
  const fullW=stageW(),fullH=stageH();
  const newW=clamp(start.viewport.w/ratio,fullW/MAX_VIEW_ZOOM,fullW),newH=newW*fullH/fullW;
  const r=stage.getBoundingClientRect(),rx=clamp((midX-r.left)/Math.max(1,r.width),0,1),ry=clamp((midY-r.top)/Math.max(1,r.height),0,1);
  return clampViewport({x:start.anchor.x-rx*newW,y:start.anchor.y-ry*newH,w:newW,h:newH});
}
function beginPinchIfPossible(){
  if(activeTouchPointers.size<2)return false;
  const pts=[...activeTouchPointers.values()].slice(0,2),a=pts[0],b=pts[1],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  const distance=Math.hypot(a.x-b.x,a.y-b.y);
  pinchGesture={distance:Math.max(1,distance),viewport:{...stageViewport},anchor:stagePointFromClient(mx,my)};
  panGesture=null;
  drag=null;
  return true;
}
function handleViewportPointerDown(e){
  const onObject=!!e.target.closest?.('.object');

  if(e.pointerType==='touch'){
    activeTouchPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activeTouchPointers.size>=2){beginPinchIfPossible();e.preventDefault();return}
    if(!onObject)panGesture={pointerId:e.pointerId,pointerType:'touch',startX:e.clientX,startY:e.clientY,viewport:{...stageViewport}};
    return;
  }

  if(e.pointerType==='mouse'&&e.button===0&&!onObject&&stageInteractionMode==='hand'){
    panGesture={pointerId:e.pointerId,pointerType:'mouse',startX:e.clientX,startY:e.clientY,viewport:{...stageViewport}};
    stage.classList.add('desktop-panning');
    try{stage.setPointerCapture?.(e.pointerId)}catch(_){}
    e.preventDefault();
  }
}
function handleViewportPointerMove(e){
  if(e.pointerType==='touch'){
    if(!activeTouchPointers.has(e.pointerId))return;
    activeTouchPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activeTouchPointers.size>=2){
      if(!pinchGesture)beginPinchIfPossible();
      const pts=[...activeTouchPointers.values()].slice(0,2),a=pts[0],b=pts[1],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,d=Math.hypot(a.x-b.x,a.y-b.y);
      stageViewport=viewportFromPinch(pinchGesture,mx,my,d);applyStageViewport();e.preventDefault();return;
    }
  }

  if(panGesture&&panGesture.pointerId===e.pointerId){
    const r=stage.getBoundingClientRect(),dx=(e.clientX-panGesture.startX)/Math.max(1,r.width)*panGesture.viewport.w,dy=(e.clientY-panGesture.startY)/Math.max(1,r.height)*panGesture.viewport.h;
    stageViewport=clampViewport({x:panGesture.viewport.x-dx,y:panGesture.viewport.y-dy,w:panGesture.viewport.w,h:panGesture.viewport.h});
    applyStageViewport();e.preventDefault();
  }
}
function handleViewportPointerEnd(e){
  if(e.pointerType==='touch'){
    activeTouchPointers.delete(e.pointerId);
    if(activeTouchPointers.size<2)pinchGesture=null;
    if(activeTouchPointers.size===1){
      const [id,p]=[...activeTouchPointers.entries()][0];
      panGesture={pointerId:id,pointerType:'touch',startX:p.x,startY:p.y,viewport:{...stageViewport}};
    }else if(activeTouchPointers.size===0)panGesture=null;
    return;
  }

  if(e.pointerType==='mouse'&&panGesture&&panGesture.pointerId===e.pointerId&&panGesture.pointerType==='mouse'){
    try{stage.releasePointerCapture?.(e.pointerId)}catch(_){}
    panGesture=null;
    stage.classList.remove('desktop-panning');
  }
}
stage.addEventListener('pointerdown',handleViewportPointerDown,{capture:true});
stage.addEventListener('pointermove',handleViewportPointerMove,{capture:true});
stage.addEventListener('pointerup',handleViewportPointerEnd,{capture:true});
stage.addEventListener('pointercancel',handleViewportPointerEnd,{capture:true});
stage.addEventListener('pointerdown',e=>{beginLasso(e)},{capture:true});
stage.addEventListener('pointermove',e=>{moveLasso(e)},{capture:true});
stage.addEventListener('pointerup',e=>{endLasso(e)},{capture:true});
stage.addEventListener('pointercancel',e=>{endLasso(e)},{capture:true});
let replaceLightId=null;
let replaceCameraId=null;
let cameraChooserBrand='Sony';
let cameraChooserId='fx3';
const LAST_CAMERA_BY_BRAND_KEY='bos-plan-last-camera-by-brand-v1';
let catalogBrand='Amaran';
let catalogFamily='';
let catalogFavoritesOnly=false;
let favoriteLightNames=[];
function loadFavoriteLights(){try{favoriteLightNames=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');if(!Array.isArray(favoriteLightNames))favoriteLightNames=[]}catch{favoriteLightNames=[]}}
function persistFavoriteLights(){try{localStorage.setItem(FAVORITES_KEY,JSON.stringify(favoriteLightNames))}catch(e){console.warn('Favorites BOS',e)}}
function isFavoriteLight(p){return favoriteLightNames.includes(p.name)}
function toggleFavoriteLight(p){if(isFavoriteLight(p))favoriteLightNames=favoriteLightNames.filter(n=>n!==p.name);else favoriteLightNames=[...favoriteLightNames,p.name];persistFavoriteLights();renderLightChooser()}
let autosaveTimer=null;
const SCALE=100;

function uid(prefix){return prefix+'_'+Math.random().toString(36).slice(2,8)}
function rad(d){return d*Math.PI/180}
function deg(r){return r*180/Math.PI}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)/SCALE}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c))}
function svgEl(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);return e}
function deepClone(v){return JSON.parse(JSON.stringify(v))}
function safeName(s){return String(s||'Plan').trim().replace(/[\/:*?"<>|]+/g,'_').replace(/\s+/g,' ').slice(0,80)||'Plan'}
function defaultPlanName(){return 'Plan sans nom'}
function normalizedPlanName(name){return String(name||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr-FR')}
function findPlanNameConflict(name,excludeId=null){
  const key=normalizedPlanName(name);
  if(!key)return null;
  return library.plans.find(p=>p.id!==excludeId&&normalizedPlanName(p.name)===key)||null;
}
function warnPlanNameConflict(name){
  alert(`Un plan nommé « ${name} » existe déjà.\n\nChoisis un autre nom avant de l’enregistrer.`);
  const input=topPlanNameInput||planNameInput;
  if(input){requestAnimationFrame(()=>{input.focus();input.select()})}
  return false;
}
function nextAvailableCopyName(baseName){
  const base=`${String(baseName||defaultPlanName()).trim()||defaultPlanName()} copie`;
  if(!findPlanNameConflict(base))return base;
  let i=2;
  while(findPlanNameConflict(`${base} ${i}`))i++;
  return `${base} ${i}`;
}
function snapValue(v){const step=Number(state.snap)||0;return step?Math.round(v/(step*SCALE))*step*SCALE:v}
function ensureStateDefaults(){
  if(!Array.isArray(state.objects))state.objects=[];
  state.snap=[0,.1,.25,.5,1].includes(Number(state.snap))?Number(state.snap):.25;
  if(!['full','names','lightcrew','direction','hidden'].includes(state.labelsMode))state.labelsMode='full';
  if(state.beamsVisible===undefined)state.beamsVisible=true;
  state.gridOpacity=clamp(Number.isFinite(Number(state.gridOpacity))?Number(state.gridOpacity):.5,0,1);
  state.planName=state.planName||defaultPlanName();
  state.folderId=state.folderId||library.folders[0]?.id||'folder_general';
  if(state.planId===undefined)state.planId=null;
  if(state.planOptionsOpen===undefined)state.planOptionsOpen=true;
  if(state.planLength===undefined)state.planLength=10;
  state.planLength=clamp(Number(state.planLength)||10,4,30);
  ensureEquipmentSheet();
}
function loadLibrary(){
  try{const raw=localStorage.getItem(LIB_KEY),v=raw&&JSON.parse(raw);if(v&&Array.isArray(v.folders)&&Array.isArray(v.plans))library=v}catch{}
  if(!library.folders.length)library.folders=[{id:'folder_general',name:'Plans'}];
}
function persistLibrary(){localStorage.setItem(LIB_KEY,JSON.stringify(library))}
function updateGridOpacity(){
  let raw=Number(state.gridOpacity);
  const v=Number.isFinite(raw)?clamp(raw,0,1):.5;
  state.gridOpacity=v;
  // Le curseur pilote maintenant à la fois l’opacité ET le contraste.
  // À 100 %, la grille devient volontairement très lisible pour un usage de plan technique.
  const dark=document.body.classList.contains('dark');
  const t=v;
  const smallA=v===0?0:(.10+t*.57), largeA=v===0?0:(.18+t*.72);
  const smallStroke=dark?`rgba(102,116,132,${smallA.toFixed(3)})`:`rgba(68,84,104,${smallA.toFixed(3)})`;
  const largeStroke=dark?`rgba(74,88,104,${largeA.toFixed(3)})`:`rgba(44,58,78,${largeA.toFixed(3)})`;
  stage.querySelectorAll('.grid-small').forEach(n=>{n.style.opacity='1';n.setAttribute('opacity','1');n.style.stroke=smallStroke;n.setAttribute('stroke',smallStroke)});
  stage.querySelectorAll('.grid-large').forEach(n=>{n.style.opacity='1';n.setAttribute('opacity','1');n.style.stroke=largeStroke;n.setAttribute('stroke',largeStroke)});
  if(gridOpacityRange)gridOpacityRange.value=String(Math.round(v*100));
  if(gridOpacityValue)gridOpacityValue.textContent=`${Math.round(v*100)} %`;
}
function updatePlanOptionsUI(){const open=state.planOptionsOpen!==false;if(planOptionsBody)planOptionsBody.classList.toggle('hidden',!open);if(planOptionsToggle){planOptionsToggle.setAttribute('aria-expanded',String(open));if(planOptionsToggleText)planOptionsToggleText.textContent=open?'MASQUER':'OUVRIR';if(planOptionsToggleCaret)planOptionsToggleCaret.textContent=open?'⌃':'⌄';}}
function updatePlanBadge(){if(currentPlanBadge)currentPlanBadge.textContent=`${state.planName||defaultPlanName()} · autosauvegarde`;if(topPlanNameInput&&document.activeElement!==topPlanNameInput)topPlanNameInput.value=state.planName||defaultPlanName();if(planNameInput&&document.activeElement!==planNameInput)planNameInput.value=state.planName||defaultPlanName();if(labelsModeSelect)labelsModeSelect.value=state.labelsMode||'full';if(toggleSnapBtn){const on=Number(state.snap)>0;toggleSnapBtn.classList.toggle('active',on);toggleSnapBtn.textContent=on?'Aimant ON':'Aimant OFF';toggleSnapBtn.setAttribute('aria-pressed',String(on))}if(toggleBeamsBtn){const on=state.beamsVisible!==false;toggleBeamsBtn.classList.toggle('active',on);toggleBeamsBtn.textContent=on?'Faisceau ON':'Faisceau OFF';toggleBeamsBtn.setAttribute('aria-pressed',String(on))}
if(stageBeamsBtn){const on=state.beamsVisible!==false;stageBeamsBtn.classList.toggle('active',on);stageBeamsBtn.textContent=on?'Faisceaux ON':'Faisceaux OFF';stageBeamsBtn.setAttribute('aria-pressed',String(on))}
if(stageInfosBtn){const on=(state.labelsMode||'full')!=='hidden';stageInfosBtn.classList.toggle('active',on);stageInfosBtn.textContent=on?'Infos ON':'Infos OFF';stageInfosBtn.setAttribute('aria-pressed',String(on))}
updateGridOpacity();if(planLengthRange)planLengthRange.value=String(Number(state.planLength||10));const planLengthText=`${Number(state.planLength||10).toFixed(Number(state.planLength)%1?1:0)} m`;if(planLengthValue)planLengthValue.textContent=planLengthText;if(planLengthQuickValue)planLengthQuickValue.textContent=planLengthText;if(planLengthMinusBtn)planLengthMinusBtn.disabled=Number(state.planLength||10)<=4;if(planLengthPlusBtn)planLengthPlusBtn.disabled=Number(state.planLength||10)>=30;updatePlanOptionsUI()}
function snapshotState(){const copy=deepClone(state);copy.selected=null;return copy}
function persistCurrent(){
  try{
    const snap=snapshotState();
    localStorage.setItem(CURRENT_KEY,JSON.stringify(snap));
    if(state.planId){
      const rec=library.plans.find(p=>p.id===state.planId);
      if(rec){
        const conflict=findPlanNameConflict(state.planName,state.planId);
        const libraryName=conflict?(rec.name||defaultPlanName()):state.planName;
        rec.name=libraryName;
        rec.folderId=state.folderId;
        rec.updatedAt=Date.now();
        rec.state=deepClone(snap);
        rec.state.planName=libraryName;
        persistLibrary();
      }
    }
  }catch(e){console.warn('Autosave BOS',e)}
  updatePlanBadge();
}
function scheduleAutosave(){clearTimeout(autosaveTimer);autosaveTimer=setTimeout(persistCurrent,350)}
function formatSavedDate(ts){try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short'}).format(new Date(ts))}catch{return ''}}
function downloadBlob(blob,filename){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}

function presetForObject(o){
  if(!o || o.kind!=='light')return null;
  return lightCatalog.find(p=>p.name===o.name)||lightCatalog.find(p=>p.short===o.short)||null;
}
function lightCapability(o){
  if(!o||o.kind!=='light')return 'daylight';
  const txt=`${o.name||''} ${o.family||''} ${o.short||''} ${o.form||''}`.toLowerCase();
  // Couleur complète : modèles explicitement "c" ou familles RGB/pixel/couleur.
  if(/\b(?:[a-z]*\d+[a-z-]*c|b7c)\b/.test(txt) || /\b(?:cob couleur|nova|infinibar|infinimat|ray|pano|pixel|tubes|tube|go|mt pro|mc pro|\bmc\b|ace 25c)\b/.test(txt))return 'color';
  // Bi-color / CCT variable : la plupart des modèles en "x" et la gamme Halo actuelle.
  if(/\b[a-z]*\d+[a-z-]*x\b/.test(txt) || /\bhalo\b/.test(txt))return 'bicolor';
  return 'daylight';
}
function normalizeLightObject(o){
  if(o.kind!=='light')return o;
  const p=presetForObject(o);
  if(p){
    o.brand=o.brand||p.brand;o.family=o.family||p.family;o.form=o.form||p.form;o.short=o.short||p.short;
    o.beam=Number(o.beam)||p.beam;o.aspect=o.aspect||p.aspect;o.length=o.length||p.length;
  } else {
    o.brand=o.brand||((o.name||'').toLowerCase().includes('aputure')?'Aputure':'Amaran');
    o.family=o.family||'Projecteur';o.form=o.form||'cob';o.short=o.short||String(o.name||'LIGHT').replace(/^(amaran|Aputure|Nanlite|Godox)\s+/i,'').slice(0,7);
  }
  o.modifier=o.modifier||'none';
  if(o.beamVisible===undefined)o.beamVisible=true;
  if(o.modifierSize===undefined)o.modifierSize=o.modifier==='softbox'?.9:(o.modifier?.startsWith('umbrella')?1.05:.9);
  o.height=clamp(Number(o.height)||2,.2,6);
  if(o.shower===undefined)o.shower=false;
  else o.shower=!!o.shower;
  if(o.modifier==='lantern'){
    if(!Number.isFinite(Number(o.beamBeforeLantern))){
      const current=Number(o.beam);
      o.beamBeforeLantern=Number.isFinite(current)&&current!==180?current:55;
    }
    o.beam=180;
  }
  const capability=lightCapability(o);
  if(capability!=='color')o.colorMode='cct';
  else if(!['cct','hsi'].includes(o.colorMode))o.colorMode='cct';
  o.cct=clamp(Number(o.cct)||5600,2000,10000);
  o.hue=((Number(o.hue)||0)%360+360)%360;
  o.saturation=clamp(Number(o.saturation ?? 100),0,100);
  return o;
}
function seed(){
  state.objects=[
    {id:uid('cam'),kind:'camera',name:'Caméra A',x:stageW()/2,y:stageH()-115,rot:-90,height:1.55,cameraModel:'Sony FX3',focal:50,locked:false},
    {id:uid('subj'),kind:'subject',name:'Sujet 1',x:stageW()/2,y:stageH()/2-10,rot:90,height:1.75,locked:false},
    {id:uid('light'),kind:'light',name:'amaran Halo 200x',brand:'Amaran',family:'Halo',form:'halo',short:'H200',x:Math.max(140,stageW()/2-215),y:stageH()/2+20,rot:-15,beam:55,beamVisible:true,intensity:60,height:2.0,modifier:'none',modifierSize:.9,colorMode:'cct',cct:5600,hue:0,saturation:100,locked:false}
  ];
  state.objects.forEach(o=>{o.labelVisible=true;o.labelPos='auto'});
  state.selected=state.objects[2].id;
  state.activePreviewCamera=state.objects[0].id;
  state.openingBindingVersion=2;
}
function normalizeCameraObject(o){
  if(!o||o.kind!=='camera')return o;
  o.cameraModel=cameras[o.cameraModel]?o.cameraModel:(cameras[state.cameraModel]?state.cameraModel:'Sony FX3');
  o.focal=clamp(Number(o.focal||state.focal||50),12,300);
  o.height=clamp(Number(o.height||1.55),0.2,4);
  return o;
}
function cameraSettings(o){normalizeCameraObject(o);return {sensor:cameras[o.cameraModel],focal:o.focal};}

function renderCanvas(){
  updateStageGeometry();
  state.objects.filter(o=>o.kind==='decor'&&o.type==='wall').forEach(syncWallChildren);
  beamsLayer.innerHTML='';objectsLayer.innerHTML='';
  state.objects.filter(o=>o.kind==='camera').forEach(drawCameraFov);
  if(state.beamsVisible!==false)state.objects.filter(o=>o.kind==='light'&&o.beamVisible!==false).forEach(drawLightBeam);
  state.objects.forEach(drawObject);
  drawPlanScaleOverlay();
  renderPreview();
  updatePlanBadge();
  scheduleAutosave();
}
function render(){renderCanvas();renderInspector();renderQuickControls()}
function drawCameraFov(o){
  const {sensor,focal}=cameraSettings(o),hfov=2*Math.atan(sensor.w/(2*focal)),len=stageH()*.74,half=Math.tan(hfov/2)*len;
  beamsLayer.appendChild(svgEl('polygon',{points:`0,0 ${len},${-half} ${len},${half}`,class:'camera-fov',transform:`translate(${o.x} ${o.y}) rotate(${o.rot})`}));
}
function kelvinToRgb(kelvin){
  let temp=clamp(Number(kelvin)||5600,1000,40000)/100,r,g,b;
  if(temp<=66){r=255;g=99.4708025861*Math.log(temp)-161.1195681661;b=temp<=19?0:138.5177312231*Math.log(temp-10)-305.0447927307}
  else{r=329.698727446*Math.pow(temp-60,-.1332047592);g=288.1221695283*Math.pow(temp-60,-.0755148492);b=255}
  return [Math.round(clamp(r,0,255)),Math.round(clamp(g,0,255)),Math.round(clamp(b,0,255))];
}
function lightColor(o,alpha=.14){
  normalizeLightObject(o);
  if(o.colorMode==='hsi')return {fill:`hsla(${o.hue},${o.saturation}%,50%,${alpha})`,stroke:`hsla(${o.hue},${Math.max(35,o.saturation)}%,48%,${Math.min(.72,alpha*4)})`};
  const [r,g,b]=kelvinToRgb(o.cct);return {fill:`rgba(${r},${g},${b},${alpha})`,stroke:`rgba(${r},${g},${b},${Math.min(.72,alpha*4)})`};
}
function lightColorText(o){normalizeLightObject(o);return o.colorMode==='hsi'?`H ${Math.round(o.hue)}° · S ${Math.round(o.saturation)}%`:`${Math.round(o.cct)} K`}
function fixtureBeamOffset(o){
  // Les sources plates / linéaires sont représentées vues du dessus par leur longueur.
  // Leur face lumineuse projette donc perpendiculairement au grand axe de l'icône.
  return ['panel','panel-wide','nova','nova-narrow','mat','strip','tube','pixel-bar'].includes(o?.form)?90:0;
}
function displayBeamAngle(o){
  const raw=clamp(Number(o.beam)||55,4,179);
  // Le cône du plan reste un repère schématique. Les sources surfaciques ou linéaires
  // très ouvertes sont volontairement plafonnées afin de garder le plan lisible.
  if(o?.form==='nova-narrow')return raw;
  if(['mat','panel','panel-wide','nova'].includes(o?.form))return Math.min(raw,68);
  if(o?.form==='strip')return Math.min(raw,120);
  if(['tube','pixel-bar'].includes(o?.form))return Math.min(raw,90);
  return raw;
}
function fixtureEmitterBase(o){
  if(['tube','pixel-bar','strip'].includes(o?.form)){
    const L=clamp(Number(o.length)||62,28,90);
    return {type:'line',span:Math.max(22,L*0.92),len:270};
  }
  if(['mat','panel','panel-wide','nova','nova-narrow'].includes(o?.form)){
    const aspect=o.aspect||1.5,w=clamp(38*aspect,38,78);
    return {type:'surface',span:Math.max(22,w-4),len:255};
  }
  return {type:'point',span:0,len:310};
}
function drawLightBeam(o){
  normalizeLightObject(o);
  const beam=displayBeamAngle(o),c=lightColor(o,.13);

  if(o.modifier==='lantern'&&!o.shower){
    const radius=fixtureEmitterBase(o).len;
    const beamRot=o.rot+fixtureBeamOffset(o);
    const d=`M 0 0 L 0 ${-radius} A ${radius} ${radius} 0 0 1 0 ${radius} Z`;
    beamsLayer.appendChild(svgEl('path',{d,class:'beam lantern-beam',style:`fill:${c.fill};stroke:${c.stroke}`,transform:`translate(${o.x} ${o.y}) rotate(${beamRot})`}));
    return;
  }
  if(o.shower){
    const showerAngle=Math.min(120,Math.max(4,beam));
    const physicalRadius=Math.tan(rad(showerAngle/2))*Number(o.height||2)*SCALE;
    const radius=clamp(physicalRadius,32,Math.min(stageW(),stageH())*.45);
    beamsLayer.appendChild(svgEl('circle',{cx:o.x,cy:o.y,r:radius,class:'beam shower-beam',style:`fill:${c.fill};stroke:${c.stroke}`}));
    return;
  }

  const base=fixtureEmitterBase(o),len=base.len,half=Math.tan(rad(beam/2))*len,beamRot=o.rot+fixtureBeamOffset(o);
  const points=base.type==='point'?`0,0 ${len},${-half} ${len},${half}`:`0,${-(base.span/2)} ${len},${-half} ${len},${half} 0,${base.span/2}`;
  beamsLayer.appendChild(svgEl('polygon',{points,class:'beam',style:`fill:${c.fill};stroke:${c.stroke}`,transform:`translate(${o.x} ${o.y}) rotate(${beamRot})`}));
}

function drawPlanScaleOverlay(){
  const g=svgEl('g',{class:'scale-overlay-group'});
  // Échelle calée sur la grille : 25 px = 25 cm, 100 px = 1 m.
  // On l'aligne sur le grand carré en bas à droite, légèrement rentrée pour éviter l'angle arrondi.
  const grid=25;
  const safeCols=1;
  const safeRows=1;
  const rightGrid=Math.floor((stageViewport.x+stageViewport.w)/grid)*grid-safeCols*grid;
  const bottomGrid=Math.floor((stageViewport.y+stageViewport.h)/grid)*grid-safeRows*grid;
  const x1=rightGrid;
  const x0=x1-100;
  const xSmall=x0+25;
  const y=bottomGrid;
  const tickTop=y-6,tickBot=y+6;
  g.appendChild(svgEl('line',{x1:x0,y1:y,x2:x1,y2:y,class:'scale-overlay-line'}));
  [x0,xSmall,x1].forEach(x=>g.appendChild(svgEl('line',{x1:x,y1:tickTop,x2:x,y2:tickBot,class:'scale-overlay-tick'})));
  g.appendChild(svgEl('text',{x:x0,y:y-9,class:'scale-overlay-text'},'0'));
  g.appendChild(svgEl('text',{x:(x0+xSmall)/2,y:y-9,class:'scale-overlay-text'},'25 cm'));
  g.appendChild(svgEl('text',{x:(x0+x1)/2,y:y-9,class:'scale-overlay-text'},'1 m'));
  objectsLayer.appendChild(g);
}

function supportsSoftbox(o){
  const no=['tube','pixel-bar','strip','bulb','mat','pocket-round'];
  return o.kind==='light'&&!no.includes(o.form);
}
function cameraModelShortName(name=''){
  return String(name).replace(/^Sony\s+/i,'').trim()||String(name||'');
}
function cameraOptionsHtml(selectedName=''){
  const groups=new Map();
  cameraPresets.forEach(c=>{const group=c.group||c.brand||'CAMÉRAS';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(c)});
  let html=[...groups.entries()].map(([group,list])=>`<optgroup label="${esc(group)}">${list.map(c=>`<option value="${esc(c.name)}" ${selectedName===c.name?'selected':''}>${esc(c.name)}</option>`).join('')}</optgroup>`).join('');
  if(selectedName&&LEGACY_CAMERAS[selectedName]&&!cameraPresets.some(c=>c.name===selectedName))html+=`<optgroup label="ANCIENS PLANS"><option value="${esc(selectedName)}" selected>${esc(selectedName)}</option></optgroup>`;
  return html;
}
function cameraBrand(c){
  return String(c?.brand||c?.group||'Autre').trim()||'Autre';
}
function cameraBrands(){
  const seen=new Set(),brands=[];
  cameraPresets.forEach(c=>{const brand=cameraBrand(c);if(!seen.has(brand)){seen.add(brand);brands.push(brand)}});
  return brands;
}
function camerasForBrand(brand){return cameraPresets.filter(c=>cameraBrand(c)===brand)}
function getLastCameraForBrand(brand){
  try{const saved=JSON.parse(localStorage.getItem(LAST_CAMERA_BY_BRAND_KEY)||'{}'),id=saved?.[brand];return camerasForBrand(brand).some(c=>c.id===id)?id:null}catch(_){return null}
}
function rememberCameraForBrand(camera){
  if(!camera)return;try{const saved=JSON.parse(localStorage.getItem(LAST_CAMERA_BY_BRAND_KEY)||'{}');saved[cameraBrand(camera)]=camera.id;localStorage.setItem(LAST_CAMERA_BY_BRAND_KEY,JSON.stringify(saved))}catch(_){ }
}
function cameraChoiceLabel(c){
  const brand=cameraBrand(c),name=String(c?.name||'');
  return name.toLowerCase().startsWith(brand.toLowerCase()+' ')?name.slice(brand.length+1):name;
}
function renderCameraChooser(){
  if(!cameraBrandChoices||!cameraModelChoice)return;
  const brands=cameraBrands();
  if(!brands.includes(cameraChooserBrand))cameraChooserBrand=brands[0]||'Autre';
  cameraBrandChoices.innerHTML=brands.map(brand=>`<button type="button" class="camera-brand-chip ${brand===cameraChooserBrand?'active':''}" data-camera-brand="${esc(brand)}">${esc(brand)}</button>`).join('');
  cameraBrandChoices.querySelectorAll('[data-camera-brand]').forEach(btn=>btn.onclick=()=>{
    cameraChooserBrand=btn.dataset.cameraBrand;
    const remembered=getLastCameraForBrand(cameraChooserBrand),list=camerasForBrand(cameraChooserBrand);
    cameraChooserId=remembered||(list[0]?.id||'');
    renderCameraChooser();
  });
  const list=camerasForBrand(cameraChooserBrand);
  if(!list.some(c=>c.id===cameraChooserId))cameraChooserId=getLastCameraForBrand(cameraChooserBrand)||(list[0]?.id||'');
  cameraModelChoice.innerHTML=list.map(c=>`<option value="${esc(c.id)}" ${c.id===cameraChooserId?'selected':''}>${esc(cameraChoiceLabel(c))}</option>`).join('');
  cameraModelChoice.value=cameraChooserId;
  cameraModelChoice.title=cameraModelChoice.options[cameraModelChoice.selectedIndex]?.textContent||'';
}
function openCameraChooser(replaceId=null){
  replaceCameraId=replaceId;replaceLightId=null;hideChoosers();cameraChooser.classList.remove('hidden');
  const obj=replaceId?state.objects.find(x=>x.id===replaceId):null;
  const current=cameraPresets.find(c=>c.name===obj?.cameraModel)||cameraPresets.find(c=>c.name==='Sony FX3')||cameraPresets[0];
  if(current){cameraChooserBrand=cameraBrand(current);cameraChooserId=current.id}
  dialogTitle.textContent=replaceId?'Changer de caméra':'Choisir une caméra';
  if(confirmCameraChoiceBtn)confirmCameraChoiceBtn.textContent=replaceId?'Valider la caméra':'Ajouter la caméra';
  renderCameraChooser();
  if(!addDialog.open){if(typeof addDialog.showModal==='function')addDialog.showModal();else addDialog.setAttribute('open','')}
}
function applyCameraChoice(){
  const camera=cameraPresets.find(c=>c.id===cameraChooserId)||camerasForBrand(cameraChooserBrand)[0];if(!camera)return;
  rememberCameraForBrand(camera);
  if(replaceCameraId){
    const obj=state.objects.find(x=>x.id===replaceCameraId);if(obj&&obj.kind==='camera'){obj.cameraModel=camera.name;normalizeCameraObject(obj);state.selected=obj.id;state.activePreviewCamera=obj.id;closeAddDialog();render();return}
  }
  addCamera(camera.name);
}
function addLightModifier(g,o){
  if(!o.modifier||o.modifier==='none')return;
  const size=Math.max(.3,Number(o.modifierSize)||.9),px=size*SCALE;
  if(o.modifier==='hyper-reflector'){
    const x0=15,x1=35,half=14;
    g.appendChild(svgEl('path',{d:`M ${x0} -6 L ${x1} -${half} Q ${x1+8} 0 ${x1} ${half} L ${x0} 6 Z`,class:'hyper-reflector-shape'}));
    g.appendChild(svgEl('line',{x1:x0,y1:-5,x2:x0,y2:5,class:'hyper-reflector-neck'}));
    return;
  }
  if(o.modifier==='lantern'){
    const cx=28,r=18;
    g.appendChild(svgEl('line',{x1:15,y1:0,x2:cx-r+2,y2:0,class:'lantern-neck'}));
    g.appendChild(svgEl('circle',{cx,cy:0,r,class:'lantern-shape'}));
    g.appendChild(svgEl('line',{x1:cx-r*.72,y1:-r*.72,x2:cx+r*.72,y2:r*.72,class:'lantern-rib'}));
    g.appendChild(svgEl('line',{x1:cx-r*.72,y1:r*.72,x2:cx+r*.72,y2:-r*.72,class:'lantern-rib'}));
    return;
  }
  if(o.modifier==='fresnel'){
    const x0=15,x1=28,x2=43,half=13;
    g.appendChild(svgEl('path',{d:`M ${x0} -6 L ${x1} -${half} L ${x2} -${half*.72} L ${x2} ${half*.72} L ${x1} ${half} L ${x0} 6 Z`,class:'fresnel-shape'}));
    g.appendChild(svgEl('line',{x1:x2-4,y1:-half*.55,x2:x2-4,y2:half*.55,class:'fresnel-lens'}));
    return;
  }
  if(o.modifier==='softbox'||o.modifier==='softbox-grid'){
    const withGrid=o.modifier==='softbox-grid';
    const linear=['ray','panel','panel-wide','nova','nova-narrow'].includes(o.form);
    if(linear){
      const w=Math.max(34,px*.32),h=Math.max(52,px*.9),x=22;
      g.appendChild(svgEl('rect',{x,y:-h/2,width:w,height:h,rx:Math.min(10,h*.1),class:'softbox-shape'}));
      g.appendChild(svgEl('line',{x1:18,y1:-h*.24,x2:x,y2:-h*.34,class:'softbox-strut'}));
      g.appendChild(svgEl('line',{x1:18,y1:h*.24,x2:x,y2:h*.34,class:'softbox-strut'}));
      if(withGrid){[-.25,0,.25].forEach(k=>g.appendChild(svgEl('line',{x1:x,y1:k*h,x2:x+w,y2:k*h,class:'softbox-grid-line'})));g.appendChild(svgEl('line',{x1:x+w*.5,y1:-h/2,x2:x+w*.5,y2:h/2,class:'softbox-grid-line'}));}
    } else {
      const face=Math.max(42,px*.75),neck=18,half=face/2,x0=16,x1=x0+neck,x2=x1+face;
      g.appendChild(svgEl('polygon',{points:`${x0},${-half*.42} ${x1},${-half} ${x2},${-half} ${x2},${half} ${x1},${half} ${x0},${half*.42}`,class:'softbox-shape'}));
      g.appendChild(svgEl('line',{x1:x0,y1:-half*.34,x2:x1,y2:-half*.84,class:'softbox-strut'}));
      g.appendChild(svgEl('line',{x1:x0,y1:half*.34,x2:x1,y2:half*.84,class:'softbox-strut'}));
      if(withGrid){[-.5,0,.5].forEach(k=>g.appendChild(svgEl('line',{x1:x1,y1:k*half,x2:x2,y2:k*half,class:'softbox-grid-line'})));g.appendChild(svgEl('line',{x1:x1+(x2-x1)*.5,y1:-half,x2:x1+(x2-x1)*.5,y2:half,class:'softbox-grid-line'}));}
    }
    return;
  }
  if(o.modifier==='umbrella-reflect'||o.modifier==='umbrella-diffusion'){
    const cls=o.modifier==='umbrella-reflect'?'umbrella-reflect-shape':'umbrella-diffusion-shape';
    const stem=24,depth=Math.max(18,px*.28),half=Math.max(22,px*.42),x0=18,x1=x0+stem;
    g.appendChild(svgEl('line',{x1:x0,y1:0,x2:x1,y2:0,class:'umbrella-stem'}));
    g.appendChild(svgEl('path',{d:`M ${x1} ${-half} Q ${x1+depth} 0 ${x1} ${half}`,class:cls}));
    g.appendChild(svgEl('line',{x1:x1,y1:-half,x2:x1,y2:half,class:'umbrella-rim'}));
    const t=svgEl('text',{x:x1+depth*.45,y:4,class:'umbrella-code','text-anchor':'middle'});t.textContent=o.modifier==='umbrella-reflect'?'R':'D';g.appendChild(t);
  }
}
function addFixtureSymbol(g,o){
  const form=o.form||'cob',modelText=(o.short||'L').slice(0,7),bodyClass=`fixture-body ${o.brand==='Aputure'?'aputure-fixture':'amaran-fixture'}`,lensClass='fixture-lens';
  const addModelText=(x=0,y=4,size=8)=>{const t=svgEl('text',{x,y,class:'fixture-code','text-anchor':'middle','font-size':size});t.textContent=modelText;g.appendChild(t)};
  if(form==='tube'||form==='pixel-bar'||form==='strip'){
    const L=o.length||62;g.appendChild(svgEl('rect',{x:-L/2,y:-8,width:L,height:16,rx:7,class:bodyClass}));
    if(form==='pixel-bar'){const count=Math.max(3,Math.round(L/12));for(let i=0;i<count;i++)g.appendChild(svgEl('rect',{x:-L/2+5+i*(L-10)/count,y:-4,width:5,height:8,rx:2,class:'fixture-pixel'}))}
    else if(form==='strip')g.appendChild(svgEl('path',{d:`M ${-L/2+5} 0 Q ${-L/4} -6 0 0 T ${L/2-5} 0`,class:'fixture-strip-line'}));
    addModelText(0,23,8);return;
  }
  if(['panel','panel-wide','nova','nova-narrow','mat'].includes(form)){
    const aspect=o.aspect||1.5,w=clamp(38*aspect,38,78),h=clamp(38/aspect,18,42),cls=form==='mat'?'fixture-mat':(form==='nova-narrow'?'fixture-nova-narrow':bodyClass);
    g.appendChild(svgEl('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:form==='mat'?3:7,class:cls}));
    if(form==='mat')g.appendChild(svgEl('rect',{x:-w/2+4,y:-h/2+4,width:w-8,height:h-8,rx:2,class:'fixture-mat-inner'}));
    else g.appendChild(svgEl('rect',{x:-w/2+5,y:-h/2+5,width:w-10,height:h-10,rx:4,class:'fixture-panel-face'}));
    addModelText(0,3,Math.min(8,Math.max(6,42/modelText.length)));return;
  }
  if(form==='pocket'||form==='pocket-round'){
    if(form==='pocket-round')g.appendChild(svgEl('circle',{cx:0,cy:0,r:20,class:bodyClass}));else g.appendChild(svgEl('rect',{x:-20,y:-16,width:40,height:32,rx:9,class:bodyClass}));
    g.appendChild(svgEl('circle',{cx:14,cy:0,r:5,class:lensClass}));addModelText(-3,3,8);return;
  }
  if(form==='bulb'){g.appendChild(svgEl('circle',{cx:4,cy:0,r:17,class:'fixture-bulb'}));g.appendChild(svgEl('rect',{x:-23,y:-8,width:12,height:16,rx:3,class:bodyClass}));addModelText(4,3,8);return}
  const heavy=form.includes('heavy'),storm=form.startsWith('storm'),ls=form.startsWith('ls'),halo=form==='halo',ray=form==='ray';
  const w=heavy?46:(storm?40:(ls?38:36)),h=heavy?34:(storm?32:30);
  g.appendChild(svgEl('rect',{x:-w/2-7,y:-h/2,width:w,height:h,rx:storm?5:8,class:bodyClass}));
  if(storm)g.appendChild(svgEl('path',{d:`M ${-w/2-2} ${-h/2+5} L ${-w/2-8} 0 L ${-w/2-2} ${h/2-5}`,class:'fixture-storm-fin'}));
  if(ls)g.appendChild(svgEl('line',{x1:-w/2,y1:-h/2+7,x2:w/2-7,y2:-h/2+7,class:'fixture-ridge'}));
  if(halo)g.appendChild(svgEl('circle',{cx:w/2-4,cy:0,r:15,class:'fixture-halo-ring'}));
  else if(ray)g.appendChild(svgEl('circle',{cx:w/2-3,cy:0,r:14,class:'fixture-ray-head'}));
  else g.appendChild(svgEl('polygon',{points:`${w/2-7},${-h/2+3} ${w/2+14},-11 ${w/2+14},11 ${w/2-7},${h/2-3}`,class:lensClass}));
  addModelText(-5,3,Math.min(8,Math.max(6,38/modelText.length)));
}

function drawAccessorySymbol(g,o){
  const w=Math.max(50,(o.width||1.2)*55);
  const thickness=Math.max(2,Math.min(82,(Number(o.height)||.05)*55));

  if(o.type==='diffusion'){
    const barH=thickness;
    g.appendChild(svgEl('rect',{x:-w/2,y:-barH/2,width:w,height:barH,rx:Math.min(3,barH/2),class:'diffusion-bar'}));
    g.appendChild(svgEl('line',{x1:-w/2+6,y1:0,x2:w/2-6,y2:0,class:'diffusion-bar-core'}));
    for(let x=-w/2+10;x<w/2-10;x+=16)g.appendChild(svgEl('line',{x1:x,y1:-barH/2+1,x2:x+8,y2:barH/2-1,class:'diffusion-hatch'}));
    return {w,h:Math.max(16,barH)};
  }

  if(o.type==='borniol'){
    g.appendChild(svgEl('rect',{x:-w/2,y:-thickness/2,width:w,height:thickness,rx:Math.min(2,thickness/2),class:'borniol-shape'}));
    const edgeY=thickness/2;
    for(let x=-w/2+5;x<w/2-2;x+=9){
      g.appendChild(svgEl('line',{x1:x,y1:edgeY,x2:x+4,y2:edgeY+4,class:'borniol-fringe'}));
    }
    return {w,h:Math.max(20,thickness+8)};
  }

  if(o.type==='flag'){
    g.appendChild(svgEl('rect',{x:-w/2,y:-thickness/2,width:w,height:thickness,rx:Math.min(1.5,thickness/2),class:'flag-shape'}));
    return {w,h:Math.max(16,thickness)};
  }

  if(o.type==='negative'){
    g.appendChild(svgEl('rect',{x:-w/2,y:-thickness/2,width:w,height:thickness,rx:Math.min(3,thickness/2),class:'negative-shape'}));
    if(thickness>=12)g.appendChild(svgEl('text',{x:0,y:4,'text-anchor':'middle',class:'negative-code'})).textContent='NEG';
    return {w,h:Math.max(16,thickness)};
  }

  const barH=thickness;
  g.appendChild(svgEl('rect',{x:-w/2,y:-barH/2,width:w,height:barH,rx:Math.min(3,barH/2),class:'reflector-bar'}));
  if(barH>=4)g.appendChild(svgEl('line',{x1:-w/2+10,y1:barH/2-1,x2:w/2-10,y2:-barH/2+1,class:'reflector-line'}));
  return {w,h:Math.max(16,barH)};
}
function drawDecorSymbol(g,o){
  const w=Math.max(45,(o.width||1)*55);
  const thickness=Math.max(2,Math.min(110,(Number(o.height)||.1)*55));

  if(o.type==='wall'){
    g.appendChild(svgEl('rect',{x:-w/2,y:-thickness/2,width:w,height:thickness,rx:Math.min(1.5,thickness/2),class:'wall-shape'}));
    return {w,h:Math.max(18,thickness)};
  }

  if(o.type==='door'){
    g.appendChild(svgEl('line',{x1:-w/2,y1:0,x2:w/2,y2:0,class:'door-frame',style:`stroke-width:${thickness}px`}));
    g.appendChild(svgEl('line',{x1:-w/2,y1:0,x2:-w/2,y2:-w,class:'door-leaf'}));
    g.appendChild(svgEl('path',{d:`M ${-w/2} ${-w} A ${w} ${w} 0 0 1 ${w/2} 0`,class:'door-arc'}));
    return {w,h:w+15};
  }

  if(o.type==='window'){
    const half=thickness/2;
    g.appendChild(svgEl('line',{x1:-w/2,y1:-half,x2:w/2,y2:-half,class:'window-line'}));
    g.appendChild(svgEl('line',{x1:-w/2,y1:half,x2:w/2,y2:half,class:'window-line'}));
    g.appendChild(svgEl('line',{x1:0,y1:-half-3,x2:0,y2:half+3,class:'window-mullion'}));
    return {w,h:Math.max(18,thickness+8)};
  }

  const h=Math.max(8,thickness);
  g.appendChild(svgEl('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:Math.min(7,h/2),class:'table-shape'}));
  if(h>14)g.appendChild(svgEl('rect',{x:-w/2+6,y:-h/2+6,width:Math.max(4,w-12),height:Math.max(4,h-12),rx:Math.min(5,(h-12)/2),class:'table-inner'}));
  return {w,h};
}

function modelDisplayName(o){
  if(!o||o.kind!=='light')return o?.name||'';
  const p=presetForObject(o);
  const n=p?.name||o.name||'Projecteur';
  return n.replace(/^amaran\b/i,'Amaran').replace(/^aputure\b/i,'Aputure');
}
function infoModeForObject(o){
  const mode=state.labelsMode||'full';
  if(mode==='hidden')return 'hidden';
  if(mode==='full')return 'full';
  if(mode==='names')return 'names';
  if(mode==='lightcrew')return (o.kind==='light'||o.kind==='accessory')?'full':'hidden';
  if(mode==='direction')return (o.kind==='light'||o.kind==='accessory')?'hidden':'names';
  return 'names';
}
function deleteObjectById(id){
  const o=state.objects.find(x=>x.id===id);if(!o)return;
  state.objects=state.objects.filter(x=>x.id!==id);
  if(state.activePreviewCamera===id)state.activePreviewCamera=state.objects.find(x=>x.kind==='camera')?.id||null;
  if(state.selected===id)state.selected=null;
  render();
}
function duplicateObjectById(id){
  const src=state.objects.find(x=>x.id===id);if(!src)return;
  const copy=deepClone(src);
  copy.id=uid(src.kind||'obj');
  copy.x=(Number(src.x)||0)+24;
  copy.y=(Number(src.y)||0)+24;
  copy.name=`${src.name||kindLabel(src)} copie`;
  copy.locked=false;
  state.objects.push(copy);
  state.selected=copy.id;
  if(copy.kind==='camera'&&!state.activePreviewCamera)state.activePreviewCamera=copy.id;
  render();
}
function beamSliderMax(o){
  if(!o||o.kind!=='light')return 179;
  if(o.modifier==='lantern')return 180;
  if(o.form==='nova-narrow')return 60;
  if(['strip','tube','pixel-bar','mat','panel','panel-wide','nova'].includes(o.form))return 120;
  return 179;
}
function drawObject(o){
  if(o.kind==='light')normalizeLightObject(o);
  const isGroupSelected=multiSelectedIds.has(o.id);const g=svgEl('g',{class:`object ${(state.selected===o.id||isGroupSelected)?'selected':''} ${isGroupSelected?'multi-selected':''} ${o.locked?'locked':''}`,transform:`translate(${o.x} ${o.y}) rotate(${o.rot})`,'data-id':o.id});
  let hitW=96,hitH=96,labelY=50;
  if(o.kind==='camera'){
    g.appendChild(svgEl('circle',{r:36,class:'selection-ring'}));g.appendChild(svgEl('rect',{x:-21,y:-16,width:34,height:32,rx:7,class:'camera-body'}));g.appendChild(svgEl('polygon',{points:'13,-10 34,-17 34,17 13,10',class:'camera-lens'}));
  } else if(o.kind==='subject'){
    g.appendChild(svgEl('circle',{r:34,class:'selection-ring'}));g.appendChild(svgEl('circle',{cx:0,cy:0,r:22,class:'subject-body'}));g.appendChild(svgEl('polygon',{points:'30,0 18,-7 18,7',class:'subject-nose'}));
  } else if(o.kind==='light'){
    g.appendChild(svgEl('circle',{r:48,class:'selection-ring'}));addLightModifier(g,o);addFixtureSymbol(g,o);labelY=62;
  } else if(o.kind==='accessory'){
    const d=drawAccessorySymbol(g,o);hitW=d.w+24;hitH=d.h+24;labelY=d.h/2+28;g.appendChild(svgEl('rect',{x:-hitW/2,y:-hitH/2,width:hitW,height:hitH,rx:8,class:'selection-box'}));
  } else if(o.kind==='decor'){
    const d=drawDecorSymbol(g,o);hitW=d.w+24;hitH=d.h+24;labelY=d.h/2+28;g.appendChild(svgEl('rect',{x:-hitW/2,y:-hitH/2,width:hitW,height:hitH,rx:8,class:'selection-box'}));
  }
  g.appendChild(svgEl('rect',{x:-hitW/2,y:-hitH/2,width:hitW,height:hitH,class:'hit'}));
  if(state.selected===o.id&&!isGroupSelected){
    const toolsY=-hitH/2-25;
    const dup=svgEl('g',{class:'object-duplicate',transform:`translate(${-18} ${toolsY}) rotate(${-o.rot})`,'data-id':o.id});
    dup.appendChild(svgEl('circle',{cx:0,cy:0,r:13,class:'object-duplicate-bg'}));
    dup.appendChild(svgEl('rect',{x:-5.5,y:-3.5,width:8.5,height:8.5,rx:1.8,class:'object-duplicate-icon'}));
    dup.appendChild(svgEl('rect',{x:-2.5,y:-6.5,width:8.5,height:8.5,rx:1.8,class:'object-duplicate-icon'}));
    dup.appendChild(svgEl('path',{d:'M 0 -2.5 L 0 2.5 M -2.5 0 L 2.5 0',class:'object-duplicate-plus'}));
    dup.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();duplicateObjectById(o.id)});
    g.appendChild(dup);
    const trash=svgEl('g',{class:'object-trash',transform:`translate(${18} ${toolsY}) rotate(${-o.rot})`,'data-id':o.id});
    trash.appendChild(svgEl('circle',{cx:0,cy:0,r:13,class:'object-trash-bg'}));
    trash.appendChild(svgEl('path',{d:'M -5 -5 L 5 -5 M -3 -8 L 3 -8 M -4 -3 L -3 6 L 3 6 L 4 -3 M -1 -2 L -1 4 M 1 -2 L 1 4',class:'object-trash-icon'}));
    trash.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();deleteObjectById(o.id)});
    g.appendChild(trash);
  }
  const objectInfoMode=infoModeForObject(o);
  if(objectInfoMode!=='hidden'){
    const pos=o.labelPos||'auto';let lx=0,ly=labelY,anchor='middle';
    if(pos==='top'){ly=-hitH/2-18}else if(pos==='left'){lx=-hitW/2-12;ly=0;anchor='end'}else if(pos==='right'){lx=hitW/2+12;ly=0;anchor='start'}else if(pos==='bottom'){ly=hitH/2+24}
    const label=svgEl('g',{transform:`rotate(${-o.rot}) translate(${lx} ${ly})`}),t=svgEl('text',{class:'object-label','text-anchor':anchor});t.textContent=o.name;label.appendChild(t);
    if(objectInfoMode==='full'){
      if(o.kind==='light'){const st=svgEl('text',{class:'object-sub','text-anchor':anchor,y:17});const modLabel=o.modifier==='hyper-reflector'?'Hyper Reflector':o.modifier==='softbox'?'Softbox':o.modifier==='softbox-grid'?'Softbox + Grid':o.modifier==='fresnel'?'Fresnel':o.modifier==='lantern'?'Lantern':o.modifier==='umbrella-reflect'?'Parapluie réflexion':o.modifier==='umbrella-diffusion'?'Parapluie diffusion':'';const base=`${o.intensity}% · ${lightColorText(o)}${modLabel?' · '+modLabel:''}${o.shower?' · Douche':''}`;st.textContent=state.labelsMode==='lightcrew'?`${base} · H ${Number(o.height||2).toFixed(1)} m`:base;label.appendChild(st)}
      else if(o.kind==='camera'){const st=svgEl('text',{class:'object-sub','text-anchor':anchor,y:17});st.textContent=`${cameraModelShortName(o.cameraModel)} · ${Math.round(o.focal||50)} mm · H ${Number(o.height||1.55).toFixed(2)} m`;label.appendChild(st)}
      else if(o.kind==='accessory'||o.kind==='decor'){const st=svgEl('text',{class:'object-sub','text-anchor':anchor,y:17});st.textContent=`${(o.width||0).toFixed(1)} × ${(o.height||0).toFixed(1)} m${o.locked?' · verrouillé':''}`;label.appendChild(st)}
    }
    g.appendChild(label);
  }
  if(state.selected===o.id&&!isGroupSelected&&!o.locked){
    const beamOffset=o.kind==='light'?fixtureBeamOffset(o):0;const gizmo=svgEl('g',{class:'rotation-gizmo',transform:beamOffset?`rotate(${beamOffset})`:''});gizmo.appendChild(svgEl('line',{x1:40,y1:0,x2:65,y2:0,class:'rotation-stem'}));const handle=svgEl('circle',{cx:74,cy:0,r:12,class:'rotation-handle','data-id':o.id});gizmo.appendChild(handle);const arrow=svgEl('path',{d:'M 69 -4 A 6 6 0 1 1 69 4 M 69 4 L 66 1 M 69 4 L 72 1',class:'rotation-icon','data-id':o.id});gizmo.appendChild(arrow);const angle=svgEl('text',{x:74,y:-19,class:'rotation-angle','text-anchor':'middle'});let shownAngle=o.rot+beamOffset;while(shownAngle>180)shownAngle-=360;while(shownAngle<=-180)shownAngle+=360;angle.textContent=`${Math.round(shownAngle)}°`;gizmo.appendChild(angle);handle.addEventListener('pointerdown',startRotate);arrow.addEventListener('pointerdown',startRotate);gizmo.addEventListener('pointerdown',e=>e.stopPropagation());g.appendChild(gizmo);
  }
  g.addEventListener('pointerdown',startDrag);objectsLayer.appendChild(g);
}

function pointerToStage(e){const pt=stage.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(stage.getScreenCTM().inverse())}
function startDrag(e){
  if(e.pointerType==='touch'&&activeTouchPointers.size>1)return;
  e.preventDefault();e.stopPropagation();const id=e.currentTarget.dataset.id,o=state.objects.find(x=>x.id===id);if(!o)return;
  const inGroup=multiSelectedIds.has(id)&&multiSelectedIds.size>1;
  if(!inGroup){
    multiSelectedIds.clear();
    if(state.selected!==id){state.selected=id;renderInspector();renderQuickControls()}
  }
  if(o.kind==='camera'){state.activePreviewCamera=o.id;renderPreview()}
  if(o.locked){renderInspector();return}
  const p=pointerToStage(e);
  if(inGroup){
    const origins={};
    multiSelectedIds.forEach(sid=>{const item=state.objects.find(x=>x.id===sid);if(item&&!item.locked)origins[sid]={x:item.x,y:item.y}});
    drag={mode:'group-move',id,pointerId:e.pointerId,startX:p.x,startY:p.y,origins};
  }else{
    drag={mode:'move',id,dx:p.x-o.x,dy:p.y-o.y,pointerId:e.pointerId};
  }
  stage.setPointerCapture?.(e.pointerId);
}
function startRotate(e){if(e.pointerType==='touch'&&activeTouchPointers.size>1)return;e.preventDefault();e.stopPropagation();const id=e.currentTarget.dataset.id||e.currentTarget.closest?.('[data-id]')?.dataset.id,o=state.objects.find(x=>x.id===id);if(!o||o.locked)return;state.selected=id;if(o.kind==='camera')state.activePreviewCamera=o.id;drag={mode:'rotate',id,pointerId:e.pointerId,rotateOffset:o.kind==='light'?fixtureBeamOffset(o):0};stage.setPointerCapture?.(e.pointerId)}
stage.addEventListener('pointermove',e=>{
  if(!drag)return;const o=state.objects.find(x=>x.id===drag.id);if(!o)return;const p=pointerToStage(e);
  if(drag.mode==='rotate'){
    o.rot=deg(Math.atan2(p.y-o.y,p.x-o.x))-(drag.rotateOffset||0);if(o.rot>180)o.rot-=360;if(o.rot<=-180)o.rot+=360;
  } else if(drag.mode==='group-move'){
    const rawDx=p.x-drag.startX,rawDy=p.y-drag.startY;
    const ids=Object.keys(drag.origins||{});
    let dx=rawDx,dy=rawDy;
    if(ids.length){
      const first=drag.origins[ids[0]];
      dx=snapValue(first.x+rawDx)-first.x;
      dy=snapValue(first.y+rawDy)-first.y;
      const xs=ids.map(id=>drag.origins[id].x),ys=ids.map(id=>drag.origins[id].y);
      dx=clamp(dx,35-Math.min(...xs),stageW()-35-Math.max(...xs));
      dy=clamp(dy,35-Math.min(...ys),stageH()-35-Math.max(...ys));
    }
    ids.forEach(id=>{const item=state.objects.find(x=>x.id===id);const origin=drag.origins[id];if(item&&origin){item.x=origin.x+dx;item.y=origin.y+dy}});
  } else {
    const targetX=clamp(snapValue(p.x-drag.dx),35,Math.max(35,stageW()-35)),targetY=clamp(snapValue(p.y-drag.dy),35,Math.max(35,stageH()-35));
    o.x=targetX;o.y=targetY;
  }renderCanvas();
});
function clearMultiSelection(){
  if(!multiSelectedIds.size)return;
  multiSelectedIds.clear();
}
function beginLasso(e){
  if(e.pointerType!=='mouse'||e.button!==0||e.target.closest?.('.object')||stageInteractionMode!=='lasso')return false;
  const p=pointerToStage(e);
  clearMultiSelection();
  state.selected=null;
  renderInspector();
  renderQuickControls();
  const rect=svgEl('rect',{x:p.x,y:p.y,width:0,height:0,class:'lasso-selection'});
  objectsLayer.appendChild(rect);
  lassoDrag={pointerId:e.pointerId,startX:p.x,startY:p.y,rect};
  try{stage.setPointerCapture?.(e.pointerId)}catch(_){}
  e.preventDefault();
  e.stopPropagation();
  return true;
}
function moveLasso(e){
  if(!lassoDrag||lassoDrag.pointerId!==e.pointerId)return;
  const p=pointerToStage(e);
  const x=Math.min(lassoDrag.startX,p.x),y=Math.min(lassoDrag.startY,p.y);
  const w=Math.abs(p.x-lassoDrag.startX),h=Math.abs(p.y-lassoDrag.startY);
  lassoDrag.rect?.setAttribute('x',x);
  lassoDrag.rect?.setAttribute('y',y);
  lassoDrag.rect?.setAttribute('width',w);
  lassoDrag.rect?.setAttribute('height',h);
  e.preventDefault();
}
function endLasso(e){
  if(!lassoDrag||lassoDrag.pointerId!==e.pointerId)return false;
  const p=pointerToStage(e);
  const x0=Math.min(lassoDrag.startX,p.x),x1=Math.max(lassoDrag.startX,p.x);
  const y0=Math.min(lassoDrag.startY,p.y),y1=Math.max(lassoDrag.startY,p.y);
  multiSelectedIds=new Set(state.objects.filter(o=>o.x>=x0&&o.x<=x1&&o.y>=y0&&o.y<=y1).map(o=>o.id));
  lassoDrag.rect?.remove();
  try{stage.releasePointerCapture?.(e.pointerId)}catch(_){}
  lassoDrag=null;
  if(multiSelectedIds.size===1){
    const [id]=multiSelectedIds;
    multiSelectedIds.clear();
    state.selected=id;
  }else{
    state.selected=null;
  }
  render();
  return true;
}

function endGesture(){if(!drag)return;try{stage.releasePointerCapture?.(drag.pointerId)}catch{}drag=null;render()}
stage.addEventListener('pointerup',endGesture);stage.addEventListener('pointercancel',endGesture);
stage.addEventListener('pointerdown',e=>{if(e.target.closest?.('.object')||lassoDrag||panGesture||stageInteractionMode==='lasso')return;if(state.selected!==null||multiSelectedIds.size){state.selected=null;clearMultiSelection();render()}});

let inspectorCollapsed=false;
function updateInspectorCollapse(){
  if(!inspector||!inspectorBody||!toggleInspectorBtn)return;
  inspector.classList.toggle('collapsed',inspectorCollapsed);
  inspectorBody.hidden=inspectorCollapsed;
  toggleInspectorBtn.setAttribute('aria-expanded',String(!inspectorCollapsed));
  if(inspectorToggleLabel)inspectorToggleLabel.textContent=inspectorCollapsed?'Afficher':'Masquer';
}
if(toggleInspectorBtn)toggleInspectorBtn.addEventListener('click',()=>{inspectorCollapsed=!inspectorCollapsed;updateInspectorCollapse()});
updateInspectorCollapse();

function selected(){return state.objects.find(o=>o.id===state.selected)}

function setLightModifier(o,value){
  if(!o||o.kind!=='light')return;
  const prev=o.modifier||'none';
  if(value==='lantern'&&prev!=='lantern'){
    const current=Number(o.beam);
    o.beamBeforeLantern=Number.isFinite(current)?current:55;
    o.beam=180;
  }else if(prev==='lantern'&&value!=='lantern'){
    const restored=Number(o.beamBeforeLantern);
    o.beam=Number.isFinite(restored)?restored:55;
    delete o.beamBeforeLantern;
  }
  o.modifier=value;
  if((o.modifier==='softbox'||o.modifier==='softbox-grid')&&!o.modifierSize)o.modifierSize=.9;
  if(o.modifier?.startsWith('umbrella'))o.modifierSize=Number(o.modifierSize)||1.05;
}
function quickModifierOptions(o){
  return supportsSoftbox(o)
    ?[['none','Nu'],['hyper-reflector','Bol / Hyper Reflector'],['softbox','Softbox'],['softbox-grid','Softbox + Grid'],['fresnel','Fresnel'],['lantern','Lantern'],['umbrella-reflect','Parapluie réflexion'],['umbrella-diffusion','Parapluie diffusion']]
    :[['none','Nu']];
}
function renderQuickControls(){
  if(!quickControls)return;
  const o=selected();

  if(!o || !(o.kind==='light' || o.kind==='accessory' || o.kind==='decor')){
    quickControls.hidden=true;
    quickControls.innerHTML='';
    delete quickControls.dataset.objectId;
    return;
  }

  quickControls.hidden=false;
  quickControls.dataset.objectId=o.id;

  if(o.kind==='accessory'||o.kind==='decor'){
    const title=o.name||kindLabel(o);
    quickControls.innerHTML=`
      <div class="quick-control-head">
        <strong>${esc(title)}</strong>
        <span>Réglages rapides</span>
      </div>
      <label class="quick-control-field">
        <span><em>Longueur</em><b id="quickObjectWidthValue">${Number(o.width||0).toFixed(1)} m</b></span>
        <input id="quickObjectWidth" type="range" min="0.1" max="20" step="0.1" value="${Number(o.width||0)}">
      </label>
      <label class="quick-control-field">
        <span><em>Épaisseur</em><b id="quickObjectThicknessValue">${Number(o.height||0).toFixed(2)} m</b></span>
        <input id="quickObjectThickness" type="range" min="0.01" max="20" step="0.01" value="${Number(o.height||0)}">
      </label>`;

    const widthInput=quickControls.querySelector('#quickObjectWidth');
    const widthValue=quickControls.querySelector('#quickObjectWidthValue');
    const thicknessInput=quickControls.querySelector('#quickObjectThickness');
    const thicknessValue=quickControls.querySelector('#quickObjectThicknessValue');

    widthInput?.addEventListener('input',()=>{
      const obj=selected();
      if(!obj||obj.id!==o.id)return;
      obj.width=Number(widthInput.value);
      if(widthValue)widthValue.textContent=`${obj.width.toFixed(1)} m`;
      renderCanvas();
      renderInspector();
    });

    thicknessInput?.addEventListener('input',()=>{
      const obj=selected();
      if(!obj||obj.id!==o.id)return;
      obj.height=Number(thicknessInput.value);
      if(thicknessValue)thicknessValue.textContent=`${obj.height.toFixed(2)} m`;
      renderCanvas();
      renderInspector();
    });
    return;
  }

  normalizeLightObject(o);
  const capability=lightCapability(o);
  const options=quickModifierOptions(o);
  const tempControl=capability==='fixed'
    ?`<div class="quick-control-static"><span>Température</span><strong>${Math.round(o.cct||5600)} K</strong></div>`
    :`<label class="quick-control-field">
        <span><em>Température</em><b id="quickLightCctValue">${Math.round(o.cct||5600)} K</b></span>
        <input id="quickLightCct" type="range" min="2000" max="10000" step="100" value="${Math.round(o.cct||5600)}">
      </label>`;

  quickControls.innerHTML=`
    <div class="quick-control-head">
      <strong>${esc(modelDisplayName(o))}</strong>
      <span>Réglages rapides</span>
    </div>
    <label class="quick-control-select">
      <span>Accessoire</span>
      <select id="quickLightModifier">
        ${options.map(([value,label])=>`<option value="${value}" ${(o.modifier||'none')===value?'selected':''}>${label}</option>`).join('')}
      </select>
    </label>
    <label class="quick-control-field">
      <span><em>Intensité</em><b id="quickLightIntensityValue">${Math.round(o.intensity||0)} %</b></span>
      <input id="quickLightIntensity" type="range" min="0" max="100" step="1" value="${Math.round(o.intensity||0)}">
    </label>
    ${tempControl}
    <label class="quick-control-field">
      <span><em>Ouverture</em><b id="quickLightBeamValue">${Math.round(Number(o.beam)||55)}°</b></span>
      <input id="quickLightBeam" type="range" min="4" max="${beamSliderMax(o)}" step="1" value="${Math.round(Number(o.beam)||55)}">
    </label>`;

  const modifier=quickControls.querySelector('#quickLightModifier');
  const intensity=quickControls.querySelector('#quickLightIntensity');
  const intensityValue=quickControls.querySelector('#quickLightIntensityValue');
  const cct=quickControls.querySelector('#quickLightCct');
  const cctValue=quickControls.querySelector('#quickLightCctValue');
  const beam=quickControls.querySelector('#quickLightBeam');
  const beamValue=quickControls.querySelector('#quickLightBeamValue');

  modifier?.addEventListener('change',()=>{
    const obj=selected();
    if(!obj||obj.id!==o.id)return;
    setLightModifier(obj,modifier.value);
    renderCanvas();
    renderInspector();
    renderQuickControls();
  });

  intensity?.addEventListener('input',()=>{
    const obj=selected();
    if(!obj||obj.id!==o.id)return;
    obj.intensity=Number(intensity.value);
    if(intensityValue)intensityValue.textContent=`${Math.round(obj.intensity)} %`;
    renderCanvas();
    renderInspector();
  });

  cct?.addEventListener('input',()=>{
    const obj=selected();
    if(!obj||obj.id!==o.id)return;
    obj.cct=Number(cct.value);
    if(obj.colorMode==='hsi')obj.colorMode='cct';
    if(cctValue)cctValue.textContent=`${Math.round(obj.cct)} K`;
    renderCanvas();
    renderInspector();
  });

  beam?.addEventListener('input',()=>{
    const obj=selected();
    if(!obj||obj.id!==o.id)return;
    if(obj.modifier==='lantern'){
      obj.beam=180;
      beam.value='180';
      if(beamValue)beamValue.textContent='180°';
    }else{
      obj.beam=Number(beam.value);
      if(beamValue)beamValue.textContent=`${Math.round(obj.beam)}°`;
    }
    renderCanvas();
    renderInspector();
  });
}

function kindLabel(o){return o.kind==='camera'?(o.name||'Caméra'):o.kind==='subject'?(o.name||'Personnage'):o.kind==='light'?(o.name||'Projecteur'):o.kind==='accessory'?(o.name||'Accessoire'):(o.name||'Décor')}
function toggleButtons(key,current,options){return `<div class="inspector-choice" data-choice="${key}">${options.map(([value,label])=>`<button data-value="${esc(value)}" class="${current===value?'active':''}">${esc(label)}</button>`).join('')}</div>`}
function renderInspector(){
  const o=selected();if(!o){inspectorEmpty.classList.remove('hidden');inspectorFields.classList.add('hidden');selectionHint.textContent='Sélectionne un élément';if(changeFixtureHeader)changeFixtureHeader.classList.add('hidden');return}
  inspectorEmpty.classList.add('hidden');inspectorFields.classList.remove('hidden');selectionHint.textContent=o.kind==='light'?modelDisplayName(o):kindLabel(o);
  if(changeFixtureHeader)changeFixtureHeader.classList.add('hidden');
  if(o.kind==='camera')normalizeCameraObject(o);
  let html='';
  if(o.kind==='light'){html+=`<div class="field"><label>Projecteur / modèle</label><button id="changeLightModelBtn" class="model-picker-btn" type="button"><span>${esc(modelDisplayName(o))}</span><strong>Changer</strong></button></div>`;}
  html+=`<div class="field"><label>${o.kind==='light'?'Nom personnalisé':'Nom'}</label><input data-k="name" value="${esc(o.name)}"></div>`;
  if(o.kind==='camera'){
    html+=`<div class="field"><label>Caméra / capteur</label><button id="changeCameraModelBtn" class="model-picker-btn" type="button"><span>${esc(o.cameraModel)}</span><strong>Changer</strong></button></div>`;
    const focalPresets=[18,24,28,35,50,85,105,135];
    html+=`<div class="field"><label>Focale</label><div class="field-inline"><input id="cameraFocalInput" data-k="focal" type="number" min="12" max="300" step="1" value="${Math.round(o.focal)}"><span class="unit">mm</span></div><div class="preset-row">${focalPresets.map(v=>`<button type="button" class="preset-chip ${Math.round(o.focal)===v?'active':''}" data-focal-preset="${v}">${v}</button>`).join('')}</div></div>`;
    html+=`<div class="field slider-field"><div class="slider-head"><label>Hauteur caméra</label><strong data-slider-out="height">${Number(o.height||1.55).toFixed(2)} m</strong></div><input data-k="height" type="range" min="0.2" max="4" step="0.05" value="${o.height}"></div>`;
  }
  if(o.kind==='subject')html+=`<div class="field slider-field"><div class="slider-head"><label>Taille</label><strong data-slider-out="height">${Number(o.height||1.75).toFixed(2)} m</strong></div><input data-k="height" type="range" min="1" max="2.2" step="0.01" value="${o.height}"></div>`;
  else if(o.kind==='light')html+='';
  else if(o.kind==='accessory'||o.kind==='decor')html+=`<div class="field slider-field"><div class="slider-head"><label>Longueur</label><strong data-slider-out="width">${Number(o.width||0).toFixed(1)} m</strong></div><input data-k="width" type="range" min="0.1" max="20" step="0.1" value="${o.width}"></div>`;
  else if(o.kind!=='camera')html+=`<div class="field"><label>Distance sujet</label><div class="field-inline"><input disabled value="${nearestSubjectDistance(o).toFixed(2)}"><span class="unit">m</span></div></div>`;
  if(o.kind==='accessory'||o.kind==='decor'){
    const zDefault=o.kind==='accessory'?(o.height||1.2):(o.type==='wall'?2.5:o.type==='door'?2.04:o.type==='window'?1.2:o.type==='table'?.75:1);
    o.zHeight=Number(o.zHeight||zDefault);
    if(o.elevation===undefined)o.elevation=o.type==='window'?.9:(o.kind==='accessory'?.35:0);
    const depthLabel='Épaisseur';
    html+=`<div class="field slider-field"><div class="slider-head"><label>${depthLabel}</label><strong data-slider-out="height">${Number(o.height||0).toFixed(2)} m</strong></div><input data-k="height" type="range" min="0.01" max="20" step="0.01" value="${o.height}"></div>`;
    html+=`<div class="field slider-field"><div class="slider-head"><label>Hauteur réelle</label><strong data-slider-out="zHeight">${Number(o.zHeight||0).toFixed(2)} m</strong></div><input data-k="zHeight" type="range" min="0.05" max="10" step="0.05" value="${o.zHeight}"></div>`;
    if(o.kind==='accessory'||o.type==='window')html+=`<div class="field slider-field"><div class="slider-head"><label>Hauteur au sol</label><strong data-slider-out="elevation">${Number(o.elevation||0).toFixed(2)} m</strong></div><input data-k="elevation" type="range" min="0" max="5" step="0.05" value="${o.elevation}"></div>`;
  }
  if(o.kind==='light'){
    normalizeLightObject(o);
    html+=`<div class="field slider-field light-height-field"><div class="slider-head light-height-head"><div class="light-height-label"><label>Hauteur projecteur</label><button id="lightShowerBtn" class="light-shower-btn ${o.shower?'active':''}" type="button" aria-pressed="${String(!!o.shower)}">Douche</button></div><strong data-slider-out="height">${Number(o.height||2).toFixed(2)} m</strong></div><input data-k="height" type="range" min="0.2" max="6" step="0.05" value="${Number(o.height||2)}"></div>`;
    html+=`<div class="field"><label>Accessoire lumière</label>${toggleButtons('modifier',o.modifier||'none',supportsSoftbox(o)?[['none','Nu'],['hyper-reflector','Bol / Hyper Reflector'],['softbox','Softbox'],['softbox-grid','Softbox + Grid'],['fresnel','Fresnel'],['lantern','Lantern'],['umbrella-reflect','Parapluie réflexion'],['umbrella-diffusion','Parapluie diffusion']]:[['none','Nu']])}</div>`;
    if(['softbox','softbox-grid','umbrella-reflect','umbrella-diffusion'].includes(o.modifier)){
      const cm=Math.round((Number(o.modifierSize)||.9)*100),label=o.modifier.startsWith('umbrella')?'Diamètre parapluie':'Taille accessoire';
      html+=`<div class="field slider-field"><div class="slider-head"><label>${label}</label><strong data-slider-out="modifierSize">${cm} cm</strong></div><input data-k="modifierSize" data-convert="cm" type="range" min="30" max="300" step="5" value="${cm}"></div>`;
    }
    const capability=lightCapability(o);
    html+=`<div class="field slider-field"><div class="slider-head"><label>Intensité</label><strong data-slider-out="intensity">${Math.round(o.intensity)} %</strong></div><input data-k="intensity" type="range" min="0" max="100" step="1" value="${o.intensity}"></div>`;
    if(capability==='color'){
      html+=`<div class="field"><label>Mode couleur</label>${toggleButtons('colorMode',o.colorMode||'cct',[['cct','Température'],['hsi','HSI']])}</div>`;
      if((o.colorMode||'cct')==='hsi'){
        html+=`<div class="field-grid"><div class="field"><label>Hue</label><div class="field-inline"><input data-k="hue" type="number" min="0" max="360" step="1" value="${Math.round(o.hue||0)}"><span class="unit">°</span></div></div><div class="field slider-field"><div class="slider-head"><label>Saturation</label><strong data-slider-out="saturation">${Math.round(o.saturation??100)} %</strong></div><input data-k="saturation" type="range" min="0" max="100" step="1" value="${Math.round(o.saturation??100)}"></div></div>`;
      } else {
        html+=`<div class="field slider-field"><div class="slider-head"><label>Température de couleur</label><strong data-slider-out="cct">${Math.round(o.cct||5600)} K</strong></div><input data-k="cct" type="range" min="2000" max="10000" step="100" value="${Math.round(o.cct||5600)}"></div>`;
      }
    } else if(capability==='bicolor') {
      html+=`<div class="field slider-field"><div class="slider-head"><label>Température de couleur</label><strong data-slider-out="cct">${Math.round(o.cct||5600)} K</strong></div><input data-k="cct" type="range" min="2000" max="10000" step="100" value="${Math.round(o.cct||5600)}"></div>`;
    } else {
      html+=`<div class="field"><label>Température fixe</label><div class="field-inline"><input disabled value="${Math.round(o.cct||5600)}"><span class="unit">K</span></div></div>`;
    }
    const beamMax=beamSliderMax(o),beamValue=Math.min(beamMax,Math.max(4,Math.round(Number(o.beam)||55)));
    html+=`<div class="field slider-field"><div class="slider-head"><label>Ouverture du cône</label><strong data-slider-out="beam">${beamValue}°</strong></div><input data-k="beam" type="range" min="4" max="${beamMax}" step="1" value="${beamValue}"><small class="field-help">Schématique : sert à visualiser l'ouverture sur le plan.</small></div>`;
  }
  if(o.kind==='accessory'||o.kind==='decor')html+=`<label class="lock-row"><input id="lockSelected" type="checkbox" ${o.locked?'checked':''}> <span>Verrouiller la position</span></label>`;
  inspectorFields.innerHTML=html;
  inspectorFields.querySelectorAll('[data-k]').forEach(inp=>inp.addEventListener('input',()=>{const obj=selected();if(!obj)return;const key=inp.dataset.k;let val=inp.value;if(['height','width','zHeight','elevation','intensity','beam','focal','modifierSize','cct','hue','saturation'].includes(key))val=Number(val);if(inp.dataset.convert==='cm')val=val/100;if(key==='focal')val=clamp(Number.isFinite(val)?val:Number(inp.value)||obj.focal||50,12,300);obj[key]=val;const out=inp.parentElement?.querySelector(`[data-slider-out="${key}"]`)||inp.closest('.field')?.querySelector(`[data-slider-out="${key}"]`);if(out){const num=Number(inp.value);const shown=inp.dataset.convert==='cm'?Math.round(num):(key==='cct'||key==='beam'||key==='focal'?Math.round(num):num);out.textContent=key==='cct'?`${shown} K`:key==='beam'?`${shown}°`:key==='focal'?`${shown} mm`:['height','width','zHeight','elevation'].includes(key)?`${num.toFixed(key==='width'?1:2)} m`:inp.dataset.convert==='cm'?`${shown} cm`:`${Math.round(num)} %`}if(key==='focal'){const numVal=Math.round(obj.focal||50);const focalInput=document.getElementById('cameraFocalInput');if(focalInput&&document.activeElement!==focalInput)focalInput.value=String(numVal);inspectorFields.querySelectorAll('[data-focal-preset]').forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.focalPreset)===numVal))}if(obj.kind==='camera')state.activePreviewCamera=obj.id;renderCanvas();renderQuickControls()}));
  const changeCameraModelBtn=document.getElementById('changeCameraModelBtn');if(changeCameraModelBtn)changeCameraModelBtn.onclick=()=>{const obj=selected();if(obj?.kind==='camera')openCameraChooser(obj.id)};
  inspectorFields.querySelectorAll('[data-focal-preset]').forEach(btn=>btn.onclick=()=>{const obj=selected();if(!obj||obj.kind!=='camera')return;obj.focal=clamp(Number(btn.dataset.focalPreset)||50,12,300);state.activePreviewCamera=obj.id;renderInspector();renderCanvas()});
  const changeLightModelBtn=document.getElementById('changeLightModelBtn');if(changeLightModelBtn)changeLightModelBtn.onclick=()=>{const obj=selected();if(obj?.kind==='light')openLightChooser(obj.id)};
  const lightShowerBtn=document.getElementById('lightShowerBtn');if(lightShowerBtn)lightShowerBtn.onclick=()=>{const obj=selected();if(!obj||obj.kind!=='light')return;obj.shower=!obj.shower;render()};
  inspectorFields.querySelectorAll('[data-choice] button').forEach(btn=>btn.onclick=()=>{const obj=selected();if(!obj)return;const key=btn.parentElement.dataset.choice;if(key==='modifier')setLightModifier(obj,btn.dataset.value);else obj[key]=btn.dataset.value;render()});
  const lock=document.getElementById('lockSelected');if(lock)lock.onchange=()=>{o.locked=lock.checked;render()};
}
function nearestSubjectDistance(o){const ss=state.objects.filter(x=>x.kind==='subject');if(!ss.length)return 0;return Math.min(...ss.map(s=>dist(o,s)))}

// V0.8 — association au mur explicite : aucun aimantage automatique.
function isOpening(o){return o?.kind==='decor'&&['window','door'].includes(o.type)}
function wallFrame(wall){
  const a=rad(wall.rot||0);return{ux:{x:Math.cos(a),y:Math.sin(a)},uy:{x:-Math.sin(a),y:Math.cos(a)},half:(wall.width||3)*SCALE/2};
}
function openingPlacementOnWall(o,wall,x=o.x,y=o.y){
  const f=wallFrame(wall),dx=x-wall.x,dy=y-wall.y,along=dx*f.ux.x+dy*f.ux.y,perp=dx*f.uy.x+dy*f.uy.y,halfOpening=(o.width||1)*SCALE/2;
  const limit=Math.max(0,f.half-halfOpening),clamped=clamp(along,-limit,limit);
  return{along,perp,clamped,x:wall.x+f.ux.x*clamped,y:wall.y+f.ux.y*clamped,rot:wall.rot||0};
}
function attachOpeningToWall(o,wall,x=o.x,y=o.y){
  if(!isOpening(o)||!wall||wall.type!=='wall')return false;const p=openingPlacementOnWall(o,wall,x,y);o.wallId=wall.id;o.wallOffset=p.clamped/SCALE;o.x=p.x;o.y=p.y;o.rot=p.rot;return true;
}
function detachOpening(o){if(!o)return;delete o.wallId;delete o.wallOffset}
function findNearbyWall(o,x=o.x,y=o.y,maxDistance=.32){
  if(!isOpening(o))return null;let best=null;for(const wall of state.objects.filter(w=>w.kind==='decor'&&w.type==='wall')){
    const p=openingPlacementOnWall(o,wall,x,y),halfOpening=(o.width||1)*SCALE/2,within=Math.abs(p.along)<=wallFrame(wall).half+halfOpening*.35;
    if(!within)continue;const d=Math.abs(p.perp)/SCALE;if(d<=maxDistance&&(!best||d<best.d))best={wall,p,d};
  }return best;
}
function syncOpeningToWall(o){
  if(!isOpening(o)||!o.wallId)return;const wall=state.objects.find(w=>w.id===o.wallId&&w.type==='wall');if(!wall){detachOpening(o);return}
  const f=wallFrame(wall),halfOpening=(o.width||1)*SCALE/2,limit=Math.max(0,f.half-halfOpening),off=clamp(Number(o.wallOffset??0)*SCALE,-limit,limit);o.wallOffset=off/SCALE;o.x=wall.x+f.ux.x*off;o.y=wall.y+f.ux.y*off;o.rot=wall.rot||0;
}
function syncWallChildren(wall){state.objects.filter(o=>o.wallId===wall.id).forEach(syncOpeningToWall)}
function migrateOpeningBindings(){
  // V1.0 simplifie le décor : fenêtres et portes restent toujours des objets libres.
  state.objects.filter(isOpening).forEach(detachOpening);
  state.openingBindingVersion=3;
}

function cameraSpace(cam,obj){const dx=(obj.x-cam.x)/SCALE,dy=(obj.y-cam.y)/SCALE,a=-rad(cam.rot);return{forward:dx*Math.cos(a)-dy*Math.sin(a),side:dx*Math.sin(a)+dy*Math.cos(a)}}
function cameraFovs(cam){const {sensor,focal}=cameraSettings(cam),hfov=2*Math.atan(sensor.w/(2*focal)),effectiveH=Math.min(sensor.h,sensor.w*9/16),vfov=2*Math.atan(effectiveH/(2*focal));return{hfov,vfov,sensor,focal}}
function projectWorld(cam,x,y,z,W=1600,H=900){
  const cs=cameraSpace(cam,{x,y});if(cs.forward<=.03)return null;const {hfov,vfov}=cameraFovs(cam),halfW=cs.forward*Math.tan(hfov/2),halfH=cs.forward*Math.tan(vfov/2);return{x:W*(.5+cs.side/(2*halfW)),y:H*(.5-(z-(cam.height||1.55))/(2*halfH)),forward:cs.forward,side:cs.side};
}
function shotLabel(item,monitorH=900){
  if(!item||!item.bbox)return null;
  const top=Number(item.bbox.y0),bottom=Number(item.bbox.y1),fullH=Math.abs(bottom-top);
  if(!Number.isFinite(top)||!Number.isFinite(bottom)||fullH<1)return null;
  // Si le haut du sujet est fortement hors cadre, le découpage ne correspond plus à une nomenclature fiable.
  if(top < -monitorH*.05)return null;
  // Le bas du cadre est converti en hauteur anatomique (0 = pieds, 1 = sommet du crâne).
  const cutFromGround=bottom<=monitorH?0:clamp((bottom-monitorH)/fullH,0,1);
  if(cutFromGround===0){
    const r=fullH/monitorH;
    return r<.52?'Plan pied large':'Plan pied';
  }
  // Catégories fondées sur le point de coupe réel du corps, et non sur sa hauteur totale projetée.
  if(cutFromGround<.43)return'Plan américain';       // coupe cuisses / au-dessus du genou
  if(cutFromGround<.60)return'Plan taille';          // bassin / taille
  if(cutFromGround<.76)return'Plan poitrine';        // buste / poitrine
  if(cutFromGround<.90)return'Gros plan';            // épaules / base du cou
  return'Très gros plan';                            // visage
}
function objectAxisEndpoints(o,widthMeters){const a=rad(o.rot||0),dx=Math.cos(a)*widthMeters*SCALE/2,dy=Math.sin(a)*widthMeters*SCALE/2;return[{x:o.x-dx,y:o.y-dy},{x:o.x+dx,y:o.y+dy}]}
function svgNode(tag,attrs={},text=''){const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text)el.textContent=text;return el}
function verticalPlanePoints(cam,o,width,z0,z1){
  const [a,b]=objectAxisEndpoints(o,width),pts=[projectWorld(cam,a.x,a.y,z0),projectWorld(cam,b.x,b.y,z0),projectWorld(cam,b.x,b.y,z1),projectWorld(cam,a.x,a.y,z1)];return pts.some(p=>!p)?null:pts;
}
function projectedVerticalPlane(cam,o,width,z0,z1,cls,label){
  const pts=verticalPlanePoints(cam,o,width,z0,z1);if(!pts)return null;const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),g=svgNode('g',{'data-depth':Math.max(...pts.map(p=>p.forward))});g.appendChild(svgNode('polygon',{points:pts.map(p=>`${p.x},${p.y}`).join(' '),class:cls}));
  if(label){const cx=xs.reduce((a,b)=>a+b,0)/4,cy=ys.reduce((a,b)=>a+b,0)/4;g.appendChild(svgNode('text',{x:cx,y:cy,class:'preview-object-code','text-anchor':'middle','dominant-baseline':'middle'},label))}
  return{node:g,depth:pts.reduce((a,p)=>a+p.forward,0)/4,bbox:{x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys)}};
}
function pathFromProjectedPoints(pts){return`M ${pts.map(p=>`${p.x} ${p.y}`).join(' L ')} Z`}
function angleDistance180(a,b){let d=Math.abs((((Number(a||0)-Number(b||0))+90)%180+180)%180-90);return d}
function previewWallMatch(o){
  if(!isOpening(o))return null;
  if(o.wallId){const wall=state.objects.find(w=>w.id===o.wallId&&w.kind==='decor'&&w.type==='wall');if(wall)return{wall,p:openingPlacementOnWall(o,wall,o.x,o.y),explicit:true}}
  let best=null;
  for(const wall of state.objects.filter(w=>w.kind==='decor'&&w.type==='wall')){
    const p=openingPlacementOnWall(o,wall,o.x,o.y),angle=angleDistance180(o.rot,wall.rot),perp=Math.abs(p.perp)/SCALE,halfOpening=(o.width||1)*SCALE/2,within=Math.abs(p.along)<=wallFrame(wall).half-halfOpening*.55;
    const tolerance=Math.max(.12,Number(wall.height||.1)/2+Number(o.height||.1)/2+.07);
    if(!within||perp>tolerance||angle>12)continue;
    const score=perp+angle/120;if(!best||score<best.score)best={wall,p,explicit:false,score};
  }
  return best;
}
function previewOpeningProxy(o,match){
  if(!match)return o;const f=wallFrame(match.wall),halfOpening=(o.width||1)*SCALE/2,limit=Math.max(0,f.half-halfOpening),off=clamp(match.p.clamped,-limit,limit);
  return{...o,x:match.wall.x+f.ux.x*off,y:match.wall.y+f.ux.y*off,rot:match.wall.rot||0};
}
function projectedWallWithOpenings(cam,wall){
  const outer=verticalPlanePoints(cam,wall,wall.width||3,0,wall.zHeight||2.5);if(!outer)return null;
  const children=state.objects.filter(isOpening).map(o=>({o,match:previewWallMatch(o)})).filter(x=>x.match?.wall?.id===wall.id);let d=pathFromProjectedPoints(outer),projectedChildren=[];
  for(const {o,match} of children){const proxy=previewOpeningProxy(o,match),z0=o.type==='window'?(o.elevation??.9):0,z1=o.type==='window'?z0+(o.zHeight||1.2):(o.zHeight||2.04),pts=verticalPlanePoints(cam,proxy,o.width||(o.type==='window'?1.5:.9),z0,z1);if(!pts)continue;d+=' '+pathFromProjectedPoints(pts);projectedChildren.push({o,pts});}
  const xs=outer.map(p=>p.x),ys=outer.map(p=>p.y),g=svgNode('g',{'data-depth':Math.max(...outer.map(p=>p.forward))});
  g.appendChild(svgNode('path',{d,class:'preview-wall','fill-rule':'evenodd'}));
  // Le trou est réellement découpé dans le mur. On ne redessine qu'un cadre, sans aplat opaque devant le mur.
  for(const {o,pts} of projectedChildren){
    const cls=o.type==='window'?'preview-window-frame':'preview-door-frame';
    g.appendChild(svgNode('polygon',{points:pts.map(p=>`${p.x},${p.y}`).join(' '),class:cls}));
    if(o.type==='window'){
      const bottomMid={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2},topMid={x:(pts[2].x+pts[3].x)/2,y:(pts[2].y+pts[3].y)/2};
      g.appendChild(svgNode('line',{x1:bottomMid.x,y1:bottomMid.y,x2:topMid.x,y2:topMid.y,class:'preview-window-mullion'}));
    }
  }
  return{node:g,depth:outer.reduce((a,p)=>a+p.forward,0)/4,bbox:{x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys)}};
}
function projectedBillboard(cam,x,y,zCenter,width,height,cls,label){
  const c=projectWorld(cam,x,y,zCenter);if(!c)return null;const {hfov,vfov}=cameraFovs(cam),W=1600,H=900,pxW=W*width/(2*c.forward*Math.tan(hfov/2)),pxH=H*height/(2*c.forward*Math.tan(vfov/2)),x0=c.x-pxW/2,y0=c.y-pxH/2;
  const g=svgNode('g',{'data-depth':c.forward});g.appendChild(svgNode('rect',{x:x0,y:y0,width:pxW,height:pxH,rx:Math.min(18,Math.max(3,pxH*.08)),class:cls}));if(label&&pxW>28&&pxH>16)g.appendChild(svgNode('text',{x:c.x,y:c.y,class:'preview-object-code','text-anchor':'middle','dominant-baseline':'middle'},label));return{node:g,depth:c.forward,bbox:{x0,x1:x0+pxW,y0,y1:y0+pxH}};
}
function bboxTouchesFrame(b){return b&&b.x1>0&&b.x0<1600&&b.y1>0&&b.y0<900}
function addSubjectPreview(cam,o){
  const bottom=projectWorld(cam,o.x,o.y,0),top=projectWorld(cam,o.x,o.y,o.height||1.75);if(!bottom||!top)return null;const h=Math.abs(bottom.y-top.y),midX=(bottom.x+top.x)/2,w=Math.max(12,h*.28),g=svgNode('g',{'data-depth':bottom.forward});
  const headR=Math.max(4,w*.27),headY=top.y+h*.12;g.appendChild(svgNode('circle',{cx:midX,cy:headY,r:headR,class:'preview-subject'}));g.appendChild(svgNode('rect',{x:midX-w*.38,y:top.y+h*.23,width:w*.76,height:h*.43,rx:w*.22,class:'preview-subject'}));g.appendChild(svgNode('rect',{x:midX-w*.32,y:top.y+h*.60,width:w*.25,height:h*.40,rx:w*.06,class:'preview-subject'}));g.appendChild(svgNode('rect',{x:midX+w*.07,y:top.y+h*.60,width:w*.25,height:h*.40,rx:w*.06,class:'preview-subject'}));
  const faceSize=headR*2;
  if(faceSize>16){
    const a=rad(o.rot||0),forwardLen=.4*SCALE;
    const frontPoint=projectWorld(cam,o.x+Math.cos(a)*forwardLen,o.y+Math.sin(a)*forwardLen,(o.height||1.75)*.9);
    const screenDx=frontPoint?frontPoint.x-midX:0;
    const dir=screenDx>=0?1:-1; // +1 = regarde vers la droite du cadre
    const toCamX=(cam.x-o.x)/SCALE,toCamY=(cam.y-o.y)/SCALE,toCamLen=Math.hypot(toCamX,toCamY)||1;
    const fwdX=Math.cos(a),fwdY=Math.sin(a);
    const towardCam=(fwdX*(toCamX/toCamLen)+fwdY*(toCamY/toCamLen)); // 1 = face caméra, 0 = profil, -1 = dos caméra
    const eyeY=headY-headR*.10,eyeRx=Math.max(1.9,headR*.14),eyeRy=Math.max(1.6,headR*.11),pupilR=Math.max(1.1,headR*.06);
    if(towardCam>0.97){
      // Regard caméra franc uniquement si vraiment face caméra
      const spread=headR*.40,leftX=midX-spread,rightX=midX+spread,noseX=midX;
      g.appendChild(svgNode('ellipse',{cx:leftX,cy:eyeY,rx:eyeRx,ry:eyeRy,class:'preview-face-feature'}));
      g.appendChild(svgNode('ellipse',{cx:rightX,cy:eyeY,rx:eyeRx,ry:eyeRy,class:'preview-face-feature'}));
      g.appendChild(svgNode('circle',{cx:leftX,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('circle',{cx:rightX,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('polygon',{points:`${noseX},${headY+headR*.02} ${noseX+headR*.08},${headY+headR*.20} ${noseX-headR*.08},${headY+headR*.20}`,class:'preview-face-nose-fill'}));
    }else if(towardCam>0.78){
      // Face légèrement de biais : deux yeux presque symétriques, nez très peu décalé
      const amt=(0.97-towardCam)/(0.97-0.78);
      const spread=headR*(.40-.02*amt),shift=dir*headR*(.03+.06*amt),noseX=midX+dir*headR*(.04+.08*amt);
      const leftX=midX-spread+shift,rightX=midX+spread+shift;
      const farScale=1-amt*.10,nearScale=1+amt*.03;
      const leftNear=dir>0,rightNear=dir<0;
      g.appendChild(svgNode('ellipse',{cx:leftX,cy:eyeY,rx:eyeRx*(leftNear?nearScale:farScale),ry:eyeRy*(leftNear?nearScale:farScale),class:'preview-face-feature'}));
      g.appendChild(svgNode('ellipse',{cx:rightX,cy:eyeY,rx:eyeRx*(rightNear?nearScale:farScale),ry:eyeRy*(rightNear?nearScale:farScale),class:'preview-face-feature'}));
      g.appendChild(svgNode('circle',{cx:leftX+dir*eyeRx*.22,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('circle',{cx:rightX+dir*eyeRx*.22,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('path',{d:`M ${noseX} ${headY+headR*.02} L ${noseX+dir*headR*.08} ${headY+headR*.17} L ${noseX-dir*headR*.03} ${headY+headR*.28}`,class:'preview-face-nose'}));
    }else if(towardCam>0.42){
      // Trois-quarts doux : deux yeux, lointain un peu plus petit, nez qui tourne progressivement
      const amt=(0.78-towardCam)/(0.78-0.42);
      const spread=headR*(.39-.05*amt),shift=dir*headR*(.08+.10*amt),noseX=midX+dir*headR*(.10+.12*amt);
      const leftX=midX-spread+shift,rightX=midX+spread+shift;
      const farScale=1-amt*.28,nearScale=1+amt*.04;
      const leftNear=dir>0,rightNear=dir<0;
      g.appendChild(svgNode('ellipse',{cx:leftX,cy:eyeY,rx:eyeRx*(leftNear?nearScale:farScale),ry:eyeRy*(leftNear?nearScale:farScale),class:'preview-face-feature'}));
      g.appendChild(svgNode('ellipse',{cx:rightX,cy:eyeY,rx:eyeRx*(rightNear?nearScale:farScale),ry:eyeRy*(rightNear?nearScale:farScale),class:'preview-face-feature'}));
      g.appendChild(svgNode('circle',{cx:leftX+dir*eyeRx*.3,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('circle',{cx:rightX+dir*eyeRx*.3,cy:eyeY,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('path',{d:`M ${noseX} ${headY+headR*.02} L ${noseX+dir*headR*.12} ${headY+headR*.17} L ${noseX-dir*headR*.04} ${headY+headR*.30}`,class:'preview-face-nose'}));
    }else if(towardCam>-0.30){
      // Profil / quasi profil : un oeil placé au-dessus + nez noir clairement hors du visage
      const eyeX=midX+dir*headR*.33,eyeYProfile=headY-headR*.16,triBaseX=midX+dir*headR*.92,triTipX=midX+dir*headR*1.28,triY=headY+headR*.04;
      g.appendChild(svgNode('ellipse',{cx:eyeX,cy:eyeYProfile,rx:eyeRx*1.02,ry:eyeRy*1.02,class:'preview-face-feature'}));
      g.appendChild(svgNode('circle',{cx:eyeX+dir*eyeRx*.20,cy:eyeYProfile,r:pupilR,class:'preview-face-pupil'}));
      g.appendChild(svgNode('polygon',{points:`${triTipX},${triY} ${triBaseX},${triY-headR*.14} ${triBaseX},${triY+headR*.14}`,class:'preview-face-nose-solid'}));
    }else{
      // Dos caméra
      g.appendChild(svgNode('path',{d:`M ${midX-headR*.26} ${headY-headR*.06} Q ${midX} ${headY+headR*.12} ${midX+headR*.26} ${headY-headR*.06}`,class:'preview-face-back'}));
    }
  }
  g.appendChild(svgNode('text',{x:midX,y:Math.max(18,top.y-10),class:'preview-subject-label','text-anchor':'middle'},o.name));
  return{node:g,depth:bottom.forward,bbox:{x0:midX-w/2,x1:midX+w/2,y0:top.y,y1:bottom.y},subjectHeight:h};
}
function addTablePreview(cam,o){
  const a=rad(o.rot||0),ux={x:Math.cos(a),y:Math.sin(a)},uy={x:-Math.sin(a),y:Math.cos(a)},hw=(o.width||1.6)*SCALE/2,hd=(o.height||.8)*SCALE/2,z=o.zHeight||.75,ptsWorld=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy])=>({x:o.x+ux.x*hw*sx+uy.x*hd*sy,y:o.y+ux.y*hw*sx+uy.y*hd*sy})),pts=ptsWorld.map(p=>projectWorld(cam,p.x,p.y,z));if(pts.some(p=>!p))return null;const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),g=svgNode('g');g.appendChild(svgNode('polygon',{points:pts.map(p=>`${p.x},${p.y}`).join(' '),class:'preview-table'}));const near=[...pts].sort((a,b)=>a.forward-b.forward).slice(0,2);near.forEach((pt,i)=>{const wp=ptsWorld[pts.indexOf(pt)],base=projectWorld(cam,wp.x,wp.y,0);if(base)g.appendChild(svgNode('line',{x1:pt.x,y1:pt.y,x2:base.x,y2:base.y,class:'preview-table-leg'}))});return{node:g,depth:pts.reduce((a,p)=>a+p.forward,0)/4,bbox:{x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys)}};
}
function previewItemForObject(cam,o){
  if(o.id===cam.id)return null;
  if(o.kind==='subject')return addSubjectPreview(cam,o);
  if(o.kind==='decor'){
    // V1.0 : la vue caméra est un contrôle de cadre/encombrement, pas une reconstruction 3D du décor.
    if(o.type==='wall'||o.type==='door')return null;
    if(o.type==='window')return projectedVerticalPlane(cam,o,o.width||1.5,o.elevation??.9,(o.elevation??.9)+(o.zHeight||1.2),'preview-window','FENÊTRE');
    if(o.type==='table')return addTablePreview(cam,o);
  }
  if(o.kind==='accessory'){
    const cls=o.type==='diffusion'?'preview-diffusion':o.type==='reflector'?'preview-reflector':o.type==='borniol'?'preview-borniol':'preview-negative';return projectedVerticalPlane(cam,o,o.width||1.2,o.elevation??.35,(o.elevation??.35)+(o.zHeight||o.height||1.5),cls,o.short||'');
  }
  if(o.kind==='light'){
    const a=rad(o.rot||0),mod=o.modifier||'none',soft=mod==='softbox',umbrella=mod==='umbrella-reflect'||mod==='umbrella-diffusion',modSize=Math.max(.3,Number(o.modifierSize)||(soft?.9:1.05)),shift=soft?Math.max(.25,modSize*.28):umbrella?Math.max(.22,modSize*.22):0,x=o.x+Math.cos(a)*shift*SCALE,y=o.y+Math.sin(a)*shift*SCALE;let w=.38,h=.30,label=o.short||'LIGHT',cls='preview-light';
    if(soft){w=Math.max(.45,modSize*.78);h=Math.max(.45,modSize*.78);label='SOFTBOX';cls='preview-softbox'}else if(umbrella){w=Math.max(.42,modSize*.72);h=Math.max(.42,modSize*.72);label=mod==='umbrella-reflect'?'PARA R':'PARA D';cls=mod==='umbrella-reflect'?'preview-umbrella-reflect':'preview-umbrella-diffusion'}else if(['tube','pixel-bar','strip'].includes(o.form)){w=(o.length||60)/55*.65;h=.10}else if(['panel','panel-wide','nova','nova-narrow','mat'].includes(o.form)){w=.75;h=.48}else if(o.form==='halo'){w=.48;h=.48;cls='preview-halo'};
    return projectedBillboard(cam,x,y,o.height||2,w,h,cls,label);
  }
  if(o.kind==='camera')return projectedBillboard(cam,o.x,o.y,o.height||1.55,.48,.34,'preview-other-camera','CAM');
  return null;
}
function makeMonitorCard(cam,compact=false){
  normalizeCameraObject(cam);const card=document.createElement('div');card.className='camera-monitor-card'+(compact?' compact':'');card.dataset.cameraId=cam.id;
  const head=document.createElement('div');head.className='camera-monitor-head';head.innerHTML=`<div><strong>${esc(cam.name)}</strong><span>${esc(cam.cameraModel)} · ${cam.focal} mm · H ${cam.height.toFixed(2)} m</span></div><button class="monitor-select" type="button">Sélectionner</button>`;head.querySelector('button').onclick=()=>{state.selected=cam.id;state.activePreviewCamera=cam.id;render()};card.appendChild(head);
  const shell=document.createElement('div');shell.className='monitor-shell';const monitor=document.createElement('div');monitor.className='monitor';const svg=svgNode('svg',{viewBox:'0 0 1600 900',preserveAspectRatio:'xMidYMid slice',class:'preview-svg'});svg.appendChild(svgNode('rect',{x:0,y:0,width:1600,height:900,class:'preview-background'}));
  const items=[];let visibleSubjects=[],technical=[],visibleWindows=[];state.objects.forEach(o=>{const item=previewItemForObject(cam,o);if(!item)return;item.object=o;items.push(item);if(bboxTouchesFrame(item.bbox)){if(o.kind==='subject')visibleSubjects.push(item);if(['light','accessory','camera'].includes(o.kind))technical.push(o);if(o.kind==='decor'&&o.type==='window')visibleWindows.push(o)}});items.sort((a,b)=>b.depth-a.depth).forEach(item=>svg.appendChild(item.node));
  const guides=svgNode('g',{class:'preview-guides'});guides.appendChild(svgNode('rect',{x:80,y:45,width:1440,height:810,class:'preview-safe'}));[1600/3,3200/3].forEach(x=>guides.appendChild(svgNode('line',{x1:x,y1:0,x2:x,y2:900,class:'preview-third'})));[300,600].forEach(y=>guides.appendChild(svgNode('line',{x1:0,y1:y,x2:1600,y2:y,class:'preview-third'})));svg.appendChild(guides);monitor.appendChild(svg);
  const label=document.createElement('div');label.className='preview-label';if(visibleSubjects.length){const main=visibleSubjects.sort((a,b)=>Math.abs((a.bbox.x0+a.bbox.x1)/2-800)-Math.abs((b.bbox.x0+b.bbox.x1)/2-800))[0];const framing=shotLabel(main);label.textContent=`${framing?framing+' · ':''}${visibleSubjects.length} sujet${visibleSubjects.length>1?'s':''} visible${visibleSubjects.length>1?'s':''}`}else label.textContent='Aucun sujet dans le cadre';monitor.appendChild(label);
  if(visibleWindows.length){const info=document.createElement('div');info.className='preview-scene-info';info.textContent=`Fenêtre${visibleWindows.length>1?'s':''} visible${visibleWindows.length>1?'s':''} : ${visibleWindows.map(o=>o.name).slice(0,2).join(' · ')}${visibleWindows.length>2?` +${visibleWindows.length-2}`:''}`;monitor.appendChild(info)}
  if(technical.length){const alert=document.createElement('div');alert.className='preview-warning';const names=[...new Set(technical.map(o=>o.kind==='light'?(o.modifier==='softbox'?`${o.short||o.name} + softbox`:o.modifier==='softbox-grid'?`${o.short||o.name} + softbox + grid`:o.modifier==='fresnel'?`${o.short||o.name} + fresnel`:o.modifier==='lantern'?`${o.short||o.name} + lantern`:o.modifier==='umbrella-reflect'?`${o.short||o.name} + parapluie réflexion`:o.modifier==='umbrella-diffusion'?`${o.short||o.name} + parapluie diffusion`:(o.short||o.name)):o.name))];alert.textContent=`⚠ Dans le champ : ${names.slice(0,3).join(' · ')}${names.length>3?` +${names.length-3}`:''}`;monitor.appendChild(alert)}
  shell.appendChild(monitor);card.appendChild(shell);return card;
}
function renderPreview(){
  const cams=state.objects.filter(o=>o.kind==='camera').map(normalizeCameraObject);cameraMonitors.innerHTML='';previewTabs.innerHTML='';
  if(!cams.length){previewTabs.classList.add('hidden');cameraReadout.textContent='Ajoute une caméra pour afficher le cadre.';cameraMonitors.innerHTML='<div class="no-camera-preview">Ajoute une caméra au plan pour voir son cadre.</div>';return}
  if(!cams.some(c=>c.id===state.activePreviewCamera))state.activePreviewCamera=cams[0].id;
  if(cams.length===1){previewTabs.classList.add('hidden');cameraReadout.textContent='';cameraMonitors.className='camera-monitors one';cameraMonitors.appendChild(makeMonitorCard(cams[0]));return}
  if(cams.length===2){previewTabs.classList.add('hidden');cameraReadout.textContent='2 caméras · vues affichées simultanément.';cameraMonitors.className='camera-monitors two';cams.forEach(c=>cameraMonitors.appendChild(makeMonitorCard(c,true)));return}
  previewTabs.classList.remove('hidden');cameraReadout.textContent=`${cams.length} caméras · sélectionne la vue à afficher.`;cams.forEach(c=>{const b=document.createElement('button');b.className='preview-tab'+(c.id===state.activePreviewCamera?' active':'');b.textContent=c.name;b.onclick=()=>{state.activePreviewCamera=c.id;renderPreview()};previewTabs.appendChild(b)});cameraMonitors.className='camera-monitors one';cameraMonitors.appendChild(makeMonitorCard(cams.find(c=>c.id===state.activePreviewCamera)||cams[0]));
}

function addSubject(){const n=state.objects.filter(o=>o.kind==='subject').length+1,o={id:uid('subj'),kind:'subject',name:`Sujet ${n}`,x:stageW()/2+40*(n-1),y:stageH()/2-10,rot:90,height:1.75,locked:false,labelVisible:true,labelPos:'auto'};state.objects.push(o);state.selected=o.id;closeAddDialog();render()}
function addCamera(cameraModel='Sony FX3'){const n=state.objects.filter(o=>o.kind==='camera').length+1,o={id:uid('cam'),kind:'camera',name:`Caméra ${String.fromCharCode(64+n)}`,x:stageW()/2+(n-1)*55,y:stageH()-100,rot:-90,height:1.55,cameraModel:cameras[cameraModel]?cameraModel:'Sony FX3',focal:50,locked:false,labelVisible:true,labelPos:'auto'};state.objects.push(o);state.selected=o.id;state.activePreviewCamera=o.id;closeAddDialog();render()}
function addLightFromPreset(p,replaceId=null){
  if(replaceId){const o=state.objects.find(x=>x.id===replaceId);if(o){const mod=o.modifier||'none';Object.assign(o,{name:p.name,brand:p.brand,family:p.family,form:p.form,short:p.short,beam:p.beam,aspect:p.aspect,length:p.length,modifier:supportsSoftbox({kind:'light',form:p.form})?mod:'none'});state.selected=o.id;closeAddDialog();render();return}}
  const n=state.objects.filter(o=>o.kind==='light').length,o={id:uid('light'),kind:'light',name:p.name,brand:p.brand,family:p.family,form:p.form,short:p.short,x:245+(n%5)*72,y:235+(n%3)*75,rot:0,beam:p.beam,beamVisible:true,intensity:50,height:2,aspect:p.aspect,length:p.length,modifier:'none',modifierSize:.9,colorMode:'cct',cct:5600,hue:0,saturation:100,locked:false,labelVisible:true,labelPos:'auto'};state.objects.push(o);state.selected=o.id;closeAddDialog();render();
}
function addAccessory(p){const n=state.objects.filter(o=>o.kind==='accessory').length,o={id:uid('acc'),kind:'accessory',type:p.type,name:p.name,short:p.short,x:Math.max(180,stageW()/2-140)+(n%4)*80,y:160+(n%3)*70,rot:0,width:p.width,height:p.height,zHeight:p.zHeight??p.height,elevation:p.type==='borniol'?.2:.35,locked:false,labelVisible:true,labelPos:'auto'};state.objects.push(o);state.selected=o.id;closeAddDialog();render()}
function addDecor(p){const n=state.objects.filter(o=>o.kind==='decor').length,zHeight=p.type==='wall'?2.5:p.type==='door'?2.04:p.type==='window'?1.2:.75,elevation=p.type==='window'?.9:0,o={id:uid('decor'),kind:'decor',type:p.type,name:p.name,x:Math.max(200,stageW()/2-70)+(n%4)*90,y:140+(n%3)*80,rot:0,width:p.width,height:p.height,zHeight,elevation,locked:false,labelVisible:true,labelPos:'auto'};state.objects.push(o);state.selected=o.id;closeAddDialog();render()}

function openAddDialog(){replaceLightId=null;replaceCameraId=null;showKinds();if(typeof addDialog.showModal==='function')addDialog.showModal();else addDialog.setAttribute('open','')}
function closeAddDialog(){if(addDialog.open&&typeof addDialog.close==='function')addDialog.close();else addDialog.removeAttribute('open');replaceLightId=null;replaceCameraId=null}
function hideChoosers(){addKinds.classList.add('hidden');lightChooser.classList.add('hidden');cameraChooser.classList.add('hidden');simpleChooser.classList.add('hidden')}
function showKinds(){hideChoosers();addKinds.classList.remove('hidden');dialogTitle.textContent='Choisir un élément'}
function openLightChooser(replaceId=null){
  replaceLightId=replaceId;hideChoosers();lightChooser.classList.remove('hidden');dialogTitle.textContent=replaceId?'Changer de projecteur':'Choisir une lumière';const obj=replaceId?state.objects.find(x=>x.id===replaceId):null;catalogBrand=obj?.brand||catalogBrand||'Amaran';catalogFamily=obj?.family||'';renderLightChooser();if(!addDialog.open){if(typeof addDialog.showModal==='function')addDialog.showModal();else addDialog.setAttribute('open','')}
}
function renderLightChooser(){
  const brands=[...new Set(lightCatalog.map(p=>p.brand))];if(!brands.includes(catalogBrand))catalogBrand=brands[0]||'Amaran';brandChoices.innerHTML=brands.map(b=>`<button class="choice-btn ${catalogBrand===b?'active':''}" data-brand="${b}">${b}</button>`).join('');
  brandChoices.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{catalogBrand=btn.dataset.brand;catalogFamily='';renderLightChooser()});
  const fams=[...new Set(lightCatalog.filter(p=>p.brand===catalogBrand).map(p=>p.family))];if(!fams.includes(catalogFamily))catalogFamily=fams[0]||'';
  familyChoices.innerHTML=fams.map(f=>`<button class="choice-btn ${catalogFamily===f?'active':''}" data-family="${esc(f)}">${esc(f.toUpperCase())}</button>`).join('');
  familyChoices.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{catalogFamily=btn.dataset.family;renderLightChooser()});
  if(favoriteChoices){favoriteChoices.innerHTML=`<button class="choice-btn ${!catalogFavoritesOnly?'active':''}" data-fav-mode="all">Tous</button><button class="choice-btn ${catalogFavoritesOnly?'active':''}" data-fav-mode="fav">★ Favoris</button>`;favoriteChoices.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{catalogFavoritesOnly=btn.dataset.favMode==='fav';renderLightChooser()})}
  const baseItems=lightCatalog.filter(p=>p.brand===catalogBrand&&p.family===catalogFamily);
  const items=catalogFavoritesOnly?baseItems.filter(isFavoriteLight):baseItems;
  modelChoices.innerHTML=items.length?items.map(p=>`<div class="model-row"><button class="choice-btn model-btn" data-light-index="${lightCatalog.indexOf(p)}">${esc(p.name.replace(/^(amaran|Aputure|Nanlite|Godox)\s+/i,''))}</button><button class="fav-btn ${isFavoriteLight(p)?'active':''}" type="button" data-fav-index="${lightCatalog.indexOf(p)}" title="Favori">★</button></div>`).join(''):`<div class="empty-inline">Aucun projecteur favori dans cette famille.</div>`;
  modelChoices.querySelectorAll('.model-btn').forEach(btn=>btn.onclick=()=>addLightFromPreset(lightCatalog[Number(btn.dataset.lightIndex)],replaceLightId));
  modelChoices.querySelectorAll('.fav-btn').forEach(btn=>btn.onclick=(e)=>{e.stopPropagation();toggleFavoriteLight(lightCatalog[Number(btn.dataset.favIndex)])});
  const favCount=lightCatalog.filter(isFavoriteLight).length;
  catalogCount.textContent=`${lightCatalog.filter(p=>p.brand===catalogBrand).length} modèles ${catalogBrand} · ${favCount} favori${favCount>1?'s':''}`;
}
function openSimpleChooser(kind){
  hideChoosers();simpleChooser.classList.remove('hidden');const list=kind==='accessory'?accessoryCatalog:decorCatalog;dialogTitle.textContent=kind==='accessory'?'Ajouter un accessoire':'Ajouter un élément de décor';simpleLabel.textContent=kind==='accessory'?'ACCESSOIRE':'DÉCOR';simpleGrid.innerHTML=list.map((p,i)=>`<button class="simple-card" data-index="${i}"><span class="simple-picto ${kind}-${p.type}">${kind==='accessory'?(p.type==='diffusion'?'▧':p.type==='borniol'?'▬':p.type==='negative'?'■':'◇'):(p.type==='wall'?'━':p.type==='door'?'◿':p.type==='window'?'▥':'▭')}</span><strong>${esc(p.name)}</strong><small>${p.width} × ${p.height} m</small></button>`).join('');simpleGrid.querySelectorAll('button').forEach(btn=>btn.onclick=()=>kind==='accessory'?addAccessory(list[Number(btn.dataset.index)]):addDecor(list[Number(btn.dataset.index)]));
}

document.getElementById('openAddBtn').onclick=openAddDialog;
const stageAddDesktopBtn=document.getElementById('stageAddDesktopBtn');
if(stageAddDesktopBtn)stageAddDesktopBtn.onclick=openAddDialog;
if(cameraModelChoice)cameraModelChoice.onchange=()=>{cameraChooserId=cameraModelChoice.value;const c=cameraPresets.find(x=>x.id===cameraChooserId);if(c)rememberCameraForBrand(c)};
if(confirmCameraChoiceBtn)confirmCameraChoiceBtn.onclick=applyCameraChoice;
if(planOptionsToggle)planOptionsToggle.onclick=()=>{state.planOptionsOpen=!(state.planOptionsOpen!==false);updatePlanOptionsUI();scheduleAutosave();persistCurrent()};document.getElementById('closeAddBtn').onclick=closeAddDialog;document.getElementById('backToKindsBtn').onclick=()=>{replaceLightId=null;showKinds()};document.getElementById('backCameraToKindsBtn').onclick=()=>{replaceCameraId=null;showKinds()};document.getElementById('backSimpleBtn').onclick=showKinds;
addKinds.querySelectorAll('[data-kind]').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.kind;if(k==='light')openLightChooser();else if(k==='subject')addSubject();else if(k==='camera')openCameraChooser();else openSimpleChooser(k)});
addDialog.addEventListener('click',e=>{if(e.target===addDialog)closeAddDialog()});

function populateFolderSelect(){
  folderSelect.innerHTML=library.folders.map(f=>`<option value="${esc(f.id)}" ${f.id===state.folderId?'selected':''}>${esc(f.name)}</option>`).join('');
}
function planThumbnailData(planState){
  const len=clamp(Number(planState?.planLength)||10,4,30),w=Math.max(400,Math.round(len*SCALE)),h=Math.round(w*STAGE_RATIO),TW=220,TH=Math.round(TW*h/w),sx=TW/w,sy=TH/h;
  const bg='<rect width="100%" height="100%" fill="#eef2f6"/>';
  const grid=[]; for(let x=0;x<=TW;x+=22)grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${TH}" stroke="#d7dde6" stroke-width="1"/>`); for(let y=0;y<=TH;y+=22)grid.push(`<line x1="0" y1="${y}" x2="${TW}" y2="${y}" stroke="#d7dde6" stroke-width="1"/>`);
  const objs=(planState?.objects||[]).map(o=>{const x=(o.x||0)*sx,y=(o.y||0)*sy; if(o.kind==='camera')return `<g transform="translate(${x},${y}) rotate(${o.rot||0})"><polygon points="-8,-5 8,0 -8,5" fill="#1b6fff"/><rect x="8" y="-7" width="14" height="14" rx="3" fill="#2d7cff"/></g>`; if(o.kind==='subject')return `<g transform="translate(${x},${y}) rotate(${o.rot||0})"><circle cx="0" cy="0" r="9" fill="#1d2533" opacity=".95"/><polygon points="12,0 6.2,-3.4 6.2,3.4" fill="#111"/></g>`; if(o.kind==='light')return `<g transform="translate(${x},${y}) rotate(${o.rot||0})"><rect x="-11" y="-7" width="22" height="14" rx="4" fill="#ffbf3a" stroke="#8d6100" stroke-width="1.5"/><circle cx="8" cy="0" r="7" fill="#f6efcf" stroke="#8d6100" stroke-width="1.5"/></g>`; if(o.kind==='accessory')return `<g transform="translate(${x},${y}) rotate(${o.rot||0})"><line x1="-14" y1="0" x2="14" y2="0" stroke="#9aa3ad" stroke-width="4" stroke-linecap="round"/></g>`; if(o.kind==='decor')return o.type==='wall'?`<g transform="translate(${x},${y}) rotate(${o.rot||0})"><line x1="${-(o.width||2)*50*sx/2}" y1="0" x2="${(o.width||2)*50*sx/2}" y2="0" stroke="#b7aa9a" stroke-width="4" stroke-linecap="square"/></g>`:''; return ''}).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}">${bg}${grid.join('')}${objs}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
function buildLibraryInto(target){
  if(!target)return;
  target.innerHTML='';
  library.folders.forEach(folder=>{
    const box=document.createElement('div');box.className='folder-block';
    const title=document.createElement('div');title.className='folder-title';title.textContent=`📁 ${folder.name}`;box.appendChild(title);
    const plans=library.plans.filter(p=>p.folderId===folder.id).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    if(!plans.length){const empty=document.createElement('div');empty.className='folder-empty';empty.textContent='Aucun plan dans ce dossier.';box.appendChild(empty)}
    plans.forEach(rec=>{
      const row=document.createElement('div');row.className='plan-row';
      row.innerHTML=`<div class="plan-row-preview"><img class="plan-thumb" src="${planThumbnailData(rec.state)}" alt="Aperçu de ${esc(rec.name)}"></div><div class="plan-row-main"><strong>${esc(rec.name)}</strong><small>${formatSavedDate(rec.updatedAt)}${rec.id===state.planId?' · plan ouvert':''}</small></div><div class="plan-row-actions"><button class="primary-mini" data-act="open">Ouvrir</button><button data-act="duplicate">Dupliquer</button><button class="danger-mini" data-act="delete">Supprimer</button></div>`;
      row.querySelector('[data-act="open"]').onclick=()=>openLibraryPlan(rec.id);
      row.querySelector('[data-act="duplicate"]').onclick=()=>duplicateLibraryPlan(rec.id);
      row.querySelector('[data-act="delete"]').onclick=()=>deleteLibraryPlan(rec.id);
      box.appendChild(row);
    });target.appendChild(box);
  });
}

const EQUIPMENT_BASE_CATEGORIES=[
  {id:'camera',name:'Caméra'},
  {id:'light',name:'Lumière'},
  {id:'accessory',name:'Accessoire'},
  {id:'extra',name:'Petit matériel & consommables'}
];
const EQUIPMENT_ADD_CATALOG={
  camera:[
    ['camera','Caméra'],['lens','Objectif'],['monitor','Moniteur'],['tripod','Trépied'],['battery-camera','Batterie caméra'],['charger-camera','Chargeur'],['media','Carte mémoire'],['video-cable','Câble HDMI / SDI']
  ],
  light:[
    ['light','Projecteur'],['tube','Tube LED'],['softbox','Softbox'],['umbrella-diff','Parapluie diffusion'],['umbrella-reflect','Parapluie réflexion'],['grid','Grille nid d’abeille'],['light-stand','Pied lumière'],['ballast','Ballast / alimentation']
  ],
  accessory:[
    ['diff-frame','Cadre de diffusion'],['diffusion','Diffusion'],['reflector','Réflecteur'],['borniol','Borniol'],['negative','Negative fill'],['cstand','C-Stand'],['combo','Pied combo'],['boom','Girafe / boom'],['sandbag','Sac de lest'],['clamp','Pince'],['superclamp','Super Clamp'],['magic-arm','Bras magique'],['spigot','Rotule / spigot']
  ],
  extra:[
    ['extension-16a','Prolong'],['extension','Rallonge secteur'],['reel','Enrouleur'],['power-strip','Triplette / multiprise'],['adapter','Adaptateur secteur'],['gaffer','Gaffer'],['cinefoil','Cinefoil / Blackwrap'],['paper-tape','Paper tape'],['velcro','Velcro / serre-câbles'],['safety','Câble de sécurité / élingue'],['clothespins','Pinces à linge'],['marker','Marqueur'],['aa','Piles AA'],['aaa','Piles AAA']
  ]
};
let equipmentAddType='camera';
let equipmentDragId=null;
function ensureEquipmentSheet(){
  if(!state.equipmentSheet||typeof state.equipmentSheet!=='object')state.equipmentSheet={};
  const s=state.equipmentSheet;
  if(typeof s.production!=='string')s.production='';
  if(typeof s.notes!=='string')s.notes='';
  if(!Array.isArray(s.contacts))s.contacts=[];
  if(!Array.isArray(s.customCategories))s.customCategories=[];
  if(!Array.isArray(s.manualItems))s.manualItems=[];
  if(!s.layout||typeof s.layout!=='object')s.layout={};
  if(!s.enabledCategories||typeof s.enabledCategories!=='object')s.enabledCategories={};
  equipmentCategoriesAllRaw(s).forEach(c=>{if(typeof s.enabledCategories[c.id]!=='boolean')s.enabledCategories[c.id]=true});
  return s;
}
function equipmentModifierText(o){
  const cm=Math.round((Number(o.modifierSize)||.9)*100);
  if(o.modifier==='hyper-reflector')return 'Bol / Hyper Reflector';
  if(o.modifier==='softbox')return `Softbox ${cm} cm`;
  if(o.modifier==='softbox-grid')return `Softbox + Grid ${cm} cm`;
  if(o.modifier==='fresnel')return 'Fresnel';
  if(o.modifier==='lantern')return 'Lantern';
  if(o.modifier==='umbrella-reflect')return `Parapluie réflexion ${cm} cm`;
  if(o.modifier==='umbrella-diffusion')return `Parapluie diffusion ${cm} cm`;
  return '';
}
function autoEquipmentItems(){
  const items=[];
  state.objects.filter(o=>o.kind==='camera').forEach(o=>items.push({id:`auto:${o.id}`,source:'auto',defaultCategory:'camera',label:o.cameraModel||o.name,detail:`${o.name} · ${Math.round(o.focal||50)} mm`}));
  state.objects.filter(o=>o.kind==='light').forEach(o=>{const mod=equipmentModifierText(o);items.push({id:`auto:${o.id}`,source:'auto',defaultCategory:'light',label:o.name,detail:mod||'Projecteur nu'})});
  state.objects.filter(o=>o.kind==='accessory').forEach(o=>items.push({id:`auto:${o.id}`,source:'auto',defaultCategory:'accessory',label:o.name,detail:`${Number(o.width||0).toFixed(1)} × ${Number(o.zHeight||o.height||0).toFixed(1)} m`}));
  return items;
}
function equipmentCategoriesAllRaw(s){return [...EQUIPMENT_BASE_CATEGORIES,...(s?.customCategories||[])]}
function equipmentCategoriesAll(){const s=ensureEquipmentSheet();return equipmentCategoriesAllRaw(s)}
function equipmentItemsAll(){const s=ensureEquipmentSheet();return [...autoEquipmentItems(),...s.manualItems.map(i=>({...i,source:'manual'}))]}
function syncEquipmentSheet(){
  const s=ensureEquipmentSheet(),cats=equipmentCategoriesAll(),validCats=new Set(cats.map(c=>c.id)),items=equipmentItemsAll(),validItems=new Set(items.map(i=>i.id));
  Object.keys(s.layout).forEach(id=>{if(!validItems.has(id))delete s.layout[id]});
  const counts={};
  items.forEach(i=>{
    const defaultCat=validCats.has(i.defaultCategory)?i.defaultCategory:'extra';
    if(!s.layout[i.id])s.layout[i.id]={categoryId:defaultCat,order:counts[defaultCat]||0};
    if(!validCats.has(s.layout[i.id].categoryId))s.layout[i.id].categoryId=defaultCat;
    counts[s.layout[i.id].categoryId]=(counts[s.layout[i.id].categoryId]||0)+1;
  });
  normalizeEquipmentOrders();
}
function normalizeEquipmentOrders(){
  const s=ensureEquipmentSheet(),items=equipmentItemsAll();
  equipmentCategoriesAll().forEach(cat=>{
    items.filter(i=>s.layout[i.id]?.categoryId===cat.id).sort((a,b)=>(s.layout[a.id]?.order||0)-(s.layout[b.id]?.order||0)).forEach((i,n)=>s.layout[i.id].order=n);
  });
}
function moveEquipmentItem(id,categoryId,beforeId=null){
  const s=ensureEquipmentSheet();if(!s.layout[id])return;
  const items=equipmentItemsAll();
  let ids=items.filter(i=>i.id!==id&&s.layout[i.id]?.categoryId===categoryId).sort((a,b)=>s.layout[a.id].order-s.layout[b.id].order).map(i=>i.id);
  const at=beforeId?ids.indexOf(beforeId):-1;if(at>=0)ids.splice(at,0,id);else ids.push(id);
  s.layout[id].categoryId=categoryId;ids.forEach((x,n)=>{if(s.layout[x])s.layout[x].order=n});normalizeEquipmentOrders();persistCurrent();renderEquipmentDialog();
}
function removeManualEquipment(id){const s=ensureEquipmentSheet();s.manualItems=s.manualItems.filter(i=>i.id!==id);delete s.layout[id];persistCurrent();renderEquipmentDialog()}
function addManualEquipment(label,categoryId='extra',detail=''){
  const s=ensureEquipmentSheet(),id=uid('eq');s.manualItems.push({id,label,detail,defaultCategory:categoryId});s.layout[id]={categoryId,order:999};normalizeEquipmentOrders();persistCurrent();renderEquipmentDialog();
}
function categoryNameForAddType(type){return EQUIPMENT_BASE_CATEGORIES.find(c=>c.id===type)?.name||'Matériel'}
function addCatalogEquipment(key,label,type){
  let detail='';
  if(key==='gaffer'){const color=prompt('Couleur du gaffer','Noir');if(color===null)return;detail=`Couleur : ${(color||'Noir').trim()}`}
  if(key==='paper-tape'){const color=prompt('Couleur du paper tape','Blanc');if(color===null)return;detail=`Couleur : ${(color||'Blanc').trim()}`}
  if(key==='marker'){const color=prompt('Couleur du marqueur','Noir');if(color===null)return;detail=`Couleur : ${(color||'Noir').trim()}`}
  if(['light-stand','cstand','combo'].includes(key)){
    const typeLabel=prompt('Type / précision du pied (ex. léger, Wind-up, C-Stand, Baby…)','');
    if(typeLabel===null)return;
    const material=prompt('Matière / précision supplémentaire (ex. métal, carbone…)','');
    if(material===null)return;
    detail=[typeLabel.trim(),material.trim()].filter(Boolean).join(' · ');
  }
  addManualEquipment(label,type,detail);
}
function editManualEquipmentDetail(id){
  const s=ensureEquipmentSheet(),item=s.manualItems.find(i=>i.id===id);if(!item)return;
  const detail=prompt(`Précision pour « ${item.label} »`,item.detail||'');if(detail===null)return;
  item.detail=detail.trim();persistCurrent();renderEquipmentDialog();
}
function toggleEquipmentCategory(id){
  const s=ensureEquipmentSheet();s.enabledCategories[id]=!(s.enabledCategories[id]!==false);persistCurrent();renderEquipmentDialog();
}
function renderEquipmentAddCatalog(){
  if(!equipmentAddTabs||!equipmentAddCatalog)return;
  equipmentAddTabs.innerHTML=EQUIPMENT_BASE_CATEGORIES.map(c=>`<button type="button" class="equipment-add-tab ${equipmentAddType===c.id?'active':''}" data-eq-add-type="${c.id}">${esc(c.name)}</button>`).join('');
  equipmentAddTabs.querySelectorAll('[data-eq-add-type]').forEach(b=>b.onclick=()=>{equipmentAddType=b.dataset.eqAddType;renderEquipmentAddCatalog()});
  const entries=EQUIPMENT_ADD_CATALOG[equipmentAddType]||[];
  equipmentAddCatalog.innerHTML=entries.map(([key,label])=>`<button type="button" class="equipment-catalog-item" data-eq-catalog-key="${esc(key)}">+ ${esc(label)}</button>`).join('');
  equipmentAddCatalog.querySelectorAll('[data-eq-catalog-key]').forEach((b,i)=>{const [key,label]=entries[i];b.onclick=()=>addCatalogEquipment(key,label,equipmentAddType)});
}
function renderEquipmentContacts(){
  const s=ensureEquipmentSheet();if(!equipmentContacts)return;
  equipmentContacts.innerHTML=s.contacts.length?s.contacts.map((c,i)=>`<div class="equipment-contact-row" data-contact-index="${i}"><input data-contact-field="name" value="${esc(c.name||'')}" placeholder="Nom"><input data-contact-field="phone" value="${esc(c.phone||'')}" placeholder="Téléphone"><button type="button" class="equipment-contact-remove" title="Supprimer">×</button></div>`).join(''):`<div class="equipment-empty">Aucun contact.</div>`;
  equipmentContacts.querySelectorAll('.equipment-contact-row').forEach(row=>{const i=Number(row.dataset.contactIndex);row.querySelectorAll('[data-contact-field]').forEach(inp=>inp.oninput=()=>{s.contacts[i][inp.dataset.contactField]=inp.value;scheduleAutosave()});row.querySelector('.equipment-contact-remove').onclick=()=>{s.contacts.splice(i,1);persistCurrent();renderEquipmentContacts()}});
}
function renderEquipmentCategories(){
  syncEquipmentSheet();const s=ensureEquipmentSheet(),items=equipmentItemsAll();if(!equipmentCategories)return;
  equipmentCategories.innerHTML=equipmentCategoriesAll().map(cat=>{
    const catItems=items.filter(i=>s.layout[i.id]?.categoryId===cat.id).sort((a,b)=>s.layout[a.id].order-s.layout[b.id].order);
    const custom=s.customCategories.some(c=>c.id===cat.id),enabled=s.enabledCategories[cat.id]!==false;
    return `<section class="equipment-category ${enabled?'':'disabled'}" data-eq-category="${cat.id}"><div class="equipment-category-head"><strong>${esc(cat.name)}</strong><div class="equipment-category-actions"><button type="button" class="equipment-category-toggle ${enabled?'active':''}" data-toggle-category="${cat.id}">${enabled?'ON':'OFF'}</button>${custom?`<button type="button" class="equipment-category-remove" data-remove-category="${cat.id}">Supprimer</button>`:''}</div></div><div class="equipment-dropzone" data-drop-category="${cat.id}">${catItems.length?catItems.map(i=>`<div class="equipment-item" draggable="true" data-eq-item="${i.id}"><span class="equipment-drag-handle">⋮⋮</span><div class="equipment-item-copy"><strong>${esc(i.label)}</strong>${i.detail?`<small>${esc(i.detail)}</small>`:''}</div><span class="equipment-item-source">${i.source==='auto'?'plan':'ajouté'}</span>${i.source==='manual'?`<div class="equipment-item-actions"><button class="equipment-item-edit" type="button" title="Préciser">✎</button><button class="equipment-item-remove" type="button" title="Supprimer">×</button></div>`:'<span></span>'}</div>`).join(''):`<div class="equipment-empty">Dépose du matériel ici</div>`}</div></section>`
  }).join('');
  equipmentCategories.querySelectorAll('[data-toggle-category]').forEach(btn=>btn.onclick=()=>toggleEquipmentCategory(btn.dataset.toggleCategory));
  equipmentCategories.querySelectorAll('[data-remove-category]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.removeCategory,cat=s.customCategories.find(c=>c.id===id);if(!cat||!confirm(`Supprimer la catégorie « ${cat.name} » ? Les éléments seront déplacés dans Petit matériel & consommables.`))return;s.customCategories=s.customCategories.filter(c=>c.id!==id);delete s.enabledCategories[id];Object.values(s.layout).forEach(l=>{if(l.categoryId===id)l.categoryId='extra'});persistCurrent();renderEquipmentDialog()});
  equipmentCategories.querySelectorAll('.equipment-dropzone').forEach(zone=>{zone.ondragover=e=>{e.preventDefault();zone.classList.add('drag-over')};zone.ondragleave=()=>zone.classList.remove('drag-over');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('drag-over');if(equipmentDragId)moveEquipmentItem(equipmentDragId,zone.dataset.dropCategory)}});
  equipmentCategories.querySelectorAll('.equipment-item').forEach(row=>{
    row.ondragstart=e=>{equipmentDragId=row.dataset.eqItem;row.classList.add('dragging');e.dataTransfer.effectAllowed='move'};row.ondragend=()=>{equipmentDragId=null;row.classList.remove('dragging')};
    row.ondragover=e=>{e.preventDefault()};row.ondrop=e=>{e.preventDefault();e.stopPropagation();if(equipmentDragId&&equipmentDragId!==row.dataset.eqItem){const cat=row.closest('[data-eq-category]').dataset.eqCategory;moveEquipmentItem(equipmentDragId,cat,row.dataset.eqItem)}};
    const edit=row.querySelector('.equipment-item-edit');if(edit)edit.onclick=()=>editManualEquipmentDetail(row.dataset.eqItem);
    const rm=row.querySelector('.equipment-item-remove');if(rm)rm.onclick=()=>removeManualEquipment(row.dataset.eqItem);
  });
}
function renderEquipmentDialog(){
  ensureEquipmentSheet();syncEquipmentSheet();const s=state.equipmentSheet;
  if(equipmentProduction)equipmentProduction.value=s.production||'';if(equipmentNotes)equipmentNotes.value=s.notes||'';
  renderEquipmentContacts();renderEquipmentCategories();renderEquipmentAddCatalog();
}
function openEquipmentDialog(){toggleExportPopover(false);renderEquipmentDialog();if(typeof equipmentDialog.showModal==='function')equipmentDialog.showModal();else equipmentDialog.setAttribute('open','')}
function closeEquipmentDialog(){if(equipmentDialog?.open&&typeof equipmentDialog.close==='function')equipmentDialog.close();else equipmentDialog?.removeAttribute('open')}
function buildEquipmentPrintArea(){
  syncEquipmentSheet();const s=ensureEquipmentSheet(),items=equipmentItemsAll();
  const contacts=s.contacts.filter(c=>(c.name||'').trim()||(c.phone||'').trim()).map(c=>`${esc(c.name||'')} ${c.phone?`· ${esc(c.phone)}`:''}`).join('<br>')||'—';
  const cats=equipmentCategoriesAll().filter(cat=>s.enabledCategories[cat.id]!==false).map(cat=>{const rows=items.filter(i=>s.layout[i.id]?.categoryId===cat.id).sort((a,b)=>s.layout[a.id].order-s.layout[b.id].order);if(!rows.length)return '';return `<section class="print-category"><h3>${esc(cat.name)}</h3>${rows.map(i=>`<div class="print-equipment-row"><div><strong>${esc(i.label)}</strong>${i.detail?`<br><small>${esc(i.detail)}</small>`:''}</div></div>`).join('')}</section>`}).join('');
  equipmentPrintArea.innerHTML=`<header class="print-equipment-header"><h1>${esc(state.planName||defaultPlanName())}</h1><h2>Liste matériel</h2><div class="print-info-grid"><div class="print-info-block"><strong>Production</strong><p>${esc(s.production||'—')}</p></div><div class="print-info-block"><strong>À contacter</strong><p>${contacts}</p></div>${s.notes?`<div class="print-info-block print-info-wide"><strong>Infos en plus</strong><p>${esc(s.notes)}</p></div>`:''}</div></header>${cats||'<p class="print-empty">Aucun matériel.</p>'}`;
}
function printEquipmentSheet(){buildEquipmentPrintArea();setTimeout(()=>window.print(),60)}

function renderLibraryList(){
  populateFolderSelect();if(planNameInput)planNameInput.value=state.planName||defaultPlanName();
  buildLibraryInto(planLibraryList);
  buildLibraryInto(inlinePlanLibraryList);
}
function setMainTab(tab){
  const libraryMode=tab==='plans';
  planView?.classList.toggle('hidden',libraryMode);
  plansView?.classList.toggle('hidden',!libraryMode);
  planTabBtn?.classList.toggle('active',!libraryMode);
  plansTabBtn?.classList.toggle('active',libraryMode);
  if(libraryMode){loadLibrary();ensureStateDefaults();renderLibraryList()}
  else requestAnimationFrame(()=>{applyStageViewport();renderCanvas()});
}
function openLibraryDialog(){loadLibrary();ensureStateDefaults();renderLibraryList();if(typeof libraryDialog.showModal==='function')libraryDialog.showModal();else libraryDialog.setAttribute('open','')}
function closeLibraryDialog(){if(libraryDialog.open&&typeof libraryDialog.close==='function')libraryDialog.close();else libraryDialog.removeAttribute('open')}
function savePlanToLibrary(opts={}){
  loadLibrary();
  const mode=opts.mode||(!state.planId?'new':'overwrite');
  const folderId=opts.folderId||state.folderId||folderSelect.value||library.folders[0].id;
  const name=(opts.name||topPlanNameInput?.value||planNameInput?.value||state.planName||defaultPlanName()).trim().replace(/\s+/g,' ')||defaultPlanName();
  const excludeId=mode==='overwrite'?state.planId:null;
  if(findPlanNameConflict(name,excludeId))return warnPlanNameConflict(name);
  state.planName=name;state.folderId=folderId;
  if(mode==='copy' || !state.planId)state.planId=uid('plan');
  let rec=library.plans.find(p=>p.id===state.planId);if(!rec){rec={id:state.planId};library.plans.push(rec)}
  rec.name=state.planName;rec.folderId=state.folderId;rec.updatedAt=Date.now();rec.state=snapshotState();persistLibrary();persistCurrent();renderLibraryList();updatePlanBadge();flash('Plan enregistré');
  return true;
}
function saveCurrentPlanFlow(){
  loadLibrary();ensureStateDefaults();
  const candidateName=(topPlanNameInput?.value||planNameInput?.value||state.planName||defaultPlanName()).trim().replace(/\s+/g,' ')||defaultPlanName();
  state.planName=candidateName;

  if(state.planId){
    const currentRec=library.plans.find(p=>p.id===state.planId);
    if(currentRec)return savePlanToLibrary({mode:'overwrite',name:candidateName,folderId:state.folderId});
  }

  const sameName=findPlanNameConflict(candidateName);
  if(sameName){
    state.planId=sameName.id;
    state.folderId=sameName.folderId||state.folderId;
    return savePlanToLibrary({mode:'overwrite',name:candidateName,folderId:state.folderId});
  }

  return savePlanToLibrary({mode:'new',name:candidateName,folderId:state.folderId});
}
function openLibraryPlan(id){const rec=library.plans.find(p=>p.id===id);if(!rec)return;resetStageViewport();state=deepClone(rec.state);state.planId=rec.id;state.planName=rec.name;state.folderId=rec.folderId;ensureStateDefaults();state.objects.forEach(normalizeSceneObject);migrateOpeningBindings();state.selected=null;if(!state.activePreviewCamera)state.activePreviewCamera=state.objects.find(o=>o.kind==='camera')?.id||null;persistCurrent();render();closeLibraryDialog();setMainTab('plan')}
function duplicateLibraryPlan(id){const rec=library.plans.find(p=>p.id===id);if(!rec)return;const suggested=nextAvailableCopyName(rec.name);const copyName=prompt('Nom du plan',suggested);if(!copyName?.trim())return;const cleanName=copyName.trim().replace(/\s+/g,' ');if(findPlanNameConflict(cleanName))return warnPlanNameConflict(cleanName);const copy=deepClone(rec);copy.id=uid('plan');copy.name=cleanName;copy.updatedAt=Date.now();copy.folderId=rec.folderId;copy.state.planId=copy.id;copy.state.planName=copy.name;library.plans.push(copy);persistLibrary();renderLibraryList()}
function deleteLibraryPlan(id){const rec=library.plans.find(p=>p.id===id);if(!rec||!confirm(`Supprimer « ${rec.name} » ?`))return;library.plans=library.plans.filter(p=>p.id!==id);if(state.planId===id)state.planId=null;persistLibrary();persistCurrent();renderLibraryList()}
function newPlan(){persistCurrent();loadLibrary();const folder=state.folderId||folderSelect.value||library.folders[0].id;state.planId=null;state.planName='Plan sans nom';state.folderId=folder;state.objects=[];state.selected=null;state.activePreviewCamera=null;state.cameraModel='Sony FX3';state.focal=50;state.snap=.25;state.labelsMode='full';state.beamsVisible=true;state.gridOpacity=.5;state.planLength=10;state.planOptionsOpen=true;state.equipmentSheet=null;state.openingBindingVersion=2;resetStageViewport();render();renderLibraryList();setMainTab('plan');persistCurrent()}
function newPlanFlow(){
  loadLibrary();
  ensureStateDefaults();
  const currentName=(topPlanNameInput?.value||planNameInput?.value||state.planName||defaultPlanName()).trim().replace(/\s+/g,' ')||defaultPlanName();
  state.planName=currentName;
  const saved=savePlanToLibrary({mode:state.planId?'overwrite':'new',name:currentName,folderId:state.folderId});
  if(!saved)return;
  newPlan();
  flash('Plan actuel sauvegardé · nouveau plan créé');
}
function duplicateCurrentPlan(){
  loadLibrary();ensureStateDefaults();
  const originalName=(topPlanNameInput?.value||state.planName||defaultPlanName()).trim().replace(/\s+/g,' ')||defaultPlanName();
  if(findPlanNameConflict(originalName,state.planId))return warnPlanNameConflict(originalName);
  state.planName=originalName;
  // La duplication sécurise d'abord l'original dans Mes plans, puis crée et enregistre la copie.
  const originalSaved=savePlanToLibrary({mode:state.planId?'overwrite':'new',name:originalName,folderId:state.folderId});
  if(!originalSaved)return false;
  const originalState=snapshotState();
  let copyName=`${originalName} copie`;
  if(findPlanNameConflict(copyName)){
    const suggested=nextAvailableCopyName(originalName);
    const chosen=prompt(`Le plan « ${copyName} » existe déjà.\nChoisis un autre nom pour la copie :`,suggested);
    if(!chosen?.trim())return false;
    copyName=chosen.trim().replace(/\s+/g,' ');
    if(findPlanNameConflict(copyName))return warnPlanNameConflict(copyName);
  }
  state=deepClone(originalState);
  state.planId=null;
  state.planName=copyName;
  state.selected=originalState.selected||null;
  if(!savePlanToLibrary({mode:'new',name:copyName,folderId:originalState.folderId}))return false;
  resetStageViewport();
  render();
  renderLibraryList();
  setMainTab('plan');
  return true;
}
function projectPayload(planState=snapshotState()){return {format:'BOS_PLAN_FEU',version:'1.60',exportedAt:new Date().toISOString(),plan:deepClone(planState)}}
function projectFile(planState=snapshotState(),name=state.planName){const payload=projectPayload(planState),blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});return new File([blob],`${safeName(name)}.bosplan.json`,{type:'application/json'})}
async function shareProjectState(planState=snapshotState(),name=state.planName){
  const file=projectFile(planState,name);
  try{
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:`PLAN — ${name}`,text:'Copie modifiable du plan.',files:[file]});return}
  }catch(e){if(e?.name==='AbortError')return;console.warn('Partage BOS',e)}
  downloadBlob(file, file.name);
  alert('Le partage direct de fichiers n’est pas disponible sur ce navigateur. La copie modifiable a été téléchargée : tu peux l’envoyer par AirDrop, Mail, Messages, etc.');
}
async function importProjectFile(file){
  if(!file)return;
  try{
    const raw=JSON.parse(await file.text()),incoming=raw?.format==='BOS_PLAN_FEU'?raw.plan:raw;
    if(!incoming||!Array.isArray(incoming.objects))throw new Error('Format invalide');
    resetStageViewport();state=deepClone(incoming);state.planId=null;state.planName=state.planName||file.name.replace(/\.bosplan\.json$|\.json$/i,'')||defaultPlanName();state.folderId=library.folders[0]?.id||'folder_general';
    ensureStateDefaults();state.objects.forEach(normalizeSceneObject);migrateOpeningBindings();state.selected=null;if(!state.activePreviewCamera)state.activePreviewCamera=state.objects.find(o=>o.kind==='camera')?.id||null;
    persistCurrent();render();closeLibraryDialog();flash('Projet importé');
  }catch(e){console.warn(e);alert('Ce fichier ne semble pas être un projet PLAN valide.')}
}

if(planTabBtn)planTabBtn.onclick=()=>setMainTab('plan');
if(plansTabBtn)plansTabBtn.onclick=()=>setMainTab('plans');
document.getElementById('closeLibraryBtn').onclick=closeLibraryDialog;
libraryDialog.addEventListener('click',e=>{if(e.target===libraryDialog)closeLibraryDialog()});
document.getElementById('newFolderBtn').onclick=()=>{const name=prompt('Nom du nouveau dossier :');if(!name?.trim())return;const f={id:uid('folder'),name:name.trim()};library.folders.push(f);persistLibrary();state.folderId=f.id;renderLibraryList();folderSelect.value=f.id};
document.getElementById('newPlanBtn').onclick=newPlanFlow;
document.getElementById('saveToLibraryBtn').onclick=()=>savePlanToLibrary({mode:state.planId?'overwrite':'new',name:(planNameInput?.value||state.planName||defaultPlanName()).trim()||defaultPlanName(),folderId:folderSelect.value||state.folderId});
function toggleExportPopover(force){if(!exportPopover||!exportMenuBtn)return;const open=typeof force==='boolean'?force:exportPopover.hasAttribute('hidden');if(open){exportPopover.removeAttribute('hidden')}else{exportPopover.setAttribute('hidden','')}exportMenuBtn.setAttribute('aria-expanded',String(open));}
if(shareProjectBtn)shareProjectBtn.onclick=()=>{toggleExportPopover(false);shareProjectState()};
if(importProjectBtn)importProjectBtn.onclick=()=>importProjectInput?.click();
if(importProjectInput)importProjectInput.onchange=async()=>{const f=importProjectInput.files?.[0];importProjectInput.value='';await importProjectFile(f)};
if(exportMenuBtn)exportMenuBtn.onclick=(e)=>{e.stopPropagation();toggleExportPopover()};
if(exportPopover)exportPopover.onclick=e=>e.stopPropagation();
document.addEventListener('click',e=>{if(exportPopover && !exportPopover.hasAttribute('hidden') && !e.target.closest('.export-wrap'))toggleExportPopover(false)});
if(topPlanNameInput)topPlanNameInput.addEventListener('input',()=>{state.planName=(topPlanNameInput.value||'').trim()||defaultPlanName();if(planNameInput&&document.activeElement!==planNameInput)planNameInput.value=state.planName;persistCurrent();updatePlanBadge()});
if(planNameInput)planNameInput.addEventListener('input',()=>{state.planName=(planNameInput.value||'').trim()||defaultPlanName();if(topPlanNameInput&&document.activeElement!==topPlanNameInput)topPlanNameInput.value=state.planName;persistCurrent();updatePlanBadge()});
document.getElementById('saveBtn').onclick=saveCurrentPlanFlow;
document.getElementById('resetBtn').onclick=newPlanFlow;
document.getElementById('duplicatePlanBtn').onclick=duplicateCurrentPlan;
function flash(txt){const b=document.getElementById('saveBtn'),lab=b?.querySelector('.tool-label');if(lab){const old=lab.textContent;lab.textContent='✓';b.title=txt;setTimeout(()=>{lab.textContent=old;b.title='Enregistrer le plan'},1200)}else if(b){const old=b.textContent;b.textContent='✓';setTimeout(()=>b.textContent=old,1200)}}
function inlineSvgStyles(original,clone){
  const props=['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','font-family','font-size','font-weight','letter-spacing','paint-order','color'];
  const os=[original,...original.querySelectorAll('*')],cs=[clone,...clone.querySelectorAll('*')];
  os.forEach((node,i)=>{const target=cs[i];if(!target)return;const st=getComputedStyle(node);const css=props.map(p=>`${p}:${st.getPropertyValue(p)}`).join(';');target.setAttribute('style',`${target.getAttribute('style')||''};${css}`)});
}
function exportPng(){
  const fullW=stageW(),fullH=stageH(),outW=1600,outH=Math.round(outW*fullH/fullW),titleH=86;
  const clone=stage.cloneNode(true);clone.setAttribute('xmlns',NS);clone.setAttribute('width',String(outW));clone.setAttribute('height',String(outH));clone.setAttribute('viewBox',`0 0 ${fullW} ${fullH}`);
  inlineSvgStyles(stage,clone);
  clone.querySelectorAll('.rotation-gizmo,.selection-ring,.selection-box,.hit').forEach(n=>n.remove());
  const source=new XMLSerializer().serializeToString(clone),blob=new Blob([source],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');c.width=outW;c.height=outH+titleH;const ctx=c.getContext('2d');ctx.fillStyle=getComputedStyle(document.querySelector('.stage-bg')).getPropertyValue('fill')||'#fbfcfe';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#121821';ctx.font='700 38px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(state.planName||defaultPlanName(),c.width/2,titleH/2);ctx.drawImage(img,0,titleH,outW,outH);URL.revokeObjectURL(url);c.toBlob(b=>{if(b)downloadBlob(b,`${safeName(state.planName||defaultPlanName())}_Plan_Feu.png`)},'image/png')};
  img.onerror=()=>{URL.revokeObjectURL(url);alert("L’export PNG n’a pas pu être généré sur ce navigateur.")};img.src=url;
}
if(exportBtn)exportBtn.onclick=()=>{toggleExportPopover(false);exportPng()};
if(equipmentListBtn)equipmentListBtn.onclick=openEquipmentDialog;
if(document.getElementById('closeEquipmentBtn'))document.getElementById('closeEquipmentBtn').onclick=closeEquipmentDialog;
if(document.getElementById('closeEquipmentFooterBtn'))document.getElementById('closeEquipmentFooterBtn').onclick=closeEquipmentDialog;
if(document.getElementById('addEquipmentContactBtn'))document.getElementById('addEquipmentContactBtn').onclick=()=>{const s=ensureEquipmentSheet();s.contacts.push({name:'',phone:''});persistCurrent();renderEquipmentContacts()};
if(document.getElementById('addEquipmentCategoryBtn'))document.getElementById('addEquipmentCategoryBtn').onclick=()=>{const name=prompt('Nom de la catégorie');if(!name?.trim())return;const s=ensureEquipmentSheet();s.customCategories.push({id:uid('eqcat'),name:name.trim()});persistCurrent();renderEquipmentDialog()};
if(document.getElementById('addFreeEquipmentBtn'))document.getElementById('addFreeEquipmentBtn').onclick=()=>{const name=prompt('Nom du matériel');if(!name?.trim())return;addManualEquipment(name.trim(),equipmentAddType)};
if(equipmentProduction)equipmentProduction.oninput=()=>{ensureEquipmentSheet().production=equipmentProduction.value;scheduleAutosave()};
if(equipmentNotes)equipmentNotes.oninput=()=>{ensureEquipmentSheet().notes=equipmentNotes.value;scheduleAutosave()};
if(document.getElementById('printEquipmentBtn'))document.getElementById('printEquipmentBtn').onclick=printEquipmentSheet;
if(toggleSnapBtn)toggleSnapBtn.onclick=()=>{state.snap=Number(state.snap)>0?0:.25;updatePlanBadge();renderCanvas()};
labelsModeSelect.onchange=()=>{state.labelsMode=labelsModeSelect.value;if(state.labelsMode!=='hidden')lastVisibleLabelsMode=state.labelsMode;updatePlanBadge();renderCanvas()};
toggleBeamsBtn.onclick=()=>{state.beamsVisible=state.beamsVisible===false;updatePlanBadge();renderCanvas()};
if(stageBeamsBtn)stageBeamsBtn.onclick=()=>{state.beamsVisible=state.beamsVisible===false;updatePlanBadge();renderCanvas()};
if(stageInfosBtn)stageInfosBtn.onclick=()=>{
  const current=state.labelsMode||'full';
  if(current==='hidden'){
    state.labelsMode=lastVisibleLabelsMode||'full';
  }else{
    lastVisibleLabelsMode=current;
    state.labelsMode='hidden';
  }
  if(labelsModeSelect)labelsModeSelect.value=state.labelsMode;
  updatePlanBadge();
  renderCanvas();
};
if(gridOpacityRange){gridOpacityRange.oninput=()=>{state.gridOpacity=clamp(Number(gridOpacityRange.value)/100,0,1);updateGridOpacity();scheduleAutosave()};gridOpacityRange.onchange=()=>persistCurrent()}
if(planLengthRange){planLengthRange.oninput=()=>{setPlanLength(Number(planLengthRange.value),{keepViewport:true});updatePlanBadge()};planLengthRange.onchange=()=>persistCurrent()}
function changePlanLengthBy(delta){
  const next=clamp(Math.round((Number(state.planLength||10)+delta)*2)/2,4,30);
  if(next===Number(state.planLength||10))return;
  setPlanLength(next,{keepViewport:true});
  updatePlanBadge();
  persistCurrent();
}
if(planLengthMinusBtn)planLengthMinusBtn.addEventListener('click',()=>changePlanLengthBy(-.5))
if(planLengthPlusBtn)planLengthPlusBtn.addEventListener('click',()=>changePlanLengthBy(.5))
if(zoomReadout)zoomReadout.addEventListener('click',()=>{resetStageViewport();persistCurrent()})
if(zoomOutBtn)zoomOutBtn.addEventListener('click',()=>zoomStage(.8))
if(zoomInBtn)zoomInBtn.addEventListener('click',()=>zoomStage(1.25))
if(stage)stage.addEventListener('wheel',e=>{
  if(!(e.ctrlKey||e.metaKey))return;
  e.preventDefault();
  zoomStage(e.deltaY<0?1.12:(1/1.12),e.clientX,e.clientY);
},{passive:false})

const installAppBtn=document.getElementById('installAppBtn');
const projectContactBtn=document.getElementById('projectContactBtn');
const improveAppBtn=document.getElementById('improveAppBtn');
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e});
if(installAppBtn)installAppBtn.addEventListener('click',async()=>{
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    try{await deferredInstallPrompt.userChoice}catch(e){}
    deferredInstallPrompt=null;
  }else{
    alert('Pour installer l’application, utilise le menu de ton navigateur puis « Ajouter à l’écran d’accueil » ou « Installer l’application ».');
  }
});
const BOS_CONTACT_URL='https://www.brunoguillard.com/';
if(projectContactBtn)projectContactBtn.addEventListener('click',()=>window.open(BOS_CONTACT_URL,'_blank','noopener'));
if(improveAppBtn)improveAppBtn.addEventListener('click',()=>window.open(BOS_CONTACT_URL,'_blank','noopener'));

const themeToggle=document.getElementById('themeToggle'),themeColor=document.getElementById('themeColor');
function applyTheme(theme){
  const dark=theme==='dark';
  document.body.classList.toggle('dark',dark);
  if(themeToggle)themeToggle.textContent=dark?'LIGHT':'DARK';
  if(themeColor)themeColor.setAttribute('content',dark?'#0B0C0E':'#F3F1EC');
  if(typeof updateGridOpacity==='function' && typeof state!=='undefined')updateGridOpacity();
  if(typeof renderPreview==='function' && typeof state!=='undefined')renderPreview();
}
applyTheme(localStorage.getItem('bruno-set-tools-theme')||'light');
if(themeToggle)themeToggle.addEventListener('click',()=>{
  const next=document.body.classList.contains('dark')?'light':'dark';
  localStorage.setItem('bruno-set-tools-theme',next);
  applyTheme(next);
});

function normalizeSceneObject(o){
  if(o.kind==='light')normalizeLightObject(o);
  if(o.kind==='camera')normalizeCameraObject(o);
  if(o.kind==='decor'){if(o.zHeight===undefined)o.zHeight=o.type==='wall'?2.5:o.type==='door'?2.04:o.type==='window'?1.2:.75;if(o.elevation===undefined)o.elevation=o.type==='window'?.9:0}
  if(o.kind==='accessory'){if(o.zHeight===undefined)o.zHeight=o.height||1.5;if(['diffusion','negative','reflector'].includes(o.type)&&Number(o.height)>.5&&Math.abs(Number(o.height)-Number(o.zHeight||0))<.001)o.height=o.type==='negative'?.05:.08;if(o.elevation===undefined)o.elevation=o.type==='borniol'?.2:.35;if(!o.short)o.short=o.type==='diffusion'?'DIFF':o.type==='negative'?'NEG':o.type==='reflector'?'REF':o.type==='flag'?'DRAP':'BOR'}
  if(o.locked===undefined)o.locked=false;if(o.labelVisible===undefined)o.labelVisible=true;if(!o.labelPos)o.labelPos='auto';return o;
}
function load(){
  const versionBadge=document.getElementById('appVersionBadge');if(versionBadge)versionBadge.textContent=APP_VERSION;
  setStageInteractionMode('hand');
  if((state.labelsMode||'full')!=='hidden')lastVisibleLabelsMode=state.labelsMode||'full';
  let stageWideSaved=false;try{stageWideSaved=localStorage.getItem(STAGE_WIDE_KEY)==='1'}catch(_){}
  setStageWide(stageWideSaved);
  loadLibrary();loadFavoriteLights();loadCachedLightDb();
  try{
    const raw=localStorage.getItem(CURRENT_KEY)||localStorage.getItem('bos-plan-feu-v05')||localStorage.getItem('bos-plan-feu-v04')||localStorage.getItem('bos-plan-feu-v03')||localStorage.getItem('bos-plan-feu-v02')||localStorage.getItem('bos-plan-feu-v01');
    const saved=raw&&JSON.parse(raw);
    if(saved&&Array.isArray(saved.objects)){state=saved;if(!state.planName)state.planName=defaultPlanName();state.objects.forEach(normalizeSceneObject);migrateOpeningBindings();if(!state.activePreviewCamera)state.activePreviewCamera=state.objects.find(o=>o.kind==='camera')?.id||null}else seed();
  }catch{seed()}
  ensureStateDefaults();if(!cameras[state.cameraModel])state.cameraModel='Sony FX3';state.focal=Number(state.focal)||50;updateStageGeometry();resetStageViewport();updatePlanBadge();render();
}
window.addEventListener('resize',()=>{
  let stageWideSaved=false;try{stageWideSaved=localStorage.getItem(STAGE_WIDE_KEY)==='1'}catch(_){}
  if(window.innerWidth<1000)stageCard?.classList.remove('stage-wide');
  else if(stageWideSaved)stageCard?.classList.add('stage-wide');
  if(stageWidthToggle){
    const wide=!!stageCard?.classList.contains('stage-wide');
    stageWidthToggle.setAttribute('aria-pressed',String(wide));
    stageWidthToggle.textContent=wide?'Réduire':'Élargir';
  }
  renderPreview();
  if(quickControls&&!quickControls.hidden&&quickControls.style.left){
    const left=parseFloat(quickControls.style.left)||0;
    const top=parseFloat(quickControls.style.top)||0;
    const pos=clampQuickControlsPosition(left,top);
    quickControls.style.left=`${pos.left}px`;
    quickControls.style.top=`${pos.top}px`;
  }
});setMainTab('plan');
load();
refreshCameraDb();
refreshLightDb();
