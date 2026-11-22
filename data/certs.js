/* Certificaciones y cursos gratuitos con peso en tu CV (verificado el 22 nov 2026).
 * peso: 3 = alto (empresa reconocida + examen), 2 = medio, 1 = complemento.
 * cuando: en qué parte del plan va; los días exactos aparecen como bloque CERT en «Mi día». */
window.CERTS = [
  {
    id: "fcc-csharp", peso: 3, tipo: "Certificación", nombre: "Foundational C# with Microsoft",
    emisor: "freeCodeCamp + Microsoft", costo: "Gratis", horas: "≈35 h",
    porque: "Lleva el logo de Microsoft y valida justo tu lenguaje principal. Es la primera que un reclutador de .NET reconoce en un perfil de estudiante.",
    como: "Crea cuenta en freeCodeCamp, vincula tu usuario de Microsoft Learn, termina los 6 módulos de Learn y presenta el examen de 80 preguntas (aprueba con 70%).",
    cuando: "24 nov → 5 dic (bloque CERT en Mi día)",
    url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/"
  },
  {
    id: "postman-student", peso: 2, tipo: "Badge", nombre: "Postman API Fundamentals Student Expert",
    emisor: "Postman", costo: "Gratis", horas: "≈5 h",
    porque: "Demuestra que sabes probar y documentar APIs REST, lo que haces en la semana 7. Es corta y se ve bien junto a tu proyecto de API.",
    como: "Entra al Student Program, haz el curso «API Fundamentals Student Expert» y entrega las tareas dentro de Postman para recibir el badge.",
    cuando: "15 → 18 dic (semana de la API)",
    url: "https://www.postman.com/student-program"
  },
  {
    id: "oci-foundations", peso: 2, tipo: "Certificación", nombre: "OCI Foundations Associate (1Z0-1085-26)",
    emisor: "Oracle", costo: "Gratis (curso y examen)", horas: "≈8 h",
    porque: "Certificación oficial de nube con examen supervisado. Te da vocabulario de cloud (regiones, cómputo, redes, IAM) para entrevistas.",
    como: "Crea tu cuenta en Oracle MyLearn, sigue la ruta «OCI Foundations Associate» y agenda el examen en línea desde la misma página.",
    cuando: "21 → 27 dic (vacaciones, sesiones ligeras)",
    url: "https://www.oracle.com/education/certification/"
  },
  {
    id: "gh-foundations", peso: 3, tipo: "Certificación", nombre: "GitHub Foundations",
    emisor: "GitHub (Microsoft)", costo: "Gratis con GitHub Education (estudiante verificado)", horas: "≈10 h",
    porque: "Git aparece en casi todas las vacantes. Esta es la certificación oficial de GitHub, con examen supervisado por Pearson VUE.",
    como: "1) Verifícate como estudiante en GitHub Education (tarda unos días; hazlo YA). 2) Estudia la ruta de Microsoft Learn «GitHub Foundations». 3) Reclama el voucher desde GitHub Education y agenda el examen. Antes de pagar, confirma que el voucher cubre el 100%.",
    cuando: "Verificación 1 dic · estudio 4 → 9 ene · examen el 10 ene o después",
    url: "https://education.github.com/experiences/foundations_certificate"
  },
  {
    id: "fcc-rwd", peso: 2, tipo: "Certificación", nombre: "Responsive Web Design",
    emisor: "freeCodeCamp", costo: "Gratis", horas: "≈40 h (ya llevas buena parte)",
    porque: "Valida HTML/CSS con 5 proyectos y un examen. Reutiliza lo que hiciste en las semanas 4–5.",
    como: "Haz los 5 proyectos certificados (puedes adaptar tu página personal y tu calculadora) y presenta el examen final.",
    cuando: "Domingos libres de diciembre o en febrero",
    url: "https://www.freecodecamp.org/learn"
  },
  {
    id: "fcc-js", peso: 2, tipo: "Certificación", nombre: "JavaScript Certification",
    emisor: "freeCodeCamp", costo: "Gratis", horas: "≈60 h",
    porque: "Complementa la de C#: demuestra que dominas el frontend que conecta con tu API.",
    como: "Haz los proyectos certificados de la ruta de JavaScript y el examen final.",
    cuando: "Febrero–marzo (durante la residencia, 3–5 h por semana)",
    url: "https://www.freecodecamp.org/learn"
  },
  {
    id: "ms-applied-aspnet", peso: 3, tipo: "Credencial", nombre: "Applied Skills: ASP.NET Core web app que consume una API",
    emisor: "Microsoft Learn", costo: "Evaluación gratuita (confírmalo al registrarte)", horas: "≈12 h",
    porque: "Es una prueba práctica en laboratorio real, no de opción múltiple. Pesa mucho para puestos .NET y encaja con tu proyecto de inventario.",
    como: "Estudia la ruta de Learn de esa credencial y presenta la evaluación práctica (2 h aprox.) cuando tu API y tu frontend funcionen.",
    cuando: "Febrero 2027 (después de terminar el inventario)",
    url: "https://learn.microsoft.com/credentials/applied-skills/develop-an-aspnet-core-web-app-that-consumes-an-api"
  },
  {
    id: "efset", peso: 2, tipo: "Certificado", nombre: "EF SET English Certificate (50 min)",
    emisor: "EF Education First", costo: "Gratis", horas: "1 h",
    porque: "Pone un número (CEFR) a tu inglés. Muchas vacantes piden inglés intermedio y esto lo demuestra.",
    como: "Ya está en tu plan: 2 dic y 14 ene. Pon el mejor resultado en LinkedIn y en tu CV.",
    cuando: "2 dic y 14 ene",
    url: "https://www.efset.org/es/"
  },
  {
    id: "hr-problem", peso: 1, tipo: "Badge", nombre: "HackerRank Problem Solving (Basic) + SQL (Basic)",
    emisor: "HackerRank", costo: "Gratis", horas: "≈2 h cada uno",
    porque: "Exámenes cronometrados que muchas empresas usan como filtro. El badge en tu perfil demuestra que pasas ese tipo de prueba.",
    como: "Presenta SQL (Basic) después de la semana 6 y Problem Solving (Basic) el 16 ene.",
    cuando: "SQL: 13 dic · Problem Solving: 16 ene",
    url: "https://www.hackerrank.com/skills-verification"
  },
  {
    id: "oracle-one", peso: 2, tipo: "Programa", nombre: "Oracle Next Education (ONE) con Alura",
    emisor: "Oracle + Alura Latam", costo: "Gratis (con beca, por convocatoria)", horas: "≈6 meses",
    porque: "Programa grande en LATAM con ruta de backend, certificado y comunidad. Varias empresas lo reconocen.",
    como: "Revisa la página oficial y regístrate en cuanto se abra la próxima convocatoria para México.",
    cuando: "Cuando abran la siguiente cohorte (revísalo cada mes)",
    url: "https://www.oracle.com/latam/education/oracle-next-education/"
  },
  {
    id: "cisco-jse", peso: 1, tipo: "Curso + badge", nombre: "JavaScript Essentials 1",
    emisor: "Cisco Networking Academy", costo: "Gratis", horas: "≈30 h",
    porque: "Curso estructurado con badge de Cisco (Credly). Sirve si prefieres un curso guiado para reforzar JS.",
    como: "Inscríbete en NetAcad, completa los módulos y el examen final del curso para recibir el badge.",
    cuando: "Opcional: refuerzo si la semana 4–5 se te complica",
    url: "https://www.netacad.com/courses/javascript-essentials-1"
  },
  {
    id: "cs50", peso: 1, tipo: "Curso", nombre: "CS50x: Introduction to Computer Science",
    emisor: "Harvard (edX)", costo: "Gratis (certificado gratuito por el sitio de CS50)", horas: "≈100 h",
    porque: "El curso de fundamentos más conocido del mundo. Úsalo para reforzar algoritmos y estructuras de datos durante la residencia.",
    como: "Sigue el curso en cs50.harvard.edu/x y entrega los problem sets para obtener el certificado gratuito.",
    cuando: "Opcional, durante la residencia",
    url: "https://cs50.harvard.edu/x/"
  }
];
