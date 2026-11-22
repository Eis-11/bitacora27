/* Seguimiento de postulaciones y contactos: a quién escribiste, por qué medio, cuándo dar seguimiento.
 * Se llena solo cuando marcas una vacante como «Postulado» en la pestaña Vacantes. */
(function () {
  "use strict";
  const UI = window.UI, esc = UI.esc, D = UI.d;
  const KEY = "dt2027_crm";
  const MEDIOS = ["Portal de empleo", "Correo", "LinkedIn", "Teléfono", "Presencial", "Referido", "Vinculación"];
  const EST = {
    enviado: { l: "Enviado", cls: "chip-accent" },
    seguimiento: { l: "Di seguimiento", cls: "chip-warn" },
    respondio: { l: "Respondió", cls: "chip-ok" },
    entrevista: { l: "Entrevista", cls: "chip-ok" },
    oferta: { l: "¡Oferta / carta!", cls: "chip-solid" },
    rechazo: { l: "Rechazo", cls: "chip-bad" },
    sinrespuesta: { l: "Sin respuesta", cls: "" }
  };
  const OPEN = new Set(["enviado", "seguimiento"]);
  const VAC2CRM = { applied: "enviado", interview: "entrevista", offer: "oferta", rejected: "rechazo" };
  let list = UI.load(KEY, []);
  const persist = () => { UI.save(KEY, list); window.dispatchEvent(new CustomEvent("dt-data")); };
  const reload = () => { list = UI.load(KEY, []); };

  // Vacantes → contactos (cuando cambias el estado de una vacante).
  document.addEventListener("change", (e) => {
    const s = e.target.closest?.("select[data-vac]");
    if (!s) return;
    const est = VAC2CRM[s.value];
    if (!est) return;
    reload();
    const v = (window.VACANTES?.items || []).find((x) => x.id === s.dataset.vac);
    let r = list.find((x) => x.vacId === s.dataset.vac);
    if (!r) {
      r = { id: UI.uid(), vacId: s.dataset.vac, empresa: v?.empresa || "Vacante", puesto: v?.titulo || "", contacto: "", medio: "Portal de empleo", fecha: D.today(), seg: D.addDays(D.today(), 5), estado: est, notas: v?.url ? v.url : "" };
      list.unshift(r);
      UI.toast(`Registrado en Control → Postulaciones. Seguimiento: ${D.short(r.seg)}`);
    } else r.estado = est;
    persist();
  }, true);

  function followUps() {
    reload();
    return list.filter((r) => OPEN.has(r.estado) && r.seg).map((r) => ({ date: r.seg, t: `Seguimiento: ${r.empresa}`, sub: `${r.medio}${r.puesto ? " · " + r.puesto : ""}`, tipo: "Seguimiento", cls: "chip-warn" }));
  }
  function stats() {
    reload();
    const n = list.length, resp = list.filter((r) => ["respondio", "entrevista", "oferta", "rechazo"].includes(r.estado)).length;
    const ent = list.filter((r) => ["entrevista", "oferta"].includes(r.estado)).length;
    const due = list.filter((r) => OPEN.has(r.estado) && r.seg && r.seg <= D.today()).length;
    const week = list.filter((r) => r.fecha >= D.monday(D.today())).length;
    return { n, resp, ent, due, week, list };
  }

  const followText = (r) => `Asunto: Seguimiento – residencia profesional ene–jun 2027

Buen día${r.contacto ? " " + r.contacto : ""}:

Les escribí el ${D.short(r.fecha)} sobre ${r.puesto ? `la vacante «${r.puesto}»` : "la posibilidad de realizar mi residencia profesional con ustedes"} (enero–junio 2027). Sigo muy interesado en ${r.empresa}; adjunto nuevamente mi CV y quedo atento a cualquier información o siguiente paso.

¡Muchas gracias por su tiempo!`;

  function html() {
    const t = D.today();
    reload();
    const st = stats();
    const ord = [...list].sort((a, b) => {
      const da = OPEN.has(a.estado) && a.seg && a.seg <= t ? 0 : 1, db = OPEN.has(b.estado) && b.seg && b.seg <= t ? 0 : 1;
      return da - db || (b.fecha || "").localeCompare(a.fecha || "");
    });
    return `
      <section class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div class="panel p-5 sm:p-6">
          <h3 class="sec-title"><span class="eyebrow">Postulaciones y contactos</span><span class="text-sm text-slate-500 font-normal">${st.n} registrados</span></h3>
          <p class="text-sm text-slate-500 mt-2">Las vacantes que marcas como «Postulado» se agregan solas. Aquí anota también correos, llamadas y mensajes de LinkedIn a empresas sin vacante.</p>
          <form id="crmForm" class="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3">
            <input name="empresa" class="field col-span-2 sm:col-span-1" placeholder="Empresa *" required maxlength="80" list="crmEmpresas" autocomplete="off" />
            <input name="contacto" class="field" placeholder="Persona (opcional)" maxlength="80" />
            <select name="medio" class="field" aria-label="Medio">${MEDIOS.map((m) => `<option>${m}</option>`).join("")}</select>
            <input name="puesto" class="field col-span-2 sm:col-span-1" placeholder="Puesto o motivo" maxlength="100" />
            <label class="grid"><span class="sr-only">Fecha</span><input name="fecha" type="date" class="field" value="${t}" /></label>
            <button class="btn btn-primary" type="submit">Registrar</button>
          </form>
          <datalist id="crmEmpresas">${[...new Set([...(window.VACANTES?.items || []).map((v) => v.empresa), ...list.map((r) => r.empresa)])].map((e) => `<option value="${esc(e)}">`).join("")}</datalist>
          <ul class="mt-5">${ord.length ? ord.map((r) => {
            const due = OPEN.has(r.estado) && r.seg && r.seg <= t;
            return `
            <li class="py-4 border-t hair first:border-t-0 ${due ? "crm-due" : ""}">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="font-semibold">${esc(r.empresa)} ${r.puesto ? `<span class="font-normal text-slate-500">· ${esc(r.puesto)}</span>` : ""}</p>
                  <p class="mono text-[11px] text-slate-500 mt-1">${esc(r.medio)}${r.contacto ? " · " + esc(r.contacto) : ""} · ${D.short(r.fecha)} (${D.rel(D.diff(t, r.fecha))})</p>
                </div>
                <select data-crm-est="${r.id}" class="field !w-auto !py-1 text-xs" aria-label="Estado">${Object.entries(EST).map(([k, e]) => `<option value="${k}" ${k === r.estado ? "selected" : ""}>${e.l}</option>`).join("")}</select>
              </div>
              ${due ? `<p class="text-sm mt-2" style="color:var(--warn)"><strong>Toca dar seguimiento</strong> (programado ${D.rel(D.diff(t, r.seg))}).</p>` : ""}
              <div class="mt-2 flex flex-wrap items-center gap-2">
                ${OPEN.has(r.estado) ? `<label class="mono text-[11px] text-slate-500 flex items-center gap-1.5">Seguimiento <input type="date" data-crm-seg="${r.id}" value="${esc(r.seg || "")}" class="field !w-auto !py-1 text-xs" /></label>
                <button type="button" data-crm-done="${r.id}" class="btn btn-sm">✓ Ya di seguimiento</button>
                <button type="button" data-crm-copy="${r.id}" class="btn btn-sm btn-ghost">Copiar correo de seguimiento</button>` : ""}
                <button type="button" data-crm-del="${r.id}" class="btn btn-sm btn-ghost ml-auto" aria-label="Eliminar">×</button>
              </div>
              <textarea data-crm-nota="${r.id}" rows="1" class="field mt-2 text-xs" placeholder="Notas: qué te dijeron, link, próxima acción…">${esc(r.notas || "")}</textarea>
            </li>`; }).join("") : `<li class="text-sm text-slate-500 py-4">Todavía no registras postulaciones. Meta del 5 dic: 10 o más.</li>`}</ul>
        </div>
        <aside class="panel p-5 sm:p-6 grid grid-cols-2 gap-5 lg:sticky lg:top-8">
          ${UI.stat(st.n, "contactos")}
          ${UI.stat(st.week, "esta semana")}
          ${UI.stat(st.n ? Math.round((st.resp / st.n) * 100) + "%" : "—", "te respondieron")}
          ${UI.stat(st.ent, "entrevistas", st.ent ? "text-[color:var(--ok)]" : "")}
          <div class="col-span-2 text-xs text-slate-500 leading-relaxed border-t hair pt-4">
            <p class="eyebrow mb-1">Regla</p>Si en 5 días hábiles no responden, da un seguimiento corto. Si a los 7 días del seguimiento sigue sin respuesta, márcalo «Sin respuesta» y sigue con otras.
          </div>
        </aside>
      </section>`;
  }

  function bind(el, rerender) {
    el.querySelector("#crmForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const empresa = String(f.get("empresa")).trim(); if (!empresa) return;
      reload();
      const prev = list.find((r) => r.empresa.toLowerCase() === empresa.toLowerCase());
      if (prev && !confirm(`Ya registraste a ${prev.empresa} el ${D.short(prev.fecha)} (${EST[prev.estado]?.l}). ¿Registrar otro contacto?`)) return;
      const fecha = String(f.get("fecha")) || D.today();
      list.unshift({ id: UI.uid(), empresa, contacto: String(f.get("contacto")).trim(), medio: String(f.get("medio")), puesto: String(f.get("puesto")).trim(), fecha, seg: D.addDays(fecha, 5), estado: "enviado", notas: "" });
      persist(); rerender(); UI.toast("Registrado. Te recordaré dar seguimiento en 5 días.");
    });
    const find = (id) => list.find((r) => r.id === id);
    el.querySelectorAll("[data-crm-est]").forEach((s) => s.addEventListener("change", () => { const r = find(s.dataset.crmEst); if (r) { r.estado = s.value; persist(); rerender(); } }));
    el.querySelectorAll("[data-crm-seg]").forEach((s) => s.addEventListener("change", () => { const r = find(s.dataset.crmSeg); if (r) { r.seg = s.value; persist(); rerender(); } }));
    el.querySelectorAll("[data-crm-nota]").forEach((s) => s.addEventListener("change", () => { const r = find(s.dataset.crmNota); if (r) { r.notas = s.value; persist(); } }));
    el.querySelectorAll("[data-crm-done]").forEach((b) => b.addEventListener("click", () => {
      const r = find(b.dataset.crmDone); if (!r) return;
      r.estado = "seguimiento"; r.seg = D.addDays(D.today(), 7);
      r.notas = `${r.notas ? r.notas + "\n" : ""}${D.today()}: di seguimiento.`;
      persist(); rerender(); UI.toast("Próximo recordatorio en 7 días");
    }));
    el.querySelectorAll("[data-crm-copy]").forEach((b) => b.addEventListener("click", () => { const r = find(b.dataset.crmCopy); if (r) UI.copy(followText(r)); }));
    el.querySelectorAll("[data-crm-del]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("¿Eliminar este registro?")) return;
      list = list.filter((r) => r.id !== b.dataset.crmDel); persist(); rerender();
    }));
  }

  window.CRM = { html, bind, followUps, stats };
})();
