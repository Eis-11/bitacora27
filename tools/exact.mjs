// Instrucciones exactas para el bloque de programación de cada sesión (23 nov 2026 – 16 ene 2027).
// c: "cómo hacerlo" para cada uno de los 3 pasos del dashboard (mismo orden).
// d: documentación exacta para ese día. ok: «Terminaste cuando…» (criterios verificables).
const MDN = "https://developer.mozilla.org/es/docs/";
const MSL = "https://learn.microsoft.com/es-es/";
const PY = "https://docs.python.org/es/3/";

export const EXACT = {
  // ---------------- Semana 4 · Calculadora web ----------------
  "2026-11-23": {
    c: [
      "Crea `grid.html` + `grid.css`. Pon 6 `<div class=\"card\">` dentro de `<main class=\"grid\">`. Escribe `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}`. Luego prueba `grid-template-areas` con 3 zonas: header, aside, content.",
      "Diseña mobile-first: sin media query = 1 columna. Agrega `@media (min-width:600px){…2 columnas}` y `@media (min-width:1024px){…3 columnas}`. Abre DevTools (F12 → ícono de celular) y prueba 375, 768 y 1280 px.",
      "En tu página personal cambia el contenedor de tarjetas a Grid con `repeat(auto-fit,minmax(240px,1fr))`. Toma 3 capturas (móvil, tablet, escritorio) y guárdalas en `/docs` del repo."
    ],
    d: [MDN + "Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout", MDN + "Web/CSS/CSS_media_queries/Using_media_queries"],
    ok: ["Sin scroll horizontal a 375 px.", "3 capturas en el repo y commit «feat: layout con CSS Grid»."]
  },
  "2026-11-24": {
    c: [
      "Crea `js-basico/variables.js`. Declara 5 variables con `const` y 2 con `let`; intenta reasignar una `const` y lee el error en consola (`node variables.js`). Escribe en un comentario cuándo usar cada una.",
      "En `tipos.js` usa `typeof` con 6 valores distintos. Convierte con `Number(\"12\")`, `parseInt(\"12px\")`, `String(5)`. Compara `5 == \"5\"` vs `5 === \"5\"` y anota por qué siempre usarás `===`.",
      "Escribe `calc.js`: funciones `sumar(a,b)`, `restar`, `multiplicar`, `dividir` que impriman el resultado con `console.log`. Llama cada una 2 veces con números distintos."
    ],
    d: [MDN + "Web/JavaScript/Guide/Grammar_and_types", MDN + "Web/JavaScript/Reference/Operators/Strict_equality"],
    ok: ["Corres los 3 archivos con `node` sin errores.", "Puedes explicar `let` vs `const` y `==` vs `===` sin ver notas."]
  },
  "2026-11-25": {
    c: [
      "En `control.js` escribe: un `if/else` que clasifique una calificación (A ≥90, B ≥80, C ≥70, F), un `switch` con el día de la semana, un `for` que sume del 1 al 100 y un `while` que cuente hacia atrás desde 10.",
      "Convierte cada ejercicio anterior en función con parámetros y `return` (p. ej. `clasificar(nota)`). Prueba cada función con 3 llamadas, una de ellas con un caso límite (0, 100, número negativo).",
      "Elige 2 ejercicios que hiciste en C# en noviembre (p. ej. FizzBuzz y promedio). Reescríbelos en JS en `comparacion.js` y en un comentario anota 3 diferencias de sintaxis con C#."
    ],
    d: [MDN + "Web/JavaScript/Guide/Control_flow_and_error_handling", MDN + "Web/JavaScript/Guide/Functions"],
    ok: ["Todas las funciones devuelven valores (no solo imprimen).", "Commit «feat: control de flujo y funciones en JS»."]
  },
  "2026-11-26": {
    c: [
      "Crea `calculadora/index.html` con un `<output id=\"pantalla\">` y botones. En `app.js`: `const pantalla = document.querySelector(\"#pantalla\")` y un `addEventListener(\"click\", …)` en un solo botón que escriba su texto en la pantalla.",
      "Botones 0–9, + − × ÷, =, C dentro de `<div class=\"teclado\">` con `display:grid;grid-template-columns:repeat(4,1fr)`. Usa `<button type=\"button\">` (no `div`) y `aria-label` en los operadores.",
      "Usa delegación de eventos: un solo `addEventListener` en `.teclado` que lea `e.target.dataset.valor`. Al presionar «=» calcula el resultado (sin `eval`: usa un `switch` por operador) y muéstralo."
    ],
    d: [MDN + "Web/API/Document/querySelector", MDN + "Web/API/EventTarget/addEventListener"],
    ok: ["La calculadora suma, resta, multiplica y divide sin recargar la página.", "No usas `eval` en ningún lado."]
  },
  "2026-11-27": {
    c: [
      "Antes de calcular valida: si falta un número muestra «Ingresa dos números»; si `Number.isNaN(valor)` muestra «Número inválido»; si divides entre 0 muestra «No se puede dividir entre 0». Nunca dejes que aparezca `NaN` o `Infinity`.",
      "Crea un `<p id=\"mensaje\" role=\"alert\">`. Errores en rojo con clase `.error`, resultados en verde con `.ok`. Limpia el mensaje al presionar C.",
      "Prueba solo con teclado (Tab, Enter, Espacio), con mouse y en vista móvil de DevTools. Agrega soporte de teclado físico con `keydown` para números y Enter."
    ],
    d: [MDN + "Web/JavaScript/Reference/Global_Objects/Number/isNaN", MDN + "Web/API/Element/keydown_event"],
    ok: ["10 ÷ 0 muestra un mensaje, no `Infinity`.", "Calculadora en GitHub Pages o en el repo con README y captura."]
  },
  "2026-11-28": {
    c: [
      "Sin tutorial y con cronómetro de 20 min: en un HTML nuevo crea una tarjeta (imagen, título, botón «Me gusta») que al hacer clic aumente un contador. Si te atoras, anota exactamente dónde.",
      "Abre la consola (F12) en tus proyectos de la semana y corrige todo error o warning. En `NOTAS.md` escribe los 3 conceptos que más te costaron (p. ej. delegación de eventos) para repasarlos.",
      "En `funciones.py` escribe `sumar(a, b)`, `es_numero(texto)` (usa `try/except ValueError`) y `promedio(lista)` que devuelva `None` si la lista está vacía. Pruébalas con `print` y sube el archivo."
    ],
    d: [PY + "tutorial/controlflow.html#defining-functions", PY + "tutorial/errors.html"],
    ok: ["Tarjeta con contador funcionando en ≤ 20 min.", "Consola sin errores en tus 3 proyectos de la semana."]
  },
  // ---------------- Semana 5 · Gestor de tareas ----------------
  "2026-11-30": {
    c: [
      "En `productos.js` crea un arreglo de 8 objetos `{id, nombre, precio, categoria}`. Usa `map` para obtener solo nombres, `filter` para precio > 100, `find` para el id 3 y `forEach` para imprimir cada uno.",
      "Escribe `ordenarPorPrecio(lista)` con `[...lista].sort((a,b) => a.precio - b.precio)` (sin modificar el original) y `buscar(lista, texto)` que no distinga mayúsculas (`toLowerCase().includes`).",
      "En `NOTAS.md` explica con un ejemplo propio: arreglo = lista ordenada que recorres; objeto = diccionario cuando buscas por clave (p. ej. `stockPorId[5]`). Convierte tu arreglo a objeto indexado por id con `reduce` o un `for`."
    ],
    d: [MDN + "Web/JavaScript/Reference/Global_Objects/Array/map", MDN + "Web/JavaScript/Reference/Global_Objects/Array/filter"],
    ok: ["El arreglo original no cambia después de ordenar.", "Explicas cuándo usar arreglo vs objeto en voz alta."]
  },
  "2026-12-01": {
    c: [
      "Crea `tareas/index.html` con un `<form>` (input título + botón). Escucha `submit` en el form, `click` en un botón «Borrar todo» y `change` en un `<select>` de prioridad; imprime cada evento en consola.",
      "En el `submit` llama `e.preventDefault()`. Si el título está vacío o tiene menos de 3 caracteres muestra un error debajo del input y no agregues nada.",
      "Guarda las tareas en un arreglo y escribe `render()` que vacíe la `<ul>` y cree un `<li>` por tarea con `document.createElement` y `textContent` (no `innerHTML` con texto del usuario)."
    ],
    d: [MDN + "Web/API/Event/preventDefault", MDN + "Web/API/Document/createElement"],
    ok: ["El formulario nunca recarga la página.", "Las tareas aparecen en la lista al enviarlas."]
  },
  "2026-12-02": {
    c: [
      "En consola: `const t = {titulo:\"x\", hecha:false}`; `const s = JSON.stringify(t)`; `typeof s` → \"string\"; `JSON.parse(s)` → objeto. Hazlo también con un arreglo de 3 tareas.",
      "Escribe `guardar(tareas)` → `localStorage.setItem(\"tareas\", JSON.stringify(tareas))` y `cargar()` que lo lea al iniciar. Recarga la página y verifica en DevTools → Application → Local Storage.",
      "`cargar()` debe devolver `[]` si no hay nada o si el JSON está roto: envuelve `JSON.parse` en `try/catch`. Prueba escribiendo a mano `localStorage.setItem(\"tareas\",\"{roto\")` y recargando."
    ],
    d: [MDN + "Web/API/Window/localStorage", MDN + "Web/JavaScript/Reference/Global_Objects/JSON/parse"],
    ok: ["Las tareas sobreviven a recargar la página.", "Con JSON roto la app no se rompe: arranca vacía."]
  },
  "2026-12-03": {
    c: [
      "Cada tarea: `{ id: crypto.randomUUID(), titulo, hecha: false, creada: new Date().toISOString() }`. Escribe esa forma como comentario al inicio de `app.js`.",
      "Funciones `agregar(titulo)`, `alternar(id)` (cambia `hecha`) y `listar()`. Cada una actualiza el arreglo, llama `guardar()` y luego `render()`.",
      "Separa en 2 archivos: `datos.js` (arreglo, agregar, alternar, guardar, cargar; nada de DOM) y `ui.js` (render y eventos). Cárgalos con `<script>` en ese orden."
    ],
    d: [MDN + "Web/API/Crypto/randomUUID", MDN + "Web/JavaScript/Guide/Modules"],
    ok: ["`datos.js` no contiene ni una línea de `document.`", "Puedes marcar y desmarcar tareas como hechas."]
  },
  "2026-12-04": {
    c: [
      "Agrega `eliminar(id)` con `filter`, guarda y renderiza. Botón 🗑 en cada `<li>` con `data-id`; usa delegación de eventos en la `<ul>`.",
      "Tres botones de filtro (Todas / Pendientes / Completadas). Guarda el filtro activo en una variable y aplica `filter` dentro de `render()`. Marca el botón activo con `aria-pressed=\"true\"`.",
      "Si la lista filtrada está vacía muestra «No hay tareas aquí». Antes de eliminar usa `confirm(\"¿Eliminar…?\")`. Muestra un contador «3 pendientes»."
    ],
    d: [MDN + "Web/JavaScript/Reference/Global_Objects/Array/filter", MDN + "Web/API/Window/confirm"],
    ok: ["Agregar, completar, filtrar y eliminar funcionan y persisten.", "Nunca se ve una lista vacía sin mensaje."]
  },
  "2026-12-05": {
    c: [
      "En `colecciones.py`: lista de 5 diccionarios de productos; con un `for` calcula el total; con comprensión `[p[\"nombre\"] for p in productos if p[\"precio\"] > 100]`.",
      "Guarda la lista en `productos.json` con `json.dump(productos, f, ensure_ascii=False, indent=2)` y léela de vuelta con `json.load`. Usa `with open(...)`.",
      "Prueba el gestor con: título vacío, 200 caracteres, 50 tareas y emojis. Escribe README (qué hace, captura, cómo abrirlo) y publica en GitHub Pages (Settings → Pages)."
    ],
    d: [PY + "tutorial/datastructures.html#list-comprehensions", PY + "library/json.html"],
    ok: ["Gestor publicado con link funcionando en el README.", "`productos.json` se escribe y se lee sin errores."]
  },
  // ---------------- Semana 6 · SQL Server ----------------
  "2026-12-07": {
    c: [
      "Instala SQL Server 2022 Developer o Express y la extensión «SQL Server (mssql)» de VS Code (o SSMS). Conéctate a `localhost` y ejecuta `SELECT @@VERSION;`.",
      "Diseña en papel: `Categorias(Id PK, Nombre UNIQUE)` y `Productos(Id PK, Nombre, Precio DECIMAL(10,2), Stock INT, CategoriaId FK → Categorias.Id)`. Decide qué columnas son NOT NULL.",
      "Dibuja el diagrama entidad-relación en draw.io (app.diagrams.net) o Mermaid en el README: 1 categoría → muchos productos. Escribe 2 líneas justificando por qué la FK va en Productos."
    ],
    d: [MSL + "sql/database-engine/install-windows/install-sql-server", MSL + "sql/relational-databases/tables/primary-and-foreign-key-constraints"],
    ok: ["`SELECT @@VERSION` responde.", "Diagrama ER en el repo `inventario`."]
  },
  "2026-12-08": {
    c: [
      "Crea `sql/01_esquema.sql` con `CREATE DATABASE Inventario;`, `USE Inventario;` y los 2 `CREATE TABLE` con `IDENTITY(1,1)`, `PRIMARY KEY` y `FOREIGN KEY`. Ejecútalo completo.",
      "Crea `sql/02_datos.sql` con `INSERT` de 4 categorías y 10 productos (precios y stock variados, incluye 2 con stock < 5).",
      "En `sql/03_crud.sql`: 3 `SELECT`, 2 `UPDATE … WHERE Id = …`, 1 `DELETE … WHERE Id = …`. Antes de cada UPDATE/DELETE corre el mismo `WHERE` con SELECT para ver qué afectarás."
    ],
    d: [MSL + "sql/t-sql/statements/create-table-transact-sql", MSL + "sql/t-sql/statements/insert-transact-sql"],
    ok: ["3 scripts numerados que corren en orden sin errores.", "Ningún UPDATE/DELETE sin WHERE."]
  },
  "2026-12-09": {
    c: [
      "En `04_filtros.sql`: `WHERE Precio BETWEEN 100 AND 500`, `WHERE Nombre LIKE '%lap%'`, `WHERE CategoriaId IN (1,3)`, y `ORDER BY Precio DESC`. Una consulta por técnica, con comentario de qué responde.",
      "`COUNT(*)` de productos, `SUM(Precio*Stock)` como valor del inventario, `AVG(Precio)`, `MIN/MAX`. Luego `GROUP BY CategoriaId` con `HAVING COUNT(*) > 1`.",
      "Consulta «stock bajo»: `WHERE Stock < 5 ORDER BY Stock`. Consulta «valor total por categoría» con GROUP BY. Guarda ambas: serán endpoints de tu API."
    ],
    d: [MSL + "sql/t-sql/queries/select-transact-sql", MSL + "sql/t-sql/functions/aggregate-functions-transact-sql"],
    ok: ["Al menos 10 consultas en `04_filtros.sql`.", "Sabes la diferencia entre WHERE y HAVING."]
  },
  "2026-12-10": {
    c: [
      "`SELECT p.Nombre, c.Nombre AS Categoria FROM Productos p INNER JOIN Categorias c ON c.Id = p.CategoriaId;` Luego crea una categoría sin productos y usa `LEFT JOIN` desde Categorias para verla con NULL.",
      "Toma una tabla «mala» de ejemplo (Productos con columnas NombreCategoria y TelefonoProveedor repetidos) y en `NOTAS.md` explica cómo la separarías hasta 3FN.",
      "Agrega `UNIQUE (Nombre)` a Categorias y `CHECK (Precio >= 0)` y `CHECK (Stock >= 0)` a Productos con `ALTER TABLE`. Intenta insertar un precio negativo y copia el error."
    ],
    d: [MSL + "sql/relational-databases/performance/joins", MSL + "sql/relational-databases/tables/unique-constraints-and-check-constraints"],
    ok: ["Explicas INNER vs LEFT JOIN con tus datos.", "La base rechaza precios y stock negativos."]
  },
  "2026-12-11": {
    c: [
      "Une todo en `sql/inventario.sql` (esquema final + restricciones). En el README agrega una tabla: columna, tipo, nulo, descripción.",
      "Escribe `sql/consultas.sql` con 20 consultas numeradas y comentadas: 4 altas, 4 búsquedas, 4 joins, 4 agregaciones, 4 de negocio (stock bajo, más caro por categoría, etc.).",
      "`DROP DATABASE Inventario;` y vuelve a crear todo desde cero corriendo tus scripts en orden. Si algo falla, corrige el script, no la base. Commit y push."
    ],
    d: [MSL + "sql/t-sql/statements/drop-database-transact-sql"],
    ok: ["La base se recrea desde cero solo con tus scripts.", "20 consultas probadas en el repo."]
  },
  "2026-12-12": {
    c: [
      "En `inventario.py`: `import sqlite3`; `con = sqlite3.connect(\"inventario.db\")`; crea la tabla `productos` con `CREATE TABLE IF NOT EXISTS`.",
      "Inserta con parámetros: `cur.execute(\"INSERT INTO productos(nombre, precio) VALUES (?, ?)\", (nombre, precio))` y `con.commit()`. Lee con `SELECT … WHERE precio > ?`. Nunca armes SQL con f-strings.",
      "Sin apuntes, escribe en papel 5 consultas (un JOIN, un GROUP BY, un UPDATE con WHERE…) y luego compruébalas. Explica en voz alta la relación Categorias–Productos."
    ],
    d: [PY + "library/sqlite3.html"],
    ok: ["El script de Python inserta y lee usando `?`.", "Escribes un JOIN de memoria."]
  },
  // ---------------- Semana 7 · ASP.NET Core Web API ----------------
  "2026-12-14": {
    c: [
      "Lee el resumen de HTTP en MDN. Abre DevTools → Network en cualquier página y anota para 1 request: método, URL, status, 2 headers y el body.",
      "En `docs/api.md` escribe la tabla: `GET /api/productos` (200), `GET /api/productos/{id}` (200/404), `POST /api/productos` (201/400), `PUT /api/productos/{id}` (204/400/404), `DELETE /api/productos/{id}` (204/404).",
      "Para cada endpoint escribe un ejemplo de request y response en JSON (bloques ```json). Esa será la documentación de tu API."
    ],
    d: [MDN + "Web/HTTP/Overview", MDN + "Web/HTTP/Status"],
    ok: ["`docs/api.md` con 5 endpoints, códigos y ejemplos JSON.", "Sabes qué significan 200, 201, 204, 400, 404 y 500."]
  },
  "2026-12-15": {
    c: [
      "`dotnet new webapi -n Inventario.Api --use-controllers` y `cd Inventario.Api`. Revisa `Program.cs`, `Controllers/` y `appsettings.json`; escribe en `NOTAS.md` para qué sirve cada uno.",
      "`dotnet run` y abre la URL de Swagger que muestra la consola (`/swagger` o `/openapi`). Ejecuta el endpoint de ejemplo y ubica en `Program.cs` dónde se configura.",
      "Crea `Models/Producto.cs`: `Id`, `Nombre` con `[Required][StringLength(100)]`, `Precio` con `[Range(0, 1000000)]`, `Stock` con `[Range(0, int.MaxValue)]`, `CategoriaId`."
    ],
    d: [MSL + "aspnet/core/tutorials/first-web-api"],
    ok: ["La API corre y Swagger abre.", "Modelo `Producto` con validaciones."]
  },
  "2026-12-16": {
    c: [
      "Crea `ProductosController` con `[ApiController][Route(\"api/[controller]\")]` y una lista estática en memoria. `GET` devuelve `Ok(lista)`; `GET {id}` devuelve `NotFound()` si no existe.",
      "`[HttpPost]` recibe `Producto`, asigna `Id`, lo agrega y devuelve `CreatedAtAction(nameof(GetById), new { id = p.Id }, p)`. `[ApiController]` ya devuelve 400 si falla la validación.",
      "En Swagger prueba: listar, id existente (200), id 999 (404), POST válido (201) y POST con precio -5 (400). Anota cada status en `docs/pruebas.md`."
    ],
    d: [MSL + "aspnet/core/web-api/action-return-types"],
    ok: ["GET, GET por id y POST responden 200/201/404/400 correctamente.", "`docs/pruebas.md` con 5 pruebas."]
  },
  "2026-12-17": {
    c: [
      "`[HttpPut(\"{id}\")]`: si `id != producto.Id` devuelve `BadRequest()`; si no existe, `NotFound()`; si todo bien, actualiza y devuelve `NoContent()` (204).",
      "`[HttpDelete(\"{id}\")]`: `NotFound()` si no existe; si existe, elimina y `NoContent()`.",
      "Ciclo completo en Swagger: crear → leer → editar → leer → eliminar → leer (debe dar 404). Agrega los resultados a `docs/pruebas.md`."
    ],
    d: [MSL + "aspnet/core/tutorials/first-web-api#the-puttodoitem-method"],
    ok: ["Los 5 endpoints funcionan con los códigos de `docs/api.md`.", "Commit «feat: CRUD de productos en memoria»."]
  },
  "2026-12-18": {
    c: [
      "Errores consistentes: en `Program.cs` agrega `builder.Services.AddProblemDetails();` para que todos los errores salgan en formato ProblemDetails. Prueba un 400 y revisa el JSON.",
      "Instala Postman, crea la colección «Inventario API» con las 5 peticiones y una variable `{{baseUrl}}`. Agrega un test por petición: `pm.response.to.have.status(200)`. Exporta la colección a `docs/`.",
      "En el README: tabla de endpoints, parámetros, ejemplo de body y códigos de respuesta. Enlaza `docs/api.md` y la colección de Postman."
    ],
    d: [MSL + "aspnet/core/web-api/handle-errors", "https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/"],
    ok: ["Colección de Postman exportada con 5 tests en verde.", "README de la API completo."]
  },
  "2026-12-19": {
    c: [
      "En `cliente.py` usa `urllib.request.urlopen(\"http://localhost:XXXX/api/productos\")` (o `requests.get` si lo instalas con `pip install requests`). Imprime el status.",
      "`json.loads(respuesta.read())` → lista de diccionarios; imprime nombre y precio. Captura `urllib.error.HTTPError` y `URLError` (API apagada) con mensajes claros.",
      "Sube la API y `cliente.py` al repo. En el README: requisitos (.NET 8+, Python 3), cómo correr la API y cómo correr el script."
    ],
    d: [PY + "library/urllib.request.html", PY + "library/json.html"],
    ok: ["El script muestra productos con la API encendida y un error claro con la API apagada."]
  },
  // ---------------- Semana 8 · Entity Framework Core ----------------
  "2026-12-21": {
    c: [
      "`dotnet add package Microsoft.EntityFrameworkCore.SqlServer` y `dotnet add package Microsoft.EntityFrameworkCore.Design` (misma versión mayor que tu .NET). Instala la herramienta: `dotnet tool install --global dotnet-ef`.",
      "`dotnet user-secrets init` y `dotnet user-secrets set \"ConnectionStrings:Inventario\" \"Server=localhost;Database=InventarioEf;Trusted_Connection=True;TrustServerCertificate=True\"`. Nunca pongas la cadena en `appsettings.json` del repo.",
      "Crea `Data/InventarioContext.cs : DbContext` con `DbSet<Producto>` y `DbSet<Categoria>`. En `Program.cs`: `builder.Services.AddDbContext<InventarioContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString(\"Inventario\")));`"
    ],
    d: [MSL + "ef/core/get-started/overview/first-app", MSL + "aspnet/core/security/app-secrets"],
    ok: ["`dotnet build` sin errores con el DbContext registrado.", "Ninguna contraseña o cadena de conexión en Git."]
  },
  "2026-12-22": {
    c: [
      "Crea `Categoria` con `List<Producto> Productos` y agrega a `Producto` la propiedad `Categoria? Categoria` además de `CategoriaId`. EF detecta la relación 1–N por convención.",
      "`dotnet ef migrations add Inicial` y abre el archivo generado en `Migrations/`. Genera el SQL con `dotnet ef migrations script` y compáralo con tu `inventario.sql`.",
      "`dotnet ef database update`. En SQL Server verifica las tablas, la FK y la tabla `__EFMigrationsHistory`."
    ],
    d: [MSL + "ef/core/managing-schemas/migrations/", MSL + "ef/core/modeling/relationships/one-to-many"],
    ok: ["Las tablas existen en SQL Server creadas por la migración.", "Puedes explicar qué es una migración."]
  },
  "2026-12-23": {
    c: [
      "Inyecta `InventarioContext` en el controlador. `GET` → `await _db.Productos.AsNoTracking().ToListAsync()`; `GET {id}` → `await _db.Productos.FirstOrDefaultAsync(p => p.Id == id)`.",
      "POST: `_db.Productos.Add(p); await _db.SaveChangesAsync();`. PUT: busca, actualiza propiedades, `SaveChangesAsync`. DELETE: `Remove` + `SaveChangesAsync`. Todos los métodos `async Task<IActionResult>`.",
      "Crea 3 productos, detén la API (Ctrl+C), vuelve a correrla y haz GET: deben seguir ahí. Borra la lista estática en memoria."
    ],
    d: [MSL + "ef/core/querying/", MSL + "ef/core/saving/basic"],
    ok: ["Los datos persisten después de reiniciar la API.", "No queda ninguna lista en memoria."]
  },
  "2026-12-24": {
    c: [
      "Además de los atributos, valida reglas de negocio en el controlador: si `CategoriaId` no existe devuelve `BadRequest` con mensaje claro.",
      "Si creas un producto con nombre repetido devuelve `Conflict()` (409). Revisa con Postman que 400, 404 y 409 salgan cuando corresponde.",
      "En `Program.cs` agrega `app.UseExceptionHandler()` (con `AddProblemDetails`) para que una excepción no muestre el stack trace al cliente. Provoca un error a propósito y revisa la respuesta."
    ],
    d: [MSL + "aspnet/core/web-api/handle-errors", MSL + "aspnet/core/mvc/models/validation"],
    ok: ["La API responde 400/404/409 con ProblemDetails.", "Una excepción no filtra detalles internos."]
  },
  "2026-12-25": {
    c: [
      "(Navidad: sesión opcional.) Corre tu colección de Postman completa con «Run collection» y anota resultados.",
      "Prueba casos límite: nombre de 101 caracteres, precio 0, stock negativo, categoría inexistente, y apaga SQL Server para ver el error de conexión.",
      "Cada defecto que puedas reproducir: abre un *issue* en GitHub con pasos, esperado y obtenido. Corrige los dos más graves."
    ],
    d: ["https://learning.postman.com/docs/collections/running-collections/intro-to-collection-runs/"],
    ok: ["Collection Runner en verde.", "Issues creados para los defectos encontrados."]
  },
  "2026-12-26": {
    c: [
      "En `pruebas_api.py` haz GET, POST, PUT y DELETE con `urllib.request.Request(method=...)` o `requests` y verifica con `assert respuesta.status == 201`, etc.",
      "Lee la URL base de una variable de entorno: `os.environ.get(\"API_URL\", \"http://localhost:5000\")`. Nada de claves en el código.",
      "En el README agrega «Pruebas automáticas»: cómo correr `python pruebas_api.py`. Repasa tu diagrama ER y actualízalo si cambió."
    ],
    d: [PY + "library/os.html#os.environ", PY + "library/urllib.request.html"],
    ok: ["`python pruebas_api.py` termina sin AssertionError.", "README actualizado."]
  },
  // ---------------- Semana 9 · Integración full stack ----------------
  "2026-12-28": {
    c: [
      "Lee qué es el origen (protocolo + dominio + puerto) y el preflight `OPTIONS`. Abre tu frontend con Live Server (p. ej. `http://127.0.0.1:5500`) y haz un `fetch` a la API: verás el error CORS en consola.",
      "En `Program.cs`: `builder.Services.AddCors(o => o.AddPolicy(\"Front\", p => p.WithOrigins(\"http://127.0.0.1:5500\").AllowAnyHeader().AllowAnyMethod()));` y `app.UseCors(\"Front\");`. Nunca uses `AllowAnyOrigin` en producción.",
      "Repite el `fetch` y revisa en DevTools → Network: status 200, header `Access-Control-Allow-Origin` y la respuesta JSON."
    ],
    d: [MDN + "Web/HTTP/CORS", MSL + "aspnet/core/security/cors"],
    ok: ["El frontend recibe datos de la API sin error CORS."]
  },
  "2026-12-29": {
    c: [
      "En `frontend/api.js`: `export async function obtenerProductos(){ const r = await fetch(`${API}/api/productos`); if(!r.ok) throw new Error(r.status); return r.json(); }`.",
      "`render(productos)` crea una fila `<tr>` por producto con `textContent`. Formatea precio con `toLocaleString(\"es-MX\",{style:\"currency\",currency:\"MXN\"})`.",
      "Muestra «Cargando…» mientras espera, «No hay productos» si la lista viene vacía y «No se pudo conectar» en el `catch`. Prueba apagando la API."
    ],
    d: [MDN + "Web/API/Fetch_API/Using_Fetch", MDN + "Web/JavaScript/Reference/Statements/async_function"],
    ok: ["La tabla muestra los productos reales de SQL Server.", "Los 3 estados (cargando, vacío, error) se ven."]
  },
  "2026-12-30": {
    c: [
      "Formulario con `<label>` + input para nombre, precio (`type=number step=0.01 min=0`), categoría (`<select>` llenado desde la API) y stock.",
      "En `submit`: `preventDefault`, valida, y `fetch(url, { method:\"POST\", headers:{\"Content-Type\":\"application/json\"}, body: JSON.stringify(datos) })`. Si la respuesta es 400, muestra los errores que manda la API.",
      "Si es 201: limpia el formulario, vuelve a cargar la lista y muestra «Producto creado» por 3 segundos."
    ],
    d: [MDN + "Web/API/Fetch_API/Using_Fetch#subir_datos_json"],
    ok: ["Creas un producto desde la web y aparece en la tabla y en SQL Server."]
  },
  "2026-12-31": {
    c: [
      "(Fin de año: solo este bloque.) Botón «Editar» en cada fila que llena el formulario; el submit hace `PUT /api/productos/{id}` cuando hay id.",
      "Botón «Eliminar» con `confirm`, `DELETE` y recarga de la lista.",
      "Deshabilita el botón de enviar (`disabled = true`) mientras la petición está en curso para evitar dobles envíos. Muestra el error si la API responde 404 o 409."
    ],
    d: [MDN + "Web/API/HTMLButtonElement/disabled"],
    ok: ["CRUD completo desde la interfaz.", "Doble clic en Guardar no crea duplicados."]
  },
  "2027-01-01": {
    c: [
      "(Año nuevo: opcional.) Revisa que cada acción tenga los 4 estados: cargando, error, éxito y vacío.",
      "Busca `innerHTML` en tu frontend: donde se muestre texto del usuario cámbialo por `textContent`. Crea un producto llamado `<img src=x onerror=alert(1)>` y confirma que se ve como texto.",
      "Navega solo con teclado, revisa contraste con DevTools (Lighthouse → Accesibilidad) y prueba en vista móvil. Corrige lo que marque Lighthouse en rojo."
    ],
    d: [MDN + "Web/API/Node/textContent", "https://developer.chrome.com/docs/lighthouse/overview?hl=es"],
    ok: ["El producto con HTML malicioso se muestra como texto.", "Lighthouse Accesibilidad ≥ 90."]
  },
  "2027-01-02": {
    c: [
      "Reutiliza `pruebas_api.py` para un flujo: crear → leer → editar → borrar, imprimiendo ✓ por paso.",
      "Haz el mismo flujo a mano desde la web con DevTools abierto. Anota cualquier error de consola o de Network.",
      "Corrige lo prioritario, actualiza el README y etiqueta la versión: `git tag v1.0 && git push --tags`."
    ],
    d: ["https://git-scm.com/book/es/v2/Fundamentos-de-Git-Etiquetado"],
    ok: ["Tag `v1.0` en GitHub.", "Flujo completo sin errores en consola."]
  },
  // ---------------- Semana 10 · Git, pruebas y Docker ----------------
  "2027-01-04": {
    c: [
      "`git switch -c feature/filtro-stock`, haz 2 commits con mensajes tipo «feat: …», `git push -u origin feature/filtro-stock` y abre un Pull Request en GitHub. Revisa tu propio diff y haz merge.",
      "Lee el patrón Arrange-Act-Assert. Decide qué probar: validaciones y reglas de negocio (no el framework).",
      "`dotnet new xunit -n Inventario.Tests`, `dotnet add reference ../Inventario.Api`. Extrae una regla a una clase (p. ej. `ReglasInventario.EsStockBajo(stock)`) y escribe 3 `[Fact]`. Corre `dotnet test`."
    ],
    d: ["https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request", MSL + "dotnet/core/testing/unit-testing-with-dotnet-test"],
    ok: ["1 PR mergeado en tu repo.", "`dotnet test` con 3 pruebas en verde."]
  },
  "2027-01-05": {
    c: [
      "Instala Docker Desktop. En `frontend/Dockerfile`: `FROM nginx:alpine` y `COPY . /usr/share/nginx/html`.",
      "`docker build -t inventario-front .` y `docker run -d -p 8080:80 --name front inventario-front`. Abre `http://localhost:8080`.",
      "Crea un `compose.yaml` mínimo con el servicio `front` y corre `docker compose up -d`, `docker compose ps` y `docker compose logs front`."
    ],
    d: ["https://hub.docker.com/_/nginx", "https://docs.docker.com/get-started/"],
    ok: ["El frontend abre en el puerto 8080 desde un contenedor."]
  },
  "2027-01-06": {
    c: [
      "Dockerfile multi-stage: etapa `build` con `mcr.microsoft.com/dotnet/sdk:8.0` (`dotnet publish -c Release -o /app`) y etapa final con `mcr.microsoft.com/dotnet/aspnet:8.0` que copia `/app`.",
      "Expón el puerto con `ENV ASPNETCORE_HTTP_PORTS=8080` y pasa la cadena de conexión como variable de entorno `ConnectionStrings__Inventario`. Agrega `.dockerignore` con `bin/`, `obj/`.",
      "`docker build -t inventario-api .`, `docker run -p 5000:8080 …` y prueba `GET http://localhost:5000/api/productos` con Postman."
    ],
    d: [MSL + "dotnet/core/docker/build-container"],
    ok: ["La API responde desde el contenedor.", "La imagen no contiene contraseñas."]
  },
  "2027-01-07": {
    c: [
      "En `compose.yaml` define 3 servicios: `db` (`mcr.microsoft.com/mssql/server:2022-latest`), `api` y `front`, con un volumen `datos-sql` para la base.",
      "La API usa `Server=db;Database=Inventario;User Id=sa;Password=${SA_PASSWORD};TrustServerCertificate=True`. Pon `SA_PASSWORD` en un archivo `.env` y agrega `.env` a `.gitignore`; sube un `.env.example`.",
      "`depends_on` de api → db y un `healthcheck` en db. Aplica las migraciones al iniciar (`db.Database.Migrate()` en desarrollo) o con un paso documentado."
    ],
    d: ["https://docs.docker.com/compose/gettingstarted/", MSL + "sql/linux/quickstart-install-connect-docker"],
    ok: ["`docker compose up` levanta base, API y frontend.", "`.env` no está en Git (solo `.env.example`)."]
  },
  "2027-01-08": {
    c: [
      "`docker compose up -d --build` y `docker compose ps`: los 3 servicios en `running`/`healthy`.",
      "Rompe algo a propósito (contraseña equivocada en `.env`), lee `docker compose logs -f api`, identifica el error y corrígelo. Anota el diagnóstico en `docs/troubleshooting.md`.",
      "Crea productos, corre `docker compose down` (sin `-v`) y `up` otra vez: los datos deben seguir. Documenta cómo resetear con `down -v`."
    ],
    d: ["https://docs.docker.com/reference/cli/docker/compose/logs/"],
    ok: ["Los datos sobreviven a `down`/`up`.", "`docs/troubleshooting.md` con al menos 1 falla y su solución."]
  },
  "2027-01-09": {
    c: [
      "`verificar.py`: hace GET a `/api/productos` y falla con mensaje claro si el status no es 200 o si la lista está vacía.",
      "Revisa el repo: `git log -p | findstr /i password` (Windows) y busca `.env`, `appsettings.Development.json` con secretos, `bin/`, `obj/`. Actualiza `.gitignore`. Si subiste un secreto, cámbialo.",
      "Pide a un compañero (o usa otra carpeta) que clone el repo y siga solo el README hasta ver la app. Corrige cada paso donde se atore."
    ],
    d: ["https://docs.github.com/es/get-started/getting-started-with-git/ignoring-files"],
    ok: ["Alguien más levantó tu app solo con el README.", "Cero secretos en el historial."]
  },
  // ---------------- Semana 11 · Cierre ----------------
  "2027-01-11": {
    c: [
      "Revisa cada archivo: nombres claros, métodos de más de 30 líneas, código duplicado. Haz una lista en un issue «Refactor».",
      "Corrige los bugs abiertos y borra código comentado o sin uso. Un commit por cambio («refactor: …», «fix: …»).",
      "Después de cada cambio corre `dotnet test`, `pruebas_api.py` y prueba la web. Si algo se rompe, `git revert` y vuelve a intentar."
    ],
    d: ["https://refactoring.guru/es/refactoring/smells"],
    ok: ["Issue de refactor cerrado.", "Pruebas en verde después de refactorizar."]
  },
  "2027-01-12": {
    c: [
      "README con secciones: Descripción, Demo (link/GIF), Tecnologías, Requisitos, Instalación con Docker, Instalación sin Docker, Pruebas, Estructura, Autor.",
      "Enlaza `docs/api.md` con todos los endpoints, ejemplos y códigos HTTP. Agrega la colección de Postman.",
      "Agrega 3 capturas o un GIF (ScreenToGif), el árbol de carpetas y el diagrama de arquitectura (front → API → SQL Server)."
    ],
    d: ["https://docs.github.com/es/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"],
    ok: ["Un reclutador entiende tu proyecto en 1 minuto leyendo el README."]
  },
  "2027-01-13": {
    c: [
      "Escribe un guion de 2 min en inglés: problem → architecture (frontend, API, database) → one technical decision → what I learned.",
      "Grábate con el celular. Escucha y anota las palabras que pronunciaste mal; búscalas en Google «how to pronounce …» y repite.",
      "Prepara la historia de 1 bug real: síntoma, cómo lo diagnosticaste (logs, DevTools), la causa, la solución y cómo verificaste que quedó."
    ],
    d: ["https://www.youglish.com/"],
    ok: ["Video de 2 min sin leer todo el guion.", "Historia de bug lista con método STAR."]
  },
  "2027-01-14": {
    c: [
      "Escribe 3 criterios de aceptación en formato «Dado… cuando… entonces…» para filtrar por nombre, categoría y stock mínimo.",
      "Implementa `GET /api/productos?nombre=&categoriaId=&stockMax=` con LINQ (`Where` condicional) y conecta los filtros en el frontend.",
      "Prueba: un filtro, combinación de filtros, sin resultados y todos vacíos (debe devolver todo). Agrega 2 pruebas xUnit."
    ],
    d: [MSL + "dotnet/csharp/linq/"],
    ok: ["Los 3 criterios de aceptación se cumplen y están en el README."]
  },
  "2027-01-15": {
    c: [
      "Revisa el filtro, corrige defectos y haz commits finales. Etiqueta `v1.1`.",
      "Cronómetro: 2 problemas de NeetCode (fácil y medio) en 25 min cada uno, sin ver soluciones. Habla en voz alta mientras programas.",
      "Para cada problema escribe complejidad O(…) de tiempo y espacio, 3 casos límite y una alternativa de solución."
    ],
    d: ["https://neetcode.io/roadmap"],
    ok: ["Tag `v1.1`.", "2 problemas resueltos con su análisis escrito."]
  },
  "2027-01-16": {
    c: [
      "Haz el EF SET (50 min) y agrega el certificado a LinkedIn (Licencias y certificaciones).",
      "Si practicaste los temas, presenta la evaluación de HackerRank «Problem Solving (Basic)» y agrega el badge; si no, déjala para febrero.",
      "Exporta el respaldo de esta página y del dashboard, crea el release `v1.1` en GitHub y ensaya tu presentación de 2 min una última vez."
    ],
    d: ["https://www.efset.org/es/", "https://www.hackerrank.com/skills-verification"],
    ok: ["Certificado EF SET en LinkedIn.", "Release en GitHub y respaldos exportados."]
  }
};

