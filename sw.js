// Service worker minimal pour l'installation native de BOS PLAN.
// Aucune mise en cache : tous les chargements restent sur le réseau.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate' && event.request.method==='GET'){
    event.respondWith(fetch(event.request));
  }
});
