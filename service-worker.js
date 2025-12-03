const CACHE_NAME = 'sek-toolbox-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './folder-styles.css',
    './modal-styles.css',
    './ui-styles.css',
    './script.js',
    './tools/tools.js',
    './tools/study-tools.js',
    './tools/creative-tools.js',
    './tools/dev-tools.js',
    './tools/game-tools.js',
    './tools/security-tools.js',
    './data/namedays.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
