/* Búsqueda global (Ctrl+K o /): días del plan, vacantes, certificaciones, pendientes, contactos y tarjetas. */
(function () {
  "use strict";
  const UI = window.UI, esc = UI.esc, D = UI.d;
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  let ov = null, results = [], idx = 0;

  function goTab(t) { document.querySelector(`.tab-btn[data-tab="${t}"]`)?.click(); }
  function index() {
    const out = [];
    (window.PLAN_DIARIO?.days || []).forEach((d) => out.push({
      tipo: "Día", t: `${D.short(d.date)} · ${d.title}`, sub: d.blocks.map((b) => b.label).join(" · "),
      txt: [d.title, d.objective, ...d.blocks.flatMap((b) => [b.label, ...b.items.map((i) => i.t + " " + (i.como || ""))])].join(" "),
      go: () => { window.MIDIA?.go(d.date); goTab("dia"); }
    }));
    (window.VACANTES?.items || []).forEach((v) => out.push({
      tipo: "Vacante", t: `${v.empresa} — ${v.titulo}`, sub: `${v.ciudad} · ${v.modalidad || ""}`, txt: [v.empresa, v.titulo, v.ciudad, v.region, (v.stack || []).join(" ")].join(" "),
      go: () => { goTab("vacantes"); setTimeout(() => { const q = document.getElementById("vacQ"); if (q) { q.value = v.empresa; q.dispatchEvent(new Event("input", { bubbles: true })); } }, 50); }
    }));
    (window.CERTS || []).forEach((c) => out.push({ tipo: "Certificación", t: c.nombre, sub: `${c.emisor} · ${c.cuando}`, txt: [c.nombre, c.emisor, c.porque].join(" "),
      go: () => { goTab("ruta"); setTimeout(() => document.getElementById("certs")?.scrollIntoView({ behavior: "smooth" }), 80); } }));
    (window.RUTA || []).forEach((f) => (f.pasos || []).forEach((p) => out.push({ tipo: "Ruta", t: p.texto, sub: `${f.fase} · ${f.titulo}`, txt: [p.texto, p.como, f.titulo].join(" "), go: () => goTab("ruta") })));
    UI.load("dt2027_tareas", []).forEach((x) => out.push({ tipo: "Pendiente", t: x.t, sub: `${x.cat}${x.due ? " · " + D.short(x.due) : ""}${x.ok ? " · hecho" : ""}`, txt: x.t + " " + x.cat, go: () => window.CONTROL?.show("pend") }));
    UI.load("dt2027_crm", []).forEach((r) => out.push({ tipo: "Contacto", t: r.empresa, sub: `${r.medio} · ${D.short(r.fecha)}${r.puesto ? " · " + r.puesto : ""}`, txt: [r.empresa, r.contacto, r.puesto, r.notas].join(" "), go: () => window.CONTROL?.show("post") }));
    (window.TARJETAS || []).forEach((c) => out.push({ tipo: "Tarjeta", t: c.q, sub: c.cat, txt: c.q + " " + c.a + " " + c.cat, go: () => window.CONTROL?.show("repaso") }));
    document.querySelectorAll("#view-empresas h3").forEach((h) => { const name = h.textContent.trim(); if (name && name.length < 80) out.push({ tipo: "Empresa", t: name, sub: "Directorio", txt: name + " " + (h.closest("article,div")?.textContent || "").slice(0, 300), go: () => { goTab("empresas"); setTimeout(() => h.scrollIntoView({ behavior: "smooth", block: "center" }), 80); } }); });
    return out.map((x) => ({ ...x, n: norm(x.t + " " + x.txt) }));
  }
  function search(q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const all = index();
    return all.filter((x) => words.every((w) => x.n.includes(w)))
      .map((x) => ({ ...x, score: words.reduce((a, w) => a + (norm(x.t).includes(w) ? 2 : 1), 0) }))
      .sort((a, b) => b.score - a.score).slice(0, 40);
  }
  function paint() {
    const list = ov.querySelector("#qList");
    list.innerHTML = results.length ? results.map((r, i) => `<li><button type="button" data-qi="${i}" class="q-item ${i === idx ? "on" : ""}"><span class="chip !py-0 shrink-0">${esc(r.tipo)}</span><span class="min-w-0"><span class="block text-sm truncate">${esc(r.t)}</span><span class="block mono text-[10.5px] text-slate-500 truncate">${esc(r.sub || "")}</span></span></button></li>`).join("")
      : `<li class="text-sm text-slate-500 p-4">${ov.querySelector("#qIn").value ? "Sin resultados." : "Busca días del plan, temas (ej. «CORS», «migraciones»), vacantes, empresas, certificaciones, pendientes o tarjetas."}</li>`;
    list.querySelectorAll("[data-qi]").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.qi)));
    list.querySelector(".on")?.scrollIntoView({ block: "nearest" });
  }
  function pick(i) { const r = results[i]; close(); r?.go(); }
  function open() {
    if (ov) return;
    ov = document.createElement("div");
    ov.className = "q-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Buscar");
    ov.innerHTML = `<div class="q-box panel"><div class="flex items-center gap-2 p-3 border-b hair"><span class="mono accent text-sm">⌕</span><input id="qIn" class="flex-1 bg-transparent outline-none text-base py-1" placeholder="Buscar en toda la app…" autocomplete="off" /><kbd>Esc</kbd></div><ul id="qList" class="max-h-[60vh] overflow-y-auto p-1.5"></ul></div>`;
    document.body.append(ov);
    const inp = ov.querySelector("#qIn");
    inp.addEventListener("input", () => { results = search(inp.value); idx = 0; paint(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); idx = Math.min(results.length - 1, idx + 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); idx = Math.max(0, idx - 1); paint(); }
      else if (e.key === "Enter") { e.preventDefault(); pick(idx); }
      else if (e.key === "Escape") close();
    });
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    results = []; paint(); inp.focus();
  }
  function close() { ov?.remove(); ov = null; }

  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ov ? close() : open(); }
    else if (e.key === "/" && !typing && !ov) { e.preventDefault(); open(); }
  });
  function init() {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn btn-ghost"; btn.title = "Buscar (Ctrl+K)";
    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg><span class="lbl">Buscar <kbd class="ml-auto">Ctrl K</kbd></span>`;
    btn.addEventListener("click", open);
    document.querySelector(".rail-actions")?.prepend(btn);
  }
  window.BUSCAR = { open };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
