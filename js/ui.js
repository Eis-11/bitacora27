/* Piezas visuales compartidas por todas las vistas (Bitácora '27). */
(function () {
  "use strict";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  window.UI = {
    esc,
    card: "panel",
    // Encabezado editorial de cada vista: número, título serif con palabra en cursiva y línea de contexto.
    head: (num, label, titleHtml, metaHtml = "", rightHtml = "") => `
      <header class="vhead">
        <div class="flex items-center justify-between gap-3">
          <p class="eyebrow"><span class="vnum">${esc(num)}</span> — ${esc(label)}</p>
          ${rightHtml}
        </div>
        <h2>${titleHtml}</h2>
        ${metaHtml ? `<p class="vmeta">${metaHtml}</p>` : ""}
      </header>`,
    stat: (n, l, cls = "") => `<div class="stat"><div class="n ${cls}">${n}</div><div class="l mt-1.5">${esc(l)}</div></div>`,
    bar: (pct, ok = false) => `<div class="bar ${ok ? "ok" : ""}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`
  };
})();
