// Genera data/plan_diario.js combinando el SCHEDULE del dashboard con el plan diario de postulación/residencia.
// Uso: node gen_plan.mjs <ruta a data.js del dashboard> <archivo de salida>
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { EXACT, CERT } from "./exact.mjs";

const [, , dataPath, outPath] = process.argv;
const { SCHEDULE } = await import(pathToFileURL(dataPath).href);

// ---------- Tareas de postulación / trámite por día ----------
// t: texto, min: minutos, como: detalle opcional
const J = (t, min, como) => ({ t, min, ...(como ? { como } : {}) });
const JOB = {
  // Semana 4 · Kit de postulación
  "2026-11-23": [
    J("Escribe o ve a Vinculación / División de Estudios: pide requisitos de residencia ene–jun 2027, fechas límite, formatos de carta de aceptación y de anteproyecto, y si aceptan residencia remota.", 30, "Anota las fechas límite en la sección Hitos de esta página (ajústalas con ⚙️) y en tu calendario."),
    J("En la pestaña Empresas marca 20 favoritas: primero Zacatecas y Aguascalientes, luego remotas y las de «Programa Activo».", 20)
  ],
  "2026-11-24": [J("CV v1 en español, 1 página: contacto + links → perfil de 2 líneas → proyectos → habilidades → educación (9° ISC, egreso 2027) → idiomas.", 45, "Sin foto ni barras de «nivel». Pon tus proyectos con link a GitHub aunque sean pequeños. Ver Ruta › URGENTE › paso 2.")],
  "2026-11-25": [J("CV en inglés (traduce y adapta) y pide a un compañero o profesor que revise ambos. Exporta: Nombre_Apellido_CV.pdf y Nombre_Apellido_CV_EN.pdf.", 45)],
  "2026-11-26": [J("LinkedIn completo: foto, titular «Estudiante de ISC · Full Stack C#/.NET en formación · Busco residencia ene–jun 2027», Acerca de, Proyectos y Open to Work.", 35), J("Conecta con 15 personas: reclutadores y desarrolladores de tus empresas favoritas.", 15)],
  "2026-11-27": [J("GitHub: crea el README de perfil (repo con tu usuario), fija 3 repos y escribe README en cada uno (qué hace, captura, cómo correrlo).", 45)],
  "2026-11-28": [J("Pestaña Vacantes: postula a 3 vacantes de encaje alto y cámbiales el estado a «Postulado» con la fecha en la nota.", 35), J("Envía 2 correos con la Plantilla Residencia a empresas favoritas aunque no tengan vacante publicada.", 20)],
  // Semana 5 · Volumen de postulaciones
  "2026-11-30": [J("Escribe tu pitch de 60 s (quién eres → qué sabes hacer → qué buscas → por qué esa empresa) y ensáyalo 5 veces en voz alta.", 20), J("1 postulación o correo nuevo.", 15)],
  "2026-12-01": [J("2 correos a empresas del directorio de tu región con la plantilla (personaliza el primer párrafo con algo real de la empresa).", 25)],
  "2026-12-02": [J("Haz el examen EF SET (50 min). Hoy cuenta como tu bloque de inglés. Guarda el resultado y ponlo en LinkedIn.", 50)],
  "2026-12-03": [J("Seguimiento: correo breve a las postulaciones con 5+ días sin respuesta.", 15, "«Buen día, les escribí el [fecha] sobre la residencia ene–jun 2027. Sigo muy interesado; adjunto de nuevo mi CV. ¡Gracias!»"), J("2 postulaciones nuevas.", 30)],
  "2026-12-04": [J("Prepara respuestas con método STAR a: háblame de ti, un reto que resolviste, un error que cometiste, por qué esta empresa, tus debilidades.", 30)],
  "2026-12-05": [J("Revisa la pestaña Vacantes (la búsqueda automática corre L/Mi/V) y postula a todas las NUEVAS de encaje alto o medio.", 30), J("Llama por teléfono a 2 empresas locales del directorio y pregunta si reciben residentes en enero y a quién enviar el CV.", 20)],
  // Semana 6 · Entrevistas
  "2026-12-07": [J("Revisa correo y LinkedIn; responde en menos de 24 h y agenda entrevistas.", 15), J("2 correos nuevos a empresas que aún no contactas.", 25)],
  "2026-12-08": [J("Simulacro de entrevista técnica: responde en voz alta 3 preguntas de C# (Ruta › Fase 1) y resuelve 1 algoritmo explicando mientras programas.", 30)],
  "2026-12-09": [J("Seguimiento a pendientes + 2 postulaciones.", 30)],
  "2026-12-10": [J("Grábate respondiendo en inglés «Tell me about yourself» (1–2 min) y escúchate.", 20), J("Plan B: pregunta en Vinculación por el Banco de Proyectos de Residencias y cuáles siguen disponibles.", 15)],
  "2026-12-11": [J("SI TIENES OFERTA: pide la carta de aceptación en el formato de tu escuela. SI NO: amplía a remoto y empresas pequeñas locales y envía 5 correos.", 40)],
  "2026-12-12": [J("HITO: revisa tus estados. Meta: al menos 1 entrevista o respuesta positiva. Si no la tienes, habla el lunes con tu coordinador de carrera.", 20)],
  // Semana 7 · Carta y anteproyecto
  "2026-12-14": [J("CON CARTA: pide a tu asesor externo el problema real que resolverás (objetivo, alcance, tecnologías). SIN CARTA: 5 correos más y aplica a un proyecto del Banco de la escuela.", 40)],
  "2026-12-15": [J("Anteproyecto: título, objetivo general, objetivos específicos y justificación (usa el formato de tu escuela).", 45)],
  "2026-12-16": [J("Anteproyecto: cronograma de 500 h por semanas, alcances y limitaciones.", 40)],
  "2026-12-17": [J("Envía el anteproyecto a tu asesor externo para revisión.", 10), J("Seguimiento a postulaciones pendientes.", 15)],
  "2026-12-18": [J("Corrige el anteproyecto y entrégalo con la carta de aceptación en Vinculación (o en la fecha límite que te dieron). Guarda los PDF y el acuse.", 40)],
  "2026-12-19": [J("HITO: documentos entregados. Si aún no tienes lugar: lista 10 empresas nuevas para llamar el lunes y habla con tu coordinador.", 25)],
  // Semana 8 · Vacaciones
  "2026-12-21": [J("Confirma con Vinculación que tu expediente está completo y quién es tu asesor interno.", 15)],
  "2026-12-22": [J("Actualiza CV y LinkedIn con la API que estás construyendo (Fase 5).", 20)],
  "2026-12-23": [J("Si sigues buscando: 3 correos (muchas empresas contestan a inicios de enero).", 20)],
  "2026-12-24": [J("Nochebuena: haz solo el bloque de programación si puedes. El resto pásalo al domingo 27 (máx. 2 h).", 0)],
  "2026-12-25": [J("Navidad: descansa. Puedes recuperar esta sesión el domingo 27.", 0)],
  "2026-12-26": [J("Revisión: ¿qué le falta al inventario para estar listo para la Fase 6?", 15)],
  // Semana 9 · Preparar el inicio
  "2026-12-28": [J("Escribe a tu empresa: fecha y horario de inicio, qué tecnologías usan y si debes llevar tu laptop.", 15)],
  "2026-12-29": [J("Investiga a tu empresa: productos, clientes, stack. Anota 3 cosas para conversar el primer día.", 20)],
  "2026-12-30": [J("README del inventario con capturas y diagrama de arquitectura.", 20)],
  "2026-12-31": [J("Fin de año: sesión ligera (solo programación). Recupera el resto el domingo 3.", 0)],
  "2027-01-01": [J("Año nuevo: descansa. Puedes recuperar esta sesión el domingo 3.", 0)],
  "2027-01-02": [J("Planea enero: escribe las 3 metas de tus primeras semanas en la residencia.", 20)],
  // Semana 10 · Papeles y portafolio
  "2027-01-04": [J("CON LUGAR: reúne documentos del primer día (INE, CURP, NSS, carta de presentación). SIN LUGAR: llama a las empresas que no respondieron.", 30)],
  "2027-01-05": [J("Verifica tu alta en el seguro facultativo del IMSS (suelen pedirlo para la residencia) y tu NSS.", 20)],
  "2027-01-06": [J("Instala en tu laptop las herramientas que usa la empresa (si ya las sabes).", 30)],
  "2027-01-07": [J("Pon el link del inventario desplegado en CV, LinkedIn y README de perfil.", 15)],
  "2027-01-08": [J("Escribe tu plan de las primeras 2 semanas en la empresa: qué aprender, a quién conocer, qué preguntar.", 20)],
  "2027-01-09": [J("Revisa la lista «Estás listo cuando…» de la Fase 6 en la Ruta.", 15)],
  // Semana 11 · Cierre
  "2027-01-11": [J("Crea tu bitácora de residencia (hoja o Markdown: fecha, actividad, horas, evidencia).", 20)],
  "2027-01-12": [J("Repasa las preguntas de entrevista de todas las fases en la Ruta.", 30)],
  "2027-01-13": [J("Grábate explicando tu proyecto en inglés (2 min) y compáralo con tu grabación de diciembre.", 20)],
  "2027-01-14": [J("Repite el EF SET y guarda el certificado (cuenta como bloque de inglés).", 50)],
  "2027-01-15": [J("GitHub final: 3–4 repos fijados, README de perfil y CV actualizados.", 30)],
  "2027-01-16": [J("HITO: fin de la preparación. Exporta el respaldo de esta página y de tu dashboard.", 15)]
};

