'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9ba140f9f81e837fffa80bc3632cad1a",
"assets/assets/Fonts/MazzardH-Bold.otf": "1a6e7758d28b79f4c742955fe5ca4bf3",
"assets/assets/Icons/Icon-E-mail.png": "8011752b443499b11792a698feae84c9",
"assets/assets/Icons/Icon-Instagram.png": "54a3b10335a61ebefbe07b0cd868ece6",
"assets/assets/Icons/Icon-Ligacao.png": "0c4fbdb5436b2fdb4b8eadb9aa80eccc",
"assets/assets/Icons/Icon-Linkedin.png": "38a1cb3966c2f94e6901065938ffb1d9",
"assets/assets/Icons/Icon-Localizacao.png": "45812cefcf524d2e8b6ef0caf3d73f1d",
"assets/assets/Icons/Icon-WhatsApp.png": "7bf6b2faa8d4c97cb7227dc1bfb23ef0",
"assets/assets/Img/bem-vindo.png": "0a150c06fc1e8b212b368fd60ab13b2c",
"assets/assets/Img/Catavento-rodape.png": "4b6a71334f74373b4119e238e24074e8",
"assets/assets/Img/Catavento.png": "a50b7298b222f2c53853459cacbb372f",
"assets/assets/Img/Detalhe-1.png": "5b9bbb0ea219ae3355d0b47acb37e17c",
"assets/assets/Img/Detalhe-rodape.png": "544f8a48007f42fb04911ed68f53690d",
"assets/assets/Img/Imagem-01.png": "154273aa7f10d6caba156bc54ea74c0f",
"assets/assets/Img/Imagem-02.png": "6f04b79a89148b2d1ca84194523651c3",
"assets/assets/Img/Imagem-03.png": "a2916fde99866108aa78ac50245fe908",
"assets/assets/Img/ImagemD-04.png": "4751c6fad594c223e700c375b073648b",
"assets/assets/Img/ImagemD-05.png": "eb854928746c32eb172104a42809e78e",
"assets/assets/Img/ImagemDN-06.png": "1dfb5e66df9421954e120c3933f02440",
"assets/assets/Img/Logo-nome.png": "c0f82957ee705a0c3adab36a0eeb7a7a",
"assets/FontManifest.json": "cb121fe4fd87fed4c04169218a774868",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "3dc866eeeac9bb7c7f9bc7dae1d53071",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "22040ec37fc557d213159dcabc9454f6",
"/": "22040ec37fc557d213159dcabc9454f6",
"main.dart.js": "1e9136ff3eb5846964c18eab3ea90019",
"manifest.json": "e88e21bb43e45295dc6a98c82ec26441",
"version.json": "5f5ba78084af2e7683d38ff5b661179f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
