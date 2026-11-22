/* Pestaña «Mi día»: qué hacer exactamente cada día, con horario, checklist, hitos, racha y revisión semanal. */
(function () {
  "use strict";

  const PLAN = window.PLAN_DIARIO || { days: [], hitos: [] };
  const LS = { AJ: "dt2027_ajustes", DIA: "dt2027_dia", NOTAS: "dt2027_dia_notas", REV: "dt2027_revision", HITOS: "dt2027_hitos", SEL: "dt2027_dia_sel" };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); } };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[0.82em]">$1</code>');
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "#");
  const UI = window.UI;
  const toast = (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m));

  /* ---------- Fechas ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const todayIso = () => iso(new Date());
  const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const longDate = (s) => { const d = parse(s); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} ${d.getFullYear()}`; };
  const shortDate = (s) => { const d = parse(s); return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
  const mondayOf = (s) => { const d = parse(s); const wd = (d.getDay() + 6) % 7; return addDays(s, -wd); };
  const toMin = (h) => { const [a, b] = (h || "16:00").split(":").map(Number); return a * 60 + (b || 0); };
  const hhmm = (m) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;

  /* ---------- Estado ---------- */
  const aj = Object.assign({ hora: "16:00", inicioRes: "2027-01-18", finRes: "2027-06-30" }, load(LS.AJ, {}));
  let done = load(LS.DIA, {});
  let notas = load(LS.NOTAS, {});
  let revs = load(LS.REV, {});
  let hitosDone = load(LS.HITOS, {});
  let minimo = load("dt2027_minimo", {}); // { fecha: true } → día en «plan mínimo» (≈30 min)
  const byDate = Object.fromEntries(PLAN.days.map((d) => [d.date, d]));
  const PLAN_START = PLAN.days[0]?.date || todayIso();
  const PLAN_END = PLAN.days.at(-1)?.date || todayIso();
  let sel = (() => { const t = todayIso(); return t < PLAN_START ? PLAN_START : t; })();

  /* ---------- Residencia (generado) ---------- */
  const TEMAS_RES = [
    { t: "Onboarding: entorno, documentación y arquitectura del sistema de la empresa", link: "https://google.github.io/eng-practices/" },
    { t: "Flujo del equipo: Git, tickets, code review y tu primer PR", link: "https://github.com/skills/review-pull-requests" },
    { t: "React 1: componentes, JSX y props", link: "https://es.react.dev/learn/your-first-component" },
    { t: "React 2: estado y eventos", link: "https://es.react.dev/learn/state-a-components-memory" },
    { t: "React 3: efectos y consumo de tu API", link: "https://es.react.dev/learn/synchronizing-with-effects" },
    { t: "React 4: formularios, listas y rutas", link: "https://es.react.dev/learn/rendering-lists" },
    { t: "TypeScript 1: tipos, interfaces y uniones", link: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
    { t: "TypeScript 2: genéricos y TypeScript con React", link: "https://react.dev/learn/typescript" },
    { t: "Pruebas 1: xUnit avanzado y mocks (Moq)", link: "https://learn.microsoft.com/es-es/dotnet/core/testing/unit-testing-best-practices" },
    { t: "Pruebas 2: pruebas de integración de tu API", link: "https://learn.microsoft.com/es-es/aspnet/core/test/integration-tests" },
    { t: "AZ-900 1: conceptos de nube", link: "https://learn.microsoft.com/es-es/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/" },
    { t: "AZ-900 2: arquitectura y servicios de Azure", link: "https://learn.microsoft.com/es-es/training/paths/azure-fundamentals-describe-azure-architecture-services/" },
    { t: "AZ-900 3: administración y gobernanza", link: "https://learn.microsoft.com/es-es/training/paths/describe-azure-management-governance/" },
    { t: "AZ-900 4: simulacro de examen y repaso", link: "https://learn.microsoft.com/es-es/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23" },
    { t: "Patrones de diseño: Repository, Strategy, Factory, Dependency Injection", link: "https://refactoring.guru/es/design-patterns" },
    { t: "Clean Architecture en .NET", link: "https://learn.microsoft.com/es-es/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures" },
    { t: "Inventario v2: migra el frontend a React + TypeScript", link: "https://es.react.dev/learn" },
    { t: "Inventario v2: autenticación y despliegue", link: "https://learn.microsoft.com/es-es/aspnet/core/security/" },
    { t: "Entrevistas junior: algoritmos de nivel medio", link: "https://neetcode.io/roadmap" },
    { t: "Entrevistas junior: diseño de sistemas básico", link: "https://github.com/donnemartin/system-design-primer/blob/master/README-es.md" },
    { t: "Informe final de residencia (redacción)", link: "" },
    { t: "Informe final + CV y LinkedIn con logros de la residencia", link: "" },
    { t: "Cierre: plática de contratación y postulación a puestos junior", link: "https://www.techinterviewhandbook.org/" }
  ];

  function residencyDay(date) {
    const w = Math.floor(diffDays(mondayOf(aj.inicioRes), date) / 7);
    const tema = TEMAS_RES[Math.min(Math.max(w, 0), TEMAS_RES.length - 1)];
    const wd = parse(date).getDay();
    const blocks = [];
    const resItems = [];
    if (wd === 1) resItems.push({ t: "Revisa con tu líder las prioridades de la semana y anótalas.", min: 10 });
    resItems.push({ t: "Jornada de residencia. Regla: si te atoras más de 30 min, pregunta con lo que ya intentaste.", min: 0 });
    resItems.push({ t: "Registra actividades, horas y evidencia en tu bitácora de residencia.", min: 5 });
    if (wd === 5) resItems.push({ t: "Resumen semanal: logros, horas acumuladas y qué aprendiste (te servirá para los reportes).", min: 15 });
    if (w === 5 && wd === 5) resItems.push({ t: "Reporte parcial 1: confirma la fecha con tu asesor interno y entrégalo.", min: 60 });
    if (w === 11 && wd === 5) resItems.push({ t: "Reporte parcial 2: confirma la fecha con tu asesor interno y entrégalo.", min: 60 });
    if (wd >= 1 && wd <= 5) blocks.push({ key: "res", label: "Residencia profesional", icon: "🏢", min: resItems.reduce((a, x) => a + x.min, 0), items: resItems });
    if (wd === 1 || wd === 3) blocks.push({ key: "learn", label: `Aprendizaje de la semana: ${tema.t}`, icon: "📚", min: 45, items: [{ t: `Estudia: ${tema.t}.`, min: 30 }, { t: "Haz un ejercicio pequeño y súbelo a GitHub.", min: 15 }], links: tema.link ? [tema.link] : [] });
    if (wd === 2) blocks.push({ key: "algo", label: "Algoritmo", icon: "🧩", min: 30, items: [{ t: "Resuelve 1 problema (NeetCode roadmap) explicando en voz alta.", min: 30 }], links: ["https://neetcode.io/roadmap"] });
    if (wd === 4) blocks.push({ key: "eng", label: "Inglés", icon: "🗣️", min: 20, items: [{ t: "Escucha 10 min de una charla técnica y explica en voz alta lo que hiciste esta semana.", min: 20 }] });
    if (wd === 6) blocks.push({ key: "proj", label: "Proyecto personal", icon: "🛠️", min: 120, items: [{ t: `Aplica el tema de la semana (${tema.t}) a tu Inventario v2.`, min: 110 }, { t: "Commit y push con mensaje claro.", min: 10 }], links: tema.link ? [tema.link] : [] });
    return { date, kind: "res", title: `Residencia · semana ${w + 1}`, objective: `Tema de la semana: ${tema.t}.`, deliverable: wd === 6 ? "Commit del proyecto personal." : "Bitácora del día con horas y actividades.", blocks };
  }

  function sundayDay(date) {
    const pre = date <= PLAN_END;
    const nextWeek = [1, 2, 3, 4, 5, 6].map((i) => addDays(date, i)).map((d) => byDate[d]?.title).filter(Boolean);
    return {
      date, kind: "sun", title: "Domingo: descanso + revisión semanal (30 min)",
      objective: "Descansar de verdad y dejar lista la próxima semana.",
      deliverable: "Revisión semanal escrita.",
      nextWeek,
      blocks: [{
        key: "sun", label: "Revisión semanal", icon: "🔁", min: 30,
        items: [
          ...(pre ? [{ t: "Pestaña Vacantes: actualiza estados y cuenta cuántas postulaciones hiciste esta semana (meta: 5+).", min: 10 }] : [{ t: "Revisa tu bitácora de residencia: ¿cuántas horas llevas acumuladas?", min: 5 }]),
          { t: "Si quedó algo pendiente de la semana, recupéralo hoy (máximo 2 h) o déjalo ir.", min: 0 },
          { t: "Lee los temas de la próxima semana (abajo) y prepara lo que necesites.", min: 10 },
          { t: "Exporta tu respaldo (botón en la pestaña Ruta).", min: 2 },
          { t: "Descansa: sin pantallas de estudio el resto del día.", min: 0 }
        ]
      }]
    };
  }

  // Plan mínimo: solo lo indispensable para no romper la racha (mismos ids de pasos).
  const KEEP = { res: 1, prog: 1, algo: 2, cert: 1, learn: 1, gap: 1, proj: 1 };
  function getDay(date) {
    const d = getDayFull(date);
    if (!d || !minimo[date] || d.kind === "sun") return d;
    const blocks = d.blocks.filter((b) => KEEP[b.key]).map((b) => {
      const items = b.items.slice(0, KEEP[b.key]);
      return { ...b, items, min: (d.kind === "res" && b.key === "res") ? b.min : items.reduce((a, x) => a + (x.min || 0), 0), ok: undefined };
    });
    return { ...d, minimo: true, objective: `Plan mínimo: lo indispensable para no perder el ritmo. ${d.objective || ""}`, blocks };
  }
  function getDayFull(date) {
    if (byDate[date]) return { ...byDate[date], kind: "plan" };
    if (parse(date).getDay() === 0 && date >= PLAN_START && date <= aj.finRes) return sundayDay(date);
    if (date >= aj.inicioRes && date <= aj.finRes) return residencyDay(date);
    if (date > PLAN_END && date < aj.inicioRes) {
      return { date, kind: "gap", title: "Antes de iniciar la residencia", objective: "Llegar descansado y listo al primer día.", deliverable: "", blocks: [{ key: "gap", label: "Preparación ligera", icon: "🎒", min: 60, items: [
        { t: "Repasa tu proyecto estrella para poder explicarlo en 2 minutos.", min: 20 },
        { t: "1 algoritmo fácil para no perder ritmo.", min: 30 },
        { t: "Confirma hora, dirección/enlace y documentos del primer día.", min: 10 }
      ] }] };
    }
    return null;
  }

  const items = (day) => (day?.blocks || []).flatMap((b) => b.items.map((_, i) => `${b.key}-${i}`));
  function dayPct(date) {
    const day = getDay(date); const ids = items(day);
    if (!ids.length) return null;
    const d = done[date] || {};
    return Math.round((ids.filter((id) => d[id]).length / ids.length) * 100);
  }

  /* ---------- Hitos ---------- */
  function allHitos() {
    const extra = [
      { date: aj.inicioRes, titulo: "Primer día de residencia", detalle: "Ajusta la fecha real con ⚙️." },
      { date: addDays(mondayOf(aj.inicioRes), 7 * 5 + 4), titulo: "Reporte parcial 1 (aprox.)", detalle: "Confirma la fecha con tu escuela." },
      { date: addDays(mondayOf(aj.inicioRes), 7 * 11 + 4), titulo: "Reporte parcial 2 (aprox.)", detalle: "Confirma la fecha con tu escuela." },
      { date: aj.finRes, titulo: "Fin de residencia e informe final", detalle: "Sal con oferta o carta de recomendación." }
    ];
    return [...PLAN.hitos, ...extra].sort((a, b) => a.date.localeCompare(b.date)).map((h, i) => ({ ...h, id: `${h.titulo}` }));
  }

  /* ---------- Estadísticas ---------- */
  function streak() {
    let n = 0; let d = todayIso();
    if ((dayPct(d) ?? 0) < 80) d = addDays(d, -1);
    for (let i = 0; i < 400; i++) {
      if (d < PLAN_START) break;
      const p = dayPct(d);
      if (p === null || parse(d).getDay() === 0) { d = addDays(d, -1); continue; }
      if (p >= 80) { n++; d = addDays(d, -1); } else break;
    }
    return n;
  }
  function pastPending() {
    const out = []; let d = addDays(todayIso(), -1);
    while (d >= PLAN_START) {
      const p = dayPct(d);
      if (p !== null && p < 80 && parse(d).getDay() !== 0) out.push({ date: d, p });
      d = addDays(d, -1);
    }
    return out;
  }

  /* ---------- Render ---------- */
  const CODE = { res: "RES", prog: "CODE", algo: "ALGO", eng: "ENG", ai: "IA", rev: "LOG", sun: "REV", gap: "PREP", learn: "LEARN", proj: "PROY", cert: "CERT" };
  const linkLabel = (u) => {
    const m = String(u).replace(/^https?:\/\/(www\.)?/, "").replace(/[?#].*$/, "").replace(/\/$/, "").split("/");
    const known = { "developer.mozilla.org": "MDN", "learn.microsoft.com": "MS Learn", "docs.python.org": "Python docs", "docs.docker.com": "Docker docs", "docs.github.com": "GitHub docs" };
    const host = known[m[0]] || m[0].replace(/^(developer|docs|learn)\./, "").replace(/\.(org|com|io)$/, "");
    const last = m.length > 1 ? decodeURIComponent(m[m.length - 1]).replace(/\.html$/, "").replace(/[_-]+/g, " ") : "";
    return last && last.length < 48 ? `${host} · ${last}` : host;
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function render() {
    const el = document.getElementById("view-dia");
    if (!el) return;
    const t = todayIso();
    const day = getDay(sel);
    const hitos = allHitos();
    const next = hitos.find((h) => h.date >= t && !hitosDone[h.id]);
    const pend = pastPending();
    const dRes = diffDays(t, aj.inicioRes);
    const planDays = PLAN.days.filter((d) => d.date <= t);
    const completos = planDays.filter((d) => (dayPct(d.date) ?? 0) >= 80).length;
    const sd = parse(sel);
    const rel = sel === t ? "Hoy" : sel === addDays(t, 1) ? "Mañana" : sel === addDays(t, -1) ? "Ayer" : "";

    el.innerHTML = `
      ${UI.head("01", rel ? `Mi día · ${rel}` : "Mi día",
        `${cap(DIAS[sd.getDay()])} <em>${sd.getDate()} de ${MESES[sd.getMonth()]}</em>`,
        day ? `<strong class="text-slate-900 dark:text-white font-semibold">${esc(day.title)}.</strong> ${esc(day.objective)}` : "",
        `<span class="flex gap-1.5">${day && day.kind !== "sun" ? `<button id="minBtn" type="button" class="btn btn-sm ${minimo[sel] ? "btn-accent" : ""}" title="Deja solo lo indispensable (≈30 min) para no romper tu racha">${minimo[sel] ? "Volver al plan completo" : "Hoy solo tengo 30 min"}</button>` : ""}<button id="ajBtn" type="button" class="btn btn-sm">Ajustes</button></span>`)}

      <div id="ajPanel" class="hidden panel p-5 grid gap-4 sm:grid-cols-3 text-sm">
        <label class="grid gap-1.5"><span class="eyebrow">Hora en que empiezas a estudiar</span><input id="ajHora" type="time" value="${esc(aj.hora)}" class="field" /></label>
        <label class="grid gap-1.5"><span class="eyebrow">Inicio de tu residencia</span><input id="ajIni" type="date" value="${esc(aj.inicioRes)}" class="field" /></label>
        <label class="grid gap-1.5"><span class="eyebrow">Fin de tu residencia</span><input id="ajFin" type="date" value="${esc(aj.finRes)}" class="field" /></label>
      </div>

      ${pend.length ? `
      <section class="panel p-4 sm:p-5 flex flex-wrap items-center gap-x-6 gap-y-3" style="border-color:var(--warn)">
        <div class="flex-1 min-w-[240px]">
          <p class="eyebrow" style="color:var(--warn)">Pendiente</p>
          <p class="text-sm mt-1"><strong>${pend.length} días anteriores sin completar.</strong> Si ya los hiciste en tu dashboard, márcalos de una vez; si no, recupera lo importante el domingo (máx. 2 h).</p>
          <div class="mt-2 flex flex-wrap gap-1.5">${pend.slice(0, 8).map((x) => `<button type="button" data-go="${x.date}" class="chip hover:border-current">${shortDate(x.date)} · ${x.p}%</button>`).join("")}${pend.length > 8 ? `<span class="chip">+${pend.length - 8}</span>` : ""}</div>
        </div>
        <button id="markPast" type="button" class="btn btn-primary">Ya hice todo lo anterior</button>
      </section>` : ""}

      <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px] items-start">
        <div class="space-y-5 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <div class="seg">
              <button type="button" data-nav="-7" aria-label="Semana anterior">«</button>
              <button type="button" data-nav="-1" aria-label="Día anterior">‹</button>
              <button type="button" data-go="${t}" aria-selected="${sel === t}">Hoy</button>
              <button type="button" data-nav="1" aria-label="Día siguiente">›</button>
              <button type="button" data-nav="7" aria-label="Semana siguiente">»</button>
            </div>
            <input id="pickDate" type="date" value="${sel}" class="field !w-auto !py-2" />
          </div>
          <div class="grid grid-cols-7 border hair rounded-xl overflow-hidden">${weekStrip()}</div>
          ${dayView(day)}
        </div>

        <aside class="space-y-5 xl:sticky xl:top-8">
          <section class="panel p-5 grid grid-cols-2 gap-x-4 gap-y-6">
            ${UI.stat(dRes > 0 ? `${dRes}` : "Ya", dRes > 0 ? "días para residencia" : "en residencia", "accent")}
            ${UI.stat(streak(), "días de racha")}
            ${UI.stat(`${completos}<span class="text-xl text-slate-400">/${planDays.length}</span>`, "días completados")}
            ${UI.stat(next ? (diffDays(t, next.date) === 0 ? "Hoy" : diffDays(t, next.date)) : "—", next ? "días al próximo hito" : "sin hitos")}
            ${next ? `<p class="col-span-2 -mt-3 text-sm border-t hair pt-3"><span class="eyebrow block mb-0.5">Próximo hito</span>${esc(next.titulo)}</p>` : ""}
          </section>

          <section class="panel p-5">
            <h3 class="sec-title"><span class="eyebrow">Hitos</span><span class="text-slate-400 font-normal text-xs mono">${Object.keys(hitosDone).length}/${hitos.length}</span></h3>
            <ol class="mt-3">
              ${hitos.map((h) => {
                const dd = diffDays(t, h.date); const ok = hitosDone[h.id];
                const tag = ok ? '<span class="chip chip-ok">logrado</span>' : dd < 0 ? '<span class="chip chip-bad">vencido</span>' : dd === 0 ? '<span class="chip chip-accent">hoy</span>' : `<span class="mono text-[11px] text-slate-400">${dd} d</span>`;
                return `<li class="py-2.5 border-t hair first:border-t-0"><label class="check text-sm"><input type="checkbox" data-hito="${esc(h.id)}" ${ok ? "checked" : ""} /><span class="flex-1 min-w-0"><span class="flex items-start justify-between gap-2"><span class="${ok ? "done" : "font-medium"}">${esc(h.titulo)}</span>${tag}</span><span class="block text-xs text-slate-500 mt-0.5"><span class="mono">${shortDate(h.date)}</span> · ${esc(h.detalle)}</span></span></label></li>`;
              }).join("")}
            </ol>
          </section>
        </aside>
      </div>`;

    bind(el);
    const tb = document.getElementById("tabDiaPct");
    if (tb) { const p = dayPct(t); tb.textContent = p === null ? "" : p + "%"; }
    if (typeof window.APP_updateRail === "function") window.APP_updateRail();
  }

  function weekStrip() {
    const mon = mondayOf(sel); const t = todayIso();
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const d = addDays(mon, i); const p = dayPct(d); const dd = parse(d);
      const fill = p === null ? "transparent" : p >= 80 ? "var(--ok)" : p > 0 ? "var(--warn)" : d < t ? "var(--bad)" : "var(--line)";
      const isSel = d === sel;
      return `<button type="button" data-go="${d}" class="py-2.5 text-center border-r hair last:border-r-0 transition-colors ${isSel ? "bg-slate-900 text-white dark:bg-white dark:text-black" : "hover:bg-slate-100 dark:hover:bg-[#0c0c0c]"}">
        <div class="mono text-[10px] uppercase tracking-widest ${isSel ? "opacity-70" : "text-slate-500"}">${DIAS[dd.getDay()].slice(0, 2)}</div>
        <div class="font-display text-2xl leading-none mt-1 ${d === t && !isSel ? "accent" : ""}">${dd.getDate()}</div>
        <div class="mx-auto mt-1.5 h-[3px] w-5 rounded-full" style="background:${fill}"></div>
      </button>`;
    }).join("");
  }

  function dayView(day) {
    if (!day) {
      return `<section class="panel p-10 text-center text-slate-500">No hay plan para el ${esc(longDate(sel))}. ${sel < PLAN_START ? "Tu plan empieza el 3 de noviembre." : "Ajusta las fechas de tu residencia en Ajustes."}</section>`;
    }
    const d = done[sel] || {};
    const p = dayPct(sel) ?? 0;
    let clock = toMin(aj.hora);
    const total = day.blocks.reduce((a, b) => a + (b.min || 0), 0);
    const nextDay = [1, 2, 3].map((i) => addDays(sel, i)).map((x) => ({ x, dd: getDay(x) })).find((o) => o.dd && o.dd.kind !== "sun");
    const isRes = day.kind === "res";

    const blocksHtml = day.blocks.map((b) => {
      const start = clock; if (!(isRes && b.key === "res")) clock += b.min || 0;
      const companyTime = isRes && b.key === "res";
      const bDone = b.items.every((_, i) => d[`${b.key}-${i}`]);
      const urgent = b.key === "res" && !isRes;
      return `
        <div class="t">${companyTime ? "Jornada" : b.min ? `${hhmm(start)}<small>${hhmm(start + b.min)}</small>` : ""}</div>
        <div class="b ${bDone ? "done" : ""} ${urgent ? "res" : ""}">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="font-semibold text-[15px] ${bDone ? "line-through decoration-[var(--accent)] text-slate-400" : ""}"><span class="mono text-[10px] tracking-widest mr-2 ${urgent ? "accent" : "text-slate-400"}">${CODE[b.key] || esc(b.icon || "")}</span>${esc(b.label)}</h4>
            <span class="flex items-center gap-2"><span class="mono text-[11px] text-slate-400">${companyTime ? "horario de la empresa" : b.min ? `${b.min} min` : ""}</span>${!bDone && !companyTime ? `<button type="button" data-focus="${esc(b.key)}" class="btn btn-sm focus-btn" title="Iniciar temporizador de enfoque para este bloque">▶ Enfocar</button>` : ""}</span>
          </div>
          ${b.info ? `<p class="text-xs text-slate-500 mt-1">${esc(b.info)}</p>` : ""}
          ${b.words?.length ? `<div class="mt-2 flex flex-wrap gap-1">${b.words.map((w) => `<span class="chip">${esc(w)}</span>`).join("")}</div>` : ""}
          <ul class="mt-3 space-y-2.5">
            ${b.items.map((it, i) => {
              const id = `${b.key}-${i}`;
              return `<li><label class="check text-sm">
                <input type="checkbox" data-item="${id}" ${d[id] ? "checked" : ""} />
                <span class="${d[id] ? "done" : ""}">${md(it.t)}${it.min ? ` <span class="mono text-[10px] text-slate-400 whitespace-nowrap">${it.min}′</span>` : ""}</span></label>
                ${it.como ? `<details class="how ml-7 mt-1" ${b.key === "prog" || b.key === "cert" ? "open" : ""}><summary>cómo hacerlo</summary><p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${md(it.como)}</p></details>` : ""}
              </li>`;
            }).join("")}
          </ul>
          ${b.links?.length ? `<div class="mt-3 flex flex-wrap gap-3">${b.links.map((u) => `<a href="${esc(safeUrl(u))}" target="_blank" rel="noopener" class="mono text-[11px] accent hover:underline">${esc(linkLabel(u))} ↗</a>`).join("")}</div>` : ""}
          ${b.ok?.length ? `<div class="done-when mt-3"><p class="eyebrow accent mb-1">Terminaste cuando</p><ul>${b.ok.map((o) => `<li>${md(o)}</li>`).join("")}</ul></div>` : ""}
        </div>`;
    }).join("");

    const rev = revs[sel] || {};
    return `
      <section class="panel overflow-hidden">
        <div class="p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4 border-b hair">
          <div class="min-w-0 max-w-xl">
            <p class="eyebrow">${day.week ? `Semana ${day.week} del dashboard · ` : ""}${total ? `≈ ${Math.floor(total / 60)} h ${total % 60} min${isRes ? " fuera del trabajo" : ""}` : ""}</p>
            ${day.deliverable ? `<p class="text-sm mt-2"><span class="eyebrow accent mr-1.5">Entregable</span>${esc(day.deliverable)}</p>` : ""}
          </div>
          <div class="text-right">
            <div class="font-display text-6xl leading-none ${p >= 80 ? "text-[color:var(--ok)]" : ""}">${p}<span class="text-3xl text-slate-400">%</span></div>
          </div>
        </div>
        ${UI.bar(p, p >= 80)}

        <div class="p-5 sm:p-6">
          <div class="agenda">${blocksHtml}</div>

          ${day.kind === "sun" ? `
            ${day.nextWeek?.length ? `<div class="mt-4 panel-flat p-4 text-sm"><span class="eyebrow block mb-1">Próxima semana</span>${day.nextWeek.map(esc).join(" · ")}</div>` : ""}
            <div class="mt-5 grid gap-4">
              ${[["q1", "¿Qué logré esta semana? (postulaciones, temas, commits)"], ["q2", "¿Qué me atoró y qué voy a hacer diferente?"], ["q3", "¿Cuál es mi prioridad #1 para la próxima semana?"]].map(([k, q]) => `
                <label class="grid gap-1.5 text-sm font-medium">${q}<textarea data-rev="${k}" rows="2" class="field font-normal">${esc(rev[k] || "")}</textarea></label>`).join("")}
            </div>` : `
            <label class="mt-5 grid gap-1.5"><span class="eyebrow">Bitácora de hoy — qué aprendí, qué me atoró, primer paso de mañana</span>
              <textarea id="dayNote" rows="3" class="field">${esc(notas[sel] || "")}</textarea>
            </label>`}

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <button id="dayAll" type="button" class="btn ${p === 100 ? "" : "btn-primary"}">${p === 100 ? "Desmarcar día" : "Marcar día completo"}</button>
            ${nextDay ? `<button type="button" data-go="${nextDay.x}" class="btn btn-ghost">Siguiente · ${esc(shortDate(nextDay.x))} — ${esc(nextDay.dd.title)} →</button>` : ""}
          </div>
        </div>
      </section>`;
  }

  function bind(el) {
    el.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
    el.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => go(addDays(sel, Number(b.dataset.nav)))));
    el.querySelector("#pickDate")?.addEventListener("change", (e) => e.target.value && go(e.target.value));
    el.querySelector("#ajBtn")?.addEventListener("click", () => el.querySelector("#ajPanel").classList.toggle("hidden"));
    [["ajHora", "hora"], ["ajIni", "inicioRes"], ["ajFin", "finRes"]].forEach(([id, k]) => el.querySelector("#" + id)?.addEventListener("change", (e) => {
      if (!e.target.value) return; aj[k] = e.target.value; save(LS.AJ, aj); rerender(); el.querySelector("#ajPanel")?.classList.remove("hidden"); toast("Ajustes guardados");
    }));
    el.querySelectorAll("input[data-item]").forEach((c) => c.addEventListener("change", (e) => {
      const m = (done[sel] = done[sel] || {});
      if (e.target.checked) m[e.target.dataset.item] = 1; else delete m[e.target.dataset.item];
      save(LS.DIA, done); rerender();
      if (dayPct(sel) === 100 && e.target.checked) toast("¡Día completo! 🔥 Racha: " + streak());
    }));
    el.querySelector("#dayAll")?.addEventListener("click", () => {
      const ids = items(getDay(sel));
      if ((dayPct(sel) ?? 0) === 100) delete done[sel]; else done[sel] = Object.fromEntries(ids.map((i) => [i, 1]));
      save(LS.DIA, done); rerender();
    });
    el.querySelector("#markPast")?.addEventListener("click", () => {
      if (!confirm("¿Marcar como hechos todos los días anteriores a hoy? (Útil si ya los hiciste en tu dashboard)")) return;
      pastPending().forEach(({ date }) => { done[date] = Object.fromEntries(items(getDay(date)).map((i) => [i, 1])); });
      save(LS.DIA, done); rerender(); toast("Días anteriores marcados");
    });
    el.querySelector("#minBtn")?.addEventListener("click", () => setMinimo(sel, !minimo[sel]));
    el.querySelectorAll("button[data-focus]").forEach((b) => b.addEventListener("click", () => {
      const blk = (getDay(sel)?.blocks || []).find((x) => x.key === b.dataset.focus);
      if (!blk || !window.FOCUS) return;
      window.FOCUS.start({ label: blk.label, key: blk.key, min: blk.min && blk.min <= 60 ? blk.min : 25 });
    }));
    el.querySelector("#dayNote")?.addEventListener("change", (e) => { notas[sel] = e.target.value; save(LS.NOTAS, notas); toast("Bitácora guardada"); });
    el.querySelectorAll("textarea[data-rev]").forEach((tx) => tx.addEventListener("change", (e) => {
      revs[sel] = Object.assign(revs[sel] || {}, { [e.target.dataset.rev]: e.target.value }); save(LS.REV, revs); toast("Revisión guardada");
    }));
    el.querySelectorAll("input[data-hito]").forEach((c) => c.addEventListener("change", (e) => {
      if (e.target.checked) hitosDone[e.target.dataset.hito] = todayIso(); else delete hitosDone[e.target.dataset.hito];
      save(LS.HITOS, hitosDone); rerender();
      if (e.target.checked) toast("¡Hito logrado! 🏁");
    }));
  }

  function setMinimo(date, on) {
    if (on) minimo[date] = true; else delete minimo[date];
    save("dt2027_minimo", minimo); rerender();
    toast(on ? "Plan mínimo: haz esto y el día cuenta." : "Plan completo de nuevo");
    window.dispatchEvent(new CustomEvent("dt-data"));
  }
  function go(date) { sel = date; render(); }
  function rerender() { const y = window.scrollY; render(); window.scrollTo(0, y); }

  // Exponer datos para respaldos (los usa extras.js).
  window.MIDIA = {
    exportData: () => ({ ajustes: aj, dia: done, notas, revision: revs, hitos: hitosDone }),
    importData: (x) => {
      if (!x || typeof x !== "object") return;
      if (x.ajustes) Object.assign(aj, x.ajustes);
      if (x.dia) done = Object.assign(done, x.dia);
      if (x.notas) notas = Object.assign(notas, x.notas);
      if (x.revision) revs = Object.assign(revs, x.revision);
      if (x.hitos) hitosDone = Object.assign(hitosDone, x.hitos);
      save(LS.AJ, aj); save(LS.DIA, done); save(LS.NOTAS, notas); save(LS.REV, revs); save(LS.HITOS, hitosDone);
      render();
    },
    render,
    // Para la pestaña Control.
    getDay, dayPct, allHitos, streak, pastPending, hitosDone: () => hitosDone, notas: () => notas,
    planRange: () => ({ start: PLAN_START, end: PLAN_END, inicioRes: aj.inicioRes, finRes: aj.finRes, hora: aj.hora }),
    setMinimo, isMinimo: (d) => !!minimo[d],
    go: (date) => { sel = date; render(); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
