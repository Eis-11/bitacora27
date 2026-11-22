/* Pestaña «Control»: las 3 prioridades del día, pendientes con fecha, próximas fechas,
 * constancia (mapa de calor), horas de enfoque, embudo de postulaciones y atajos de teclado. */
(function () {
  "use strict";
  const LS = { TAREAS: "dt2027_tareas", TOP3: "dt2027_top3", LOG: "dt2027_focus_log", DIA: "dt2027_dia", VAC: "dt2027_vacantes_estado", CERTS: "dt2027_certs" };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); } };
  const UI = window.UI, esc = UI.esc;
  const toast = (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m));
  const M = () => window.MIDIA;

  /* ---------- Fechas ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const DIA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const short = (s) => { const d = parse(s); return `${DIA[d.getDay()]} ${d.getDate()} ${MES[d.getMonth()]}`; };
  const rel = (n) => (n === 0 ? "hoy" : n === 1 ? "mañana" : n === -1 ? "ayer" : n < 0 ? `hace ${-n} d` : `en ${n} d`);

  const CATS = ["Escuela", "Residencia", "Código", "Certificación", "Inglés", "Personal"];
  const PRIO = { 1: { l: "Alta", cls: "chip-bad" }, 2: { l: "Media", cls: "chip-warn" }, 3: { l: "Baja", cls: "" } };
  const ESTADOS = [["saved", "Me interesa"], ["applied", "Postulado"], ["interview", "Entrevista"], ["offer", "Aceptado"], ["rejected", "Descartada"]];

  let tareas = load(LS.TAREAS, []);
  let top3 = load(LS.TOP3, {});
  let catFilter = "all";
  let pane = load("dt2027_ctl_pane", "hoy");
  let weekOff = 0;
  const PANES = [["hoy", "Hoy"], ["pend", "Pendientes"], ["post", "Postulaciones"], ["resid", "Residencia"], ["repaso", "Repaso"], ["prog", "Progreso"]];
  const monday = (s) => UI.d.monday(s);

  /* ---------- Cálculos ---------- */
  function todayBlocks(date = today()) {
    const day = M()?.getDay(date);
    if (!day) return { day: null, blocks: [], total: 0 };
    const d = load(LS.DIA, {})[date] || {};
    const blocks = day.blocks.map((b) => ({ ...b, done: b.items.every((_, i) => d[`${b.key}-${i}`]) }));
    const total = blocks.filter((b) => !(day.kind === "res" && b.key === "res")).reduce((a, b) => a + (b.min || 0), 0);
    return { day, blocks, total };
  }
  const focusByDay = () => load(LS.LOG, []).reduce((a, x) => ((a[x.d] = (a[x.d] || 0) + x.min), a), {});
  function upcoming() {
    const t = today(), out = [];
    const hd = M()?.hitosDone() || {};
    (M()?.allHitos() || []).forEach((h) => {
      const n = diff(t, h.date);
      if (!hd[h.id] && n >= -14 && n <= 30) out.push({ date: h.date, t: h.titulo, sub: h.detalle, tipo: "Hito", cls: "chip-accent" });
    });
    for (let i = 0; i <= 21; i++) {
      const date = addDays(t, i);
      (M()?.getDay(date)?.blocks || []).filter((b) => b.key === "cert" && /examen|agenda/i.test(b.label)).forEach((b) => out.push({ date, t: b.label.replace(/^Certificación · /, ""), sub: "Bloque CERT en Mi día", tipo: "Certificación", cls: "chip-ok" }));
    }
    (window.CRM?.followUps() || []).filter((x) => diff(t, x.date) <= 21).forEach((x) => out.push(x));
    tareas.filter((x) => !x.ok && x.due && diff(t, x.due) <= 21).forEach((x) => out.push({ date: x.due, t: x.t, sub: x.cat, tipo: "Pendiente", cls: PRIO[x.pr]?.cls || "" }));
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }

  /* ---------- Render ---------- */
  function render() {
    const el = document.getElementById("view-control");
    if (!el || !M()) return;
    const t = today();
    const { day, blocks, total } = todayBlocks();
    const next = blocks.find((b) => !b.done && !(day?.kind === "res" && b.key === "res"));
    const pct = M().dayPct(t);
    const fmin = focusByDay()[t] || 0;
    const overdue = tareas.filter((x) => !x.ok && x.due && x.due < t).length;
    const mine = top3[t] || [{}, {}, {}];

    const badge = {
      pend: overdue || tareas.filter((x) => !x.ok).length || "",
      post: window.CRM ? window.CRM.stats().due || "" : "",
      repaso: window.CARDS ? window.CARDS.stats().due || "" : ""
    };
    let body = "";
    if (pane === "pend") body = pendientesHtml();
    else if (pane === "post") body = window.CRM ? window.CRM.html() : "";
    else if (pane === "resid") body = window.RESID ? window.RESID.html() : "";
    else if (pane === "repaso") body = window.CARDS ? window.CARDS.html() : "";
    else if (pane === "prog") body = `${semanaHtml()}${heatHtml()}<section class="grid gap-5 lg:grid-cols-3">${focusHtml()}${embudoHtml()}${certsHtml()}</section>`;
    else body = hoyHtml({ t, day, next, pct, fmin, total, overdue, mine });

    el.innerHTML = `
      ${UI.head("05", "Control", `Centro de <em>control</em>`,
        `Decide tus 3 prioridades, enfócate un bloque a la vez y saca de tu cabeza todo lo que no sea del plan: pendientes, postulaciones y horas quedan registrados aquí.`,
        `<button type="button" id="ctlKeys" class="btn btn-sm btn-ghost" title="Atajos de teclado">⌨ Atajos</button>`)}

      <div id="ctlKeysBox" class="panel-flat p-4 text-sm hidden">
        <p class="eyebrow mb-2">Atajos (fuera de campos de texto)</p>
        <div class="grid gap-1.5 sm:grid-cols-2 mono text-[12px]">
          <span><kbd>1</kbd>–<kbd>5</kbd> cambiar de pestaña</span>
          <span><kbd>Ctrl</kbd>+<kbd>K</kbd> o <kbd>/</kbd> buscar en toda la app</span>
          <span><kbd>E</kbd> enfocar el siguiente bloque de hoy</span>
          <span><kbd>N</kbd> nuevo pendiente</span>
          <span><kbd>Espacio</kbd> · <kbd>1</kbd> · <kbd>2</kbd> voltear / fallé / acerté (Repaso)</span>
          <span><kbd>Esc</kbd> minimizar modo enfoque</span>
        </div>
      </div>

      <nav class="ctl-tabs" role="tablist" aria-label="Secciones de Control">${PANES.map(([k, l]) => `<button type="button" role="tab" data-ctl-pane="${k}" aria-selected="${k === pane}">${l}${badge[k] ? `<span class="ctl-badge ${k === "pend" && overdue ? "bad" : ""}">${badge[k]}</span>` : ""}</button>`).join("")}</nav>

      <div id="ctlBody" class="space-y-6">${body}</div>`;
    bind(el);
    const rr = () => rerender();
    if (pane === "post") window.CRM?.bind(el, rr);
    if (pane === "resid") window.RESID?.bind(el, rr);
    if (pane === "repaso") window.CARDS?.bind(el, rr);
  }

  function hoyHtml({ t, day, next, pct, fmin, total, overdue, mine }) {
    const bk = window.APP_BACKUP?.daysSince();
    const hasData = Object.keys(load(LS.DIA, {})).length || tareas.length;
    const metasW = load("dt2027_metas", {})[monday(t)] || [];
    const crm = window.CRM?.stats(), cards = window.CARDS?.stats(), res = window.RESID?.stats();
    const r = M().planRange();
    const enRes = t >= r.inicioRes && t <= r.finRes;
    const minimo = M().isMinimo?.(t);
    const dRes = UI.d.diff(t, r.inicioRes);
    return `
      ${hasData && (bk === null || bk >= 7) ? `
      <section class="panel p-4 sm:p-5 flex flex-wrap items-center gap-3" style="border-color:var(--warn)">
        <p class="text-sm flex-1 min-w-[220px]"><span class="eyebrow block mb-1" style="color:var(--warn)">Respaldo</span>${bk === null ? "Nunca has respaldado tu progreso." : `Tu último respaldo fue hace ${bk} días.`} Si borras el navegador o cambias de teléfono, lo pierdes.</p>
        <button type="button" data-backup class="btn btn-primary">Respaldar ahora</button>
      </section>` : ""}

      <section class="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div class="next-step p-6 sm:p-7">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <p class="eyebrow accent">Tus 3 de hoy · ${short(t)}</p>
            <span class="mono text-[11px] text-slate-500">Si solo haces esto, el día valió.</span>
          </div>
          <ol class="mt-4 grid gap-2.5">
            ${[0, 1, 2].map((i) => { const x = mine[i] || {}; return `
            <li class="flex items-center gap-3">
              <span class="font-display text-3xl leading-none w-6 accent">${i + 1}</span>
              <input type="checkbox" data-t3ok="${i}" ${x.ok ? "checked" : ""} aria-label="Prioridad ${i + 1} hecha" class="w-4 h-4 accent-[var(--accent)]" />
              <input data-t3="${i}" class="field flex-1 ${x.ok ? "line-through text-slate-400" : ""}" value="${esc(x.t || "")}" placeholder="${["Lo más importante (ej. terminar CV en inglés)", "Segunda prioridad", "Tercera prioridad"][i]}" maxlength="140" />
            </li>`; }).join("")}
          </ol>
          ${!mine.some((x) => x && x.t) && next ? `<button type="button" id="t3fill" class="btn btn-sm mt-3">Sugerir desde el plan de hoy</button>` : ""}
          <div class="mt-6 pt-5 border-t hair flex flex-wrap items-center justify-between gap-3">
            ${next ? `<div class="min-w-0"><p class="eyebrow">Siguiente bloque del plan${minimo ? " · plan mínimo" : ""}</p><p class="font-semibold mt-1">${esc(next.label)} <span class="mono text-[11px] text-slate-400">${next.min ? next.min + " min" : ""}</span></p></div>
              <div class="flex flex-wrap gap-2"><button type="button" data-ctl-focus="${esc(next.key)}" class="btn btn-accent">▶ Enfocar ahora</button><button type="button" data-go-dia class="btn">Ver Mi día</button></div>`
              : `<p class="text-sm text-slate-500">${day ? "Terminaste todos los bloques de hoy. 👏" : "Hoy no hay plan: descansa o adelanta un pendiente."}</p>
              <button type="button" id="freeFocus" class="btn">▶ Bloque libre de 25 min</button>`}
          </div>
          ${day && day.kind !== "sun" ? `<button type="button" id="ctlMin" class="btn btn-sm btn-ghost mt-3">${minimo ? "↺ Volver al plan completo" : "Día difícil: hoy solo tengo 30 min"}</button>` : ""}
        </div>

        <div class="panel p-6 grid grid-cols-2 gap-6 content-start">
          ${UI.stat(pct === null ? "—" : pct + '<span class="text-2xl text-slate-400">%</span>', "plan de hoy", pct >= 80 ? "text-[color:var(--ok)]" : "")}
          ${UI.stat(`${fmin}<span class="text-2xl text-slate-400">/${total || "—"}</span>`, "min enfocados hoy")}
          ${UI.stat(M().streak(), "días seguidos ≥ 80%")}
          ${UI.stat(overdue, "pendientes vencidos", overdue ? "text-[color:var(--bad)]" : "")}
          <div class="col-span-2">${UI.bar(total ? (fmin / total) * 100 : 0, total && fmin >= total)}<p class="mono text-[10.5px] text-slate-500 mt-2">Minutos con el temporizador vs. minutos del plan de hoy.</p></div>
        </div>
      </section>

      <section class="grid gap-3 sm:grid-cols-3">
        <button type="button" data-ctl-pane="post" class="panel-flat p-4 text-left hover:shadow-card-hover">
          <p class="eyebrow">Seguimientos</p><p class="font-display text-3xl mt-1 ${crm?.due ? "accent" : ""}">${crm?.due || 0}</p><p class="text-xs text-slate-500">${crm?.due ? "toca escribirles hoy" : `${crm?.n || 0} contactos · ${crm?.week || 0} esta semana`}</p></button>
        <button type="button" data-ctl-pane="repaso" class="panel-flat p-4 text-left hover:shadow-card-hover">
          <p class="eyebrow">Repaso de entrevista</p><p class="font-display text-3xl mt-1">${cards?.today || 0}<span class="text-lg text-slate-400">/${cards?.goal || 10}</span></p><p class="text-xs text-slate-500">${cards?.due || 0} tarjetas esperando</p></button>
        <button type="button" data-ctl-pane="resid" class="panel-flat p-4 text-left hover:shadow-card-hover">
          <p class="eyebrow">Residencia</p><p class="font-display text-3xl mt-1">${enRes ? `${Math.round(res?.total || 0)}<span class="text-lg text-slate-400">/${res?.meta || 500} h</span>` : dRes > 0 ? `${dRes} <span class="text-lg text-slate-400">días</span>` : "—"}</p><p class="text-xs text-slate-500">${enRes ? "registra tus horas de hoy" : "para empezar · horas y logros"}</p></button>
      </section>

      <section class="grid gap-5 xl:grid-cols-2">
        ${proximosHtml()}
        <div class="space-y-5">
          ${metasW.some((x) => x && x.t) ? `<div class="panel p-5 sm:p-6"><h3 class="sec-title"><span class="eyebrow">Metas de esta semana</span><button type="button" data-ctl-pane="prog" class="text-sm accent hover:underline">Editar →</button></h3><ul class="mt-3">${metasW.map((x, i) => x && x.t ? `<li class="py-2 border-t hair first:border-t-0"><label class="check text-sm"><input type="checkbox" data-meta-ok="${monday(t)}|${i}" ${x.ok ? "checked" : ""} /><span class="${x.ok ? "done" : ""}">${esc(x.t)}</span></label></li>` : "").join("")}</ul></div>`
            : `<div class="panel-flat p-4 text-sm text-slate-500">Sin metas para esta semana. <button type="button" data-ctl-pane="prog" class="accent hover:underline">Ponlas en Progreso →</button></div>`}
          ${calHtml()}
        </div>
      </section>`;
  }

  function calHtml() {
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Recordatorios en tu calendario</span></h3>
        <p class="text-sm text-slate-500 mt-2">Descarga tus sesiones, hitos, exámenes y seguimientos como archivo <span class="mono">.ics</span>, con aviso 10 minutos antes de cada sesión.</p>
        <div class="mt-3 grid gap-1.5 text-sm">
          <label class="check"><input type="checkbox" id="icsDias" checked /><span>Sesiones diarias del plan (a tu hora de estudio)</span></label>
          <label class="check"><input type="checkbox" id="icsHitos" checked /><span>Hitos y exámenes de certificación</span></label>
          <label class="check"><input type="checkbox" id="icsSeg" checked /><span>Seguimientos de postulaciones y pendientes con fecha</span></label>
        </div>
        <button type="button" id="icsBtn" class="btn btn-primary mt-4">Descargar calendario (.ics)</button>
        <details class="how mt-3"><summary>cómo agregarlo</summary><p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed"><strong>iPhone:</strong> descárgalo desde Safari, ábrelo y toca «Agregar todo». <strong>Android / Google Calendar:</strong> en la PC entra a calendar.google.com → ⚙ Configuración → Importar y exportar → elige el archivo; aparecerá solo en tu teléfono. Si cambias tu hora de estudio, vuelve a importarlo: los eventos se actualizan, no se duplican.</p></details>
      </div>`;
  }

  /* ---------- Calendario .ics ---------- */
  const slug = (s) => String(s).normalize("NFD").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().slice(0, 40);
  function buildICS(opt) {
    const r = M().planRange(), t = today();
    const [hh, mm] = (r.hora || "16:00").split(":").map(Number);
    const enc = new TextEncoder();
    const escI = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
    const fold = (line) => { let out = "", cur = "", n = 0; for (const ch of line) { const b = enc.encode(ch).length; if (n + b > 73) { out += cur + "\r\n "; cur = ""; n = 1; } cur += ch; n += b; } return out + cur; };
    const dt = (d, h, m) => `${d.replace(/-/g, "")}T${pad(h)}${pad(m)}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const ev = [];
    const add = (uid, lines) => ev.push(["BEGIN:VEVENT", `UID:${uid}@bitacora27`, `DTSTAMP:${stamp}`, ...lines, "END:VEVENT"]);
    if (opt.dias) {
      for (let d = t; d <= r.end; d = addDays(d, 1)) {
        const day = M().getDay(d); if (!day) continue;
        const blocks = day.blocks.filter((b) => !(day.kind === "res" && b.key === "res"));
        const min = blocks.reduce((a, b) => a + (b.min || 0), 0) || 60;
        const endM = Math.min(23 * 60 + 59, hh * 60 + mm + min);
        add(`dia-${d}`, [`DTSTART:${dt(d, hh, mm)}`, `DTEND:${dt(d, Math.floor(endM / 60), endM % 60)}`,
          `SUMMARY:${escI("Bitácora · " + day.title)}`,
          `DESCRIPTION:${escI(blocks.map((b) => `• ${b.label} (${b.min || 0} min)`).join("\n") + "\n\nAbre Mi día para ver los pasos exactos.")}`,
          "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escI("Empieza tu sesión: " + day.title)}`, "TRIGGER:-PT10M", "END:VALARM"]);
      }
    }
    const allDay = (uid, date, title, desc) => add(uid, [`DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${addDays(date, 1).replace(/-/g, "")}`, `SUMMARY:${escI(title)}`, `DESCRIPTION:${escI(desc || "")}`, "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escI(title)}`, "TRIGGER:-PT15H", "END:VALARM"]);
    if (opt.hitos) {
      M().allHitos().filter((h) => h.date >= t).forEach((h) => allDay(`hito-${h.date}-${slug(h.titulo)}`, h.date, "🎯 " + h.titulo, h.detalle));
      for (let d = t; d <= r.end; d = addDays(d, 1)) (M().getDay(d)?.blocks || []).filter((b) => b.key === "cert" && /examen|agenda/i.test(b.label)).forEach((b) => allDay(`cert-${d}`, d, "🏅 " + b.label.replace(/^Certificación · /, ""), "Bloque CERT en Mi día"));
    }
    if (opt.seg) {
      (window.CRM?.followUps() || []).filter((x) => x.date >= t).forEach((x) => allDay(`seg-${x.date}-${slug(x.t)}`, x.date, "✉ " + x.t, x.sub));
      tareas.filter((x) => !x.ok && x.due && x.due >= t).forEach((x) => allDay(`tarea-${x.id}`, x.due, "☐ " + x.t, x.cat));
    }
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bitacora27//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Bitácora'27", ...ev.flat(), "END:VCALENDAR"];
    return { text: lines.map(fold).join("\r\n") + "\r\n", n: ev.length };
  }

  /* ---------- Revisión semanal ---------- */
  function weekData(mon) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i)), t = today();
    const inW = (d) => d && d >= mon && d <= days[6];
    const plan = days.filter((d) => d <= t && M().dayPct(d) !== null && parse(d).getDay() !== 0);
    const by = focusByDay(), cd = load("dt2027_cards_dia", {});
    return {
      days, cumplidos: plan.filter((d) => M().dayPct(d) >= 80).length, conPlan: plan.length,
      foco: days.reduce((a, d) => a + (by[d] || 0), 0),
      tareas: tareas.filter((x) => x.ok && inW(x.hecha)).length,
      contactos: load("dt2027_crm", []).filter((x) => inW(x.fecha)).length,
      tarjetas: days.reduce((a, d) => a + (cd[d] || 0), 0),
      horas: load("dt2027_resid_horas", []).filter((x) => inW(x.date)).reduce((a, x) => a + Number(x.h || 0), 0),
      logros: load("dt2027_logros", []).filter((x) => inW(x.date))
    };
  }
  function semanaHtml() {
    const t = today(), mon = addDays(monday(t), weekOff * 7), w = weekData(mon), next = addDays(mon, 7);
    const metasAll = load("dt2027_metas", {}), metasNow = metasAll[mon] || [], metasNext = metasAll[next] || [{}, {}, {}];
    const metOk = metasNow.filter((x) => x && x.t && x.ok).length, metTot = metasNow.filter((x) => x && x.t).length;
    const h = (m) => `${Math.floor(m / 60)} h ${m % 60} min`;
    return `
      <section class="panel p-5 sm:p-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div><p class="eyebrow accent">Revisión semanal</p><p class="font-display text-3xl sm:text-4xl mt-1">Semana del <em>${short(mon)}</em></p></div>
          <div class="seg"><button type="button" data-week="-1">‹ Anterior</button><button type="button" data-week="0" aria-selected="${weekOff === 0}">Esta</button><button type="button" data-week="1" ${weekOff >= 0 ? "disabled" : ""}>Siguiente ›</button></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
          ${UI.stat(`${w.cumplidos}<span class="text-xl text-slate-400">/${w.conPlan}</span>`, "días ≥ 80%", w.conPlan && w.cumplidos === w.conPlan ? "text-[color:var(--ok)]" : "")}
          ${UI.stat(h(w.foco), "de enfoque")}
          ${UI.stat(w.contactos, "postulaciones / contactos")}
          ${UI.stat(w.tareas, "pendientes cerrados")}
          ${UI.stat(w.tarjetas, "tarjetas repasadas")}
          ${UI.stat(Math.round(w.horas * 10) / 10, "h de residencia")}
          ${UI.stat(w.logros.length, "logros")}
          ${UI.stat(metTot ? `${metOk}<span class="text-xl text-slate-400">/${metTot}</span>` : "—", "metas cumplidas")}
        </div>
        ${w.logros.length ? `<p class="text-sm mt-5"><span class="eyebrow mr-2">Logros</span>${w.logros.map((x) => esc(x.t)).join(" · ")}</p>` : ""}
        <div class="grid gap-6 md:grid-cols-2 mt-6 pt-6 border-t hair">
          <div>
            <p class="eyebrow mb-2">Metas para la semana del ${short(next)}</p>
            <div class="grid gap-2">${[0, 1, 2].map((i) => `<input data-meta="${next}|${i}" class="field" value="${esc(metasNext[i]?.t || "")}" placeholder="${["Ej. 5 postulaciones nuevas", "Ej. aprobar Foundational C#", "Ej. 6 días ≥ 80%"][i]}" maxlength="120" />`).join("")}</div>
          </div>
          <div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p class="eyebrow mb-2">Preguntas para cerrar la semana</p>
            <ol class="list-decimal ml-4 space-y-1"><li>¿Qué fue lo que más me acercó a la residencia?</li><li>¿Qué me distrajo o me atoró, y qué cambio el lunes?</li><li>¿Qué día fallé y por qué? ¿Necesitaba el plan mínimo?</li></ol>
            <p class="text-xs text-slate-500 mt-2">Escribe tus respuestas en Mi día del domingo (Revisión semanal).</p>
            <button type="button" id="weekCopy" class="btn btn-sm mt-4">Copiar resumen de la semana</button>
          </div>
        </div>
      </section>`;
  }

  function pendientesHtml() {
    const t = today();
    const list = tareas.filter((x) => catFilter === "all" || x.cat === catFilter);
    const open = list.filter((x) => !x.ok).sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999") || a.pr - b.pr);
    const groups = [
      ["Vencidas", open.filter((x) => x.due && x.due < t), "var(--bad)"],
      ["Hoy", open.filter((x) => x.due === t), "var(--accent)"],
      ["Próximos 7 días", open.filter((x) => x.due && x.due > t && diff(t, x.due) <= 7), ""],
      ["Más adelante", open.filter((x) => x.due && diff(t, x.due) > 7), ""],
      ["Sin fecha", open.filter((x) => !x.due).sort((a, b) => a.pr - b.pr), ""]
    ].filter((g) => g[1].length);
    const doneL = list.filter((x) => x.ok);
    const row = (x) => `
      <li class="flex items-start gap-3 py-2.5 border-t hair first:border-t-0">
        <input type="checkbox" data-tk="${esc(x.id)}" ${x.ok ? "checked" : ""} class="mt-1 w-4 h-4 accent-[var(--accent)]" aria-label="Completar" />
        <div class="flex-1 min-w-0">
          <p class="text-sm ${x.ok ? "line-through text-slate-400" : ""}">${esc(x.t)}</p>
          <p class="mt-1 flex flex-wrap gap-1.5 items-center">
            <span class="chip ${PRIO[x.pr]?.cls || ""} !py-0">${PRIO[x.pr]?.l || ""}</span><span class="chip !py-0">${esc(x.cat)}</span>
            ${x.due ? `<span class="mono text-[10.5px] ${!x.ok && x.due < t ? "text-[color:var(--bad)]" : "text-slate-500"}">${short(x.due)} · ${rel(diff(t, x.due))}</span>` : ""}
            ${x.origen === "enfoque" ? '<span class="mono text-[10px] text-slate-400">· anotado en enfoque</span>' : ""}
          </p>
        </div>
        <button type="button" data-tkdel="${esc(x.id)}" class="btn btn-sm btn-ghost" aria-label="Eliminar">×</button>
      </li>`;
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Pendientes</span><span class="text-sm text-slate-500 font-normal">${open.length} abiertos</span></h3>
        <form id="tkForm" class="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <input id="tkText" class="field col-span-2 sm:col-span-4" placeholder="Ej. pedir constancia de estudios en Servicios Escolares" maxlength="200" required autocomplete="off" />
          <input id="tkDue" class="field" type="date" aria-label="Fecha límite" />
          <select id="tkCat" class="field" aria-label="Categoría">${CATS.map((c) => `<option>${c}</option>`).join("")}</select>
          <select id="tkPr" class="field" aria-label="Prioridad"><option value="1">Alta</option><option value="2" selected>Media</option><option value="3">Baja</option></select>
          <button class="btn btn-primary" type="submit">Agregar</button>
        </form>
        <div class="flex flex-wrap gap-1.5 mt-3">${["all", ...CATS].map((c) => `<button type="button" data-cat="${c}" class="chip ${catFilter === c ? "chip-solid" : ""}">${c === "all" ? "Todas" : c}</button>`).join("")}</div>
        <div class="mt-4 grid gap-4">
          ${groups.length ? groups.map(([l, g, col]) => `<div><p class="eyebrow mb-1" ${col ? `style="color:${col}"` : ""}>${l} · ${g.length}</p><ul>${g.map(row).join("")}</ul></div>`).join("")
            : `<p class="text-sm text-slate-500 py-4">Nada pendiente${catFilter !== "all" ? " en esta categoría" : ""}. Anota aquí trámites, correos, entregas de la escuela: todo lo que no esté en el plan.</p>`}
        </div>
        ${doneL.length ? `<details class="how mt-4"><summary>Completadas (${doneL.length})</summary><ul class="mt-2">${doneL.slice(0, 30).map(row).join("")}</ul><button type="button" id="tkClear" class="btn btn-sm mt-2">Borrar completadas</button></details>` : ""}
      </div>`;
  }

  function proximosHtml() {
    const t = today(), up = upcoming();
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Próximas fechas</span><span class="text-sm text-slate-500 font-normal">3 semanas</span></h3>
        <ol class="mt-3">${up.length ? up.map((x) => { const n = diff(t, x.date); return `
          <li class="grid grid-cols-[84px_1fr] gap-3 py-3 border-t hair first:border-t-0">
            <div><p class="mono text-[11px] ${n < 0 ? "text-[color:var(--bad)]" : n <= 2 ? "accent" : "text-slate-500"}">${short(x.date)}</p><p class="font-display text-xl leading-none mt-1">${rel(n)}</p></div>
            <div class="min-w-0"><p class="text-sm font-medium">${esc(x.t)}</p><p class="mt-1 flex flex-wrap gap-1.5 items-center"><span class="chip ${x.cls} !py-0">${x.tipo}</span><span class="text-xs text-slate-500">${esc(x.sub || "")}</span></p></div>
          </li>`; }).join("") : `<li class="text-sm text-slate-500 py-3">Sin fechas en las próximas 3 semanas.</li>`}</ol>
      </div>`;
  }

  function heatHtml() {
    const r = M().planRange(), t = today();
    const end = r.finRes > r.end ? r.finRes : r.end;
    let d = addDays(r.start, -((parse(r.start).getDay() + 6) % 7)); // lunes
    const cols = [];
    while (d <= end) { cols.push(Array.from({ length: 7 }, (_, i) => addDays(d, i))); d = addDays(d, 7); }
    let done80 = 0, past = 0;
    const cell = (date) => {
      if (date < r.start || date > end) return `<span class="hm-c hm-out"></span>`;
      const p = M().dayPct(date);
      const fut = date > t;
      if (!fut && p !== null && parse(date).getDay() !== 0) { past++; if (p >= 80) done80++; }
      const lvl = p === null ? "hm-none" : fut ? "hm-fut" : p >= 80 ? "hm-4" : p >= 50 ? "hm-3" : p > 0 ? "hm-2" : "hm-0";
      return `<button type="button" data-hm="${date}" class="hm-c ${lvl} ${date === t ? "hm-today" : ""}" title="${short(date)}${p !== null ? ` · ${p}%` : ""}"></button>`;
    };
    const gridHtml = cols.map((c) => c.map(cell).join("")).join(""); // antes del encabezado: calcula done80/past
    let lastM = -1;
    const months = cols.map((c) => { const m = parse(c[0]).getMonth(); const lbl = m !== lastM ? MES[m] : ""; lastM = m; return `<span>${lbl}</span>`; }).join("");
    return `
      <section class="panel p-5 sm:p-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div><p class="eyebrow">Constancia</p><p class="font-display text-3xl mt-1">${done80} de ${past} <em class="accent">días cumplidos</em></p></div>
          <div class="flex items-center gap-1.5 mono text-[10.5px] text-slate-500">0% <span class="hm-c hm-0"></span><span class="hm-c hm-2"></span><span class="hm-c hm-3"></span><span class="hm-c hm-4"></span> ≥80% · clic = abrir el día</div>
        </div>
        <div class="hm-wrap mt-4">
          <div class="hm-days mono">${["L", "", "M", "", "V", "", "D"].map((x) => `<span>${x}</span>`).join("")}</div>
          <div class="overflow-x-auto pb-1">
            <div class="hm-months mono" style="grid-template-columns:repeat(${cols.length},14px)">${months}</div>
            <div class="hm-grid" style="grid-template-columns:repeat(${cols.length},14px)">${gridHtml}</div>
          </div>
        </div>
      </section>`;
  }

  function focusHtml() {
    const by = focusByDay(), t = today();
    const days = Array.from({ length: 14 }, (_, i) => addDays(t, i - 13));
    const max = Math.max(60, ...days.map((d) => by[d] || 0));
    const sum = (a, b) => Array.from({ length: 7 }, (_, i) => by[addDays(t, -i - a)] || 0).reduce((x, y) => x + y, 0);
    const w = sum(0), pw = sum(7);
    const h = (m) => `${Math.floor(m / 60)} h ${m % 60} min`;
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Horas de enfoque</span><span class="text-sm text-slate-500 font-normal">14 días</span></h3>
        <p class="font-display text-4xl mt-3">${h(w)}</p>
        <p class="mono text-[11px] mt-1 ${w >= pw ? "text-[color:var(--ok)]" : "text-slate-500"}">últimos 7 días · ${w >= pw ? "▲" : "▼"} vs ${h(pw)} la semana anterior</p>
        <div class="fbars mt-5">${days.map((d) => { const m = by[d] || 0; return `<div title="${short(d)} · ${m} min"><i style="height:${Math.max(2, (m / max) * 100)}%" class="${d === t ? "today" : ""}"></i><span class="mono">${parse(d).getDate()}</span></div>`; }).join("")}</div>
        <p class="text-xs text-slate-500 mt-3">Cuenta solo el tiempo medido con <strong>▶ Enfocar</strong>.</p>
      </div>`;
  }

  function embudoHtml() {
    const vs = load(LS.VAC, {});
    const c = Object.fromEntries(ESTADOS.map(([k]) => [k, 0]));
    Object.values(vs).forEach((v) => { if (v in c) c[v]++; });
    const sent = c.applied + c.interview + c.offer + c.rejected;
    const extra = tareas.filter((x) => x.cat === "Residencia" && x.ok).length;
    const max = Math.max(1, ...Object.values(c));
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Postulaciones</span><button type="button" data-tab-go="vacantes" class="text-sm accent hover:underline">Vacantes →</button></h3>
        <p class="font-display text-4xl mt-3">${sent} <em class="text-2xl text-slate-400">enviadas</em></p>
        <p class="mono text-[11px] text-slate-500 mt-1">${sent ? `${Math.round(((c.interview + c.offer) / sent) * 100)}% llegó a entrevista` : "Meta del 5 dic: 10+ postulaciones o correos"}</p>
        <ul class="mt-4 grid gap-2">${ESTADOS.map(([k, l]) => `<li class="grid grid-cols-[96px_1fr_24px] items-center gap-2 text-xs"><span>${l}</span><div class="bar ${k === "offer" ? "ok" : ""}"><i style="width:${(c[k] / max) * 100}%"></i></div><span class="mono text-right">${c[k]}</span></li>`).join("")}</ul>
        <p class="text-xs text-slate-500 mt-3">Los correos a empresas sin vacante anótalos como pendientes de «Residencia»${extra ? ` (${extra} hechos)` : ""}.</p>
      </div>`;
  }

  function certsHtml() {
    const C = window.CERTS || [], st = load(LS.CERTS, {});
    const got = C.filter((c) => st[c.id]?.st === "ok"), wip = C.filter((c) => st[c.id]?.st === "curso");
    const nextExam = upcoming().find((x) => x.tipo === "Certificación");
    return `
      <div class="panel p-5 sm:p-6">
        <h3 class="sec-title"><span class="eyebrow">Certificaciones</span><button type="button" data-tab-go="ruta" data-anchor="certs" class="text-sm accent hover:underline">Ruta →</button></h3>
        <p class="font-display text-4xl mt-3">${got.length}<span class="text-2xl text-slate-400">/${C.length}</span> <em class="text-2xl text-slate-400">obtenidas</em></p>
        ${UI.bar(C.length ? (got.length / C.length) * 100 : 0, true)}
        ${nextExam ? `<p class="text-sm mt-4"><span class="eyebrow block mb-1 accent">Próxima</span>${esc(nextExam.t)} · <span class="mono text-xs">${short(nextExam.date)}</span></p>` : ""}
        ${wip.length ? `<p class="text-sm mt-3"><span class="eyebrow block mb-1">En curso</span>${wip.map((c) => esc(c.nombre)).join(" · ")}</p>` : ""}
        ${got.length ? `<p class="text-sm mt-3"><span class="eyebrow block mb-1" style="color:var(--ok)">Obtenidas</span>${got.map((c) => esc(c.nombre)).join(" · ")}</p>` : ""}
      </div>`;
  }

  /* ---------- Eventos ---------- */
  function saveTop3() { save(LS.TOP3, top3); }
  function bind(el) {
    const t = today();
    el.querySelector("#ctlKeys")?.addEventListener("click", () => el.querySelector("#ctlKeysBox").classList.toggle("hidden"));
    el.querySelectorAll("[data-ctl-pane]").forEach((b) => b.addEventListener("click", () => show(b.dataset.ctlPane)));
    el.querySelectorAll("[data-backup]").forEach((b) => b.addEventListener("click", () => window.APP_BACKUP?.share()));
    el.querySelector("#ctlMin")?.addEventListener("click", () => { M().setMinimo(t, !M().isMinimo(t)); rerender(); });
    el.querySelector("#icsBtn")?.addEventListener("click", () => {
      const { text, n } = buildICS({ dias: el.querySelector("#icsDias").checked, hitos: el.querySelector("#icsHitos").checked, seg: el.querySelector("#icsSeg").checked });
      if (!n) { toast("No hay eventos con esas opciones"); return; }
      UI.download(`bitacora27_${t}.ics`, text, "text/calendar"); toast(`${n} eventos listos para tu calendario`);
    });
    el.querySelectorAll("[data-week]").forEach((b) => b.addEventListener("click", () => { const v = +b.dataset.week; weekOff = v === 0 ? 0 : Math.min(0, weekOff + v); rerender(); }));
    el.querySelectorAll("[data-meta]").forEach((i) => i.addEventListener("change", () => {
      const [w, k] = i.dataset.meta.split("|"), all = load("dt2027_metas", {});
      all[w] = all[w] || [{}, {}, {}]; all[w][+k] = { ...(all[w][+k] || {}), t: i.value.trim() }; save("dt2027_metas", all); toast("Meta guardada");
    }));
    el.querySelectorAll("[data-meta-ok]").forEach((c) => c.addEventListener("change", () => {
      const [w, k] = c.dataset.metaOk.split("|"), all = load("dt2027_metas", {});
      if (all[w]?.[+k]) { all[w][+k].ok = c.checked; save("dt2027_metas", all); rerender(); }
    }));
    el.querySelector("#weekCopy")?.addEventListener("click", () => {
      const mon = addDays(monday(t), weekOff * 7), w = weekData(mon), m = (load("dt2027_metas", {})[mon] || []).filter((x) => x && x.t);
      UI.copy([`Semana del ${short(mon)}`, `- Días cumplidos: ${w.cumplidos}/${w.conPlan}`, `- Enfoque: ${Math.round(w.foco / 6) / 10} h`, `- Postulaciones/contactos: ${w.contactos}`, `- Pendientes cerrados: ${w.tareas}`, `- Tarjetas repasadas: ${w.tarjetas}`, `- Horas de residencia: ${w.horas}`, `- Logros: ${w.logros.map((x) => x.t).join("; ") || "—"}`, `- Metas: ${m.map((x) => (x.ok ? "✓ " : "✗ ") + x.t).join("; ") || "—"}`].join("\n"));
    });

    el.querySelectorAll("input[data-t3]").forEach((i) => i.addEventListener("change", (e) => {
      const k = +e.target.dataset.t3; top3[t] = top3[t] || [{}, {}, {}];
      top3[t][k] = { ...(top3[t][k] || {}), t: e.target.value.trim() }; saveTop3();
    }));
    el.querySelectorAll("input[data-t3ok]").forEach((i) => i.addEventListener("change", (e) => {
      const k = +e.target.dataset.t3ok; top3[t] = top3[t] || [{}, {}, {}];
      top3[t][k] = { ...(top3[t][k] || {}), ok: e.target.checked }; saveTop3(); rerender();
      if (top3[t].filter((x) => x && x.t).length && top3[t].every((x) => !x.t || x.ok)) toast("¡Tus 3 de hoy, hechas!");
    }));
    el.querySelector("#t3fill")?.addEventListener("click", () => {
      const { day, blocks } = todayBlocks();
      const pick = blocks.filter((b) => !b.done && !(day?.kind === "res" && b.key === "res")).slice(0, 3);
      top3[t] = [0, 1, 2].map((i) => (pick[i] ? { t: pick[i].label } : {})); saveTop3(); rerender();
    });
    el.querySelectorAll("[data-ctl-focus]").forEach((b) => b.addEventListener("click", () => focusNext()));
    el.querySelector("#freeFocus")?.addEventListener("click", () => window.FOCUS?.start({ label: "Bloque libre", min: 25 }));
    el.querySelectorAll("[data-go-dia]").forEach((b) => b.addEventListener("click", () => { M().go(t); goTab("dia"); }));
    el.querySelectorAll("[data-tab-go]").forEach((b) => b.addEventListener("click", () => {
      goTab(b.dataset.tabGo);
      if (b.dataset.anchor) setTimeout(() => document.getElementById(b.dataset.anchor)?.scrollIntoView({ behavior: "smooth" }), 60);
    }));
    el.querySelectorAll("[data-hm]").forEach((b) => b.addEventListener("click", () => { M().go(b.dataset.hm); goTab("dia"); }));
    el.querySelector("#tkForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = el.querySelector("#tkText").value.trim(); if (!txt) return;
      tareas.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: txt, due: el.querySelector("#tkDue").value, cat: el.querySelector("#tkCat").value, pr: +el.querySelector("#tkPr").value, ok: false, creada: t });
      save(LS.TAREAS, tareas); rerender(); document.getElementById("tkText")?.focus(); toast("Pendiente agregado");
    });
    el.querySelectorAll("input[data-tk]").forEach((c) => c.addEventListener("change", (e) => {
      const x = tareas.find((y) => y.id === e.target.dataset.tk); if (!x) return;
      x.ok = e.target.checked; x.hecha = x.ok ? t : undefined; save(LS.TAREAS, tareas); rerender();
    }));
    el.querySelectorAll("[data-tkdel]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("¿Eliminar este pendiente?")) return;
      tareas = tareas.filter((y) => y.id !== b.dataset.tkdel); save(LS.TAREAS, tareas); rerender();
    }));
    el.querySelector("#tkClear")?.addEventListener("click", () => {
      if (!confirm("¿Borrar todos los pendientes completados?")) return;
      tareas = tareas.filter((y) => !y.ok); save(LS.TAREAS, tareas); rerender();
    });
    el.querySelectorAll("[data-cat]").forEach((b) => b.addEventListener("click", () => { catFilter = b.dataset.cat; rerender(); }));
  }
  function show(p) {
    pane = PANES.some(([k]) => k === p) ? p : "hoy"; save("dt2027_ctl_pane", pane);
    if (document.getElementById("view-control")?.classList.contains("hidden")) goTab("control");
    render(); document.querySelector(".ctl-tabs")?.scrollIntoView({ block: "nearest" });
  }
  function rerender() { const y = window.scrollY; render(); window.scrollTo(0, y); updateRail(); }
  function goTab(name) { document.querySelector(`.tab-btn[data-tab="${name}"]`)?.click(); }
  function focusNext() {
    const { day, blocks } = todayBlocks();
    const b = blocks.find((x) => !x.done && !(day?.kind === "res" && x.key === "res"));
    if (!window.FOCUS) return;
    if (!b) { window.FOCUS.start({ label: "Bloque libre", min: 25 }); return; }
    window.FOCUS.start({ label: b.label, key: b.key, min: b.min && b.min <= 60 ? b.min : 25 });
  }
  function updateRail() {
    const r = document.getElementById("railFocus");
    if (r) {
      const over = tareas.filter((x) => !x.ok && x.due && x.due < today()).length;
      r.textContent = over ? `${over} vencido${over > 1 ? "s" : ""}` : `${focusByDay()[today()] || 0} min`;
      r.classList.toggle("text-[color:var(--bad)]", !!over);
    }
  }

  /* ---------- Atajos ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (!document.getElementById("focusOverlay")?.classList.contains("hidden")) return;
    if (document.querySelector(".fixed.inset-0:not(.hidden)[role='dialog']")) return;
    const tabs = ["dia", "ruta", "vacantes", "empresas", "control"];
    const inRepaso = pane === "repaso" && !document.getElementById("view-control")?.classList.contains("hidden") && window.CARDS?.isShown();
    if (inRepaso && (e.key === "1" || e.key === "2")) { window.CARDS.act(e.key === "2" ? "ok" : "ko", rerender); return; }
    if (/^[1-5]$/.test(e.key)) { goTab(tabs[+e.key - 1]); }
    else if (e.key === "e" || e.key === "E") { e.preventDefault(); focusNext(); }
    else if (pane === "repaso" && e.key === " " && window.CARDS?.hasCard() && !document.getElementById("view-control")?.classList.contains("hidden")) { e.preventDefault(); window.CARDS.act("show", rerender); }
    else if (e.key === "n" || e.key === "N") { e.preventDefault(); goTab("control"); show("pend"); setTimeout(() => { const i = document.getElementById("tkText"); i?.focus(); i?.scrollIntoView({ block: "center" }); }, 60); }
  });

  // Recarga cuando se abre la pestaña o cambian datos en otra parte (modo enfoque, otra pestaña del navegador).
  window.addEventListener("dt-tab", (e) => { if (e.detail === "control") { tareas = load(LS.TAREAS, []); top3 = load(LS.TOP3, {}); render(); } });
  window.addEventListener("dt-data", () => { tareas = load(LS.TAREAS, []); updateRail(); if (!document.getElementById("view-control")?.classList.contains("hidden")) rerender(); });
  window.addEventListener("storage", (e) => { if (e.key && e.key.startsWith("dt2027_")) { tareas = load(LS.TAREAS, []); top3 = load(LS.TOP3, {}); render(); updateRail(); } });

  window.CONTROL = {
    exportData: () => ({ tareas, top3, enfoque: load(LS.LOG, []) }),
    importData: (x) => {
      if (!x || typeof x !== "object") return;
      if (Array.isArray(x.tareas)) { const ids = new Set(tareas.map((y) => y.id)); tareas = [...tareas, ...x.tareas.filter((y) => y && y.id && !ids.has(y.id))]; save(LS.TAREAS, tareas); }
      if (x.top3 && typeof x.top3 === "object") { top3 = Object.assign(top3, x.top3); save(LS.TOP3, top3); }
      if (Array.isArray(x.enfoque) && !load(LS.LOG, []).length) save(LS.LOG, x.enfoque);
      render(); updateRail();
    },
    render, show
  };
  function init() { render(); updateRail(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
