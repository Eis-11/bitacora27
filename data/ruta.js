/*
 * Ruta paso a paso: de cero a practicante Full Stack (C#/.NET + JavaScript + SQL).
 * Las fechas coinciden con tu "Dashboard Ruta Full Stack 2027" (semanas 1–11, 3 nov 2026 – 16 ene 2027),
 * donde está el detalle día por día. Esta ruta es el MAPA: qué aprender, con qué curso, qué entregar
 * y cómo saber que ya estás listo. Después continúa durante la residencia (ene–jun 2027).
 *
 * Esquema de cada fase:
 *  id, fase, titulo, inicio, fin (AAAA-MM-DD), dashboard (semanas), horas, urgente?, paralela?,
 *  objetivo, porQue, pasos[{id, texto, min, como}], cursos[{nombre,url,proveedor,gratis,nota}],
 *  proyecto{nombre, descripcion, requisitos[]}, listo[] (autoevaluación), errores[], entrevista[]
 * Los "id" son estables: tu progreso se guarda con ellos.
 */
window.RUTA_RUTINA = [
  { bloque: "Programación", min: 110, detalle: "Tema del día del dashboard + proyecto de la fase." },
  { bloque: "Algoritmos", min: 50, detalle: "1 problema: entender, pseudocódigo, código, 3 pruebas." },
  { bloque: "Inglés técnico", min: 45, detalle: "Vocabulario, lectura de docs, listening y explicar en voz alta." },
  { bloque: "IA responsable", min: 25, detalle: "Usa IA para que te EXPLIQUE y te dé pistas, no para que haga la tarea." },
  { bloque: "Bitácora + commit", min: 10, detalle: "Qué aprendí, qué me atoró, siguiente paso. Termina con git push." }
];

window.RUTA_REGLAS = [
  "Si te atoras 20 min: relee el error, busca en la documentación oficial. A los 40 min: pide ayuda (foro, compañero o IA explicándote, no resolviéndote).",
  "Si te atrasas: NO saltes los proyectos. Recorta ejercicios repetitivos y usa el domingo solo para ponerte al día (máx. 2 h).",
  "Marca un paso solo cuando puedas hacerlo de nuevo sin ver el tutorial.",
  "Todo lo que hagas termina en GitHub. Un día sin commit es un día que el reclutador no ve.",
  "Prioridad cuando no alcanza el tiempo: 1) postulación/trámite de residencia, 2) proyecto de la fase, 3) curso, 4) algoritmos, 5) inglés."
];

