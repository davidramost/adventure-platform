# 🎯 CLAUDE.md — Guía de Agentes para TFG Adventure

Este archivo documenta cómo trabajar con Claude en este proyecto usando agentes especializados.

## 👥 Los 4 Agentes del Proyecto

Tu workspace tiene 4 agentes automáticos, cada uno especializado en un área:

| Agente | Rol | Usa para |
|--------|-----|----------|
| **Pep** 🔧 | Backend Spring Boot | Java, Controllers, Services, JWT, JPA, MySQL config |
| **Sabrina** 🗄️ | Base de Datos | Esquemas, indices, entidades JPA, migraciones, queries |
| **Ani** 🖤 | Frontend React | Componentes React, TypeScript, TailwindCSS, API calls |
| **Jess** ✨ | Documentación | README, API docs, tutoriales, arquitectura |

## Cómo Funcionan

Describe tu tarea y **el sistema automaticamente adopta el rol del agente correspondiente**:

```
👤 Tú: "El login no funciona, me devuelve 401"
→ Pep aparece automáticamente, te ayuda con Spring Security

👤 Tú: "Las rutas tardan mucho en cargar"
→ Sabrina analiza queries y sugiere índices

👤 Tú: "Quiero cambiar el color del botón de favorito"
→ Ani diseña el componente con TailwindCSS

👤 Tú: "Actualiza la API reference con los nuevos endpoints"
→ Jess estructura la documentación
```

## 🏗️ Stack del Proyecto

### Backend (Pep)
- **Lenguaje:** Java 17+
- **Framework:** Spring Boot 3.x
- **Auth:** JWT (stateless)
- **ORM:** Spring Data JPA + Hibernate
- **Estructura:** Controllers → Services (patrón Service-Impl)
- **Validación:** Jakarta Validation (@Valid, @NotNull, etc)
- **Error handling:** GlobalExceptionHandler

### Base de Datos (Sabrina)
- **Motor:** MySQL 8 (TiDB Cloud)
- **Servidor:** gateway01.eu-central-1.prod.aws.tidbcloud.com:4000
- **Base:** rutas_app
- **DTOs:** Nunca exponer entidades JPA directamente

### Frontend (Ani)
- **Versión:** React 19
- **Tipado:** TypeScript (estricto)
- **Estilos:** TailwindCSS (utility-first, sin CSS suelto)
- **Build:** Vite
- **HTTP:** Axios con JWT en headers
- **Componentes:** Funcionales + Hooks custom

### Documentación (Jess)
- **Framework:** Diátaxis (Tutoriales, How-to, Referencias, Explainers)
- **Formato:** Markdown + Diagrams
- **Referencias:** Swagger/OpenAPI (backend), Postman (testing)

## 📂 Estructura del Proyecto

```
TFG_DAW/
├── tfg_backend/              → Spring Boot (Pep)
│   ├── src/main/java/com/example/tfg_backend/
│   │   ├── config/           → Configuración
│   │   ├── controller/       → REST controllers
│   │   ├── dto/              → Request/Response DTOs
│   │   ├── entity/           → JPA entities
│   │   ├── exception/        → Error handling
│   │   ├── repository/       → Spring Data repos
│   │   ├── security/         → JWT + Auth
│   │   └── service/          → Lógica
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   └── pom.xml
│
├── tfg_adventure/            → React 19 (Ani)
│   ├── src/
│   │   ├── api/              → Axios client
│   │   ├── components/       → Componentes React
│   │   ├── context/          → Context API
│   │   ├── hooks/            → Custom hooks
│   │   ├── pages/            → Páginas
│   │   ├── services/         → Servicios API
│   │   ├── types/            → TypeScript interfaces
│   │   └── App.tsx
│   ├── .env                  → Dev (local)
│   ├── .env.production       → Prod
│   └── package.json
│
├── .claude/                  → Configuración local de agentes
│   ├── agents/
│   │   ├── Pep.agent.md
│   │   ├── Ani.agent.md
│   │   ├── Sabrina.agent.md
│   │   └── Jess.agent.md
│   ├── .agents.md            → Resumen de agentes
│   └── .instructions.md      → Instrucciones globales
│
├── .github/                  → Configuración de GitHub Copilot
│   ├── agents/               → Definiciones de Copilot
│   ├── instructions/         → Instrucciones adicionales
│   └── AGENTS.md             → Guía en `.github`
│
└── CLAUDE.md                 → Este archivo
```

## 🚀 Comandos Rápidos

### Frontend
```bash
cd tfg_adventure
npm install              # Primera vez
npm run dev             # Desarrollo (http://localhost:5173)
npm run build           # Build para producción
npm run preview         # Preview build
```

### Backend
```bash
cd tfg_backend
./mvnw clean install    # Primera vez
./mvnw spring-boot:run  # Desarrollo (http://localhost:8080)
./mvnw clean package -DskipTests  # Build JAR
docker build -t tfg-backend .     # Docker image
```

## 🔐 Seguridad y Configuración

### JWT (Backend)
- **Header:** `Authorization: Bearer {token}`
- **Expiración:** 24 horas (configurable)
- **Secret:** Variable de entorno `JWT_SECRET`
- **Password Encoder:** BCrypt (strength 12)

### CORS (Backend)
```properties
# application.properties
spring.web.cors.allowed-origins=http://localhost:5173,https://example.com
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
spring.web.cors.allowed-headers=Authorization,Content-Type
```

