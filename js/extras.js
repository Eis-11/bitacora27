/* Navegación, Vacantes 2027 y Ruta de aprendizaje. Progreso guardado en localStorage. */
(function () {
  "use strict";

  const LS = {
    TAB: "dt2027_tab",
    VAC: "dt2027_vacantes_estado",
    VAC_NOTES: "dt2027_vacantes_notas",
    RUTA: "dt2027_ruta_progreso",
    SEEN: "dt2027_vacantes_vistas",
    AJ: "dt2027_ajustes",
    CERTS: "dt2027_certs"
  };
  const UI = window.UI;
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); } };
  const esc = UI.esc;
  const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[0.82em]">$1</code>');
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "#");
  const toast = (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m));

  const DAY = 86400000;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const toDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const fmt = (s) => { const d = toDate(s); return `${d.getDate()} ${MESES[d.getMonth()]}`; };
  const fmtMin = (m) => (m >= 60 ? `${Math.round((m / 60) * 10) / 10} h` : `${m} min`);

  /* ==================== NAVEGACIÓN Y RIEL ==================== */
  function setTab(name) {
    document.querySelectorAll(".tab-view").forEach((v) => v.classList.toggle("hidden", v.id !== "view-" + name));
    document.querySelectorAll(".tab-btn").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === name)));
    save(LS.TAB, name);
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    window.scrollTo({ top: 0 });
    window.dispatchEvent(new CustomEvent("dt-tab", { detail: name }));
  }

  function updateRail() {
    const el = document.getElementById("railCount");
    if (!el) return;
    const ini = (load(LS.AJ, {}) || {}).inicioRes || "2027-01-18";
    const n = Math.round((toDate(ini) - today()) / DAY);
    const nuevas = VAC.items.filter(isNew).length;
    el.innerHTML = n > 0 ? `
      <p class="eyebrow">Faltan</p>
      <div class="big mt-2">${n} <em>días</em></div>
      <p class="text-sm text-slate-500 mt-2 leading-snug">para tu primer día de residencia · <span class="mono">${fmt(ini)}</span></p>
      <div class="mt-4 grid gap-1.5 text-xs mono text-slate-500">
        <div class="flex justify-between"><span>Ruta</span><span class="text-slate-900 dark:text-white">${pct(allSteps())}%</span></div>
        <div class="flex justify-between"><span>Vacantes nuevas</span><span class="text-slate-900 dark:text-white">${nuevas}</span></div>
      </div>` : `
      <p class="eyebrow">Estás en</p>
      <div class="big mt-2"><em>residencia</em></div>
      <p class="text-sm text-slate-500 mt-2">Desde el <span class="mono">${fmt(ini)}</span>. Que cada semana deje evidencia.</p>`;
  }
  window.APP_updateRail = () => updateRail();

  /* ==================== VACANTES ==================== */
  const VAC = window.VACANTES || { items: [], searchLog: [], lastUpdated: "—" };
  const PORTALES = window.PORTALES_VACANTES || [];
  const ESTADOS = {
    none: { label: "Sin postular", cls: "" },
    saved: { label: "Me interesa", cls: "chip-warn" },
    applied: { label: "Postulado", cls: "chip-accent" },
    interview: { label: "Entrevista", cls: "chip-accent" },
    offer: { label: "¡Aceptado!", cls: "chip-ok" },
    rejected: { label: "Descartada", cls: "chip-bad" }
  };
  const VERIF = {
    oficial: { label: "Fuente oficial", cls: "chip-ok" },
    agregador: { label: "Agregador · verifica", cls: "chip-warn" },
    cerrada: { label: "Cerrada", cls: "" }
  };
  const ENCAJE = { alto: ["Encaje alto", "var(--ok)"], medio: ["Encaje medio", "var(--warn)"], bajo: ["Encaje bajo", "var(--muted)"] };

  let vacState = load(LS.VAC, {});
  let vacNotes = load(LS.VAC_NOTES, {});
  const seenBefore = new Set(load(LS.SEEN, null) || []);
  const firstVisit = load(LS.SEEN, null) === null;
  const vf = { q: "", region: "all", encaje: "all", estado: "all", ocultarCerradas: true, top: false };

  function isNew(v) { return !firstVisit && !seenBefore.has(v.id); }

  function renderVacantesShell() {
    const regions = [...new Set(VAC.items.map((v) => v.region))].sort();
    const el = document.getElementById("view-vacantes");
    el.innerHTML = `
      ${UI.head("03", "Vacantes", `Prácticas <em>enero–junio 2027</em>`,
        `Última búsqueda: <span class="mono">${esc(VAC.lastUpdated)}</span>. Se buscan nuevas automáticamente lunes, miércoles y viernes. Las de agregador cambian a diario: abre la fuente antes de postular.`)}

      <section id="vacKpis" class="panel grid grid-cols-2 sm:grid-cols-4"></section>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px] items-start">
        <div class="space-y-4 min-w-0">
          <section class="panel p-3 sm:p-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr]">
            <input id="vacQ" type="search" placeholder="Buscar empresa, puesto, stack…" class="field" />
            <select id="vacRegion" class="field"><option value="all">Todas las regiones</option>${regions.map((r) => `<option>${esc(r)}</option>`).join("")}</select>
            <select id="vacEncaje" class="field"><option value="all">Cualquier encaje</option><option value="alto">Encaje alto</option><option value="medio">Encaje medio</option><option value="bajo">Encaje bajo</option></select>
            <select id="vacEstado" class="field"><option value="all">Todos mis estados</option>${Object.entries(ESTADOS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>
            <div class="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm text-slate-600 dark:text-slate-300">
              <label class="check items-center"><input id="vacCerradas" type="checkbox" checked /> Ocultar cerradas</label>
              <label class="check items-center"><input id="vacTop" type="checkbox" /> Solo empresas grandes</label>
              <span id="vacCount" class="ml-auto mono text-xs text-slate-400 self-center"></span>
            </div>
          </section>
          <div id="vacList" class="grid gap-4 md:grid-cols-2"></div>
        </div>

        <aside class="space-y-5 xl:sticky xl:top-8">
          <section class="panel p-5">
            <h3 class="sec-title"><span class="eyebrow">Revisar a mano</span></h3>
            <p class="text-xs text-slate-500 mt-1">Portales que cambian a diario. Dales una vuelta 2 veces por semana.</p>
            <ul class="mt-3 text-sm">${PORTALES.map((p) => `<li class="border-t hair first:border-t-0"><a class="flex justify-between gap-2 py-2 hover:text-[color:var(--accent-ink)] dark:hover:text-[color:var(--accent)]" target="_blank" rel="noopener" href="${esc(safeUrl(p.url))}"><span>${esc(p.nombre)}</span><span class="mono text-slate-400">↗</span></a></li>`).join("")}</ul>
          </section>
          <section class="panel p-5">
            <h3 class="sec-title"><span class="eyebrow">Historial de búsquedas</span></h3>
            <ol class="mt-3 space-y-3 text-sm max-h-80 overflow-auto pr-1">${[...(VAC.searchLog || [])].reverse().map((l) => `<li><span class="mono text-[11px] accent">${esc(l.date)}</span><p class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mt-0.5">${esc(l.summary)}</p></li>`).join("")}</ol>
          </section>
        </aside>
      </div>`;

    const bind = (id, key, prop = "value") => document.getElementById(id).addEventListener("input", (e) => { vf[key] = e.target[prop]; renderVacList(); });
    bind("vacQ", "q"); bind("vacRegion", "region"); bind("vacEncaje", "encaje"); bind("vacEstado", "estado"); bind("vacCerradas", "ocultarCerradas", "checked"); bind("vacTop", "top", "checked");
    renderVacList();
  }

  function renderVacList() {
    const q = vf.q.trim().toLowerCase();
    const order = { alto: 0, medio: 1, bajo: 2 };
    const items = VAC.items
      .filter((v) => !(vf.ocultarCerradas && v.verificacion === "cerrada"))
      .filter((v) => !vf.top || v.top)
      .filter((v) => vf.region === "all" || v.region === vf.region)
      .filter((v) => vf.encaje === "all" || v.encaje === vf.encaje)
      .filter((v) => vf.estado === "all" || (vacState[v.id] || "none") === vf.estado)
      .filter((v) => !q || [v.titulo, v.empresa, v.ciudad, v.requisitos, (v.stack || []).join(" "), v.nota].join(" ").toLowerCase().includes(q))
      .sort((a, b) => (isNew(b) - isNew(a)) || (order[a.encaje] - order[b.encaje]) || String(b.encontrada).localeCompare(String(a.encontrada)));

    const list = document.getElementById("vacList");
    list.innerHTML = items.length ? items.map(vacCard).join("") :
      `<div class="panel p-10 text-center md:col-span-2 text-slate-500">No hay vacantes con esos filtros.</div>`;
    const c = document.getElementById("vacCount");
    if (c) c.textContent = `${items.length} de ${VAC.items.length}`;

    list.querySelectorAll("select[data-vac]").forEach((s) => s.addEventListener("change", (e) => {
      vacState[e.target.dataset.vac] = e.target.value; save(LS.VAC, vacState); renderVacList(); updateKpis();
    }));
    list.querySelectorAll("textarea[data-note]").forEach((t) => t.addEventListener("change", (e) => {
      vacNotes[e.target.dataset.note] = e.target.value; save(LS.VAC_NOTES, vacNotes); toast("Nota guardada");
    }));
    list.querySelectorAll("button[data-tpl]").forEach((b) => b.addEventListener("click", () => {
      if (typeof window.openTemplateModal === "function") {
        window.openTemplateModal();
        const c2 = document.getElementById("tplCompany");
        if (c2) { c2.value = b.dataset.tpl; c2.dispatchEvent(new Event("input", { bubbles: true })); }
      }
    }));
    updateKpis();
  }

  function vacCard(v) {
    const st = vacState[v.id] || "none";
    const ver = VERIF[v.verificacion] || VERIF.agregador;
    const closed = v.verificacion === "cerrada";
    const enc = ENCAJE[v.encaje] || ENCAJE.bajo;
    return `
      <article class="panel p-5 flex flex-col gap-3.5 transition-shadow hover:shadow-card-hover ${closed ? "opacity-60" : ""}">
        <div class="flex items-start justify-between gap-3">
          <p class="mono text-[11px] tracking-[.14em] uppercase accent font-medium">${esc(v.empresa)}${v.top ? ' <span title="Empresa grande / top" class="text-slate-400">★</span>' : ""}</p>
          <div class="flex flex-wrap justify-end gap-1">
            ${isNew(v) ? '<span class="chip chip-solid">NUEVA</span>' : ""}
            <span class="chip ${ver.cls}">${ver.label}</span>
          </div>
        </div>
        <div>
          <h3 class="text-[17px] font-semibold leading-snug">${esc(v.titulo)}</h3>
          <p class="mt-1 text-xs flex items-center gap-1.5 text-slate-500"><span class="dot" style="background:${enc[1]}"></span>${enc[0]}${st !== "none" ? ` · <span class="chip ${ESTADOS[st].cls} !py-0">${ESTADOS[st].label}</span>` : ""}</p>
        </div>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2.5 kv border-y hair py-3">
          <div class="kv"><dt>Ubicación</dt><dd>${esc(v.ciudad)}</dd></div>
          <div class="kv"><dt>Modalidad</dt><dd>${esc(v.modalidad)}</dd></div>
          <div class="kv"><dt>Inicio</dt><dd>${esc(v.inicio)}</dd></div>
          <div class="kv"><dt>Apoyo</dt><dd>${esc(v.pago)}</dd></div>
        </dl>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${esc(v.requisitos)}</p>
        <div class="flex flex-wrap gap-1">${(v.stack || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        ${v.nota ? `<p class="text-xs leading-relaxed pl-3 border-l-2" style="border-color:var(--accent)">${esc(v.nota)}</p>` : ""}
        <textarea data-note="${esc(v.id)}" rows="1" placeholder="Tus notas: contacto, fecha en que postulaste…" class="field text-xs resize-y">${esc(vacNotes[v.id] || "")}</textarea>
        <div class="mt-auto flex flex-wrap items-center gap-2">
          <a href="${esc(safeUrl(v.url))}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Ver vacante ↗</a>
          <button type="button" data-tpl="${esc(v.empresa)}" class="btn btn-sm">Plantilla</button>
          <select data-vac="${esc(v.id)}" aria-label="Estado de postulación" class="field !w-auto !py-1.5 text-xs ml-auto">
            ${Object.entries(ESTADOS).map(([k, e]) => `<option value="${k}" ${k === st ? "selected" : ""}>${e.label}</option>`).join("")}
          </select>
        </div>
        <p class="mono text-[10px] text-slate-400 leading-relaxed">${esc(v.fuente)} · ${esc(v.encontrada)}</p>
      </article>`;
  }

  function updateKpis() {
    const open = VAC.items.filter((v) => v.verificacion !== "cerrada");
    const applied = Object.values(vacState).filter((s) => ["applied", "interview", "offer"].includes(s)).length;
    const nuevas = VAC.items.filter(isNew).length;
    const top = open.filter((v) => v.top).length;
    const k = document.getElementById("vacKpis");
    if (k) k.innerHTML = [
      [open.length, "abiertas", ""], [nuevas, "nuevas", nuevas ? "accent" : ""], [top, "empresas grandes", ""], [applied, "postuladas", ""]
    ].map(([n, l, c], i) => `<div class="p-5 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} sm:border-l first:border-l-0 hair">${UI.stat(n, l, c)}</div>`).join("");
    const t = document.getElementById("tabVacCount");
    if (t) t.textContent = nuevas ? `${nuevas} nuevas` : open.length;
    updateRail();
  }

  /* ==================== RUTA DE APRENDIZAJE ==================== */
  const RUTA = window.RUTA || [];
  const RUTINA = window.RUTA_RUTINA || [];
  const CERTS = window.CERTS || [];
  let certState = load(LS.CERTS, {}); // { id: { st: "pend"|"curso"|"ok", link: "" } }
  const CERT_ST = { pend: "Pendiente", curso: "En curso", ok: "Obtenida" };

  function certsSection() {
    if (!CERTS.length) return "";
    const got = CERTS.filter((c) => certState[c.id]?.st === "ok").length;
    const wip = CERTS.filter((c) => certState[c.id]?.st === "curso").length;
    const ord = [...CERTS].sort((a, b) => b.peso - a.peso);
    return `
      <section id="certs" class="panel">
        <div class="p-5 sm:p-7 flex flex-wrap items-end justify-between gap-4 border-b hair">
          <div class="max-w-2xl">
            <p class="eyebrow accent">Certificaciones y cursos gratuitos</p>
            <h3 class="font-display text-4xl sm:text-5xl leading-[1] mt-2 tracking-tight">Lo que <em>más pesa</em> en tu CV</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">Ordenadas por peso para un reclutador de .NET / full stack. Las que tienen fecha aparecen como bloque <span class="mono accent">CERT</span> en <em>Mi día</em>. Al obtener una, pega el link verificable y agrégala a LinkedIn → Licencias y certificaciones.</p>
          </div>
          <div class="flex gap-6">${UI.stat(got, "obtenidas", got ? "text-[color:var(--ok)]" : "")}${UI.stat(wip, "en curso")}${UI.stat(CERTS.length, "en la lista")}</div>
        </div>
        <ol>${ord.map((c) => {
          const s = certState[c.id] || {};
          const st = s.st || "pend";
          return `<li class="cert-row p-5 sm:px-7 border-t hair first:border-t-0">
            <div class="flex md:flex-col items-center md:items-start gap-2">
              <span class="cert-w" title="Peso en el CV: ${c.peso} de 3">${[1, 2, 3].map((n) => `<i class="${n <= c.peso ? "on" : ""}"></i>`).join("")}</span>
              <span class="mono text-[10px] text-slate-400 uppercase tracking-wider">${esc(c.tipo)}</span>
            </div>
            <div class="min-w-0">
              <a href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener" class="font-semibold text-[15px] hover:underline ${st === "ok" ? "line-through decoration-[var(--accent)] text-slate-400" : ""}">${esc(c.nombre)} <span class="mono text-slate-400">↗</span></a>
              <p class="mono text-[11px] text-slate-500 mt-1">${esc(c.emisor)} · <span class="${/^gratis/i.test(c.costo) ? "text-[color:var(--ok)]" : ""}">${esc(c.costo)}</span> · ${esc(c.horas)}</p>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">${esc(c.porque)}</p>
              <details class="how mt-2"><summary>cómo obtenerla</summary><p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${esc(c.como)}</p></details>
              <p class="text-xs mt-2"><span class="eyebrow mr-1.5">Cuándo</span>${esc(c.cuando)}</p>
            </div>
            <div class="grid gap-2">
              <select data-cert="${esc(c.id)}" class="field text-sm" aria-label="Estado de ${esc(c.nombre)}">${Object.entries(CERT_ST).map(([k, l]) => `<option value="${k}" ${k === st ? "selected" : ""}>${l}</option>`).join("")}</select>
              ${st === "ok" ? `<input data-cert-link="${esc(c.id)}" class="field text-xs" type="url" placeholder="Link de la credencial" value="${esc(s.link || "")}" />
                ${s.link ? `<a href="${esc(safeUrl(s.link))}" target="_blank" rel="noopener" class="mono text-[11px] accent hover:underline">Ver credencial ↗</a>` : ""}` : ""}
            </div>
          </li>`;
        }).join("")}</ol>
        <p class="px-5 sm:px-7 py-4 border-t hair text-xs text-slate-500">Verificado el 22 nov 2026. Los programas gratuitos cambian: confirma costo y vigencia en la página oficial antes de agendar un examen. Las ofertas de vouchers gratis de AWS y AZ-900 de 2026 ya vencieron, por eso no están aquí.</p>
      </section>`;
  }
  const REGLAS = window.RUTA_REGLAS || [];
  let prog = load(LS.RUTA, {});
  let selFase = null;      // fase abierta en el detalle (por defecto, la del siguiente paso)
  let selPane = "pasos";   // pestaña del detalle
  const allSteps = () => RUTA.flatMap((f) => f.pasos);
  const pct = (steps) => (steps.length ? Math.round((steps.filter((s) => prog[s.id]).length / steps.length) * 100) : 0);

  function faseStatus(f) {
    const t = today(), ini = toDate(f.inicio), fin = toDate(f.fin), p = pct(f.pasos);
    if (p === 100) return { key: "done", label: "Completa", cls: "chip-ok" };
    if (t > fin) return { key: "late", label: "Atrasada", cls: "chip-bad" };
    if (t >= ini) return { key: "now", label: "En curso", cls: "chip-accent" };
    return { key: "next", label: `Empieza ${fmt(f.inicio)}`, cls: "" };
  }

  // Porcentaje de pasos que "deberías" llevar hoy según las fechas del plan.
  function expectedPct() {
    const t = today().getTime();
    let exp = 0, tot = 0;
    RUTA.forEach((f) => {
      const ini = toDate(f.inicio).getTime(), fin = toDate(f.fin).getTime() + DAY;
      const frac = Math.min(1, Math.max(0, (t - ini) / (fin - ini)));
      exp += frac * f.pasos.length; tot += f.pasos.length;
    });
    return tot ? Math.round((exp / tot) * 100) : 0;
  }

  // Cola de pasos pendientes: primero lo urgente, luego lo atrasado, luego lo que está en curso, luego lo siguiente.
  function queue() {
    const rank = { late: 1, now: 2, next: 3, done: 9 };
    return RUTA
      .map((f) => ({ f, st: faseStatus(f) }))
      .filter(({ st }) => st.key !== "done")
      .sort((a, b) => (b.f.urgente ? 1 : 0) - (a.f.urgente ? 1 : 0) || rank[a.st.key] - rank[b.st.key] || toDate(a.f.inicio) - toDate(b.f.inicio))
      .flatMap(({ f }) => f.pasos.filter((p) => !prog[p.id]).map((p) => ({ f, p })));
  }

  const chk = (id, html, extra = "") => `
    <label class="check text-sm">
      <input type="checkbox" data-step="${esc(id)}" ${prog[id] ? "checked" : ""} />
      <span class="${prog[id] ? "done" : ""}">${html}${extra}</span>
    </label>`;

  function renderRuta() {
    const total = pct(allSteps());
    const exp = expectedPct();
    const diff = total - exp;
    const ritmo = diff >= 5 ? ["Adelantado", "text-[color:var(--ok)]"] : diff <= -10 ? ["Atrasado", "text-[color:var(--bad)]"] : ["Al día", "accent"];
    const q = queue();
    const nextS = q[0];
    const after = q.slice(1, 6);
    const late = RUTA.filter((f) => !f.urgente && faseStatus(f).key === "late");
    if (!selFase || !RUTA.some((f) => f.id === selFase)) selFase = nextS ? nextS.f.id : (RUTA.find((f) => faseStatus(f).key === "now") || RUTA[0] || {}).id;
    const sel = RUTA.find((f) => f.id === selFase);
    const el = document.getElementById("view-ruta");

    el.innerHTML = `
      ${UI.head("02", "Ruta de aprendizaje", `De estudiante a <em>practicante full stack</em>`,
        `C# · ASP.NET Core · HTML-CSS-JavaScript · SQL Server · Git · Docker. Sigue el orden: haz <strong>tu siguiente paso</strong>, márcalo y la ruta te da el que sigue. El detalle de cada día está en <em>Mi día</em>.`,
        `<div class="flex gap-1.5"><button id="rutaExport" type="button" class="btn btn-sm">Exportar</button><label class="btn btn-sm">Importar<input id="rutaImport" type="file" accept="application/json" class="hidden" /></label></div>`)}

      <section class="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        ${nextS ? `
        <div class="next-step p-6 sm:p-7 flex flex-col gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="eyebrow accent">Tu siguiente paso</span>
            <span class="chip ${nextS.f.urgente ? "chip-solid" : ""}">${esc(nextS.f.fase)}</span>
            <span class="chip">${fmtMin(nextS.p.min)}</span>
          </div>
          <p class="text-xl sm:text-2xl font-semibold leading-snug tracking-tight">${md(nextS.p.texto)}</p>
          ${nextS.p.como ? `<div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"><span class="eyebrow block mb-1">Cómo hacerlo</span>${md(nextS.p.como)}</div>` : ""}
          ${nextS.f.cursos?.[0] ? `<a href="${esc(safeUrl(nextS.f.cursos[0].url))}" target="_blank" rel="noopener" class="text-sm hover:underline"><span class="eyebrow mr-1.5">Apóyate en</span>${esc(nextS.f.cursos[0].nombre)} <span class="mono text-slate-400">↗</span></a>` : ""}
          <div class="flex flex-wrap gap-2 mt-auto pt-1">
            <button type="button" data-done="${esc(nextS.p.id)}" class="btn btn-accent">✓ Hecho, dame el siguiente</button>
            <button type="button" data-sel-fase="${esc(nextS.f.id)}" data-scroll="1" class="btn">Ver la fase completa</button>
          </div>
        </div>` : `
        <div class="next-step p-7"><p class="eyebrow accent">Ruta completa</p><p class="font-display text-4xl mt-2">Terminaste <em>todo</em>.</p><p class="text-sm text-slate-500 mt-2">Ahora el objetivo es convertir la residencia en oferta de trabajo.</p></div>`}

        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Después de eso</span></h3>
          <ol class="mt-2">
            ${after.length ? after.map(({ f, p }, i) => `<li class="py-3 border-t hair first:border-t-0">${chk(p.id, `<span class="mono text-[11px] text-slate-400 mr-1.5">${String(i + 2).padStart(2, "0")}</span>${md(p.texto)}`, ` <span class="chip ml-1">${esc(f.fase)} · ${fmtMin(p.min)}</span>`)}</li>`).join("")
              : `<li class="text-sm text-slate-500 py-3">Nada más en cola.</li>`}
          </ol>
        </div>
      </section>

      ${late.length ? `
      <section class="panel p-5 flex flex-wrap items-center gap-x-6 gap-y-3" style="border-color:var(--warn)">
        <div class="flex-1 min-w-[260px]">
          <p class="eyebrow" style="color:var(--warn)">Ponte al corriente</p>
          <p class="text-sm mt-1">Estas fases ya pasaron de fecha y no están marcadas. Si ya las hiciste en tu dashboard, márcalas para que tu siguiente paso sea el correcto. Si no, haz sus pasos: aparecen primero en la cola.</p>
        </div>
        <div class="flex flex-wrap gap-2">${late.map((f) => `<button type="button" data-master="${esc(f.id)}" class="btn btn-sm">${esc(f.fase)} · ya la domino</button>`).join("")}</div>
      </section>` : ""}

      <section class="panel grid sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)] items-center">
        <div class="p-5">${UI.stat(`${total}%`, "tu avance")}</div>
        <div class="p-5 border-l hair">${UI.stat(`${exp}%`, "esperado hoy")}</div>
        <div class="p-5 border-l hair">${UI.stat(ritmo[0], "ritmo", ritmo[1])}</div>
        <div class="p-5 sm:border-l hair border-t sm:border-t-0">
          <div class="relative">${UI.bar(total)}<span class="absolute -top-1.5 h-[16px] w-[2px] bg-slate-900 dark:bg-white" style="left:${exp}%" title="Esperado hoy"></span></div>
          <p class="mono text-[10px] text-slate-400 mt-2.5">La rayita marca dónde deberías ir hoy según las fechas.</p>
        </div>
      </section>

      <section class="space-y-3">
        <h3 class="sec-title"><span class="eyebrow">Mapa</span><span class="text-sm text-slate-500 font-normal">Toca una fase para ver qué incluye.</span></h3>
        <div class="phase-map no-scrollbar">
          ${RUTA.map((f) => {
            const st = faseStatus(f); const p = pct(f.pasos);
            return `<button type="button" data-sel-fase="${esc(f.id)}" aria-pressed="${f.id === selFase}" class="phase-cell is-${st.key} ${f.urgente ? "is-urgent" : ""}">
              <span class="pn">${f.urgente ? "URGENTE" : esc(f.fase.replace("Fase ", "F"))} · ${fmt(f.inicio)}</span>
              <span class="pt">${esc(f.titulo)}</span>
              <span class="pp">${p}<span class="text-base text-slate-400">%</span></span>
              ${UI.bar(p, p === 100)}
            </button>`;
          }).join("")}
        </div>
      </section>

      ${sel ? faseDetail(sel) : ""}

      ${certsSection()}

      <section class="grid gap-5 lg:grid-cols-2">
        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Tu rutina</span><span class="text-sm text-slate-500 font-normal">${RUTINA.reduce((a, r) => a + r.min, 0)} min · lunes a sábado</span></h3>
          <div class="routine mt-4">${RUTINA.map((r) => `<div style="flex:${r.min}" title="${esc(r.bloque)} · ${r.min} min">${esc(r.bloque)}</div>`).join("")}</div>
          <ul class="mt-4">${RUTINA.map((r) => `<li class="grid grid-cols-[64px_1fr] gap-3 py-2.5 border-t hair first:border-t-0 text-sm"><span class="mono text-xs pt-0.5">${r.min} min</span><span><strong class="font-semibold">${esc(r.bloque)}.</strong> <span class="text-slate-600 dark:text-slate-300">${esc(r.detalle)}</span></span></li>`).join("")}</ul>
          <p class="mt-2 text-xs text-slate-500">Domingo: descanso y revisión semanal. Durante la residencia baja a 3–5 h por semana.</p>
        </div>
        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Reglas para no atorarte</span></h3>
          <ol class="mt-3">${REGLAS.map((r, i) => `<li class="grid grid-cols-[40px_1fr] gap-2 py-3 border-t hair first:border-t-0 text-sm"><span class="font-display text-3xl leading-none accent">${i + 1}</span><span class="leading-relaxed">${esc(r)}</span></li>`).join("")}</ol>
        </div>
      </section>`;

    bindRuta(el);
    const t = document.getElementById("tabRutaPct");
    if (t) t.textContent = total + "%";
    updateRail();
  }

  function faseDetail(f) {
    const p = pct(f.pasos);
    const st = faseStatus(f);
    const minTotal = f.pasos.reduce((a, s) => a + (s.min || 0), 0);
    const done = f.pasos.filter((s) => prog[s.id]).length;
    const panes = [
      ["pasos", `Pasos ${done}/${f.pasos.length}`],
      ["cursos", `Cursos ${f.cursos.length}`],
      ["proyecto", "Proyecto"],
      ["listo", "¿Listo para avanzar?"],
      ...(f.errores?.length || f.entrevista?.length ? [["entrevista", "Errores y entrevista"]] : [])
    ];
    if (!panes.some(([k]) => k === selPane)) selPane = "pasos";
    let body = "";
    if (selPane === "pasos") {
      body = `<ol>${f.pasos.map((s, i) => `
        <li class="grid grid-cols-[34px_1fr] gap-2 py-3.5 border-t hair first:border-t-0">
          <span class="font-display text-2xl leading-none ${prog[s.id] ? "text-slate-400" : "accent"}">${i + 1}</span>
          <div>
            ${chk(s.id, md(s.texto), ` <span class="mono text-[10px] text-slate-400 whitespace-nowrap">${fmtMin(s.min)}</span>${prog[s.id] ? ` <span class="mono text-[10px] text-[color:var(--ok)]">✓ ${esc(prog[s.id])}</span>` : ""}`)}
            ${s.como ? `<details class="how ml-7 mt-1.5"><summary>cómo hacerlo</summary><p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${md(s.como)}</p></details>` : ""}
          </div>
        </li>`).join("")}</ol>`;
    } else if (selPane === "cursos") {
      body = `<p class="text-sm text-slate-500 mb-3">Hazlos en este orden. No necesitas terminar todos: avanza cuando cumplas la checklist de «¿Listo para avanzar?».</p>
        <ol class="grid gap-2.5 sm:grid-cols-2">${f.cursos.map((c, i) => `
        <li><a href="${esc(safeUrl(c.url))}" target="_blank" rel="noopener" class="panel-flat block h-full p-4 hover:shadow-card-hover transition-shadow">
          <span class="flex items-start gap-3"><span class="font-display text-2xl leading-none accent">${i + 1}</span>
          <span><span class="font-semibold text-sm">${esc(c.nombre)} <span class="mono text-slate-400">↗</span></span>
          <span class="block mono text-[10.5px] text-slate-500 mt-1">${esc(c.proveedor)}${c.gratis ? " · gratis" : ""}</span>
          ${c.nota ? `<span class="block text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">${esc(c.nota)}</span>` : ""}</span></span>
        </a></li>`).join("")}</ol>`;
    } else if (selPane === "proyecto") {
      body = `<p class="font-display text-3xl leading-tight">${esc(f.proyecto.nombre)}</p>
        <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">${esc(f.proyecto.descripcion)}</p>
        <p class="eyebrow mt-5 mb-1">Requisitos del proyecto</p>
        <ul>${f.proyecto.requisitos.map((r, i) => `<li class="py-2.5 border-t hair first:border-t-0">${chk(`${f.id}-proj-${i}`, esc(r))}</li>`).join("")}</ul>`;
    } else if (selPane === "listo") {
      body = `<p class="text-sm text-slate-500 mb-2">Cuando puedas marcar todo esto sin ayuda, pasa a la siguiente fase aunque no hayas terminado todos los cursos.</p>
        <ul>${f.listo.map((r, i) => `<li class="py-2.5 border-t hair first:border-t-0">${chk(`${f.id}-ok-${i}`, esc(r))}</li>`).join("")}</ul>
        ${p < 100 && !f.urgente ? `<button type="button" data-master="${esc(f.id)}" class="btn mt-4">Ya domino esta fase · marcar todos sus pasos</button>` : ""}`;
    } else {
      body = `<div class="grid gap-6 md:grid-cols-2">
        ${f.errores?.length ? `<div><p class="eyebrow mb-2" style="color:var(--warn)">Errores comunes</p><ul>${f.errores.map((e) => `<li class="text-sm py-2 border-t hair first:border-t-0 leading-relaxed">${esc(e)}</li>`).join("")}</ul></div>` : ""}
        ${f.entrevista?.length ? `<div><p class="eyebrow accent mb-2">Te pueden preguntar en entrevista</p><ul>${f.entrevista.map((e) => `<li class="text-sm py-2 border-t hair first:border-t-0 leading-relaxed">${esc(e)}</li>`).join("")}</ul></div>` : ""}
      </div>`;
    }
    return `
      <section id="faseDetail" class="panel scroll-mt-6">
        <div class="p-5 sm:p-7 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] border-b hair">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="eyebrow accent">${esc(f.fase)}</span>
              <span class="chip ${st.cls}">${esc(st.label)}</span>
              ${f.paralela ? '<span class="chip">en paralelo</span>' : ""}
            </div>
            <h3 class="font-display text-4xl sm:text-5xl leading-[1] mt-3 tracking-tight">${esc(f.titulo)}</h3>
            <p class="mono text-[11px] text-slate-500 mt-3">${fmt(f.inicio)} → ${fmt(f.fin)} · ${esc(f.horas)} · ≈${fmtMin(minTotal)} en pasos${f.dashboard && f.dashboard !== "—" ? ` · dashboard: ${esc(f.dashboard)}` : ""}</p>
          </div>
          <div class="grid gap-3 text-sm content-start">
            <p><span class="eyebrow block mb-1">Objetivo</span>${esc(f.objetivo)}</p>
            <p class="text-slate-600 dark:text-slate-300"><span class="eyebrow block mb-1">Por qué importa</span>${esc(f.porQue)}</p>
          </div>
        </div>
        ${UI.bar(p, p === 100)}
        <div class="px-5 sm:px-7 pt-5">
          <div class="seg" role="tablist">${panes.map(([k, l]) => `<button type="button" role="tab" data-pane="${k}" aria-selected="${k === selPane}">${l}</button>`).join("")}</div>
        </div>
        <div class="p-5 sm:p-7 pt-4">${body}</div>
      </section>`;
  }

  function bindRuta(el) {
    const mark = (id, on) => {
      if (on) prog[id] = new Date().toLocaleDateString("en-CA"); else delete prog[id];
      save(LS.RUTA, prog);
      const f = RUTA.find((x) => x.pasos.some((p) => p.id === id));
      if (f && on && pct(f.pasos) === 100) toast(`¡${f.fase} completada!`);
    };
    el.querySelectorAll("input[data-step]").forEach((c) => c.addEventListener("change", (e) => { mark(e.target.dataset.step, e.target.checked); rerender(); }));
    el.querySelectorAll("button[data-done]").forEach((b) => b.addEventListener("click", () => {
      mark(b.dataset.done, true); selFase = null; rerender(); toast("Hecho. Siguiente paso listo.");
    }));
    el.querySelectorAll("[data-sel-fase]").forEach((b) => b.addEventListener("click", () => {
      selFase = b.dataset.selFase; selPane = "pasos"; rerender();
      document.getElementById("faseDetail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    el.querySelectorAll("button[data-pane]").forEach((b) => b.addEventListener("click", () => { selPane = b.dataset.pane; rerender(); }));
    el.querySelectorAll("button[data-master]").forEach((b) => b.addEventListener("click", () => {
      const f = RUTA.find((x) => x.id === b.dataset.master);
      if (!f || !confirm(`¿Marcar todos los pasos de «${f.titulo}» como dominados?`)) return;
      const d = new Date().toLocaleDateString("en-CA");
      f.pasos.forEach((p) => { prog[p.id] = prog[p.id] || d; });
      save(LS.RUTA, prog); selFase = null; rerender(); toast(`${f.fase} marcada como dominada`);
    }));
    el.querySelectorAll("select[data-cert]").forEach((x) => x.addEventListener("change", (e) => {
      const id = e.target.dataset.cert;
      certState[id] = { ...(certState[id] || {}), st: e.target.value };
      save(LS.CERTS, certState); rerender();
      if (e.target.value === "ok") toast("¡Felicidades! Pega el link y súbela a LinkedIn");
    }));
    el.querySelectorAll("input[data-cert-link]").forEach((x) => x.addEventListener("change", (e) => {
      const id = e.target.dataset.certLink;
      certState[id] = { ...(certState[id] || {}), link: e.target.value.trim() };
      save(LS.CERTS, certState); rerender();
    }));
    document.getElementById("rutaExport").addEventListener("click", () => window.APP_BACKUP.share());
    document.getElementById("rutaImport").addEventListener("change", async (e) => {
      try {
        const d = JSON.parse(await e.target.files[0].text());
        if (window.APP_BACKUP && window.APP_BACKUP.restore(d)) return;
        if (d.ruta && typeof d.ruta === "object") prog = Object.assign(prog, d.ruta);
        if (d.vacantes && typeof d.vacantes === "object") vacState = Object.assign(vacState, d.vacantes);
        if (d.notas && typeof d.notas === "object") vacNotes = Object.assign(vacNotes, d.notas);
        if (d.certs && typeof d.certs === "object") { certState = Object.assign(certState, d.certs); save(LS.CERTS, certState); }
        save(LS.RUTA, prog); save(LS.VAC, vacState); save(LS.VAC_NOTES, vacNotes);
        if (d.midia && window.MIDIA) window.MIDIA.importData(d.midia);
        if (d.control && window.CONTROL) window.CONTROL.importData(d.control);
        rerender(); renderVacList(); toast("Respaldo importado");
      } catch { toast("Archivo no válido"); }
    });
  }
  function rerender() { const y = window.scrollY; renderRuta(); window.scrollTo(0, y); }

  /* ==================== INICIO ==================== */
  function init() {
    document.querySelectorAll(".tab-btn").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
    renderVacantesShell();
    renderRuta();
    const [fromHash, sub] = location.hash.replace("#", "").split("/");
    if (fromHash === "control" && sub) setTimeout(() => window.CONTROL?.show(sub), 0);
    setTab(["dia", "empresas", "vacantes", "ruta", "control"].includes(fromHash) ? fromHash : load(LS.TAB, "dia"));
    updateRail();
    // Marca como vistas las vacantes actuales (las que lleguen después aparecerán como NUEVAS).
    save(LS.SEEN, VAC.items.map((v) => v.id));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
