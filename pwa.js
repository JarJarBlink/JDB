/* Registers the service worker. Include with:  <script defer src="pwa.js"></script>
 * sw.js is looked up next to this file, so keep both in the JDB root.
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  // Must be read synchronously while the script is executing.
  var swUrl = new URL('sw.js', document.currentScript.src).href;
  var hadController = !!navigator.serviceWorker.controller;
  var reloading = false;

  // Reload once when a NEW worker takes over (not on the very first install).
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || reloading) return;
    reloading = true;
    location.reload();
  });

  function showUpdateToast(worker) {
    var bar = document.createElement('div');
    bar.textContent = 'New version available \u2014 tap to reload';
    bar.style.cssText =
      'position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);z-index:10000;' +
      'padding:.6rem 1rem;border-radius:.5rem;background:#222;color:#fff;' +
      'font:14px/1.4 sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4)';
    bar.addEventListener('click', function () {
      worker.postMessage('SKIP_WAITING');
      bar.remove();
    });
    document.body.appendChild(bar);
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) showUpdateToast(reg.waiting);

      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast(nw);
        });
      });
    }).catch(function (err) {
      console.warn('SW registration failed:', err);
    });
  });

  // Optional: add <button id="pwa-install" hidden>Install</button> anywhere in a page
  // and it will appear only when the browser says the app is installable.
  window.addEventListener('beforeinstallprompt', function (e) {
    var btn = document.getElementById('pwa-install');
    if (!btn) return; // no button on this page: leave the browser default alone
    e.preventDefault();
    btn.hidden = false;
    btn.addEventListener('click', function () {
      btn.hidden = true;
      e.prompt();
    }, { once: true });
  });
})();
