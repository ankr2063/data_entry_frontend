# PWA App

A minimal Progressive Web App built with vanilla JavaScript.

## Development
For live reload during development:
```bash
npm run start
```

## Production
Serve with any HTTP server (HTTPS required for PWA):
```bash
npx serve
```

## Structure
```
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── css/
│   └── style.css      # Styles
├── js/
│   └── app.js         # Main JavaScript
└── icons/             # App icons (add 192x192 and 512x512 PNG files)
```

## Features
- Offline support
- Installable
- Responsive design
- Live reload in development
