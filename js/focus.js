/* Modo enfoque: temporizador por bloques (25/50 min), pantalla sin distracciones,
 * captura rápida de distracciones (van a Pendientes) y registro de minutos enfocados. */
(function () {
  "use strict";
  const LS = { RUN: "dt2027_focus_run", LOG: "dt2027_focus_log", TAREAS: "dt2027_tareas" };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); } };
  const esc = window.UI.esc;
  const toast = (m) => (typeof window.showToast === "function" ? window.showToast(m) : console.log(m));
  const pad = (n) => String(n).padStart(2, "0");
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

  // run: { label, key, phase: "work"|"break"|"done", dur, endsAt, left (ms, si está en pausa), paused, startedAt, count }
  let run = load(LS.RUN, null);
  let tick = null;

  const left = () => (!run ? 0 : run.paused ? run.left : Math.max(0, run.endsAt - Date.now()));
  const fmt = (ms) => { const s = Math.ceil(ms / 1000); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
  const persist = () => save(LS.RUN, run);

  function logWork(min) {
    if (!run || min < 1) return;
    const log = load(LS.LOG, []);
    log.push({ d: todayIso(), min: Math.round(min), label: run.label, key: run.key || "" });
    save(LS.LOG, log.slice(-2000));
    window.dispatchEvent(new CustomEvent("dt-data"));
  }
  function todayMin() { const t = todayIso(); return load(LS.LOG, []).filter((x) => x.d === t).reduce((a, x) => a + x.min, 0); }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.28, 0.56].forEach((t, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = i === 2 ? 880 : 660; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.24);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.26);
      });
    } catch { /* sin audio */ }
  }
  function notify(msg) {
    try { if ("Notification" in window && Notification.permission === "granted") new Notification("Bitácora'27", { body: msg }); } catch { /* nada */ }
  }

  /* ---------- API ---------- */
  function start(opts) {
    if (run && run.phase === "work" && !confirm(`Ya tienes un bloque en curso («${run.label}»). ¿Reemplazarlo?`)) return;
    if (run && run.phase === "work") stopWork(true);
    const dur = Math.max(1, Math.min(180, Number(opts.min) || 25));
    run = { label: opts.label || "Bloque de enfoque", key: opts.key || "", phase: "work", dur, endsAt: Date.now() + dur * 60000, left: 0, paused: false, startedAt: Date.now(), count: (run?.count || 0) };
    persist(); open(); loop();
    if ("Notification" in window && Notification.permission === "default") { try { Notification.requestPermission(); } catch { /* nada */ } }
  }
  function startBreak(min) {
    run = { ...run, phase: "break", dur: min, endsAt: Date.now() + min * 60000, paused: false, left: 0 };
    persist(); paint(); loop();
  }
  function pause() {
    if (!run || run.phase === "done") return;
    if (run.paused) { run.endsAt = Date.now() + run.left; run.paused = false; } else { run.left = left(); run.paused = true; }
    persist(); paint();
  }
  function addMin(n) {
    if (!run || run.phase === "done") return;
    if (run.paused) run.left += n * 60000; else run.endsAt += n * 60000;
    run.dur += n; persist(); paint();
  }
  function elapsedMin() { return run ? (run.dur * 60000 - left()) / 60000 : 0; }
  function stopWork(silent) {
    if (!run) return;
    if (run.phase === "work") {
      const m = elapsedMin();
      if (m >= 3) { logWork(m); if (!silent) toast(`Registrados ${Math.round(m)} min de enfoque`); }
    }
    run = null; persist(); close(); paint(); clearInterval(tick); tick = null;
  }
  function finishPhase() {
    if (run.phase === "work") {
      logWork(run.dur);
      run = { ...run, phase: "done", count: (run.count || 0) + 1, paused: false };
      persist(); beep(); notify(`Terminaste «${run.label}». Toma un descanso.`); open();
    } else {
      beep(); notify("Se acabó el descanso. ¿Siguiente bloque?");
      run = { ...run, phase: "done", paused: false }; persist(); open();
    }
    paint();
  }
  function loop() {
    clearInterval(tick);
    tick = setInterval(() => {
      if (!run || run.phase === "done") { clearInterval(tick); tick = null; paint(); return; }
      if (!run.paused && left() <= 0) finishPhase();
      paint();
    }, 1000);
  }

  /* ---------- Captura de distracciones ---------- */
  function capture(text) {
    const t = text.trim(); if (!t) return;
    const tareas = load(LS.TAREAS, []);
    tareas.unshift({ id: Date.now().toString(36), t, cat: "Personal", pr: 2, due: "", ok: false, creada: todayIso(), origen: "enfoque" });
    save(LS.TAREAS, tareas);
    window.dispatchEvent(new CustomEvent("dt-data"));
    toast("Anotado en Pendientes. Sigue con tu bloque.");
  }

  /* ---------- UI ---------- */
  const pill = document.createElement("button");
  pill.type = "button"; pill.id = "focusPill"; pill.className = "focus-pill hidden";
  pill.addEventListener("click", () => open());
  const ov = document.createElement("div");
  ov.id = "focusOverlay"; ov.className = "focus-ov hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Modo enfoque");

  function overlayHtml() {
    const top3 = (load("dt2027_top3", {})[todayIso()] || []).filter((x) => x && x.t);
    const ph = run?.phase;
    const sub = ph === "work" ? "Enfocado en" : ph === "break" ? "Descanso" : "Bloque terminado";
    return `
      <div class="focus-in">
        <div class="flex items-center justify-between gap-3">
          <p class="eyebrow accent">Modo enfoque${run?.count ? ` · ${run.count} bloque${run.count === 1 ? "" : "s"} completado${run.count === 1 ? "" : "s"} seguidos` : ""}</p>
          <button type="button" data-f="min" class="btn btn-sm btn-ghost">Minimizar ↘</button>
        </div>
        <p class="eyebrow mt-10">${sub}</p>
        <h2 class="font-display text-3xl sm:text-5xl leading-[1.05] mt-2 tracking-tight">${esc(run?.label || "")}</h2>
        ${ph === "done" ? `
          <p class="font-display text-7xl sm:text-[9rem] leading-none mt-8 accent">Listo.</p>
          <p class="text-sm text-slate-400 mt-4">Marca en <em>Mi día</em> lo que terminaste. Levántate, toma agua y estira 5 minutos.</p>
          <div class="flex flex-wrap gap-2 mt-8">
            <button type="button" data-f="brk" data-m="5" class="btn btn-accent">Descanso 5 min</button>
            <button type="button" data-f="brk" data-m="15" class="btn">Descanso largo 15 min</button>
            <button type="button" data-f="again" class="btn">Otro bloque de 25 min</button>
            <button type="button" data-f="end" class="btn btn-ghost">Cerrar</button>
          </div>` : `
          <p id="focusClock" class="focus-clock font-display mt-6">${fmt(left())}</p>
          <div class="bar mt-2"><i id="focusBar" style="width:0%"></i></div>
          <div class="flex flex-wrap gap-2 mt-8">
            <button type="button" data-f="pause" class="btn btn-accent">${run?.paused ? "▶ Reanudar" : "❚❚ Pausa"}</button>
            <button type="button" data-f="plus" class="btn">+5 min</button>
            <button type="button" data-f="end" class="btn btn-ghost">${ph === "work" ? "Terminar y registrar" : "Saltar descanso"}</button>
          </div>`}
        ${ph === "work" ? `
        <form id="focusCap" class="mt-12 max-w-xl">
          <label class="eyebrow block mb-2" for="focusCapIn">¿Se te ocurrió algo? Anótalo y vuelve al bloque</label>
          <div class="flex gap-2"><input id="focusCapIn" class="field flex-1" placeholder="Ej. contestar correo de Vinculación" autocomplete="off" /><button class="btn" type="submit">Anotar</button></div>
        </form>` : ""}
        ${top3.length ? `<div class="mt-10 max-w-xl"><p class="eyebrow mb-2">Tus 3 de hoy</p><ol class="text-sm space-y-1">${top3.map((x, i) => `<li class="${x.ok ? "line-through text-slate-500" : ""}"><span class="mono accent mr-2">${i + 1}</span>${esc(x.t)}</li>`).join("")}</ol></div>` : ""}
        <p class="mono text-[10.5px] text-slate-500 mt-12">Esc minimiza · Espacio pausa · Hoy llevas ${todayMin()} min enfocados</p>
      </div>`;
  }
  function open() { if (!run) return; ov.innerHTML = overlayHtml(); ov.classList.remove("hidden"); document.body.classList.add("focus-lock"); bindOv(); paint(); }
  function close() { ov.classList.add("hidden"); document.body.classList.remove("focus-lock"); paint(); }
  function bindOv() {
    ov.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => {
      const f = b.dataset.f;
      if (f === "min") close();
      else if (f === "pause") { pause(); open(); }
      else if (f === "plus") addMin(5);
      else if (f === "brk") { startBreak(Number(b.dataset.m)); open(); }
      else if (f === "again") { const l = run.label, k = run.key, c = run.count; run = null; start({ label: l, key: k, min: 25 }); run.count = c; persist(); }
      else if (f === "end") { if (run.phase === "work" && !confirm("¿Terminar este bloque ahora? Se registran los minutos que llevas.")) return; stopWork(); }
    }));
    ov.querySelector("#focusCap")?.addEventListener("submit", (e) => { e.preventDefault(); const i = ov.querySelector("#focusCapIn"); capture(i.value); i.value = ""; i.focus(); });
  }
  function paint() {
    const active = run && run.phase !== "done";
    pill.classList.toggle("hidden", !run || !ov.classList.contains("hidden"));
    if (run) pill.innerHTML = `<span class="dot ${run.paused ? "" : "pulse"}" style="background:${run.phase === "break" ? "var(--ok)" : "var(--accent)"}"></span><span class="mono">${active ? fmt(left()) : "listo"}</span><span class="lbl">${esc(run.phase === "break" ? "Descanso" : run.label)}</span>`;
    const c = document.getElementById("focusClock"); if (c && active) c.textContent = fmt(left());
    const b = document.getElementById("focusBar"); if (b && active) b.style.width = `${Math.min(100, 100 - (left() / (run.dur * 60000)) * 100)}%`;
    if (active) document.title = `${fmt(left())} · ${run.phase === "break" ? "Descanso" : run.label}`;
    else if (document.title.includes(" · ")) document.title = window.__baseTitle || document.title;
  }
  document.addEventListener("keydown", (e) => {
    if (ov.classList.contains("hidden") || !run) return;
    if (e.key === "Escape") close();
    if (e.key === " " && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName) && run.phase !== "done") { e.preventDefault(); pause(); open(); }
  });

  function init() {
    window.__baseTitle = document.title;
    document.body.append(pill, ov);
    if (run) {
      if (run.phase !== "done" && !run.paused && left() <= 0) finishPhase();
      else if (run.phase !== "done") loop();
    }
    paint();
  }
  window.FOCUS = { start, open, todayMin, capture, isActive: () => !!run && run.phase !== "done" };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
