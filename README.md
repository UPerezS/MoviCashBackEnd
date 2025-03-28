# Proyecto de Gestión de Ordenes de Pago - Colaboración empresa LKBASS.

## Estructura del proyecto.

```
MoviCashBackEnd/
│
├── config/             # Configuraciones (base de datos, etc)
├── controllers/        # Contiene la lógica de negocio principal, como operaciones CRUD (manejan la lógica de las rutas)
├── middlewares/        # Middlewares (autenticación, validación, etc.)
├── models/             # Modelos (Define la estructura de los datos y cómo interactuar con la base de datos.)
├── routes/             # Rutas (Definen los endpoints de la API y asocia cada ruta con un controlador.)
├── services/           # Servicios ( Contiene funciones reutilizables que pueden ser usadas por múltiples controladores)
├── utils/              # Utilidades (funciones helper, validaciones, handdle, etc.)
|
├── index.js            # Configuración de la app Express
└── server.js           # Inicio del servidor
│
├── .env                # Variables de entorno
├── .gitignore          # Archivo para ignorar archivos en Git
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```

## Convenciones de Commits del proyecto.


`feat:` Añadir una nueva funcionalidad o característica.

* Ejemplo: feat: añadir autenticación por Google,

`fix:` Corregir un error.

* Ejemplo: fix: resolver crash al cargar usuarios sin avatar.

`docs:` Cambios en la documentación.

* Ejemplo: docs: actualizar el README con nuevas instrucciones.

`style:` Cambios relacionados con formato, estilo de código, espacios, etc. (sin cambios funcionales).

* Ejemplo: style: corregir indentación en UserService.

`refactor:` Refactorización del código (ni corrección de errores ni nueva funcionalidad).

* Ejemplo: refactor: optimizar la consulta a la base de datos.

`test:` Añadir o modificar pruebas.

`chore:` Cambios en la configuración o mantenimiento del proyecto (sin impacto directo en la funcionalidad).

* Ejemplo: chore: actualizar dependencias a sus últimas versiones.


`ci:` Cambios relacionados con la integración continua o pipelines.

* Ejemplo: ci: configurar deploy automático para producción.

## Convenciones de Ramas del proyecto.

`main:` Producción.

`dev:` Integración de funcionalidades y pruebas.

`feature/, fix/:` Ramas temporales para desarrollo.

### Esquema sugerido de nombres:


* feature/nombre-de-la-funcionalidad-nombre-integrante-del-equipo

    - Ejemplo: feature/login-usuarios-Cesar

* fix/nombre-del-error-nombre-integrante-del-equipo

    - Ejemplo: fix/error-de-login-Cesar

---

**Nota:**

Usar el modo imperativo: **empizar con un verbo en presente como añadir, corregir, mejorar.**


✅ Ejemplo: fix: corregir error en el login de usuarios.

❌ Ejemplo: fix: Corregido un error al loguear usuarios.


---


**Nota:** Las claves de las Apis estan en **Jira**, crean el archivo **.env** y las ponen igual que **.env.example**

---

**Nota:** siempre instalar las depencencias añadiendo el -E para fijarlas ejemplo: **npm i -E jsonwebtoken**