window.RUTA = [
  {
    id: "p",
    fase: "URGENTE",
    titulo: "Conseguir tu lugar de residencia",
    inicio: "2026-11-21",
    fin: "2026-12-19",
    dashboard: "En paralelo a semanas 3–7",
    horas: "45–60 min diarios",
    urgente: true,
    paralela: true,
    objetivo: "Tener carta de aceptación de una empresa antes de vacaciones de diciembre para iniciar la residencia en enero.",
    porQue: "Las empresas cierran sus decisiones de practicantes para enero entre finales de noviembre y mediados de diciembre. Si esperas a «terminar de aprender», se te va el periodo. Postula YA con lo que tienes y sigue aprendiendo.",
    pasos: [
      { id: "p-1", min: 60, texto: "Ve a Vinculación / División de Estudios de tu escuela y pide: requisitos de residencia ene–jun 2027, fechas límite, formato de anteproyecto y el Banco de Proyectos.", como: "Pregunta exactamente: ¿cuál es la fecha límite para entregar la carta de aceptación y el anteproyecto?, ¿aceptan residencia remota?, ¿cuántas horas son (normalmente 500)?, ¿quién será mi asesor interno? Anota todo en la bitácora." },
      { id: "p-2", min: 120, texto: "Haz tu CV de 1 página en español (y otra versión en inglés).", como: "Orden: datos de contacto + links (GitHub, LinkedIn) → Perfil de 2 líneas → Proyectos (los que ya tienes: consola C#, página personal) con stack y link → Habilidades → Educación (9° semestre ISC, fecha de egreso) → Idiomas. Sin foto, sin barras de «nivel de habilidad». Exporta a PDF: Nombre_Apellido_CV.pdf." },
      { id: "p-3", min: 60, texto: "Completa LinkedIn: foto, titular «Estudiante de ISC · Desarrollador Full Stack C#/.NET en formación · Buscando residencia ene–jun 2027», Open to Work.", como: "Agrega tus proyectos en la sección Proyectos con link a GitHub. Conecta con reclutadores de las empresas de tu directorio." },
      { id: "p-4", min: 60, texto: "Ordena tu GitHub: README de perfil, fija 3 repos, cada repo con README (qué hace, captura, cómo correrlo).", como: "Crea un repo con tu mismo nombre de usuario para el README de perfil. Aunque los proyectos sean pequeños, un README bien hecho da buena impresión." },
      { id: "p-5", min: 30, texto: "Prepara tu pitch de 60 segundos y personaliza la Plantilla Residencia (botón arriba en la página).", como: "Estructura: quién eres → qué sabes hacer (proyectos concretos) → qué buscas (residencia ene–jun, 500 h) → por qué esa empresa. Practícalo en voz alta 5 veces." },
      { id: "p-6", min: 300, texto: "Postula a 5 vacantes por semana (pestaña Vacantes) y escribe a 5 empresas del directorio aunque no tengan vacante publicada.", como: "Registra cada envío con estado «Postulado» y la fecha en la nota. Escribe a las favoritas por correo con la plantilla: muchas empresas de residencias no publican vacante, responden a correos directos." },
      { id: "p-7", min: 60, texto: "Seguimiento: a los 5–7 días hábiles sin respuesta, envía un correo breve de seguimiento.", como: "«Buen día, les escribí el [fecha] sobre la residencia ene–jun 2027. Sigo muy interesado; adjunto de nuevo mi CV. ¡Gracias!»" },
      { id: "p-8", min: 90, texto: "Al recibir respuesta positiva: pide la carta de aceptación en el formato de tu escuela y redacta el anteproyecto con tu asesor externo.", como: "El anteproyecto suele llevar: nombre del proyecto, objetivo general y específicos, justificación, cronograma de 500 h y alcances. Pide al asesor de la empresa el problema real que vas a resolver." },
      { id: "p-9", min: 30, texto: "Entrega carta de aceptación + anteproyecto en Vinculación antes de la fecha límite y confirma tu asesor interno.", como: "Guarda copias en PDF de todo lo entregado y una foto del acuse." }
    ],
    cursos: [
      { nombre: "Guía de LinkedIn para estudiantes", url: "https://university.linkedin.com/", proveedor: "LinkedIn", gratis: true },
      { nombre: "Perfil de GitHub con README", url: "https://docs.github.com/es/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme", proveedor: "GitHub Docs", gratis: true },
      { nombre: "Tech Interview Handbook — CV", url: "https://www.techinterviewhandbook.org/resume/", proveedor: "Tech Interview Handbook", gratis: true, nota: "En inglés; muy práctico." }
    ],
    proyecto: { nombre: "Kit de postulación", descripcion: "Todo lo que necesitas para postular en 5 minutos.", requisitos: ["CV PDF español e inglés", "LinkedIn completo con Open to Work", "GitHub con 3 repos fijados y README", "Plantilla de correo personalizada", "Lista de 20 empresas objetivo marcadas como favoritas"] },
    listo: ["Tengo carta de aceptación firmada", "Entregué el anteproyecto en mi escuela", "Conozco a mi asesor interno y externo"],
    errores: ["Esperar a «sentirse listo» para postular.", "Mandar el mismo correo genérico sin el nombre de la empresa.", "No dar seguimiento.", "No preguntar en la escuela las fechas límite."],
    entrevista: ["Háblame de ti.", "¿Por qué quieres hacer tu residencia con nosotros?", "Cuéntame de un proyecto que hayas hecho y qué fue lo más difícil.", "¿Cuánto tiempo puedes dedicar? ¿Puedes presencial?"]
  },
  {
    id: "f0",
    fase: "Fase 0",
    titulo: "Entorno de trabajo y método de estudio",
    inicio: "2026-11-03",
    fin: "2026-11-04",
    dashboard: "Semana 1 (días 1–2)",
    horas: "4–6 h",
    objetivo: "Computadora lista y un hábito diario de estudio con bitácora.",
    porQue: "Los practicantes que no dominan su entorno pierden horas en cosas que no son programar. En la empresa te darán una máquina y esperarán que la configures solo.",
    pasos: [
      { id: "f0-1", min: 60, texto: "Instala VS Code, .NET SDK 8 o superior, Node.js LTS y Git. Comprueba con `dotnet --info`, `node -v`, `git --version`.", como: "Extensiones de VS Code: C# Dev Kit, Live Server, GitLens, Prettier, SQL Server (mssql)." },
      { id: "f0-2", min: 30, texto: "Crea tu cuenta de GitHub con nombre profesional y configura `git config --global user.name` y `user.email`.", como: "Usa el mismo correo de GitHub en Git. Activa la verificación en dos pasos." },
      { id: "f0-3", min: 45, texto: "Domina 10 comandos de terminal: cd, ls/dir, mkdir, rm, cp, mv, cat/type, clear, `code .`, `git status`.", como: "Reto: crea una carpeta de proyecto, archivos dentro, muévelos y bórralos sin usar el explorador de archivos." },
      { id: "f0-4", min: 30, texto: "Crea el repo «bitacora» y escribe tu primera entrada (qué aprendí, qué me atoró, siguiente paso).", como: "Un archivo por semana: semana-01.md. Este repo es tu evidencia para la escuela y los reclutadores." }
    ],
    cursos: [
      { nombre: "Instalar .NET en Windows", url: "https://learn.microsoft.com/es-es/dotnet/core/install/windows", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "CS50x — Semana 0 (lógica)", url: "https://cs50.harvard.edu/x/", proveedor: "Harvard", gratis: true, nota: "Opcional si sientes floja la lógica." }
    ],
    proyecto: { nombre: "Repositorio «bitacora»", descripcion: "Tu diario de aprendizaje público.", requisitos: ["README con tu plan", "Una entrada por día de estudio"] },
    listo: ["Creo una carpeta, la abro en VS Code, inicio Git y la subo a GitHub sin buscar cómo."],
    errores: ["Instalar mil extensiones y herramientas en lugar de empezar a programar."],
    entrevista: ["¿Qué herramientas usas para desarrollar?"]
  },
  {
    id: "f1",
    fase: "Fase 1",
    titulo: "Lógica de programación con C#",
    inicio: "2026-11-03",
    fin: "2026-11-14",
    dashboard: "Semanas 1–2",
    horas: "20–25 h",
    objetivo: "Variables, condiciones, ciclos, métodos, colecciones, excepciones y POO básica en C#.",
    porQue: "Es la base de todo el backend .NET que usarás en la residencia. Las preguntas técnicas de practicante casi siempre son de estos temas.",
    pasos: [
      { id: "f1-1", min: 180, texto: "Tipos (`int`, `double`, `decimal`, `string`, `bool`), operadores y entrada/salida con `Console.ReadLine` + `TryParse`.", como: "Ejercicio: calculadora que nunca truena aunque el usuario escriba letras." },
      { id: "f1-2", min: 240, texto: "Condiciones (`if`, `switch`) y ciclos (`for`, `while`, `foreach`).", como: "Ejercicios: número primo, tabla de multiplicar, adivina el número, FizzBuzz." },
      { id: "f1-3", min: 180, texto: "Métodos: parámetros, retorno, sobrecarga; excepciones con `try/catch`.", como: "Refactoriza la calculadora: un método por operación y validación centralizada." },
      { id: "f1-4", min: 240, texto: "Arreglos, `List<T>`, `Dictionary<K,V>`, cadenas y LINQ básico (`Where`, `Select`, `OrderBy`).", como: "Ejercicio: lista de calificaciones → promedio, máxima, mínima, aprobados con LINQ." },
      { id: "f1-5", min: 300, texto: "POO: clases, propiedades, constructores, encapsulamiento, herencia e interfaces.", como: "Modela Producto, Categoría e Inventario (te servirá para el proyecto final)." },
      { id: "f1-6", min: 120, texto: "Depuración: breakpoints, ejecución paso a paso y ventana de variables en VS Code.", como: "Introduce un error a propósito y encuéntralo solo con el depurador." }
    ],
    cursos: [
      { nombre: "Foundational C# with Microsoft (certificado)", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", proveedor: "freeCodeCamp + Microsoft", gratis: true, nota: "Prioridad #1: certificado gratis para tu CV." },
      { nombre: "Tutoriales de C#", url: "https://learn.microsoft.com/es-es/dotnet/csharp/", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "Exercism — C# track (ejercicios con mentoría)", url: "https://exercism.org/tracks/csharp", proveedor: "Exercism", gratis: true }
    ],
    proyecto: { nombre: "Sistema de estudiantes (consola)", descripcion: "CRUD en consola con clases y persistencia en JSON.", requisitos: ["Agregar, buscar, editar y borrar", "Guardar y cargar de archivo JSON", "Validación de entradas", "README con capturas"] },
    listo: ["Escribo sin ayuda un programa con clases, listas y validación.", "Explico la diferencia entre clase y objeto, y entre List y Dictionary.", "Uso el depurador para encontrar errores."],
    errores: ["Copiar código del video sin escribirlo tú.", "Saltarte la POO porque «luego la veo»."],
    entrevista: ["¿Qué es encapsulamiento?", "¿Diferencia entre interfaz y clase abstracta?", "¿Qué es una excepción y cuándo la usas?", "¿Value type vs reference type?"]
  },
  {
    id: "f2",
    fase: "Fase 2",
    titulo: "Git y GitHub como en una empresa",
    inicio: "2026-11-16",
    fin: "2026-11-28",
    dashboard: "Uso diario (formal en semana 10)",
    horas: "6–8 h",
    paralela: true,
    objetivo: "Ramas, commits claros, pull requests y resolución de conflictos.",
    porQue: "Desde el día 1 de la residencia vas a trabajar con ramas y pull requests. Hazlo desde ahora en todos tus proyectos; no lo dejes para la semana 10.",
    pasos: [
      { id: "f2-1", min: 60, texto: "Ciclo diario: `add`, `commit`, `push`, `pull` con mensajes en imperativo («Agrega validación de correo»).", como: "Regla: un commit por cambio lógico, no un commit gigante al final del día." },
      { id: "f2-2", min: 90, texto: "Ramas: `git switch -c`, `merge` y resolver un conflicto provocado a propósito.", como: "Edita la misma línea en dos ramas y haz merge. Resuelve en VS Code." },
      { id: "f2-3", min: 60, texto: "Pull requests: trabaja cada funcionalidad en una rama y fusiónala con PR.", como: "Describe en el PR: qué cambia, cómo probarlo y una captura." },
      { id: "f2-4", min: 45, texto: "`.gitignore` (bin/, obj/, node_modules/, .env) y nunca subir contraseñas.", como: "Usa la plantilla oficial de .gitignore para VisualStudio." }
    ],
    cursos: [
      { nombre: "GitHub Skills — Introduction to GitHub", url: "https://github.com/skills/introduction-to-github", proveedor: "GitHub", gratis: true },
      { nombre: "Learn Git Branching (interactivo)", url: "https://learngitbranching.js.org/?locale=es_AR", proveedor: "Open source", gratis: true },
      { nombre: "Pro Git (libro en español)", url: "https://git-scm.com/book/es/v2", proveedor: "git-scm", gratis: true }
    ],
    proyecto: { nombre: "Historial limpio", descripcion: "Todos tus proyectos con historial profesional.", requisitos: ["10+ commits con buenos mensajes por proyecto", "Al menos 2 PR fusionados", ".gitignore correcto"] },
    listo: ["Resuelvo un conflicto de merge sin miedo.", "Trabajo cada funcionalidad en su rama."],
    errores: ["Subir bin/ y obj/ o contraseñas.", "Commits tipo «cambios» o «ya quedó»."],
    entrevista: ["¿Diferencia entre merge y rebase?", "¿Qué haces si tienes un conflicto?"]
  },
  {
    id: "f3",
    fase: "Fase 3",
    titulo: "Frontend: HTML, CSS y JavaScript",
    inicio: "2026-11-16",
    fin: "2026-12-05",
    dashboard: "Semanas 3–5",
    horas: "45–50 h",
    objetivo: "Interfaces responsivas y accesibles, manipulación del DOM y consumo de APIs con fetch.",
    porQue: "Casi todas las vacantes «full stack» piden poder hacer la pantalla además de la API. Y tu portafolio necesita algo que se vea.",
    pasos: [
      { id: "f3-1", min: 240, texto: "HTML semántico y formularios (labels, tipos de input, validación nativa, accesibilidad).", como: "Pasa tu página por Lighthouse (F12 → Lighthouse) y llega a 90+ en accesibilidad." },
      { id: "f3-2", min: 360, texto: "CSS: modelo de caja, Flexbox, Grid y responsive con media queries.", como: "Juega Flexbox Froggy y Grid Garden; luego maqueta tu página personal en móvil y escritorio." },
      { id: "f3-3", min: 300, texto: "JavaScript: variables, funciones, condicionales, ciclos, arreglos y objetos (`map`, `filter`, `reduce`).", como: "Rehaz en JS 5 ejercicios que ya resolviste en C#: verás que la lógica es la misma." },
      { id: "f3-4", min: 300, texto: "DOM y eventos: crear, modificar y eliminar elementos; validar formularios.", como: "Calculadora visual y luego gestor de tareas (semana 5 del dashboard)." },
      { id: "f3-5", min: 180, texto: "JSON, `localStorage`, promesas, `async/await` y `fetch` contra una API pública.", como: "Muestra en tarjetas datos de una API pública (ej. PokeAPI) con estados de carga y error." },
      { id: "f3-6", min: 60, texto: "Publica en GitHub Pages tu página personal y el gestor de tareas.", como: "Settings → Pages → rama main. Pon el link en tu CV y LinkedIn." }
    ],
    cursos: [
      { nombre: "Responsive Web Design (certificado)", url: "https://www.freecodecamp.org/learn/", proveedor: "freeCodeCamp", gratis: true },
      { nombre: "JavaScript Algorithms and Data Structures (certificado)", url: "https://www.freecodecamp.org/learn/", proveedor: "freeCodeCamp", gratis: true },
      { nombre: "MDN — Aprende desarrollo web", url: "https://developer.mozilla.org/es/docs/Learn", proveedor: "Mozilla", gratis: true, nota: "Tu referencia diaria." },
      { nombre: "javascript.info (en español)", url: "https://es.javascript.info/", proveedor: "javascript.info", gratis: true },
      { nombre: "Flexbox Froggy / Grid Garden", url: "https://flexboxfroggy.com/#es", proveedor: "Codepip", gratis: true }
    ],
    proyecto: { nombre: "Página personal + Gestor de tareas", descripcion: "Dos sitios publicados en GitHub Pages.", requisitos: ["Responsive (móvil y escritorio)", "Gestor con agregar, completar, borrar, filtrar y localStorage", "Lighthouse 90+ en accesibilidad", "Publicados con link"] },
    listo: ["Maqueto un diseño desde cero sin frameworks.", "Consumo una API y muestro los datos con estados de carga y error.", "Explico qué es el DOM y cómo funciona un evento."],
    errores: ["Pasar semanas perfeccionando el CSS.", "Saltarte JavaScript puro para ir directo a React."],
    entrevista: ["¿Diferencia entre let, const y var?", "¿Qué es el DOM?", "¿Qué hace async/await?", "¿Flexbox vs Grid, cuándo usas cada uno?"]
  },
  {
    id: "f4",
    fase: "Fase 4",
    titulo: "Bases de datos y SQL Server",
    inicio: "2026-12-07",
    fin: "2026-12-12",
    dashboard: "Semana 6",
    horas: "18–20 h",
    objetivo: "Modelar tablas relacionadas y consultar con JOIN, agrupaciones y transacciones.",
    porQue: "En casi cualquier residencia vas a tocar una base de datos existente. Saber leer y escribir SQL te hace útil desde la primera semana.",
    pasos: [
      { id: "f4-1", min: 120, texto: "Modelo entidad-relación, llaves primarias y foráneas, normalización hasta 3FN.", como: "Dibuja en draw.io el modelo del inventario: Producto, Categoría, Proveedor, Movimiento." },
      { id: "f4-2", min: 120, texto: "Instala SQL Server Express (o con Docker) y SQL Server Management Studio o la extensión mssql.", como: "Crea la base de datos Inventario con un script .sql guardado en el repo." },
      { id: "f4-3", min: 180, texto: "SELECT, WHERE, ORDER BY, INSERT, UPDATE, DELETE.", como: "Inserta 30 productos de prueba y practica consultas." },
      { id: "f4-4", min: 180, texto: "Agregados, GROUP BY, HAVING, INNER/LEFT JOIN entre 3+ tablas.", como: "Reportes: stock por categoría, productos sin movimientos, top 5 más vendidos." },
      { id: "f4-5", min: 90, texto: "Transacciones, índices y restricciones (CHECK, UNIQUE).", como: "Registra una venta que descuente stock dentro de una transacción." }
    ],
    cursos: [
      { nombre: "Get started querying with Transact-SQL", url: "https://learn.microsoft.com/es-es/training/paths/get-started-querying-with-transact-sql/", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "SQLBolt (ejercicios interactivos)", url: "https://sqlbolt.com/", proveedor: "SQLBolt", gratis: true },
      { nombre: "HackerRank — SQL", url: "https://www.hackerrank.com/domains/sql", proveedor: "HackerRank", gratis: true, nota: "Saca el certificado SQL (Basic)." }
    ],
    proyecto: { nombre: "Base de datos del inventario", descripcion: "Script reproducible y diagrama.", requisitos: ["Script de creación + datos de prueba", "Diagrama ER en el README", "10 consultas de reporte documentadas"] },
    listo: ["Resuelvo SQL Basic y Medium de HackerRank.", "Explico qué es una llave foránea y un LEFT JOIN."],
    errores: ["Guardar todo en una sola tabla.", "No guardar los scripts en el repo."],
    entrevista: ["¿INNER JOIN vs LEFT JOIN?", "¿Qué es normalizar?", "¿WHERE vs HAVING?", "¿Qué es una transacción?"]
  },
  {
    id: "f5",
    fase: "Fase 5",
    titulo: "Backend: ASP.NET Core Web API + Entity Framework Core",
    inicio: "2026-12-14",
    fin: "2026-12-26",
    dashboard: "Semanas 7–8",
    horas: "40 h",
    objetivo: "API REST con CRUD, validaciones, EF Core sobre SQL Server y documentación Swagger.",
    porQue: "Es el corazón del perfil .NET que buscan Paylocity, consultoras y bancos. Con esta fase ya puedes decir «sé hacer backend».",
    pasos: [
      { id: "f5-1", min: 120, texto: "HTTP: métodos, códigos de estado, JSON y diseño REST.", como: "Prueba una API pública con Postman o un archivo `.http` en VS Code." },
      { id: "f5-2", min: 300, texto: "Crea la Web API con `dotnet new webapi`: endpoints GET, POST, PUT, DELETE de productos.", como: "Devuelve los códigos correctos: 200, 201, 204, 400, 404." },
      { id: "f5-3", min: 120, texto: "Validación con DataAnnotations, manejo de errores y Swagger.", como: "Ningún dato inválido debe llegar a la base de datos." },
      { id: "f5-4", min: 360, texto: "Entity Framework Core: DbContext, entidades, relaciones 1-N y migraciones.", como: "`dotnet ef migrations add Inicial` y `dotnet ef database update`." },
      { id: "f5-5", min: 180, texto: "DTOs, inyección de dependencias y capa de servicios.", como: "El controlador no debe tocar el DbContext directamente: usa un servicio." },
      { id: "f5-6", min: 180, texto: "(Extra) Autenticación con JWT: registro e inicio de sesión.", como: "Protege POST/PUT/DELETE; deja GET público." }
    ],
    cursos: [
      { nombre: "Create web apps and services with ASP.NET Core", url: "https://learn.microsoft.com/es-es/training/paths/aspnet-core-web-app/", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "Tutorial: Web API con controladores", url: "https://learn.microsoft.com/es-es/aspnet/core/tutorials/first-web-api", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "EF Core — Introducción", url: "https://learn.microsoft.com/es-es/ef/core/get-started/overview/first-app", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "Postman API Fundamentals Student Expert", url: "https://academy.postman.com/", proveedor: "Postman Academy", gratis: true, nota: "Insignia gratis para el CV." }
    ],
    proyecto: { nombre: "API del inventario", descripcion: "Backend completo documentado.", requisitos: ["CRUD de productos y categorías", "EF Core + SQL Server con migraciones", "Validaciones y errores consistentes", "Swagger y colección de Postman", "README con cómo correrla"] },
    listo: ["Otra persona clona mi repo y corre la API siguiendo el README.", "Explico qué es inyección de dependencias y para qué sirve un DTO."],
    errores: ["Exponer las entidades de EF directamente.", "Poner la cadena de conexión con contraseña en GitHub."],
    entrevista: ["¿Qué es REST?", "¿Diferencia entre PUT y PATCH?", "¿Qué es una migración?", "¿Qué es inyección de dependencias?"]
  },
  {
    id: "f6",
    fase: "Fase 6",
    titulo: "Integración Full Stack, pruebas, Docker y despliegue",
    inicio: "2026-12-28",
    fin: "2027-01-09",
    dashboard: "Semanas 9–10",
    horas: "35–40 h",
    objetivo: "Conectar frontend con API, escribir pruebas, empaquetar con Docker y publicar.",
    porQue: "Un proyecto desplegado con pruebas y CI es lo que separa tu CV del de los demás practicantes.",
    pasos: [
      { id: "f6-1", min: 300, texto: "Frontend consume tu API: CORS, listar, crear, editar y borrar productos con estados de carga y error.", como: "Semana 9 del dashboard. Usa el gestor de tareas como base visual." },
      { id: "f6-2", min: 180, texto: "Pruebas unitarias con xUnit para la capa de servicios.", como: "Mínimo: casos válidos, inválidos y límite para crear y actualizar producto." },
      { id: "f6-3", min: 240, texto: "Dockerfile para API y frontend, y `compose.yaml` con SQL Server.", como: "`docker compose up` debe levantar todo con un solo comando." },
      { id: "f6-4", min: 90, texto: "GitHub Actions: compilar y correr pruebas en cada push.", como: "Pon el badge verde de CI en el README." },
      { id: "f6-5", min: 180, texto: "Despliega (Azure for Students, Render o Railway) y pon el link en README, CV y LinkedIn.", como: "Azure for Students da crédito sin tarjeta con tu correo escolar." }
    ],
    cursos: [
      { nombre: "Pruebas unitarias con xUnit", url: "https://learn.microsoft.com/es-es/dotnet/core/testing/unit-testing-with-dotnet-test", proveedor: "Microsoft Learn", gratis: true },
      { nombre: "Docker — Get started", url: "https://docs.docker.com/get-started/", proveedor: "Docker Docs", gratis: true },
      { nombre: "GitHub Skills — Hello GitHub Actions", url: "https://github.com/skills/hello-github-actions", proveedor: "GitHub", gratis: true },
      { nombre: "Azure for Students", url: "https://azure.microsoft.com/es-mx/free/students/", proveedor: "Microsoft", gratis: true }
    ],
    proyecto: { nombre: "⭐ Sistema de inventario Full Stack", descripcion: "Tu proyecto estrella para entrevistas.", requisitos: ["Frontend + API + SQL Server integrados", "Pruebas unitarias y CI en verde", "Docker Compose funcionando", "Desplegado con link público", "README con arquitectura, capturas y cómo correrlo"] },
    listo: ["Tengo un link público funcionando que puedo enseñar en una entrevista.", "Explico la arquitectura de mi proyecto en 2 minutos."],
    errores: ["Dejar el despliegue para «después».", "README vacío."],
    entrevista: ["Explícame la arquitectura de tu proyecto.", "¿Qué es CORS?", "¿Para qué sirve Docker?", "¿Qué probaste y cómo?"]
  },
  {
    id: "f7",
    fase: "Fase 7",
    titulo: "Algoritmos, inglés y entrevistas (diario) + simulación final",
    inicio: "2026-11-03",
    fin: "2027-01-16",
    dashboard: "Diario + semana 11",
    horas: "1.5 h diaria",
    paralela: true,
    objetivo: "Pasar filtros técnicos y de inglés, y llegar a la residencia sabiendo explicar tu trabajo.",
    porQue: "Muchas empresas filtran con un ejercicio tipo HackerRank y una entrevista con preguntas en inglés.",
    pasos: [
      { id: "f7-1", min: 30, texto: "Haz hoy el examen EF SET para saber tu nivel de inglés real.", como: "Repítelo en la semana 11 para medir avance. Pon el certificado en LinkedIn." },
      { id: "f7-2", min: 1500, texto: "Algoritmos: 1 problema diario de los 65 del dashboard (arreglos, strings, hash maps, dos punteros, recursión, ordenamientos).", como: "Siempre: entender → pseudocódigo → código → 3 pruebas → complejidad Big O." },
      { id: "f7-3", min: 60, texto: "Saca el certificado HackerRank Problem Solving (Basic).", como: "Hazlo cuando resuelvas 3 problemas fáciles seguidos en menos de 20 min cada uno." },
      { id: "f7-4", min: 600, texto: "Inglés técnico: curso A2 for Developers y explicar en voz alta lo que hiciste cada día.", como: "Grábate 2 minutos explicando tu proyecto en inglés cada domingo." },
      { id: "f7-5", min: 120, texto: "Simulacro de entrevista: pide a alguien (o a una IA) que te haga las preguntas de entrevista de cada fase.", como: "Usa el método STAR: Situación, Tarea, Acción, Resultado." },
      { id: "f7-6", min: 300, texto: "Semana 11: refactoriza, documenta, explica tu arquitectura en inglés y resuelve un requerimiento sorpresa.", como: "Es tu ensayo de cómo será trabajar en la empresa." }
    ],
    cursos: [
      { nombre: "EF SET (certificado gratis)", url: "https://www.efset.org/es/english-certificate/", proveedor: "EF", gratis: true },
      { nombre: "A2 English for Developers (certificado)", url: "https://www.freecodecamp.org/learn/", proveedor: "freeCodeCamp", gratis: true },
      { nombre: "HackerRank Skills Verification", url: "https://www.hackerrank.com/skills-verification", proveedor: "HackerRank", gratis: true },
      { nombre: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", proveedor: "NeetCode", gratis: true, nota: "Cuando termines los 65 del dashboard." }
    ],
    proyecto: { nombre: "Repo «algoritmos»", descripcion: "Tus soluciones organizadas.", requisitos: ["Una carpeta por tema", "Cada solución con explicación y complejidad"] },
    listo: ["Resuelvo un problema fácil en menos de 20 min explicando en voz alta.", "Me presento y explico mi proyecto en inglés 2 minutos."],
    errores: ["Ver la solución a los 5 minutos.", "Dejar el inglés porque «no es programación»."],
    entrevista: ["Invierte una cadena.", "Encuentra duplicados en un arreglo.", "Tell me about yourself.", "What was the hardest bug you fixed?"]
  },
  {
    id: "f8",
    fase: "Fase 8",
    titulo: "Primeras semanas de residencia",
    inicio: "2027-01-18",
    fin: "2027-02-28",
    dashboard: "—",
    horas: "Tu jornada + 3 h/semana",
    objetivo: "Integrarte al equipo, entender su código y entregar tu primera tarea real.",
    porQue: "Las primeras 6 semanas definen si te dan proyectos importantes y si al final te ofrecen trabajo.",
    pasos: [
      { id: "f8-1", min: 120, texto: "Semana 1: configura el entorno de la empresa, lee la documentación y aprende su flujo (tickets, ramas, code review).", como: "Haz una lista de dudas y resuélvelas en un bloque con tu líder, no a cada rato." },
      { id: "f8-2", min: 60, texto: "Lleva una bitácora semanal de actividades y horas (la pide la escuela para los reportes).", como: "Fecha, actividad, horas, evidencia. Al final suma tus 500 h." },
      { id: "f8-3", min: 240, texto: "Pide una tarea pequeña (bug o mejora) y entrégala con PR bien descrito.", como: "Primera impresión: entrega a tiempo y pregunta antes de bloquearte más de medio día." },
      { id: "f8-4", min: 120, texto: "Ajusta el anteproyecto con tu asesor externo si el proyecto cambió.", como: "Avisa a tu asesor interno de cualquier cambio." },
      { id: "f8-5", min: 60, texto: "Entrega tu primer reporte parcial de residencia en la fecha que marque tu escuela.", como: "Usa tu bitácora como base." }
    ],
    cursos: [
      { nombre: "Cómo hacer code review (Google eng-practices)", url: "https://google.github.io/eng-practices/", proveedor: "Google", gratis: true },
      { nombre: "Clean Code en .NET (guía)", url: "https://github.com/thangchung/clean-code-dotnet", proveedor: "GitHub (comunidad)", gratis: true }
    ],
    proyecto: { nombre: "Primer PR aceptado en la empresa", descripcion: "Tu primera contribución real.", requisitos: ["Tarea entregada", "Reporte parcial entregado"] },
    listo: ["Tengo mi primer PR aprobado.", "Entregué el primer reporte parcial."],
    errores: ["Quedarse callado horas atorado.", "No llevar registro de horas."],
    entrevista: []
  },
  {
    id: "f9",
    fase: "Fase 9",
    titulo: "Crecer durante la residencia y convertirla en empleo",
    inicio: "2027-03-01",
    fin: "2027-06-30",
    dashboard: "—",
    horas: "3–5 h/semana",
    objetivo: "Aprender lo que usa la empresa, terminar tu proyecto de residencia y salir con oferta o carta de recomendación.",
    porQue: "Muchas empresas contratan a sus practicantes. Las habilidades extra te hacen candidato junior fuerte si no.",
    pasos: [
      { id: "f9-1", min: 900, texto: "Aprende el framework frontend de la empresa (React o Angular) con la documentación oficial.", como: "Rehaz el frontend del inventario en ese framework." },
      { id: "f9-2", min: 600, texto: "TypeScript: tipos, interfaces y genéricos.", como: "Lo piden en la mayoría de vacantes junior." },
      { id: "f9-3", min: 900, texto: "Fundamentos de nube: prepara AZ-900 (Azure Fundamentals).", como: "Busca vouchers gratuitos en eventos Microsoft Virtual Training Days." },
      { id: "f9-4", min: 120, texto: "Mes 4: pide retroalimentación formal y pregunta abiertamente por una plaza al terminar.", como: "«Me gustaría quedarme al terminar la residencia, ¿qué necesito mejorar para lograrlo?»" },
      { id: "f9-5", min: 600, texto: "Termina y entrega el informe final de residencia y la evaluación.", como: "Pide también una carta de recomendación y un contacto de LinkedIn de tu líder." },
      { id: "f9-6", min: 120, texto: "Actualiza CV y LinkedIn con la residencia (logros con números) y empieza a postular a puestos junior si no hay oferta.", como: "Ej.: «Desarrollé 6 endpoints que redujeron X», no «hice tareas varias»." }
    ],
    cursos: [
      { nombre: "React — Aprende", url: "https://es.react.dev/learn", proveedor: "React", gratis: true },
      { nombre: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", proveedor: "Microsoft", gratis: true },
      { nombre: "Azure Fundamentals (AZ-900)", url: "https://learn.microsoft.com/es-es/credentials/certifications/azure-fundamentals/", proveedor: "Microsoft Learn", gratis: true, nota: "El examen tiene costo; busca voucher." },
      { nombre: "Angular — tutorial oficial", url: "https://angular.dev/tutorials", proveedor: "Angular", gratis: true, nota: "Solo si tu empresa usa Angular." }
    ],
    proyecto: { nombre: "Inventario v2 + informe final", descripcion: "Proyecto personal actualizado y residencia cerrada.", requisitos: ["Frontend en React/Angular con TypeScript", "Informe final entregado", "Carta de recomendación u oferta"] },
    listo: ["Terminé la residencia con oferta de trabajo o carta de recomendación."],
    errores: ["Dejar el informe final para la última semana."],
    entrevista: ["¿Qué lograste en tu residencia?", "¿Qué harías diferente?"]
  }
];
