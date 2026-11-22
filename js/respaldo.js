/* Respaldo completo: guarda TODO tu progreso (todas las pestañas) en un archivo .json
 * y lo comparte (WhatsApp, Drive, correo) en el teléfono o lo descarga en la PC. */
(function () {
  "use strict";
  const UI = window.UI;
  const LAST = "dt2027_ultimo_respaldo";
  const SKIP = new Set(["dt2027_focus_run", "dt2027_tab", LAST]);
  const isMine = (k) => /^(dt2027_|dtm2026_)/.test(k) && !SKIP.has(k);

  function data() {
    const keys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isMine(k)) keys[k] = localStorage.getItem(k);
    }
    return { app: "bitacora27", version: 2, fecha: new Date().toISOString(), keys };
  }
  const fileName = () => `bitacora27_respaldo_${UI.d.today()}.json`;
  function mark() { localStorage.setItem(LAST, JSON.stringify(UI.d.today())); window.dispatchEvent(new CustomEvent("dt-data")); }

  async function share() {
    const text = JSON.stringify(data(), null, 1);
    const file = new File([text], fileName(), { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ files: [file], title: "Respaldo Bitácora'27" }); mark(); UI.toast("Respaldo compartido"); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    UI.download(fileName(), text, "application/json"); mark(); UI.toast("Respaldo descargado");
  }

  // Restaura un respaldo v2 (todas las claves). Devuelve false si no es de este formato.
  function restore(obj) {
    if (!obj || obj.app !== "bitacora27" || !obj.keys) return false;
    const n = Object.keys(obj.keys).filter(isMine).length;
    if (!confirm(`Este respaldo es del ${String(obj.fecha).slice(0, 10)} y trae ${n} secciones. Reemplazará el progreso de este dispositivo. ¿Continuar?`)) return true;
    Object.entries(obj.keys).forEach(([k, v]) => { if (isMine(k) && typeof v === "string") localStorage.setItem(k, v); });
    mark(); UI.toast("Respaldo restaurado"); setTimeout(() => location.reload(), 600);
    return true;
  }
  function pickAndRestore() {
    const i = Object.assign(document.createElement("input"), { type: "file", accept: "application/json,.json" });
    i.addEventListener("change", async () => {
      try { const o = JSON.parse(await i.files[0].text()); if (!restore(o)) UI.toast("Ese archivo es de la versión anterior: impórtalo desde Ruta → Importar"); }
      catch { UI.toast("Archivo no válido"); }
    });
    i.click();
  }
  const daysSince = () => { const l = UI.load(LAST, null); return l ? UI.d.diff(l, UI.d.today()) : null; };

  window.APP_BACKUP = { data, share, restore, pickAndRestore, daysSince, mark };
})();