const HITOS = [
  { date: "2026-11-28", titulo: "Kit de postulación listo", detalle: "CV (ES/EN), LinkedIn, GitHub ordenado." },
  { date: "2026-12-05", titulo: "10+ postulaciones o correos enviados", detalle: "Registrados en la pestaña Vacantes." },
  { date: "2026-12-12", titulo: "Al menos 1 entrevista o respuesta positiva", detalle: "Si no, activa el plan B con tu coordinador." },
  { date: "2026-12-18", titulo: "Carta de aceptación + anteproyecto entregados", detalle: "Ajusta a la fecha límite de tu escuela." },
  { date: "2027-01-09", titulo: "Inventario full stack desplegado", detalle: "Link público en CV y LinkedIn." },
  { date: "2027-01-16", titulo: "Fin de la preparación", detalle: "Semana 11 del dashboard completada." }
];

const strip = (steps = []) => steps.map((s) => ({ t: s.text, min: s.minutes }));
// Pasos de programación con «cómo hacerlo» exacto del día (tools/exact.mjs).
const progItems = (d) => strip(d.program.steps).map((it, i) => (EXACT[d.date]?.c?.[i] ? { ...it, como: EXACT[d.date].c[i] } : it));
const progLinks = (d) => (EXACT[d.date]?.d?.length ? EXACT[d.date].d : d.program.links || []);
const days = SCHEDULE.map((d) => ({
  date: d.date,
  week: d.week,
  dayName: d.dayName,
  title: d.title,
  objective: d.objective,
  deliverable: d.program?.deliverable || "",
  blocks: [
    ...(JOB[d.date] ? [{ key: "res", label: "Residencia y postulación", icon: "🎯", min: JOB[d.date].reduce((a, x) => a + x.min, 0), items: JOB[d.date] }] : []),
    { key: "prog", label: `Programación · ${d.program.focus}`, icon: "💻", min: d.program.minutes, items: progItems(d), links: progLinks(d), ...(EXACT[d.date]?.ok ? { ok: EXACT[d.date].ok } : {}) },
    ...(CERT[d.date] ? [{ key: "cert", label: `Certificación · ${CERT[d.date].n}`, icon: "🏅", min: CERT[d.date].i.reduce((a, x) => a + x.min, 0), items: CERT[d.date].i, links: [CERT[d.date].u] }] : []),
    { key: "algo", label: `Algoritmo #${d.algorithm.number} · ${d.algorithm.title}`, icon: "🧩", min: d.algorithm.minutes, items: strip(d.algorithm.steps), info: `${d.algorithm.level} · ${d.algorithm.language} — ${d.algorithm.description}`, links: [d.algorithm.link] },
    { key: "eng", label: "Inglés técnico", icon: "🗣️", min: d.english.minutes, items: strip(d.english.steps), info: d.english.focus, words: d.english.words || [], links: d.english.link ? [d.english.link] : [] },
    { key: "ai", label: `IA responsable · ${d.ai.title}`, icon: "🤖", min: d.ai.minutes, items: strip(d.ai.steps), info: d.ai.description },
    { key: "rev", label: "Cierre: bitácora y commit", icon: "📝", min: d.review.minutes, items: [...strip(d.review.steps), { t: "Haz `git push` de lo de hoy.", min: 1 }] }
  ]
}));

const out = `/* Generado a partir de tu Dashboard Ruta Full Stack 2027 (data.js) + plan de postulación/residencia.
 * ${days.length} sesiones del ${days[0].date} al ${days.at(-1).date}. No lo edites a mano: vuelve a generarlo. */
window.PLAN_DIARIO = ${JSON.stringify({ hitos: HITOS, days })};
`;
writeFileSync(outPath, out, "utf8");
console.log("OK", days.length, "días,", Object.keys(JOB).length, "con tareas de postulación,", (out.length / 1024).toFixed(0), "KB");
const missing = Object.keys(JOB).filter((k) => !days.some((d) => d.date === k));
missing.push(...[...Object.keys(EXACT), ...Object.keys(CERT)].filter((k) => !days.some((d) => d.date === k)));
console.log("Instrucciones exactas:", Object.keys(EXACT).length, "· bloques CERT:", Object.keys(CERT).length);
if (missing.length) console.log("Fechas de JOB sin sesión:", missing.join(", "));
