const staticCacheName = 'site-static';
const dynamicCacheName = 'site-dynamic';

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/index.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/manifest.json',
    '/pages/fallback.html'
]


// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
      cache.keys().then(keys => {
        if(keys.length > size){
          cache.delete(keys[0]).then(limitCacheSize(name, size));
        }
      });
    });
  };



//assets will through error if url is not defined

// install service workerl
self.addEventListener('install', evt =>{
//console.log("Sw has been installed",e);

// cache of all data
evt.waitUntil(
    caches.open(staticCacheName).then(cache=>{
        console.log("cache shell assets")
        cache.addAll(assets)
      })
 )
});

// activate event
self.addEventListener('activate', evt =>{
    //console.log("Sw has been activated",e);
    evt.waitUntil(
     caches.keys().then(keys =>{
      return Promise.all(keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName )
      .map(key => caches.delete(key))
      )
     })
    )
});


// fetch events
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
   evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 15)
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
            return caches.match('/pages/fallback.html');
          }
        }
       )
      );
     }
  });