# Alkady Car Gallery – PWA wrapper

This repo hosts a simple PWA shell that loads your Google Apps Script web app in an iframe.

**Live app URL (Apps Script):**
https://script.google.com/macros/s/AKfycbyA2Fo14EEhTUM53TGBKpVE3cTPV93rmK8icplq7bPp-zRVEzi014cTn9Rnms5dSHiKZg/exec

## Files
- `index.html` – loads your web app via iframe and registers the service worker
- `manifest.webmanifest` – PWA manifest with icons
- `sw.js` – simple cache for wrapper assets
- `icons/icon-192.png`, `icons/icon-512.png` – app icons (generated from your logo)
- `.well-known/assetlinks.json` – placeholder; replace with the file PWABuilder gives you for Android TWA

## Quick deploy (GitHub Pages)
1. Push these files to a GitHub repo (e.g. `alkady-gallery`).
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` (root).
3. Open: `https://<username>.github.io/alkady-gallery/`
4. Optional: map custom domain like `gallery.alkadycarsgroup.com` (CNAME to `<username>.github.io`).

## PWABuilder (Android package)
1. Go to https://www.pwabuilder.com and enter your GitHub Pages URL.
2. Fix any manifest/service worker warnings (should be fine).
3. In the **Package** tab, generate **Android (TWA)**.
4. PWABuilder will give you an `assetlinks.json` – put it into `/.well-known/assetlinks.json` in this repo and redeploy.
5. Upload the generated Android package (AAB) to Play Console.

> For iOS: use “Add to Home Screen” or create the iOS package from PWABuilder.
