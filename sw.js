self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    self.registration.unregister()
        .then(() => console.log('Self-destructed SW'))
        .finally(() => self.clients.matchAll().then(clients => {
            clients.forEach(client => client.navigate(client.url)); // Force reload
        }));
});
