if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      console.log('Service Worker registered', reg);
      document.getElementById('status').textContent = 'PWA ready - works offline!';
    })
    .catch(err => {
      console.error('Service Worker registration failed', err);
      document.getElementById('status').textContent = 'PWA registration failed';
    });
}
