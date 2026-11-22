/* Instalación como app (PWA): registra el service worker y muestra el botón «Instalar app».
 * Android/Chrome/Edge: usa el aviso nativo de instalación. iPhone/iPad: muestra los pasos de Safari. */
(function () {
  "use strict";
  const toast = (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m));
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome/.test(ua);
  let deferred = null;

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW:", e)));
  }
  // Pide al navegador que no borre tus datos (progreso, notas) para liberar espacio.
  if (navigator.storage?.persist) navigator.storage.persisted().then((p) => { if (!p && standalone()) navigator.storage.persist(); });

  const btn = document.createElement("button");
  btn.type = "button"; btn.id = "installBtn"; btn.className = "btn btn-ghost hidden";
  btn.title = "Instalar Bitácora'27 en este dispositivo";
  btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3M12 9v6m0 0-2.25-2.25M12 15l2.25-2.25" /></svg><span class="lbl">Instalar app</span>`;

  function show() { if (!standalone()) btn.classList.remove("hidden"); }
  function iosHelp() {
    const ov = document.createElement("div");
    ov.className = "ios-help"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = `
      <div class="panel p-6 max-w-sm w-full">
        <p class="eyebrow accent">Instalar en iPhone / iPad</p>
        <p class="font-display text-3xl mt-2 leading-tight">Bitácora'27 en tu <em>pantalla de inicio</em></p>
        ${isSafari ? "" : `<p class="text-sm mt-3" style="color:var(--bad)">Abre esta página en <strong>Safari</strong>: en iPhone solo Safari permite instalarla.</p>`}
        <ol class="mt-4 text-sm space-y-3">
          <li><span class="mono accent mr-2">1</span>Toca el botón <strong>Compartir</strong> (cuadro con flecha ↑) en la barra de Safari.</li>
          <li><span class="mono accent mr-2">2</span>Baja y elige <strong>Agregar a inicio</strong>.</li>
          <li><span class="mono accent mr-2">3</span>Toca <strong>Agregar</strong>. Ábrela siempre desde ese ícono.</li>
        </ol>
        <button type="button" class="btn btn-primary w-full mt-6">Entendido</button>
      </div>`;
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.tagName === "BUTTON") ov.remove(); });
    document.body.append(ov);
  }

  btn.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      if (outcome === "accepted") btn.classList.add("hidden");
    } else if (isIOS) iosHelp();
    else toast("Usa el menú del navegador (⋮) → «Instalar app» o «Agregar a pantalla principal».");
  });

  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; show(); });
  addEventListener("appinstalled", () => { btn.classList.add("hidden"); deferred = null; toast("App instalada. Ábrela desde tu pantalla de inicio."); navigator.storage?.persist?.(); });

  function init() {
    const actions = document.querySelector(".rail-actions");
    if (actions) actions.prepend(btn);
    if (isIOS && !standalone()) show();
    if (standalone()) document.documentElement.classList.add("is-app");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