// Bloque CERT por día: certificaciones gratuitas con peso en el CV (ver data/certs.js).
const C = (t, min, como) => ({ t, min, ...(como ? { como } : {}) });
export const CERT = {
  "2026-11-24": { n: "Foundational C# (freeCodeCamp + Microsoft)", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Crea tu cuenta en freeCodeCamp y en Microsoft Learn y vincúlalas desde la página de la certificación.", 10), C("Haz el módulo 1 de Microsoft Learn: «Write your first C# code» y responde la pregunta de comprensión en freeCodeCamp.", 25)] },
  "2026-11-26": { n: "Foundational C# · módulo 2", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Módulo 2: «Create and run simple C# console applications». Haz los ejercicios en VS Code, no solo leas.", 30)] },
  "2026-11-28": { n: "Foundational C# · módulo 3", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Módulo 3: «Add logic to C# console applications» (if, switch, for, do-while).", 30)] },
  "2026-11-30": { n: "Foundational C# · módulo 4", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Módulo 4: «Work with variable data in C# console applications» (conversión de tipos, arreglos, formato de strings).", 30)] },
  "2026-12-01": { n: "GitHub Education (para GitHub Foundations)", u: "https://education.github.com/pack", i: [C("Solicita la verificación de estudiante en GitHub Education con tu correo institucional y foto de tu credencial vigente. Tarda días: por eso va hoy.", 15, "Usa tu correo del instituto como correo verificado en GitHub. Si te rechazan, sube una constancia de estudios con fecha reciente.")] },
  "2026-12-03": { n: "Foundational C# · módulos 5 y 6", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Módulo 5: «Create methods in C# console applications».", 20), C("Módulo 6: «Debug C# console applications» (breakpoints, try/catch).", 20)] },
  "2026-12-05": { n: "Examen Foundational C#", u: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/", i: [C("Presenta el examen final (80 preguntas, necesitas 70%). Si no pasas, repasa los temas fallados y reintenta la semana siguiente.", 60), C("Agrega la certificación a LinkedIn (Licencias y certificaciones) con el link verificable y ponla en tu CV.", 10)] },
  "2026-12-12": { n: "HackerRank SQL (Basic)", u: "https://www.hackerrank.com/skills-verification", i: [C("Opcional (o el domingo): presenta la evaluación SQL (Basic) de HackerRank ahora que terminaste la semana de SQL.", 60)] },
  "2026-12-15": { n: "Postman API Fundamentals Student Expert", u: "https://www.postman.com/student-program", i: [C("Abre el Student Program, inicia el curso API Fundamentals y haz la primera parte dentro de Postman.", 30)] },
  "2026-12-18": { n: "Postman Student Expert · entrega", u: "https://www.postman.com/student-program", i: [C("Termina las tareas del curso (usarás tu colección de hoy) y envíalas para recibir el badge. Agrégalo a LinkedIn.", 40)] },
  "2026-12-21": { n: "OCI Foundations Associate · estudio", u: "https://www.oracle.com/education/certification/", i: [C("Crea tu cuenta en Oracle MyLearn y avanza la ruta «OCI Foundations Associate» (fundamentos de nube, regiones, cómputo).", 40)] },
  "2026-12-23": { n: "OCI Foundations Associate · estudio", u: "https://www.oracle.com/education/certification/", i: [C("Avanza la ruta: almacenamiento, redes e IAM. Haz el examen de práctica de MyLearn.", 40)] },
  "2026-12-26": { n: "Examen OCI Foundations Associate", u: "https://www.oracle.com/education/certification/", i: [C("Presenta el examen 1Z0-1085-26 en línea (gratis desde MyLearn). Agrega la credencial a LinkedIn.", 60)] },
  "2027-01-05": { n: "GitHub Foundations · estudio", u: "https://learn.microsoft.com/es-es/training/paths/github-foundations/", i: [C("Ruta de Microsoft Learn «GitHub Foundations»: introducción a Git y GitHub, repositorios, ramas y PR.", 40)] },
  "2027-01-07": { n: "GitHub Foundations · estudio", u: "https://learn.microsoft.com/es-es/training/paths/github-foundations/", i: [C("Ruta «GitHub Foundations»: Issues, Projects, Actions básico, Codespaces y seguridad.", 40)] },
  "2027-01-09": { n: "GitHub Foundations · agenda el examen", u: "https://education.github.com/experiences/foundations_certificate", i: [C("Reclama el voucher desde GitHub Education, confirma que cubre el 100% y agenda el examen en línea (Pearson VUE) para el fin de semana.", 20), C("Haz un examen de práctica y repasa lo que fallaste.", 30)] }
};
