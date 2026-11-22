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
    // Utilidades compartidas por los módulos nuevos.
    load: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    save: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); } },
    md: (s) => esc(s).replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[0.82em]">$1</code>'),
    safeUrl: (u) => (/^https?:\/\//i.test(u || "") ? u : "#"),
    toast: (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m)),
    uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    copy: async (text) => {
      try { await navigator.clipboard.writeText(text); }
      catch { const t = Object.assign(document.createElement("textarea"), { value: text }); document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
      window.UI.toast("Copiado al portapapeles");
    },
    download: (name, text, type = "text/plain") => {
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([text], { type })), download: name });
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    d: (() => {
      const pad = (n) => String(n).padStart(2, "0");
      const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const parse = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
      const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
      const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
      const diff = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
      return {
        pad, iso, parse, addDays, diff, MES, DIA,
        today: () => iso(new Date()),
        monday: (s) => addDays(s, -((parse(s).getDay() + 6) % 7)),
        short: (s) => { const d = parse(s); return `${DIA[d.getDay()]} ${d.getDate()} ${MES[d.getMonth()]}`; },
        rel: (n) => (n === 0 ? "hoy" : n === 1 ? "mañana" : n === -1 ? "ayer" : n < 0 ? `hace ${-n} d` : `en ${n} d`)
      };
    })(),
    bar: (pct, ok = false) => `<div class="bar ${ok ? "ok" : ""}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`
  };
})();
