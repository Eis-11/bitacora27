/* Residencia: registro de horas (meta 500 h), resúmenes semanales/mensuales para tus reportes
 * y «Mis logros» (lista para convertir en viñetas de CV y LinkedIn). */
(function () {
  "use strict";
  const UI = window.UI, esc = UI.esc, D = UI.d;
  const K = { LOG: "dt2027_resid_horas", CFG: "dt2027_resid_cfg", LOGROS: "dt2027_logros" };
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const get = () => UI.load(K.LOG, []);
  const cfg = () => Object.assign({ meta: 500 }, UI.load(K.CFG, {}));
  const range = () => window.MIDIA?.planRange() || { inicioRes: "2027-01-18", finRes: "2027-06-30" };
  const fmtH = (h) => (Math.round(h * 10) / 10).toString();
  const emit = () => window.dispatchEvent(new CustomEvent("dt-data"));

  function weeks(log) {
    const by = {};
    log.forEach((x) => { const w = D.monday(x.date); (by[w] = by[w] || []).push(x); });
    return Object.entries(by).sort((a, b) => b[0].localeCompare(a[0]));
  }
  function summary(entries, titulo) {
    const tot = entries.reduce((a, x) => a + Number(x.h || 0), 0);
    const lines = [...entries].sort((a, b) => a.date.localeCompare(b.date)).map((x) => `- ${D.short(x.date)} (${fmtH(x.h)} h): ${x.act}${x.evid ? ` [Evidencia: ${x.evid}]` : ""}`);
    return `${titulo}\nTotal: ${fmtH(tot)} h\n\nActividades:\n${lines.join("\n")}`;
  }
  function stats() {
    const log = get(), c = cfg(), r = range(), t = D.today();
    const total = log.reduce((a, x) => a + Number(x.h || 0), 0);
    const left = Math.max(0, c.meta - total);
    const from = t > r.inicioRes ? t : r.inicioRes;
    const wLeft = Math.max(1, Math.ceil(D.diff(from, r.finRes) / 7));
    const last14 = log.filter((x) => D.diff(x.date, t) < 14 && x.date <= t).reduce((a, x) => a + Number(x.h || 0), 0) / 2;
    return { total, left, wLeft, need: left / wLeft, pace: last14, meta: c.meta, log };
  }

  function html() {
    const s = stats(), r = range(), t = D.today();
    const before = t < r.inicioRes;
    const wk = weeks(s.log);
    const months = [...new Set(s.log.map((x) => x.date.slice(0, 7)))].sort().reverse();
    const logros = UI.load(K.LOGROS, []);
    return `
      <section class="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Horas de residencia</span>
            <label class="mono text-[11px] text-slate-500 font-normal flex items-center gap-1.5">Meta <input id="resMeta" type="number" min="1" max="2000" value="${s.meta}" class="field !w-20 !py-1 text-xs" /> h</label></h3>
          ${before ? `<p class="text-sm text-slate-500 mt-2">Tu residencia empieza el <strong>${D.short(r.inicioRes)}</strong> (cámbialo en Mi día → Ajustes). Desde ese día registra tus horas al salir: toma 1 minuto y te ahorra horas al hacer los reportes.</p>` : ""}
          <div class="mt-4 flex flex-wrap items-end gap-x-10 gap-y-4">
            <p class="font-display text-6xl leading-none">${fmtH(s.total)}<span class="text-3xl text-slate-400">/${s.meta} h</span></p>
            ${UI.stat(fmtH(s.need), "h/semana necesarias")}
            ${UI.stat(fmtH(s.pace), "h/semana (últ. 2 sem.)", s.total && s.pace < s.need ? "text-[color:var(--warn)]" : "")}
          </div>
          <div class="mt-3">${UI.bar((s.total / s.meta) * 100, s.total >= s.meta)}</div>
          <p class="mono text-[10.5px] text-slate-500 mt-2">Faltan ${fmtH(s.left)} h · ${s.wLeft} semanas hasta ${D.short(r.finRes)}</p>
          <form id="resForm" class="mt-5 grid gap-2 grid-cols-2 sm:grid-cols-[auto_90px_minmax(0,1fr)]">
            <input name="date" type="date" class="field" value="${t}" required aria-label="Fecha" />
            <input name="h" type="number" min="0.5" max="24" step="0.5" class="field" placeholder="Horas" value="8" required aria-label="Horas" />
            <input name="act" class="field col-span-2 sm:col-span-1" placeholder="¿Qué hiciste? (ej. endpoint de reportes en ASP.NET Core)" required maxlength="240" />
            <input name="evid" class="field col-span-2" placeholder="Evidencia: link del PR, ticket, captura… (opcional)" maxlength="240" />
            <button class="btn btn-primary" type="submit">Registrar día</button>
          </form>
          <div class="mt-6 grid gap-3">${wk.length ? wk.slice(0, 12).map(([w, es]) => {
            const tot = es.reduce((a, x) => a + Number(x.h || 0), 0);
            return `<details class="panel-flat p-3" ${w === D.monday(t) ? "open" : ""}>
              <summary class="flex flex-wrap items-center justify-between gap-2 cursor-pointer"><span class="font-semibold text-sm">Semana del ${D.short(w)}</span><span class="mono text-xs">${fmtH(tot)} h · ${es.length} días</span></summary>
              <ul class="mt-2">${[...es].sort((a, b) => a.date.localeCompare(b.date)).map((x) => `<li class="flex items-start gap-3 py-2 border-t hair first:border-t-0 text-sm"><span class="mono text-[11px] text-slate-500 w-20 shrink-0">${D.short(x.date)}</span><span class="mono text-xs w-10 shrink-0">${fmtH(x.h)} h</span><span class="flex-1 min-w-0">${esc(x.act)}${x.evid ? ` <a href="${esc(UI.safeUrl(x.evid))}" target="_blank" rel="noopener" class="mono text-[11px] accent">${/^https?:/.test(x.evid) ? "evidencia ↗" : esc(x.evid)}</a>` : ""}</span><button type="button" data-res-del="${x.id}" class="btn btn-sm btn-ghost !py-0" aria-label="Eliminar">×</button></li>`).join("")}</ul>
              <button type="button" data-res-week="${w}" class="btn btn-sm mt-2">Copiar resumen de la semana</button>
            </details>`; }).join("") : ""}</div>
          ${months.length ? `<div class="mt-4 flex flex-wrap items-center gap-2"><span class="eyebrow">Resumen mensual</span>${months.map((m) => `<button type="button" data-res-month="${m}" class="chip">${MESES[+m.slice(5) - 1]} ${m.slice(0, 4)}</button>`).join("")}<button type="button" id="resCsv" class="btn btn-sm ml-auto">Descargar todo (.csv)</button></div>` : ""}
        </div>

        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Mis logros</span><span class="text-sm text-slate-500 font-normal">${logros.length}</span></h3>
          <p class="text-sm text-slate-500 mt-2">Anota cada cosa que termines y que se pueda medir. Al actualizar tu CV o LinkedIn ya tendrás las viñetas listas.</p>
          <form id="logForm" class="mt-4 grid gap-2">
            <input name="t" class="field" placeholder="Qué lograste (ej. Publiqué mi API de inventario con Docker)" required maxlength="200" />
            <input name="imp" class="field" placeholder="Resultado o número (ej. 5 endpoints, 12 pruebas, −40% tiempo)" maxlength="160" />
            <button class="btn btn-primary" type="submit">Guardar logro</button>
          </form>
          <ul class="mt-4">${logros.length ? logros.map((x) => `<li class="flex items-start gap-3 py-2.5 border-t hair first:border-t-0 text-sm"><span class="mono text-[10.5px] text-slate-500 w-16 shrink-0 pt-0.5">${D.short(x.date)}</span><span class="flex-1 min-w-0">${esc(x.t)}${x.imp ? ` <span class="text-slate-500">— ${esc(x.imp)}</span>` : ""}</span><button type="button" data-log-del="${x.id}" class="btn btn-sm btn-ghost !py-0" aria-label="Eliminar">×</button></li>`).join("") : `<li class="text-sm text-slate-500 py-2">Ej.: «Obtuve la certificación Foundational C# de Microsoft y freeCodeCamp».</li>`}</ul>
          ${logros.length ? `<button type="button" id="logCopy" class="btn btn-sm mt-3">Copiar como viñetas para CV</button>` : ""}
        </div>
      </section>`;
  }

  function bind(el, rerender) {
    el.querySelector("#resMeta")?.addEventListener("change", (e) => { const v = Math.max(1, +e.target.value || 500); UI.save(K.CFG, { ...cfg(), meta: v }); rerender(); });
    el.querySelector("#resForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target), log = get();
      log.push({ id: UI.uid(), date: String(f.get("date")), h: Number(f.get("h")), act: String(f.get("act")).trim(), evid: String(f.get("evid")).trim() });
      UI.save(K.LOG, log); emit(); rerender(); UI.toast("Día registrado");
    });
    el.querySelectorAll("[data-res-del]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("¿Eliminar este registro de horas?")) return;
      UI.save(K.LOG, get().filter((x) => x.id !== b.dataset.resDel)); emit(); rerender();
    }));
    el.querySelectorAll("[data-res-week]").forEach((b) => b.addEventListener("click", () => {
      const w = b.dataset.resWeek, es = get().filter((x) => D.monday(x.date) === w);
      UI.copy(summary(es, `Reporte semanal de residencia — semana del ${D.short(w)} al ${D.short(D.addDays(w, 6))}`));
    }));
    el.querySelectorAll("[data-res-month]").forEach((b) => b.addEventListener("click", () => {
      const m = b.dataset.resMonth, es = get().filter((x) => x.date.startsWith(m));
      UI.copy(summary(es, `Reporte mensual de residencia — ${MESES[+m.slice(5) - 1]} ${m.slice(0, 4)}`));
    }));
    el.querySelector("#resCsv")?.addEventListener("click", () => {
      const q = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
      const rows = [["Fecha", "Horas", "Actividad", "Evidencia"], ...[...get()].sort((a, b) => a.date.localeCompare(b.date)).map((x) => [x.date, x.h, x.act, x.evid])];
      UI.download(`horas_residencia_${D.today()}.csv`, "﻿" + rows.map((r) => r.map(q).join(",")).join("\r\n"), "text/csv");
    });
    el.querySelector("#logForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target), l = UI.load(K.LOGROS, []);
      l.unshift({ id: UI.uid(), date: D.today(), t: String(f.get("t")).trim(), imp: String(f.get("imp")).trim() });
      UI.save(K.LOGROS, l); emit(); rerender(); UI.toast("Logro guardado 🎉");
    });
    el.querySelectorAll("[data-log-del]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("¿Eliminar este logro?")) return;
      UI.save(K.LOGROS, UI.load(K.LOGROS, []).filter((x) => x.id !== b.dataset.logDel)); emit(); rerender();
    }));
    el.querySelector("#logCopy")?.addEventListener("click", () => UI.copy(UI.load(K.LOGROS, []).map((x) => `• ${x.t}${x.imp ? ` (${x.imp})` : ""}`).join("\n")));
  }

  window.RESID = { html, bind, stats };
})();
