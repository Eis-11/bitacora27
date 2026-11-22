/* Repaso espaciado (sistema Leitner) con las tarjetas de data/tarjetas.js.
 * Caja 1 → mañana · 2 → 3 días · 3 → 7 · 4 → 14 · 5 → 30. Si fallas, regresa a la caja 1. */
(function () {
  "use strict";
  const UI = window.UI, esc = UI.esc, D = UI.d;
  const K = { ST: "dt2027_cards", DAY: "dt2027_cards_dia" };
  const GAP = [0, 1, 3, 7, 14, 30];
  const NEW_PER_DAY = 8, GOAL = 10;
  const ALL = () => window.TARJETAS || [];
  let cat = "all", cur = null, shown = false;

  const st = () => UI.load(K.ST, {});
  const doneToday = () => UI.load(K.DAY, {})[D.today()] || 0;
  function queue() {
    const s = st(), t = D.today();
    const pool = ALL().filter((c) => cat === "all" || c.cat === cat);
    const due = pool.filter((c) => s[c.id] && s[c.id].next <= t).sort((a, b) => s[a.id].b - s[b.id].b);
    const newToday = Object.values(s).filter((x) => x.first === t).length;
    const fresh = pool.filter((c) => !s[c.id]).slice(0, Math.max(0, NEW_PER_DAY - newToday));
    return [...due, ...fresh];
  }
  function grade(ok) {
    if (!cur) return;
    const s = st(), t = D.today();
    const x = s[cur.id] || { b: 0, first: t, ok: 0, ko: 0 };
    x.b = ok ? Math.min(5, x.b + 1) : 1;
    x.next = D.addDays(t, GAP[x.b]);
    ok ? x.ok++ : x.ko++;
    s[cur.id] = x; UI.save(K.ST, s);
    const dd = UI.load(K.DAY, {}); dd[t] = (dd[t] || 0) + 1; UI.save(K.DAY, dd);
    if (dd[t] === GOAL) UI.toast(`¡Meta de ${GOAL} tarjetas cumplida!`);
    cur = null; shown = false;
    window.dispatchEvent(new CustomEvent("dt-data"));
  }
  function stats() {
    const s = st(), boxes = [0, 0, 0, 0, 0];
    Object.values(s).forEach((x) => { if (x.b >= 1) boxes[x.b - 1]++; });
    return { boxes, seen: Object.keys(s).length, total: ALL().length, due: queue().length, today: doneToday(), goal: GOAL };
  }

  function html() {
    const q = queue();
    if (!cur || !q.some((c) => c.id === cur.id)) { cur = q[0] || null; shown = false; }
    const sx = stats(), s = st();
    const cats = [...new Set(ALL().map((c) => c.cat))];
    const box = cur && s[cur.id] ? s[cur.id].b : 0;
    return `
      <section class="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div class="panel p-5 sm:p-7">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="eyebrow accent">Repaso para entrevistas</p>
            <span class="mono text-[11px] text-slate-500">${sx.today}/${GOAL} hoy · ${q.length} pendientes</span>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-3">${["all", ...cats].map((c) => `<button type="button" data-card-cat="${esc(c)}" class="chip ${cat === c ? "chip-solid" : ""}">${c === "all" ? "Todas" : esc(c)}</button>`).join("")}</div>
          ${cur ? `
          <div class="flashcard mt-5">
            <p class="mono text-[10.5px] text-slate-500 uppercase tracking-wider">${esc(cur.cat)} · ${box ? `caja ${box}` : "nueva"}</p>
            <p class="font-display text-3xl sm:text-4xl leading-[1.1] mt-3 tracking-tight">${UI.md(cur.q)}</p>
            ${shown ? `<div class="mt-5 pt-5 border-t hair text-[15px] leading-relaxed">${UI.md(cur.a)}</div>` : `<p class="text-sm text-slate-500 mt-5">Respóndela en voz alta antes de voltearla.</p>`}
          </div>
          <div class="flex flex-wrap gap-2 mt-5">
            ${shown ? `<button type="button" data-card="ko" class="btn">✗ No la sabía <kbd class="ml-1">1</kbd></button><button type="button" data-card="ok" class="btn btn-accent">✓ La sabía <kbd class="ml-1">2</kbd></button>`
              : `<button type="button" data-card="show" class="btn btn-primary">Mostrar respuesta <kbd class="ml-1">Espacio</kbd></button>`}
          </div>` : `
          <div class="flashcard mt-5"><p class="font-display text-4xl">Terminaste <em class="accent">por hoy</em>.</p><p class="text-sm text-slate-500 mt-3">Las tarjetas vuelven cuando toca repasarlas. Mañana entran ${NEW_PER_DAY} nuevas.</p></div>`}
        </div>
        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Tu memoria</span><span class="text-sm text-slate-500 font-normal">${sx.seen}/${sx.total} vistas</span></h3>
          <div class="grid grid-cols-5 gap-2 mt-4 text-center">${sx.boxes.map((n, i) => `<div class="panel-flat p-2"><p class="font-display text-3xl">${n}</p><p class="mono text-[10px] text-slate-500">caja ${i + 1}<br>${GAP[i + 1]} d</p></div>`).join("")}</div>
          <p class="text-xs text-slate-500 mt-4 leading-relaxed">Cada acierto sube la tarjeta de caja y la aleja en el tiempo; cada fallo la regresa a la caja 1. Haz ${GOAL} al día (≈10 min, perfecto en el teléfono). Las de la caja 5 ya las dominas.</p>
        </div>
      </section>`;
  }
  function bind(el, rerender) {
    el.querySelectorAll("[data-card-cat]").forEach((b) => b.addEventListener("click", () => { cat = b.dataset.cardCat; cur = null; rerender(); }));
    el.querySelectorAll("[data-card]").forEach((b) => b.addEventListener("click", () => act(b.dataset.card, rerender)));
  }
  function act(a, rerender) {
    if (!cur) return;
    if (a === "show") shown = true; else if (shown) grade(a === "ok");
    rerender();
  }
  window.CARDS = { html, bind, stats, act, isShown: () => shown, hasCard: () => !!cur };
})();
