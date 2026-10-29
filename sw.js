/* Math Portal — offline cache (index.html-এর পাশে রাখুন, HTTPS হোস্টিং লাগবে) */
var C = "mathportal-v1";
self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var r = e.request;
  if(r.method !== "GET") return;
  var u = new URL(r.url);
  if(/firebase|googleapis\.com\/identitytoolkit|firestore|wa\.me/.test(u.href) && !/gstatic\.com\/firebasejs/.test(u.href)) return; // লাইভ ডেটা ক্যাশ নয়
  e.respondWith(caches.open(C).then(function(c){
    return c.match(r).then(function(hit){
      var net = fetch(r).then(function(res){ if(res && (res.ok || res.type === "opaque")) c.put(r, res.clone()); return res; }).catch(function(){ return hit; });
      return hit || net;
    });
  }));
});