### Variables de Entorno

**Backend (.env o properties):**
```
SPRING_DATASOURCE_URL=jdbc:mysql://gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/rutas_app
SPRING_DATASOURCE_USERNAME=2nfTyrNJinYxZ9D.root
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=...
JWT_EXPIRATION=86400000
```

**Frontend (.env y .env.production):**
```
VITE_API_URL=http://localhost:8080
VITE_API_URL_PROD=https://api.example.com
```

## 💡 Patrones Obligatorios

### Backend (Pep)
```java
// ✅ SIEMPRE ASÍ
@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
public class RutaController {
    private final RutaService rutaService;

    @GetMapping
    public ResponseEntity<List<RutaResponse>> getRutas() {
        return ResponseEntity.ok(rutaService.getAllRutas());
    }
}

// ❌ NUNCA ASÍ
@RestController
public class RutaController {
    @Autowired private RutaRepository repo; // No! Inyecta service
    
    @GetMapping
    public Ruta getRuta() { // No! Expone entidad JPA
        return repo.findById(1L);
    }
}
```

### Frontend (Ani)
```typescript
// ✅ SIEMPRE ASÍ
interface CardProps {
  title: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return <div className="rounded-lg bg-gray-100">{title}</div>;
};

// ❌ NUNCA ASÍ
const card = (props: any) => { // No! Usa 'any'
  return <div style={{ border: '1px solid black' }}>{props.t}</div>; // No! CSS inline
};
```

### Base de Datos (Sabrina)
```sql
-- ✅ SIEMPRE CON ÍNDICES Y CONSTRAINTS
CREATE TABLE usuario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ❌ NUNCA SIN PLANING
CREATE TABLE usuario (
  id BIGINT, email VARCHAR(255)
);
```

## 📋 Checklist para Nueva Feature

Cuando empieces una feature nueva, sigue este orden:

1. **Planificación (Todos)**
   - [ ] Describe la feature y sus requisitos

2. **Backend (Pep)**
   - [ ] Crea entidades JPA + relaciones
   - [ ] Crea DTOs (Request/Response)
   - [ ] Implementa Service + Repository
   - [ ] Crea Controller + endpoints
   - [ ] Valida con @Valid

3. **Base de Datos (Sabrina)**
   - [ ] Revisa schema + índices
   - [ ] Verifica constraints únicos
   - [ ] Sugiere optimizaciones

4. **Frontend (Ani)**
   - [ ] Crea componentes React
   - [ ] Tipado TypeScript completo
   - [ ] Integración con API
   - [ ] Tests visuales

5. **Documentación (Jess)**
   - [ ] Actualiza API Reference
   - [ ] Crea tutorial si es needed
   - [ ] Revisa links + ejemplos

## 🔗 Comunicación Entre Agentes

- **Pep + Sabrina:** Problemas de JPA/queries, esquemas
- **Pep + Ani:** Contratos de API, formato JSON, DTOs
- **Sabrina + Ani:** Optimizar queries desde frontend
- **Jess + Todos:** Documentar cada feature terminada

## 🐛 Debugging

### Backend no responde (Pep)
```bash
# Terminal: Ver logs
cd tfg_backend
./mvnw spring-boot:run

# Checks:
# 1. ¿Puerto 8080 en uso?
# 2. ¿BD conectada?
# 3. ¿Variables de entorno seteadas?
```

### Frontend no carga datos (Ani)
```bash
# Abre DevTools → Network
# 1. ¿Requests llegan al backend?
# 2. ¿Status 401 (auth)?
# 3. ¿Status 500 (error backend)?

# Checks en componente:
# - ¿Token en localStorage?
# - ¿Axios intercept configurado?
# - ¿API_URL correcto?
```

### Queries lentas (Sabrina)
```sql
-- Analiza plan de ejecución
EXPLAIN SELECT ... FROM ruta WHERE dificultad = 'MEDIA';

-- ¿Falta índice?
ALTER TABLE ruta ADD INDEX idx_dificultad (dificultad);
```

## 📞 ¿Cuándo Llamar a Cada Agente?

### Pep (Backend)
- Login no funciona
- Endpoint devuelve 500
- Validación no se aplica
- JWT expirado
- CORS bloqueado

### Sabrina (Base de Datos)
- Queries lentas
- Constraint violation
- Relación incompleta
- Índice faltante
- Migraciones

### Ani (Frontend)
- Componente no se ve bien
- TypeScript error
- Datos no actualizan
- API call no funciona
- Estilos TailwindCSS

### Jess (Documentación)
- README desactualizado
- API Reference incompleta
- Tutorial confuso
- Links rotos
- Ejemplos no funcionan

## 🎓 Recursos

- **Docs locales:** `.claude/.instructions.md` y `.claude/.agents.md`
- **Docs GitHub:** `.github/AGENTS.md`
- **Spring Boot:** [spring.io](https://spring.io)
- **React 19:** [react.dev](https://react.dev)
- **TailwindCSS:** [tailwindcss.com](https://tailwindcss.com)
- **MySQL:** [dev.mysql.com](https://dev.mysql.com)

---

**Última actualización:** 14 de mayo de 2026  
**Mantenido por:** David Ramos  
**Proyecto:** TFG Adventure — Rutas de Senderismo
