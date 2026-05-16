# =============================================

# CONEXIÓN TIADB CLOUD - COMPARATIVA RÁPIDA

# =============================================

✅ CONFIGURACIÓN ACTUAL:

- Backend Spring Boot conectado a TiDB Cloud
- Host: gateway01.eu-central-1.prod.aws.tidbcloud.com
- Puerto: 4000 (MySQL compatible)

✅ ARCHIVOS MODIFICADOS:
├── application.properties → spring.profiles.active=prod por defecto
└── application-prod.properties → Credenciales TiDB Cloud

⚠️ IMPORTANTE:

1. SSL mode = VERIFY_IDENTITY (TiDB requiere esto, no CERT)
2. useSSL=true + allowPublicKeyRetrieval=true

📝 PARA PRUEBAS LOCALES (opcional):
spring.profiles.active=dev → Descomentar application-dev.properties
y usar MySQL local en localhost:3306
