# 🚀 Guía Rápida - Debugging Local + Deployment

## Para Desarrollo Local (F5)

Presiona **F5** en VS Code. Automáticamente:

1. Compila el proyecto  
2. Establece `SPRING_PROFILES_ACTIVE=dev`
3. Carga `application-dev.properties` (con credenciales hardcoded)
4. Conecta a TiDB Cloud
5. Inicia Tomcat en <http://localhost:8080>

✅ **Funciona sin scripts** ✅

---

## Para Producción (Render.com)

En el dashboard de Render, agrega estas variables de entorno:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/rutas_app?useSSL=true&allowPublicKeyRetrieval=false
SPRING_DATASOURCE_USERNAME=2nfTyrNJinYxZ9D.root
SPRING_DATASOURCE_PASSWORD=<TiDB_PASSWORD>
JWT_SECRET=TfgAdventureSecretKeyForJwtTokenGeneration2026MustBeAtLeast256BitsLong!!
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=prod
```

Spring cargará `application-prod.properties` que usa `${...}` placeholders → las variables de entorno se resolverán automáticamente.

---

## Archivos Importantes

| Archivo | Propósito | Git |
|---------|-----------|-----|
| `application.properties` | Configuración base + perfil activo | ✅ Commit |
| `application-dev.properties` | Credenciales locales (hardcoded) | ❌ .gitignore |
| `application-prod.properties` | Plantillas con `${...}` para env vars | ✅ Commit |
| `.vscode/launch.json` | Config F5 - establece perfil `dev` | ✅ Commit |
| `.env` | Variables antiguas (deprecated) | ❌ .gitignore |

---

## Solución de Problemas

### Error: "Missing user name prefix"

→ Verifica que estés usando el perfil `dev` localmente. En `.vscode/launch.json` debe estar:

```json
"env": {
    "SPRING_PROFILES_ACTIVE": "dev"
}
```

### Error: Credenciales undefined

→ Verifica `application-dev.properties` tenga los valores hardcoded, no placeholders `${}`.

### En producción no conecta

→ Verifica que Render tenga TODAS las variables de entorno listadas arriba.

---

## Arquitectura de Perfiles

```
┌─────────────────────────────────────┐
│  application.properties             │
│  spring.profiles.active=${...}      │ ← Busca env var, por defecto "dev"
└─────────────────────────────────────┘
              ↓
        ┌─────┴─────┐
        ↓           ↓
  ┌──────────┐  ┌──────────┐
  │  -dev    │  │  -prod   │
  ├──────────┤  ├──────────┤
  │ Hardcode │  │ Env vars │
  │ creds    │  │ (${...}) │
  └──────────┘  └──────────┘
        ↓           ↓
   Local F5    Render.com
```

---

## Notas Finales

- **Nunca** hardcodees credenciales en producción
- **Siempre** usa variables de entorno para prod
- El perfil `dev` es **SOLO para desarrollo local**
- Los archivos `-dev.properties` y `-prod.properties` se ignoran en git
